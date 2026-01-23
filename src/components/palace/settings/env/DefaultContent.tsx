'use client';

import { useEffect, useState } from 'react';
import api from '@utils/axios'
import styles from '@components/palace/settings/env/DefaultContent.module.scss';
import HeaderSection from "@components/common/SubContentForm/headerSection/HeaderSection";

type EnvPreferences = {
    darkMode: boolean;
    defaultPageSize: number;
};

export default function DefaultContent() {
    const [prefs, setPrefs] = useState<EnvPreferences>({
        darkMode: false,
        defaultPageSize: 20,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [statusKind, setStatusKind] = useState<'ok' | 'error' | null>(null);

    // 초기 로드: DB에 저장된 환경설정 불러오기
    useEffect(() => {
        let aborted = false;

        (async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/common/users/me/preferences');

                if (aborted) return;

                const data = response.data;

                const darkMode = Boolean(data.darkMode);
                const pageSize = Number(data.defaultPageSize ?? 20) || 20;

                setPrefs({
                    darkMode,
                    defaultPageSize: pageSize,
                });

                // DB에 저장된 다크모드 값을 실제 문서에도 반영
                if (darkMode) {
                    document.documentElement.classList.add('dark');
                    window.localStorage.setItem('theme', 'dark');
                } else {
                    document.documentElement.classList.remove('dark');
                    window.localStorage.setItem('theme', 'light');
                }
            } catch (err) {
                console.warn(
                    '[EnvSettings] 환경설정 조회 실패 (기본값 사용)',
                    err,
                );
                if (!aborted) {
                    setStatusKind('error');
                    setStatusMessage(
                        '저장된 환경설정을 불러오지 못했습니다. 기본값이 사용됩니다.',
                    );
                }
            } finally {
                if (!aborted) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            aborted = true;
        };
    }, []);

    const handleToggleDarkMode = () => {
        setPrefs(prev => ({ ...prev, darkMode: !prev.darkMode }));
    };

    const handleChangePageSize = (value: string) => {
        const num = Number(value);
        if (!Number.isNaN(num) && num > 0) {
            setPrefs(prev => ({ ...prev, defaultPageSize: num }));
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setStatusMessage(null);
            setStatusKind(null);

            const payload = {
                darkMode: prefs.darkMode,
                defaultPageSize: prefs.defaultPageSize,
            };

            await api.post('/api/common/users/me/preferences', payload);

            // 저장 성공 시 테마 반영
            if (prefs.darkMode) {
                document.documentElement.classList.add('dark');
                window.localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                window.localStorage.setItem('theme', 'light');
            }

            // 헤더 토글 버튼 동기화
            window.dispatchEvent(new Event('theme-change'));

            setStatusKind('ok');
            setStatusMessage('환경설정이 저장되었습니다.');
        } catch (err) {
            console.error('[EnvSettings] 환경설정 저장 실패', err);
            setStatusKind('error');
            setStatusMessage('환경설정을 저장하는 중 오류가 발생했습니다.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <HeaderSection
                title="환경 설정"
                description="
                    다크 모드와 기본 목록 크기 등을 설정하면 다음 접속부터 동일한
                    환경으로 사용할 수 있습니다
                    ."
            />

            <div className={styles.sectionGrid}>
                {/* 좌측: 테마 / 표시 환경 */}
                <section className={styles.card}>
                    <header className={styles.cardHeader}>
                        <div>
                            <h2 className={styles.cardTitle}>테마 / 표시 환경</h2>
                            <p className={styles.cardSub}>
                                다크 모드와 기본 페이지 사이즈 등 UI 환경을 설정합니다.
                            </p>
                        </div>
                    </header>

                    <div className={styles.cardBody}>
                        {/* 다크 모드 토글 */}
                        <div className={styles.toggleRow}>
                            <div className={styles.toggleLabelBlock}>
                                <span className={styles.toggleTitle}>다크 모드</span>
                                <span className={styles.toggleDescription}>
                  배경을 어둡게 하여 눈부심을 줄이고, 디스코드 스타일 톤으로
                  전환합니다.
                </span>
                            </div>

                            <button
                                type="button"
                                className={styles.switch}
                                data-active={prefs.darkMode ? 'true' : 'false'}
                                onClick={handleToggleDarkMode}
                                disabled={loading || saving}
                                aria-pressed={prefs.darkMode}
                            >
                                <span className={styles.switchThumb} />
                            </button>
                        </div>

                        {/* 기본 페이지 사이즈 */}
                        <div className={styles.fieldRow}>
                            <span className={styles.fieldLabel}>기본 목록 페이지 크기</span>
                            <select
                                className={styles.select}
                                value={prefs.defaultPageSize}
                                onChange={e => handleChangePageSize(e.target.value)}
                                disabled={loading || saving}
                            >
                                <option value={10}>10개</option>
                                <option value={20}>20개</option>
                                <option value={50}>50개</option>
                                <option value={100}>100개</option>
                            </select>
                        </div>

                        {statusMessage && (
                            <div
                                className={`${styles.statusText} ${
                                    statusKind === 'ok'
                                        ? styles.statusOk
                                        : statusKind === 'error'
                                            ? styles.statusError
                                            : ''
                                }`}
                            >
                                {statusMessage}
                            </div>
                        )}
                    </div>

                    <div className={styles.footerRow}>
                        <button
                            type="button"
                            className={styles.saveButton}
                            data-variant="primary"
                            onClick={handleSave}
                            disabled={loading || saving}
                        >
                            {saving ? '저장 중...' : '설정 저장'}
                        </button>
                    </div>
                </section>

                {/* 우측: 예시용 카드 (아직 동작 X) */}
                <section className={styles.card}>
                    <header className={styles.cardHeader}>
                        <div>
                            <h2 className={styles.cardTitle}>알림 / 기타 설정 (예시)</h2>
                            <p className={styles.cardSub}>
                                추후 이메일 알림, 기본 대시보드 기간 등 추가 환경설정 항목을 둘
                                수 있습니다.
                            </p>
                        </div>
                    </header>

                    <div className={styles.cardBody}>
                        <div className={styles.fieldRow}>
                            <span className={styles.fieldLabel}>대시보드 기본 기간 (예시)</span>
                            <select className={styles.select} disabled>
                                <option>오늘</option>
                                <option>최근 7일</option>
                                <option>최근 30일</option>
                            </select>
                        </div>

                        <div className={styles.fieldRow}>
                            <span className={styles.fieldLabel}>이메일 알림 (예시)</span>
                            <select className={styles.select} disabled>
                                <option>모든 알림</option>
                                <option>중요 알림만</option>
                                <option>알림 끄기</option>
                            </select>
                        </div>

                        <p className={styles.statusText}>
                            위 옵션들은 아직 동작하지 않는 목업임
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}