'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from '@components/palace/test/ai-case-notes/DefaultContent.module.scss';
import HeaderSection from '@components/common/SubContentForm/headerSection/HeaderSection';

type TemplateKind = 'case_note' | 'inquiry_reply' | 'sms_reply';

const KIND_LABEL: Record<TemplateKind, string> = {
    case_note: '상담이력',
    inquiry_reply: '1:1 문의 답변',
    sms_reply: '문자 답변',
};

type SavedTemplate = {
    id: string;
    companyId: number;
    kind: TemplateKind;
    title: string;
    prompt: string;
    content: string;
    createdAt: string; // ISO
};

const STORAGE_KEY_PREFIX = 'react-pj:templates:company:';

function makeId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function DefaultContent() {
    const companyId = 1;

    // 1. 종류 선택(필수)
    const [kind, setKind] = useState<TemplateKind>('case_note');

    // 2. company + kind 별로 따로 저장
    const storageKey = useMemo(
        () => `${STORAGE_KEY_PREFIX}${companyId}:kind:${kind}`,
        [companyId, kind]
    );

    const [prompt, setPrompt] = useState('');
    const [generated, setGenerated] = useState('');

    const [saveTitle, setSaveTitle] = useState('');
    const [showSaveBox, setShowSaveBox] = useState(false);

    const [saved, setSaved] = useState<SavedTemplate[]>([]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            const list: SavedTemplate[] = raw ? JSON.parse(raw) : [];
            setSaved(Array.isArray(list) ? list : []);
        } catch {
            setSaved([]);
        }
    }, [storageKey]);

    const persist = (list: SavedTemplate[]) => {
        setSaved(list);
        localStorage.setItem(storageKey, JSON.stringify(list));
    };

    const resetAll = () => {
        setPrompt('');
        setGenerated('');
        setSaveTitle('');
        setShowSaveBox(false);
    };

    // 3. kind별 더미 템플릿 (나중에 GPT 호출로 교체)
    const buildDummyTemplate = (k: TemplateKind, p: string) => {
        if (k === 'case_note') {
            return (
                `### 상담이력 작성 템플릿\n` +
                `- 회사ID: ${companyId}\n` +
                `- 종류: 상담이력\n\n` +
                `**1) 상담 요약**\n- 고객명/연락처:\n- 핵심 이슈(1줄):\n\n` +
                `**2) 상세 내용**\n- 상황:\n- 고객 요구:\n- 특이사항:\n\n` +
                `**3) 조치/안내**\n- 안내 내용:\n- 처리 결과:\n\n` +
                `**4) 후속 조치**\n- 담당/기한:\n- 다음 액션:\n\n` +
                `---\n요청 프롬프트(원문):\n${p}\n`
            );
        }

        if (k === 'inquiry_reply') {
            return (
                `### 1:1 문의 답변 템플릿\n` +
                `- 회사ID: ${companyId}\n` +
                `- 종류: 1:1 문의 답변\n\n` +
                `안녕하세요. [고객명]님,\n\n` +
                `문의 주신 내용 확인했습니다.\n` +
                `- 문의 요약:\n` +
                `- 확인 결과:\n\n` +
                `아래와 같이 안내드립니다.\n` +
                `1) ...\n2) ...\n\n` +
                `추가로 궁금하신 점이 있다면 편하게 회신 부탁드립니다.\n감사합니다.\n\n` +
                `---\n요청 프롬프트(원문):\n${p}\n`
            );
        }

        // sms_reply
        return (
            `### 문자 답변 템플릿\n` +
            `- 회사ID: ${companyId}\n` +
            `- 종류: 문자 답변\n\n` +
            `[업체명]입니다.\n` +
            `문의하신 내용 안내드립니다: \n` +
            `- \n` +
            `추가 문의는 답장 부탁드립니다. 감사합니다.\n\n` +
            `---\n요청 프롬프트(원문):\n${p}\n`
        );
    };

    const generateTemplate = () => {
        const p = prompt.trim();
        if (!p) return;

        const template = buildDummyTemplate(kind, p);

        setGenerated(template);
        setShowSaveBox(true);

        if (!saveTitle.trim()) {
            setSaveTitle(`${KIND_LABEL[kind]} 템플릿`);
        }
    };

    const saveTemplate = () => {
        const title = saveTitle.trim();
        if (!title) return;
        if (!generated.trim()) return;

        const item: SavedTemplate = {
            id: makeId(),
            companyId,
            kind,
            title,
            prompt: prompt.trim(),
            content: generated,
            createdAt: new Date().toISOString(),
        };

        persist([item, ...saved]);
        setShowSaveBox(false);
    };

    const removeTemplate = (id: string) => {
        persist(saved.filter((x) => x.id !== id));
    };

    const loadTemplate = (id: string) => {
        const item = saved.find((x) => x.id === id);
        if (!item) return;
        setPrompt(item.prompt);
        setGenerated(item.content);
        setSaveTitle(item.title);
        setShowSaveBox(true);
    };

    const copyGenerated = async () => {
        if (!generated) return;
        await navigator.clipboard.writeText(generated);
    };

    return (
        <div className={styles.root}>
            <HeaderSection
                title="응대 템플릿 생성(AI)"
                description="상담이력/1:1 답변/문자 답변 등 템플릿을 문장으로 생성하고 저장해 재사용합니다."
            />

            {/* 종류 선택 Bar */}
            <section className={styles.kindBar}>
                <div className={styles.kindTabs} role="tablist" aria-label="템플릿 종류">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={kind === 'case_note'}
                        className={`${styles.kindTab} ${kind === 'case_note' ? styles.kindTabActive : ''}`}
                        onClick={() => {
                            setKind('case_note');
                            setShowSaveBox(false);
                        }}
                    >
                        상담이력
                    </button>

                    <button
                        type="button"
                        role="tab"
                        aria-selected={kind === 'inquiry_reply'}
                        className={`${styles.kindTab} ${kind === 'inquiry_reply' ? styles.kindTabActive : ''}`}
                        onClick={() => {
                            setKind('inquiry_reply');
                            setShowSaveBox(false);
                        }}
                    >
                        1:1 문의 답변
                    </button>

                    <button
                        type="button"
                        role="tab"
                        aria-selected={kind === 'sms_reply'}
                        className={`${styles.kindTab} ${kind === 'sms_reply' ? styles.kindTabActive : ''}`}
                        onClick={() => {
                            setKind('sms_reply');
                            setShowSaveBox(false);
                        }}
                    >
                        문자 답변
                    </button>
                </div>

                <div className={styles.kindRight}>
                    <span className={styles.badgeLabel}>company</span>
                    <span className={styles.badgeValue}>{companyId}</span>
                </div>
            </section>

            {/* 좌/우 2컬럼 */}
            <div className={styles.twoCols}>
                {/* 좌: 프롬프트 */}
                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div>
                            <div className={styles.cardTitle}>프롬프트</div>
                            <div className={styles.cardHint}>
                                선택한 종류({KIND_LABEL[kind]})에 맞는 템플릿을 문장으로 요청하세요.
                            </div>
                        </div>

                        <div className={styles.cardHeaderActions}>
                            <button type="button" className={styles.btnOutline} onClick={resetAll}>
                                초기화
                            </button>
                            <button
                                type="button"
                                className={styles.btnPrimary}
                                onClick={generateTemplate}
                                disabled={!prompt.trim()}
                            >
                                생성
                            </button>
                        </div>
                    </div>

                    <textarea
                        className={styles.textarea}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={`${KIND_LABEL[kind]} 템플릿을 어떤 형태로 만들지 설명해 주세요.`}
                    />
                </section>

                {/* 우: 생성 결과 */}
                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div>
                            <div className={styles.cardTitle}>생성 결과</div>
                            <div className={styles.cardHint}>
                                결과를 복사하거나, 현재 종류({KIND_LABEL[kind]})에 템플릿으로 저장하세요.
                            </div>
                        </div>

                        <div className={styles.cardHeaderActions}>
                            <button
                                type="button"
                                className={styles.btnOutline}
                                onClick={copyGenerated}
                                disabled={!generated.trim()}
                            >
                                복사
                            </button>
                            <button
                                type="button"
                                className={styles.btnOutline}
                                onClick={() => setShowSaveBox((v) => !v)}
                                disabled={!generated.trim()}
                            >
                                저장
                            </button>
                        </div>
                    </div>

                    {showSaveBox && (
                        <div className={styles.saveBox}>
                            <label className={styles.field}>
                                <span className={styles.fieldLabel}>템플릿 이름</span>
                                <input
                                    className={styles.input}
                                    value={saveTitle}
                                    onChange={(e) => setSaveTitle(e.target.value)}
                                    placeholder={`예) ${KIND_LABEL[kind]}_표준`}
                                />
                            </label>

                            <div className={styles.saveActions}>
                                <button type="button" className={styles.btnOutline} onClick={() => setShowSaveBox(false)}>
                                    닫기
                                </button>
                                <button
                                    type="button"
                                    className={styles.btnPrimary}
                                    onClick={saveTemplate}
                                    disabled={!saveTitle.trim() || !generated.trim()}
                                >
                                    저장 확정
                                </button>
                            </div>
                        </div>
                    )}

                    <textarea
                        className={styles.textarea}
                        value={generated}
                        onChange={(e) => setGenerated(e.target.value)}
                        placeholder="생성 버튼을 누르면 결과가 표시됩니다."
                    />
                </section>
            </div>

            {/* 하단: 현재 kind의 저장 목록 */}
            <section className={styles.card}>
                <div className={styles.cardHeader}>
                    <div>
                        <div className={styles.cardTitle}>저장된 템플릿</div>
                        <div className={styles.cardHint}>
                            현재 선택한 종류({KIND_LABEL[kind]})의 템플릿 목록입니다.
                        </div>
                    </div>
                </div>

                {saved.length === 0 ? (
                    <div className={styles.emptyText}>저장된 템플릿이 없습니다.</div>
                ) : (
                    <div className={styles.list}>
                        {saved.map((t) => (
                            <div key={t.id} className={styles.listItem}>
                                <div className={styles.listLeft}>
                                    <div className={styles.listTitle}>{t.title}</div>
                                    <div className={styles.listMeta}>
                                        {new Date(t.createdAt).toLocaleString()} · prompt {t.prompt ? '있음' : '없음'}
                                    </div>
                                </div>

                                <div className={styles.listActions}>
                                    <button type="button" className={styles.btnOutline} onClick={() => loadTemplate(t.id)}>
                                        불러오기
                                    </button>
                                    <button type="button" className={styles.btnDanger} onClick={() => removeTemplate(t.id)}>
                                        삭제
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}