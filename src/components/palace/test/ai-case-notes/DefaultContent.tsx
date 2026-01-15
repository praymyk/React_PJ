'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

import styles from '@components/palace/test/ai-case-notes/DefaultContent.module.scss';
import HeaderSection from '@components/common/SubContentForm/headerSection/HeaderSection';
import KindTabSection from '@components/palace/test/ai-case-notes/tabSection/KindTabSection';

import {
    buildTemplateListQuery,
    normalizeKind,
    type TemplateKind,
    type TemplateListApiResponse,
} from '@/app/(protected)/palace/test/ai-case-notes/data';

type UiTemplateRow = {
    id: string;
    companyId: number;
    kind: TemplateKind;
    title: string;
    prompt: string | null;
    content: string;
    createdAt: string;
    updatedAt: string;
    createdBy: number | null;
};

const KIND_LABEL: Record<TemplateKind, string> = {
    case_note: '상담이력',
    inquiry_reply: '1:1 문의 답변',
    sms_reply: '문자 답변',
};

export default function DefaultContent() {
    const companyId = 1;
    const sp = useSearchParams();

    const kind: TemplateKind = useMemo(() => normalizeKind(sp.get('kind')), [sp]);

    // ===== 생성 UI 상태 =====
    const [prompt, setPrompt] = useState('');
    const [generated, setGenerated] = useState('');
    const [saveTitle, setSaveTitle] = useState('');
    const [showSaveBox, setShowSaveBox] = useState(false);

    // ===== 목록(DB) 상태 =====
    const [saved, setSaved] = useState<UiTemplateRow[]>([]);
    const [listLoading, setListLoading] = useState(false);
    const [listError, setListError] = useState<string | null>(null);

    // kind 바뀌면 생성 UI 초기화 (URL=진실 패턴)
    useEffect(() => {
        setPrompt('');
        setGenerated('');
        setSaveTitle('');
        setShowSaveBox(false);
    }, [kind]);

    const refetchList = useCallback(async () => {
        setListLoading(true);
        setListError(null);

        try {
            const qs = buildTemplateListQuery({ companyId, kind, page: 1, pageSize: 50 });
            const res = await fetch(`/api/common/template?${qs}`, { cache: 'no-store' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const json: TemplateListApiResponse = await res.json();
            if (!json.ok) throw new Error('API ok=false');

            const uiRows: UiTemplateRow[] = json.data.rows.map((r) => ({
                id: String(r.id),
                companyId: r.company_id,
                kind: r.kind,
                title: r.title,
                prompt: r.prompt,
                content: r.content,
                createdAt: r.created_at,
                updatedAt: r.updated_at,
                createdBy: r.created_by,
            }));

            setSaved(uiRows);
        } catch (e) {
            console.error('[DefaultContent] list fetch error:', e);
            setSaved([]);
            setListError('템플릿 목록을 불러오지 못했습니다.');
        } finally {
            setListLoading(false);
        }
    }, [companyId, kind]);

    // 탭(kind) / companyId 바뀌면 목록 재조회
    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (cancelled) return;
            await refetchList();
        })();
        return () => {
            cancelled = true;
        };
    }, [refetchList]);

    const resetAll = () => {
        setPrompt('');
        setGenerated('');
        setSaveTitle('');
        setShowSaveBox(false);
    };

    // ===== 더미 생성(추후 GPT 연동으로 교체) =====
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
                `추가 문의는 편하게 회신 부탁드립니다.\n감사합니다.\n\n` +
                `---\n요청 프롬프트(원문):\n${p}\n`
            );
        }

        return (
            `### 문자 답변 템플릿\n` +
            `- 회사ID: ${companyId}\n` +
            `- 종류: 문자 답변\n\n` +
            `[업체명]입니다.\n` +
            `문의하신 내용 안내드립니다:\n- \n` +
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

        if (!saveTitle.trim()) setSaveTitle(`${KIND_LABEL[kind]} 템플릿`);
    };

    // ===== DB 저장(POST) =====
    const saveTemplate = async () => {
        const title = saveTitle.trim();
        if (!title || !generated.trim()) return;

        try {
            const res = await fetch('/api/common/response-templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companyId,
                    kind,
                    title,
                    prompt: prompt.trim() || null,
                    content: generated,
                }),
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            setShowSaveBox(false);
            await refetchList(); // 저장 후 목록 리프레시
        } catch (e) {
            console.error('[DefaultContent] saveTemplate error:', e);
            alert('저장에 실패했습니다.');
        }
    };

    // ===== DB 삭제(DELETE) =====
    const removeTemplate = async (id: string) => {
        try {
            const res = await fetch(`/api/common/response-templates/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            await refetchList();
        } catch (e) {
            console.error('[DefaultContent] removeTemplate error:', e);
            alert('삭제에 실패했습니다.');
        }
    };

    // ===== 불러오기(목록에서 UI로) =====
    const loadTemplate = (id: string) => {
        const item = saved.find((x) => x.id === id);
        if (!item) return;
        setPrompt(item.prompt ?? '');
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

            <KindTabSection companyId={companyId} />

            <div className={styles.twoCols}>
                {/* 좌 */}
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

                {/* 우 */}
                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div>
                            <div className={styles.cardTitle}>생성 결과</div>
                            <div className={styles.cardHint}>
                                결과를 복사하거나, 현재 종류({KIND_LABEL[kind]})에 템플릿으로 저장하세요.
                            </div>
                        </div>

                        <div className={styles.cardHeaderActions}>
                            <button type="button" className={styles.btnOutline} onClick={copyGenerated} disabled={!generated.trim()}>
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

            {/* 하단 리스트 */}
            <section className={styles.card}>
                <div className={styles.cardHeader}>
                    <div>
                        <div className={styles.cardTitle}>저장된 템플릿</div>
                        <div className={styles.cardHint}>현재 선택한 종류({KIND_LABEL[kind]})의 템플릿 목록입니다.</div>
                    </div>
                </div>

                {listLoading ? (
                    <div className={styles.emptyText}>불러오는 중...</div>
                ) : listError ? (
                    <div className={styles.emptyText}>{listError}</div>
                ) : saved.length === 0 ? (
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