'use client';

import { useEffect, useMemo, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// ✅ [수정 1] axios 인스턴스 import (경로는 프로젝트 설정에 맞게 @utils/axios 등)
import api from '@/utils/axios';

import styles from '@components/palace/test/ai-case-notes/DefaultContent.module.scss';
import HeaderSection from '@components/common/SubContentForm/headerSection/HeaderSection';
import KindTabSection from '@components/palace/test/ai-case-notes/tabSection/KindTabSection';

export type TemplateKind = 'case_note' | 'inquiry_reply' | 'sms_reply';

// 백엔드 응답 데이터 구조 (Snake Case)
type ApiTemplateRow = {
    id: number;
    company_id: number;
    kind: string;
    title: string;
    prompt: string | null;
    content: string;
    created_at: string;
    updated_at: string;
    created_by: number | null;
};

// UI에서 사용할 데이터 구조 (Camel Case)
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

function DefaultContentInner() {
    const companyId = 1;
    const sp = useSearchParams();

    const kind: TemplateKind = useMemo(() => {
        const k = sp.get('kind');
        return (k === 'case_note' || k === 'inquiry_reply' || k === 'sms_reply') ? k : 'case_note';
    }, [sp]);

    const [prompt, setPrompt] = useState('');
    const [generated, setGenerated] = useState('');
    const [saveTitle, setSaveTitle] = useState('');
    const [showSaveBox, setShowSaveBox] = useState(false);

    const [saved, setSaved] = useState<UiTemplateRow[]>([]);
    const [listLoading, setListLoading] = useState(false);
    const [listError, setListError] = useState<string | null>(null);

    useEffect(() => {
        setPrompt('');
        setGenerated('');
        setSaveTitle('');
        setShowSaveBox(false);
    }, [kind]);

    // ✅ [수정 2] 목록 조회 (axios.get 사용)
    const refetchList = useCallback(async () => {
        setListLoading(true);
        setListError(null);

        try {
            // api.get 사용 (쿼리 파라미터는 params 옵션으로 전달)
            const res = await api.get('/api/common/template', {
                params: {
                    companyId,
                    kind
                }
            });

            // axios는 res.data에 실제 응답 바디가 들어있음
            // 백엔드 응답: { ok: true, data: { rows: [...] } }
            const json = res.data;

            if (!json.ok) throw new Error('API Response not ok');

            const apiRows: ApiTemplateRow[] = json.data.rows;

            // 매핑 로직
            const uiRows: UiTemplateRow[] = apiRows.map((r) => ({
                id: String(r.id),
                companyId: r.company_id,
                kind: r.kind as TemplateKind,
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

    useEffect(() => {
        refetchList();
    }, [refetchList]);

    const resetAll = () => {
        setPrompt('');
        setGenerated('');
        setSaveTitle('');
        setShowSaveBox(false);
    };

    // 더미 생성 함수 (그대로 유지)
    const buildDummyTemplate = (k: TemplateKind, p: string) => {
        if (k === 'case_note') {
            return `### 상담이력 (AI 예시)\n- 요약: ...\n- 내용: ${p}`;
        }
        return `[${KIND_LABEL[k]}] AI 자동 생성 결과입니다.\n내용: ${p}`;
    };

    const generateTemplate = () => {
        const p = prompt.trim();
        if (!p) return;
        const template = buildDummyTemplate(kind, p);
        setGenerated(template);
        setShowSaveBox(true);
        if (!saveTitle.trim()) setSaveTitle(`${KIND_LABEL[kind]} 템플릿`);
    };

    // ✅ [수정 3] 템플릿 저장 (axios.post 사용)
    const saveTemplate = async () => {
        const title = saveTitle.trim();
        if (!title || !generated.trim()) return;

        try {
            // body 객체를 두 번째 인자로 바로 전달
            await api.post('/api/common/response-templates', {
                companyId,
                kind,
                title,
                prompt: prompt.trim() || null,
                content: generated,
            });

            setShowSaveBox(false);
            alert('저장되었습니다.');
            await refetchList();
        } catch (e) {
            console.error('[DefaultContent] saveTemplate error:', e);
            alert('저장에 실패했습니다.');
        }
    };

    // ✅ [수정 4] 템플릿 삭제 (axios.delete 사용)
    const removeTemplate = async (id: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            await api.delete(`/api/common/response-templates/${id}`);
            await refetchList();
        } catch (e) {
            console.error('[DefaultContent] removeTemplate error:', e);
            alert('삭제에 실패했습니다.');
        }
    };

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
        alert('복사되었습니다.');
    };

    // JSX 렌더링 부분은 동일
    return (
        <div className={styles.root}>
            <HeaderSection
                title="응대 템플릿 생성(AI)"
                description="AI를 활용해 상담 템플릿을 생성하고 저장/관리합니다."
            />

            <KindTabSection companyId={companyId} />

            <div className={styles.twoCols}>
                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div>
                            <div className={styles.cardTitle}>프롬프트</div>
                            <div className={styles.cardHint}>
                                {KIND_LABEL[kind]} 템플릿을 어떻게 만들지 설명해주세요.
                            </div>
                        </div>
                        <div className={styles.cardHeaderActions}>
                            <button type="button" className={styles.btnOutline} onClick={resetAll}>초기화</button>
                            <button
                                type="button"
                                className={styles.btnPrimary}
                                onClick={generateTemplate}
                                disabled={!prompt.trim()}
                            >
                                AI 생성
                            </button>
                        </div>
                    </div>
                    <textarea
                        className={styles.textarea}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="예) 고객 문의에 정중하게 답변하는 템플릿 생성해줘"
                    />
                </section>

                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div>
                            <div className={styles.cardTitle}>생성 결과</div>
                            <div className={styles.cardHint}>결과를 수정하거나 저장하여 사용하세요.</div>
                        </div>
                        <div className={styles.cardHeaderActions}>
                            <button type="button" className={styles.btnOutline} onClick={copyGenerated} disabled={!generated.trim()}>복사</button>
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
                                    placeholder="템플릿 제목 입력"
                                />
                            </label>
                            <div className={styles.saveActions}>
                                <button type="button" className={styles.btnOutline} onClick={() => setShowSaveBox(false)}>취소</button>
                                <button
                                    type="button"
                                    className={styles.btnPrimary}
                                    onClick={saveTemplate}
                                    disabled={!saveTitle.trim()}
                                >
                                    확인
                                </button>
                            </div>
                        </div>
                    )}

                    <textarea
                        className={styles.textarea}
                        value={generated}
                        onChange={(e) => setGenerated(e.target.value)}
                        placeholder="AI 생성 결과가 여기에 표시됩니다."
                    />
                </section>
            </div>

            <section className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>저장된 템플릿 ({saved.length})</div>
                </div>

                {listLoading ? (
                    <div className={styles.emptyText}>로딩 중...</div>
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
                                        {new Date(t.createdAt).toLocaleString()} · {t.prompt ? 'AI 생성' : '직접 작성'}
                                    </div>
                                    <div className={styles.listPreview}>{t.content.slice(0, 50)}...</div>
                                </div>
                                <div className={styles.listActions}>
                                    <button type="button" className={styles.btnOutline} onClick={() => loadTemplate(t.id)}>불러오기</button>
                                    <button type="button" className={styles.btnDanger} onClick={() => removeTemplate(t.id)}>삭제</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default function DefaultContent() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DefaultContentInner />
        </Suspense>
    );
}