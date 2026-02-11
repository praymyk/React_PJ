'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

import api from '@/utils/axios';

import styles from '@components/palace/test/ai-case-notes/DefaultContent.module.scss';
import HeaderSection from '@components/common/SubContentForm/headerSection/HeaderSection';
import KindTabSection from '@components/palace/test/ai-case-notes/tabSection/KindTabSection';
import type {ApiResponse} from "@/types/api";

type TemplateAiContent = {
    content: string; // 서버가 주는 문자열 JSON
};

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

type TemplateKind = 'case_note' | 'inquiry_reply' | 'sms_reply';

const KIND_LABEL: Record<TemplateKind, string> = {
    case_note: '상담이력',
    inquiry_reply: '1:1 문의 답변',
    sms_reply: '문자 답변',
};

type Props = {
    companyId: number;
};

export function DefaultContentInner({ companyId } : Props) {

    const sp = useSearchParams();

    const kind: TemplateKind = useMemo(() => {
        const k = sp.get('kind');
        return (k === 'case_note' || k === 'inquiry_reply' || k === 'sms_reply') ? k : 'case_note';
    }, [sp]);

    // 탭(kind)별 프롬프트 입력 예시
    const PROMPT_EXAMPLES: Record<TemplateKind, string> = {
        case_note: '예) 성형외과 고객의 상담 내용을 요약하고 조치사항을 기록할 템플릿을 만들어줘',
        inquiry_reply: '예) 배송 관련 문의를 접수한 고객에게 보낼 안내 메일 템플릿 작성해줘',
        sms_reply: '예) 예약 확정 안내 문자를 광고성 없이 70자 이내로 깔끔하게 만들어줘',
    };

    // State 관리
    const [prompt, setPrompt] = useState('');
    const [generated, setGenerated] = useState('');
    const [saveTitle, setSaveTitle] = useState('');
    const [showSaveBox, setShowSaveBox] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const [saved, setSaved] = useState<UiTemplateRow[]>([]);
    const [listLoading, setListLoading] = useState(false);
    const [listError, setListError] = useState<string | null>(null);

    // 탭 변경 시 초기화
    useEffect(() => {
        setPrompt('');
        setGenerated('');
        setSaveTitle('');
        setShowSaveBox(false);
        setIsGenerating(false);
    }, [kind]);

    const refetchList = useCallback(async () => {
        setListLoading(true);
        setListError(null);

        try {
            const { data } = await api.get<{ rows: ApiTemplateRow[] }>('/api/common/template', {
                params: {
                    companyId,
                    kind
                }
            });

            if (!Array.isArray(data.rows)) {
                throw new Error('Invalid response: rows is not an array');
            }

            const apiRows = data.rows || [];

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

    const generateTemplate = async () => {
        const p = prompt.trim();
        if (!p) return;

        setIsGenerating(true);
        setShowSaveBox(false);

        try {
            // 백엔드 API 호출
            const res = await api.post<{ content: string }>(
                '/api/ai/generate/template',
                { kind, prompt: p },
                { timeout: 60000 }
            );

            const payload = res.data;

            if (payload?.content) {
                setGenerated(payload.content);

                // 제목 자동 세팅 (비어있을 경우)
                if (!saveTitle.trim()) {
                    setSaveTitle(`${KIND_LABEL[kind]} AI생성`);
                }
            } else {
                throw new Error('AI 응답 데이터가 올바르지 않습니다.');
            }

        } catch (e) {
            console.error('[Generate] error:', e);
            alert('AI 템플릿 생성에 실패했습니다.\n잠시 후 다시 시도해주세요.');
        } finally {
            setIsGenerating(false); // 로딩 종료
        }
    };

    // 템플릿 저장 요청
    const saveTemplate = async () => {
        const title = saveTitle.trim();
        if (!title || !generated.trim()) return;

        try {
            await api.post('/api/common/response-templates', {
                companyId,
                kind,
                title,
                prompt: prompt.trim() || null,
                content: generated,
            });

            setShowSaveBox(false);
            alert('성공적으로 저장되었습니다.');
            await refetchList();
        } catch (e) {
            console.error('[DefaultContent] saveTemplate error:', e);
            alert('저장에 실패했습니다.');
        }
    };

    // 템플릿 삭제 요청
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
                            <button
                                type="button"
                                className={styles.btnOutline}
                                onClick={resetAll}
                                disabled={isGenerating}
                            >
                                초기화
                            </button>
                            <button
                                type="button"
                                className={styles.btnPrimary}
                                onClick={generateTemplate}
                                disabled={!prompt.trim() || isGenerating}
                            >
                                {/* 로딩 중이면 텍스트 변경 */}
                                {isGenerating ? '생성 중...' : 'AI 생성'}
                            </button>
                        </div>
                    </div>
                    <textarea
                        className={styles.textarea}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={PROMPT_EXAMPLES[kind]}
                        disabled={isGenerating}
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
                                <button type="button" className={styles.btnOutline} onClick={() => setShowSaveBox(false)}>닫기</button>
                                <button
                                    type="button"
                                    className={styles.btnPrimary}
                                    onClick={saveTemplate}
                                    disabled={!saveTitle.trim()}
                                >
                                    저장 확정
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 결과 영역 (로딩 오버레이 포함) */}
                    <div className={styles.resultContainer}>
                        {isGenerating && (
                            <div className={styles.loadingOverlay}>
                                <span className="uSpinner" style={{ marginRight: '8px' }}></span>
                                <span>AI가 템플릿을 작성하고 있습니다...</span>
                            </div>
                        )}
                        <textarea
                            className={styles.textarea}
                            value={generated}
                            onChange={(e) => setGenerated(e.target.value)}
                            placeholder="AI 생성 버튼을 누르면 결과가 여기에 표시됩니다."
                            disabled={isGenerating}
                        />
                    </div>
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