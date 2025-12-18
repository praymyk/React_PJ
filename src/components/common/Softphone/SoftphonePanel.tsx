'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as JsSIP from 'jssip';
import styles from './SoftphonePanel.module.scss';

/** SIP 연결 상태 */
type ConnectionStatus = 'disconnected' | 'connecting' | 'registered';

/** UA 설정 타입: JsSIP.UA 생성자의 첫 번째 인자를 그대로 가져와 재사용 */
type JsSIPUAConfig = ConstructorParameters<typeof JsSIP.UA>[0];
/** UA 인스턴스 타입 */
type JsSIPUAInstance = InstanceType<typeof JsSIP.UA>;

/** 통화 세션에서 실제로 쓰는 최소 인터페이스만 정의 */
interface JsSIPSessionLike {
    /** 통화 종료 */
    terminate: () => void;
    /** 인바운드 수신 시 사용할 수 있는 answer 메서드 (JsSIP.RTCSession 에 따라 선택적) */
    answer?: (options?: unknown) => void;
}

// TODO: 실서비스에서는 환경 변수로 분리할 것 (.env.local 등)
const SIP_DOMAIN = 'dev-pbx.metapbx.co.kr';
const SIP_DEFAULT_WS = `wss://${SIP_DOMAIN}:8089/ws`;
const SIP_DEFAULT_PASSWORD = 'Metapbx1234!@!@';

export default function SoftphonePanel() {
    const [sipUri, setSipUri] = useState('');
    const [password, setPassword] = useState(SIP_DEFAULT_PASSWORD);
    const [wsUri, setWsUri] = useState(SIP_DEFAULT_WS);
    const [status, setStatus] = useState<ConnectionStatus>('disconnected');
    const [targetNumber, setTargetNumber] = useState('');
    const [log, setLog] = useState<string[]>([]);

    // 인바운드(수신) 상태
    const [incomingNumber, setIncomingNumber] = useState<string | null>(null);
    const [incomingStatus, setIncomingStatus] = useState<'idle' | 'ringing' | 'in-call'>('idle');

    // JsSIP UA 및 통화 세션 참조(React 라이프사이클과 분리하여 관리)
    const uaRef = useRef<JsSIPUAInstance | null>(null);
    const sessionRef = useRef<JsSIPSessionLike | null>(null);

    // 원격 오디오 재생용 audio 엘리먼트
    const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

    /** 로그 한 줄 추가 */
    const appendLog = useCallback((msg: string) => {
        setLog((prev) => [
            ...prev,
            `[${new Date().toLocaleTimeString()}] ${msg}`,
        ]);
    }, []);

    /** 언마운트 시 UA 정리 */
    useEffect(() => {
        return () => {
            try {
                if (uaRef.current) {
                    uaRef.current.stop();
                    uaRef.current = null;
                }
            } catch (e) {
                console.warn('[SoftphonePanel] UA stop error on unmount', e);
            }
        };
    }, []);

    /** SIP REGISTER (로그인) */
    const handleRegister = () => {
        if (!sipUri) {
            appendLog('SIP 내선(번호)을 입력하세요.');
            return;
        }

        appendLog(`SIP 로그인 시도: ${sipUri} / ws=${wsUri}`);
        setStatus('connecting');

        try {
            // 기존 UA가 있으면 정리
            if (uaRef.current) {
                try {
                    uaRef.current.stop();
                } catch {
                    /* ignore */
                }
                uaRef.current = null;
            }

            const socket = new JsSIP.WebSocketInterface(wsUri);

            const configuration: JsSIPUAConfig = {
                sockets: [socket],
                uri: `sip:${sipUri}@${SIP_DOMAIN}`,
                authorization_user: sipUri,
                password,
                register: true,
                registrar_server: `sip:${SIP_DOMAIN}`,
                session_timers: true,
            };

            const ua = new JsSIP.UA(configuration);
            uaRef.current = ua;

            // 이벤트 핸들러
            ua.on('connected', () => {
                appendLog('SIP WebSocket 연결 완료');
            });

            ua.on('disconnected', () => {
                appendLog('SIP WebSocket 연결 끊김');
                setStatus('disconnected');
            });

            ua.on('registered', () => {
                appendLog('SIP 등록 완료');
                setStatus('registered');
            });

            ua.on('unregistered', () => {
                appendLog('SIP 등록 해제');
                setStatus('disconnected');
            });

            // NOTE:
            // JsSIP의 `registrationFailed` 이벤트 payload는 공식 타입 정의가 거의 없고
            // 실제 런타임에서도 형태가 들쭉날쭉해서 강하게 타입을 좁히기가 애매하다.
            // 여기서는 `e.cause` 정도만 로그에 찍어서 확인하는 용도라
            // 과도한 커스텀 이벤트 타입을 정의하기보다는, 의도적으로 `any`를 사용
            ua.on('registrationFailed', (e: any) => {
                console.warn('SIP 등록 실패', e);
                appendLog(`SIP 등록 실패: ${e?.cause || '알 수 없는 오류'}`);
                setStatus('disconnected');
            });

            // 새 RTC 세션 생성 이벤트 (인바운드/아웃바운드 공통 진입점)
            ua.on('newRTCSession', (data: any) => {
                const { originator, session, request } = data || {};
                const rtcSession = session as any;

                // 인/아웃바운드 공통: 원격 오디오 스트림 바인딩
                setupRemoteAudio(rtcSession);

                // 인바운드(원격에서 걸어온 콜)
                if (originator === 'remote') {
                    try {
                        // TODO:
                        //  - Asterisk 쪽에서 인바운드 콜의 발신번호를 어디에 실을지(From.user / P-Asserted-Identity / 커스텀 헤더 등)
                        //    최종 합의 후, 그 헤더 기준으로 displayNumber 파싱 로직 확정 필요.
                        const fromUri: any = request?.from?.uri;
                        const displayNumber: string =
                            fromUri?.user ||
                            request?.from?.display_name ||
                            '알 수 없는 번호';

                        appendLog(`인바운드 수신: ${displayNumber}`);
                        setIncomingNumber(displayNumber);
                        setIncomingStatus('ringing');

                        // 현재 세션으로 교체
                        sessionRef.current = rtcSession as JsSIPSessionLike;
                    } catch (e) {
                        console.warn(
                            '[SoftphonePanel] newRTCSession(inbound) error',
                            e,
                        );
                    }
                    return;
                }

                // 아웃바운드(로컬에서 건 콜)
                appendLog('새 아웃바운드 세션 생성');
                sessionRef.current = rtcSession as JsSIPSessionLike;
            });

            ua.start();

        } catch (err) {
            console.error('[SoftphonePanel] handleRegister error', err);
            appendLog('SIP 로그인 중 오류가 발생했습니다. 콘솔 로그를 확인하세요.');
            setStatus('disconnected');
        }
    };

    /** SIP UNREGISTER (로그아웃) */
    const handleUnregister = () => {
        appendLog('SIP 로그아웃 시도');
        try {
            if (uaRef.current) {
                try {
                    // 일부 서버 환경에서는 unregister가 불필요할 수 있음
                    uaRef.current.unregister();
                } catch {
                    /* ignore */
                }
                uaRef.current.stop();
                uaRef.current = null;
            }

            // 혹시 살아있는 세션이 있으면 종료
            if (sessionRef.current) {
                try {
                    sessionRef.current.terminate();
                } catch {
                    /* ignore */
                }
                sessionRef.current = null;
            }

            setStatus('disconnected');
            appendLog('SIP 로그아웃 완료');
        } catch (err) {
            console.error('[SoftphonePanel] handleUnregister error', err);
            appendLog('SIP 로그아웃 중 오류가 발생했습니다.');
        }
    };

    type CallDirection = 'inbound' | 'outbound';
    type CallPhase = 'ringing' | 'answered' | 'ended' | 'failed';

    interface CallEventPayload {
        direction: CallDirection;
        phase: CallPhase;
        peerNumber?: string | null; // 상대 번호 (수신: from / 발신: to)
        reason?: string;
    }

    // ───────────────── 원격 오디오 스트림 바인딩 헬퍼 ─────────────────
    /**
     * JsSIP RTC 세션에 연결된 RTCPeerConnection에서 들어오는
     * 원격 오디오 트랙 > 공용 audio 엘리먼트(remoteAudioRef)에 붙임
     *
     * 인바운드/아웃바운드 구분 없이 newRTCSession 이벤트에서 공통으로 호출.
     */
    const setupRemoteAudio = (rtcSession: any) => {
        const audioEl = remoteAudioRef.current;
        if (!audioEl || !rtcSession) return;

        const playStream = (stream: MediaStream) => {
            if (!stream) return;
            audioEl.srcObject = stream;

            audioEl
                .play()
                .then(() => {
                    appendLog('원격 오디오 재생 시작');
                })
                .catch((err) => {
                    console.warn('[SoftphonePanel] 원격 오디오 자동 재생 실패', err);
                    appendLog(
                        '원격 오디오 재생 실패 (브라우저 자동재생 정책을 확인하세요)',
                    );
                });
        };

        const bindPeerConnection = (pc: RTCPeerConnection) => {
            if (!pc) return;

            // 1) 이미 올라가 있는 remote audio 트랙이 있으면 즉시 한 번 확인
            try {
                const remoteAudioTracks = pc
                    .getReceivers()
                    .map((r) => r.track)
                    .filter(
                        (t): t is MediaStreamTrack =>
                            !!t && t.kind === 'audio',
                    );

                if (remoteAudioTracks.length > 0) {
                    // 이미 존재하는 트랙만으로 MediaStream 구성
                    const stream = new MediaStream(remoteAudioTracks);
                    playStream(stream);
                }
            } catch (err) {
                // 일부 브라우저/환경에서 getReceivers 미지원일 수 있어서 방어용
                console.warn(
                    '[SoftphonePanel] getReceivers() 확인 중 에러 (무시 가능)',
                    err,
                );
            }

            // 2) 이후에 추가되는 track 이벤트도 계속 감시
            pc.addEventListener('track', (event: RTCTrackEvent) => {
                const [stream] = event.streams;
                if (!stream) return;
                playStream(stream);
            });

            // 3) 구형 브라우저 대비 addstream fallback
            //    (Ts 타입 정의에는 없어서 expect-error)
            pc.addEventListener('addstream', (event: any) => {
                if (!event.stream) return;
                playStream(event.stream);
            });
        };

        // 0) newRTCSession 시점에 이미 connection 이 잡혀있는 경우도 먼저 한 번 시도
        const immediatePc =
            (rtcSession.connection as RTCPeerConnection | undefined) ||
            (rtcSession._connection as RTCPeerConnection | undefined);

        if (immediatePc) {
            bindPeerConnection(immediatePc);
        }

        // 1) 이후 peerconnection 이벤트에서도 다시 한 번 안전하게 바인딩
        rtcSession.on('peerconnection', (ev: any) => {
            const pc = ev.peerconnection as RTCPeerConnection | undefined;
            if (!pc) return;
            bindPeerConnection(pc);
        });
    };

    // TODO: 실서비스에서는 BASE_URL을 env 로 정의 필요.
    const TURN_CRED_ENDPOINT = 'http://localhost:8080/Ipcc/api/auth/turn-credentials';

    /**
     * TURN 자격증명 동적 조회 → RTCPeerConnection iceServers 포맷으로 변환
     */
    async function fetchTurnIceServers(): Promise<RTCIceServer[]> {
        const stunUrl = 'stun:turn.metapbx.co.kr:3478';

        try {
            const res = await fetch(TURN_CRED_ENDPOINT, {
                headers: { Accept: 'application/json' },
            });
            if (!res.ok) throw new Error(`TURN cred HTTP ${res.status}`);

            const data = await res.json();

            const username   = data.username as string;
            const credential = data.credential as string;
            const urls       = Array.isArray(data.urls) ? data.urls : [];

            // 서버에서 받은 TURN URL 목록을 iceServers 항목으로 매핑
            const turnServers: RTCIceServer[] = urls.map((u: string) => ({
                urls: [u],
                username,
                credential,
            }));

            // STUN 추가
            return [...turnServers, { urls: stunUrl }];
        } catch (err) {
            console.warn('[TURN] 동적 자격증명 조회 실패 → STUN-only 폴백:', err);
            return [{ urls: stunUrl }];
        }
    }

    // ───────────────── 공통 이벤트 헬퍼 ( 인/아웃 통화 이벤트 컨트롤러 ) ─────────────────
    const fireCallEvent = (event: CallEventPayload) => {
        // 1. 콘솔 + 로그
        appendLog(
            `콜 이벤트: ${event.direction} / ${event.phase}` +
            (event.peerNumber ? ` / 번호=${event.peerNumber}` : '') +
            (event.reason ? ` / 사유=${event.reason}` : ''),
        );

        // 2, 나중에 여기에서만 확장
        // TODO: 필요 시
        // - 백엔드 REST 로그 전송
        // - Recoil/Zustand 전역 상태 업데이트
        // - 다른 컴포넌트 알림 등
    };

    // ───────────────── 인바운드(수신) 관련 핸들러 ─────────────────
    const handleAnswer = async () => {
        if (!sessionRef.current) {
            appendLog('수신할 통화 세션이 없습니다.');
            return;
        }

        const sessionAny = sessionRef.current as JsSIPSessionLike & {
            answer?: (options?: unknown) => void;
        };

        if (typeof sessionAny.answer !== 'function') {
            appendLog(
                '현재 세션은 answer()를 지원하지 않습니다. (JsSIP 설정 확인 필요)',
            );
            return;
        }

        try {
            appendLog('인바운드 통화 수신 시도');

            const iceServers = await fetchTurnIceServers();

            const answerOptions: any = {
                mediaConstraints: { audio: true, video: false },
                pcConfig: {
                    iceServers,
                    iceTransportPolicy: 'all',
                    bundlePolicy: 'max-bundle',
                    rtcpMuxPolicy: 'require',
                    sdpSemantics: 'unified-plan',
                },
            };

            sessionAny.answer(answerOptions);

            setIncomingStatus('in-call');

            fireCallEvent({
                direction: 'inbound',
                phase: 'answered',
                peerNumber: incomingNumber,
            });
        } catch (err) {
            console.error('[SoftphonePanel] handleAnswer error', err);
            appendLog('인바운드 통화 수신 중 오류가 발생했습니다.');

            fireCallEvent({
                direction: 'inbound',
                phase: 'failed',
                peerNumber: incomingNumber,
                reason: 'answer-error',
            });
        }
    };

    const handleReject = () => {
        if (!sessionRef.current) {
            appendLog('거절/종료할 인바운드 세션이 없습니다.');
            return;
        }

        try {
            appendLog('인바운드 통화 거절/종료 요청');
            sessionRef.current.terminate();
            sessionRef.current = null;
            setIncomingStatus('idle');
            setIncomingNumber(null);

            fireCallEvent({
                direction: 'inbound',
                phase: 'ended',
                reason: 'rejected',
            });
        } catch (err) {
            console.error('[SoftphonePanel] handleReject error', err);
            appendLog('인바운드 통화 종료 중 오류가 발생했습니다.');

            fireCallEvent({
                direction: 'inbound',
                phase: 'failed',
                reason: 'reject-error',
            });
        }
    };

    // ───────────────── 아웃바운드(발신) 관련 핸들러 ─────────────────
    /** 발신 (UA.call) */
    const handleCall = async () => {
        const sanitizedTarget = targetNumber.replace(/-/g, '').trim();

        if (!sanitizedTarget) {
            appendLog('발신 번호를 입력하세요.');
            return;
        }
        if (!/^\d{8,}$/.test(sanitizedTarget)) {
            appendLog('올바른 전화번호를 입력하세요. (숫자 8자리 이상)');
            return;
        }
        if (!uaRef.current || status !== 'registered') {
            appendLog('먼저 SIP 로그인(등록 완료) 상태여야 합니다.');
            return;
        }

        // 기존 통화가 살아있으면 먼저 정리
        if (sessionRef.current) {
            try {
                sessionRef.current.terminate();
            } catch {
                /* ignore */
            }
            sessionRef.current = null;
        }

        const originType = 'INTERNAL';
        const callerCid = '15339427'; // TODO: 실제 발신번호로 교체

        appendLog(`발신 시도 → ${sanitizedTarget}`);

        try {
            const iceServers = await fetchTurnIceServers();

            const options: any = {
                extraHeaders: [
                    `ORIGIN_TYPE: ${originType}`,
                    `X-EXTEN: ${sipUri}`,
                    `CID: ${callerCid}`,
                ],
                eventHandlers: {
                    progress: () => {
                        appendLog('호출 진행 중...(Ringing)');
                        fireCallEvent({
                            direction: 'outbound',
                            phase: 'ringing',
                            peerNumber: sanitizedTarget,
                        });
                    },
                    confirmed: () => {
                        appendLog('통화 연결 완료');
                        fireCallEvent({
                            direction: 'outbound',
                            phase: 'answered',
                            peerNumber: sanitizedTarget,
                        });
                    },
                    ended: () => {
                        appendLog('통화 종료');
                        sessionRef.current = null;
                        fireCallEvent({
                            direction: 'outbound',
                            phase: 'ended',
                            peerNumber: sanitizedTarget,
                        });
                    },
                    failed: (e: any) => {
                        appendLog(`통화 실패: ${e?.cause || '알 수 없는 오류'}`);
                        sessionRef.current = null;
                        fireCallEvent({
                            direction: 'outbound',
                            phase: 'failed',
                            peerNumber: sanitizedTarget,
                            reason: e?.cause,
                        });
                    },
                },
                mediaConstraints: { audio: true, video: false },
                pcConfig: {
                    iceServers,
                    iceTransportPolicy: 'all',   // 필요하면 'relay' 로 강제
                    bundlePolicy: 'max-bundle',
                    rtcpMuxPolicy: 'require',
                    sdpSemantics: 'unified-plan',
                },
            };

            const session = uaRef.current.call(
                `sip:${sanitizedTarget}@${SIP_DOMAIN}`,
                options,
            ) as unknown as JsSIPSessionLike;

            sessionRef.current = session;
        } catch (err) {
            console.error('[SoftphonePanel] handleCall error', err);
            appendLog('발신 중 오류가 발생했습니다. 콘솔 로그를 확인하세요.');

            fireCallEvent({
                direction: 'outbound',
                phase: 'failed',
                peerNumber: sanitizedTarget,
                reason: 'call-error',
            });
        }
    };

    /** 통화 종료 */
    const handleHangup = () => {
        if (!sessionRef.current) {
            appendLog('종료할 활성 통화가 없습니다.');
            return;
        }
        try {
            appendLog('통화 종료 요청');
            sessionRef.current.terminate();
            sessionRef.current = null;
        } catch (err) {
            console.error('[SoftphonePanel] handleHangup error', err);
            appendLog('통화 종료 중 오류가 발생했습니다.');
        }
    };

    return (
            <div className={styles.softphoneRoot}>
            {/* 왼쪽: SIP 로그인 + 콜 컨트롤 */}
            <div className={styles.leftColumn}>
                {/* SIP 로그인 카드 */}
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>SIP 로그인</h2>

                    <label className={styles.field}>
                        <div>SIP URI</div>
                        <input
                            type="text"
                            value={sipUri}
                            onChange={(e) => setSipUri(e.target.value)}
                            placeholder="6001"
                            className={styles.textInput}
                        />
                    </label>

                    <label className={styles.field}>
                        <div>비밀번호</div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.textInput}
                        />
                    </label>

                    <label className={styles.field}>
                        <div>WS URI</div>
                        <input
                            type="text"
                            value={wsUri}
                            onChange={(e) => setWsUri(e.target.value)}
                            placeholder={`wss://${SIP_DOMAIN}:8089/ws`}
                            className={styles.textInput}
                        />
                    </label>

                    <div className={styles.buttonRow}>
                        <button type="button" onClick={handleRegister}>
                            로그인
                        </button>
                        <button type="button" onClick={handleUnregister}>
                            로그아웃
                        </button>
                    </div>

                    <div className={styles.statusText}>
                        상태:{' '}
                        <strong
                            className={
                                status === 'disconnected'
                                    ? styles.statusDisconnected
                                    : status === 'connecting'
                                        ? styles.statusConnecting
                                        : styles.statusRegistered
                            }
                        >
                            {status === 'disconnected' && '미접속'}
                            {status === 'connecting' && '접속 중...'}
                            {status === 'registered' && '등록 완료'}
                        </strong>
                    </div>
                </section>
                {/* 인바운드(수신) 제어 카드 */}
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>인바운드(수신)</h2>

                    <div className={styles.statusText}>
                        상태:
                        <strong>
                            {incomingStatus === 'idle' && '대기 중'}
                            {incomingStatus === 'ringing' && '벨 울리는 중'}
                            {incomingStatus === 'in-call' && '통화 중'}
                        </strong>
                    </div>

                    {incomingNumber && (
                        <div className={styles.statusText}>
                            수신 번호: <strong>{incomingNumber}</strong>
                        </div>
                    )}

                    <div className={styles.buttonRow}>
                        <button
                            type="button"
                            onClick={handleAnswer}
                            disabled={incomingStatus !== 'ringing'}
                        >
                            받기
                        </button>
                        <button
                            type="button"
                            onClick={handleReject}
                            disabled={!sessionRef.current}
                        >
                            거절/끊기
                        </button>
                    </div>
                </section>

                {/* 아웃바운드(발신) 제어 카드 */}
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>아웃바운드(발신)</h2>

                    <label className={styles.field}>
                        <div>발신 번호</div>
                        <input
                            type="text"
                            value={targetNumber}
                            onChange={(e) => setTargetNumber(e.target.value)}
                            placeholder="010-0000-0000"
                            className={styles.textInput}
                        />
                    </label>

                    <div className={styles.buttonRow}>
                        <button type="button" onClick={handleCall}>
                            발신
                        </button>
                        <button type="button" onClick={handleHangup}>
                            끊기
                        </button>
                    </div>
                </section>
            </div>

            {/* 오른쪽: 이벤트 로그 */}
            <section className={styles.logSection}>
                <h2 className={styles.cardTitle}>이벤트 로그</h2>
                <div className={styles.logBody}>
                    {log.length === 0 ? (
                        <div className={styles.logEmpty}>
                            아직 로그가 없습니다. 좌측에서 로그인/발신을 시도해 보세요.
                        </div>
                    ) : (
                        log.map((line, idx) => <div key={idx}>{line}</div>)
                    )}
                </div>
            </section>

            {/* 인바운드 / 아웃바운드 공통으로 사용하는 원격 오디오 요소 */}
            <audio
                ref={remoteAudioRef}
                autoPlay
                playsInline
                style={{ display: 'none' }}
            />
        </div>
    );
}