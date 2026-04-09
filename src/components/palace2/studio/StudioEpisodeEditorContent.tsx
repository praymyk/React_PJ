'use client';

import { 
    listEpisodes, 
    createEpisode as createEpisodeApi, 
    getEpisode as getEpisodeApi,
    updateEpisode as updateEpisodeApi,
    type EpisodeSummary,
    type EpisodeDetail,
    type Anchor
} from '@/api/episode';
import type { WorkCreateResponse } from '@/api/works';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './StudioEpisodeEditorContent.module.scss';

// utils for splitting paragraphs
function splitParagraphs(raw: string | null | undefined) {
    if (!raw) return [];
    return raw
        .split(/\n{2,}/g)
        .map(s => s.trim())
        .filter(Boolean);
}

export default function StudioEpisodeEditorContent({ initialWork }: { initialWork?: WorkCreateResponse }) {
    const router = useRouter();
    const params = useParams<{ workId: string; episodeId: string }>();

    const workId = params?.workId;
    const episodeId = params?.episodeId;

    const [workTitle, setWorkTitle] = useState<string>(initialWork?.title ?? '(loading)');
    const [episode, setEpisode] = useState<EpisodeDetail | null>(null);
    const [episodeList, setEpisodeList] = useState<EpisodeSummary[]>([]);
    const [loadingList, setLoadingList] = useState(false);
    const [saving, setSaving] = useState(false);

    // 편집 상태
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [anchors, setAnchors] = useState<Anchor[]>([]);
    const paragraphs = useMemo(() => splitParagraphs(body), [body]);

    // 에피소드 리스트 로드 (서버 API)
    const reloadList = useCallback(async () => {
        if (!workId) return;
        setLoadingList(true);
        try {
            const data = await listEpisodes(workId);
            setEpisodeList(data);

            // 'new' 상태일 때 넘버링 자동 완성
            if (episodeId === 'new') {
                const maxNo = data.reduce((max, ep) => Math.max(max, ep.episodeNo), 0);
                const nextNo = maxNo + 1;
                setEpisode({
                    id: 'new', workId: workId as string, episodeNo: nextNo, title: `${nextNo}화 제목을 입력하세요`,
                    body: '', paragraphs: [], anchors: [], status: 'DRAFT',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });
                setTitle(`${nextNo}화 제목을 입력하세요`);
                setBody('');
                setAnchors([]);
            }
        } catch (err) {
            console.error('에피소드 목록 로딩 실패:', err);
        } finally {
            setLoadingList(false);
        }
    }, [workId, episodeId]);

    useEffect(() => {
        // 1) 작품 정보 설정 (Props가 있으면 바로 사용)
        if (initialWork) {
            setWorkTitle(initialWork.title);
        }

        // 2) 에피소드 목록 (서버 API 호출)
        reloadList();

        // 3) 선택 에피소드 상세 (서버 API 호출)
        const fetchEpisodeDetail = async () => {
            if (episodeId && episodeId !== 'new' && workId) {
                try {
                    const ep = await getEpisodeApi(workId, episodeId);
                    setEpisode(ep);
                    setTitle(ep.title);
                    setBody(ep.body ?? '');
                    setAnchors(ep.anchors ?? []);
                } catch (error) {
                    console.error('에피소드 상세 조회 실패:', error);
                    alert('에피소드 정보를 불러오는데 실패했습니다.');
                }
            }
        };

        fetchEpisodeDetail();

    }, [workId, episodeId, reloadList, initialWork]);

    const goEpisode = (id: string) => router.push(`/palace2/studio/${workId}/episodes/${id}`);

    const onCreateNext = () => {
        if (!workId) return;
        goEpisode('new');
    };

    const addAuthorAnchor = (afterParagraphIndex: number) => {
        const id = `a_${Date.now()}`;
        setAnchors(prev => [
            ...prev,
            { id, afterParagraphIndex, source: 'AUTHOR', caption: '작가 지정 앵커', spoilerLevel: 0 },
        ]);
    };

    const removeAnchor = (anchorId: string) => {
        setAnchors(prev => prev.filter(a => a.id !== anchorId));
    };

    const onSave = async () => {
        if (!episode || !workId) return;
        setSaving(true);
        try {
            const payload = {
                episodeNo: episode.episodeNo,
                title: title.trim() || `${episode.episodeNo}화`,
                body,
                paragraphs,
                anchors,
                status: episode.status,
            };

            if (episode.id === 'new') {
                // 신규 등록: POST 요청으로 한 번에 모든 데이터 생성
                const newEp = await createEpisodeApi(workId, payload);
                
                await reloadList();
                goEpisode(newEp.id);
            } else {
                // 본문/앵커 업데이트 (PUT)
                await updateEpisodeApi(workId, episode.id, payload);
                setEpisode({ ...episode, ...payload, updatedAt: new Date().toISOString() });
                await reloadList();
            }
        } catch (err: any) {
            console.error('저장 실패:', err);
            alert('저장 중 오류가 발생했습니다.');
        } finally {
            setSaving(false);
        }
    };

    // preview blocks(텍스트 사이에 이미지 placeholder 용)
    const previewBlocks = useMemo(() => {
        const byIndex = new Map<number, Anchor[]>();
        for (const a of anchors) {
            const arr = byIndex.get(a.afterParagraphIndex) ?? [];
            arr.push(a);
            byIndex.set(a.afterParagraphIndex, arr);
        }

        const blocks: Array<{ type: 'text' | 'image'; key: string; text?: string; anchor?: Anchor }> = [];
        paragraphs.forEach((p, idx) => {
            blocks.push({ type: 'text', key: `p_${idx}`, text: p });
            (byIndex.get(idx) ?? []).forEach(a => blocks.push({ type: 'image', key: a.id, anchor: a }));
        });
        return blocks;
    }, [paragraphs, anchors]);

    return (
        <div className={styles.contentGrid}>
            {/* 좌측: 에피소드 리스트 */}
            <aside className={styles.leftColumn}>
                <section className={styles.sidePanel}>
                    <div className={styles.sideHeader}>
                        <div className={styles.sideTitle}>Episodes</div>
                        <button className={styles.smallBtn} type="button" onClick={onCreateNext}>
                            + 새 회차
                        </button>
                    </div>

                    <div className={styles.workName}>{workTitle}</div>

                    <ul className={styles.epList}>
                        {episodeList.map(m => (
                            <li key={m.id}>
                                <button
                                    type="button"
                                    className={styles.epItem}
                                    data-active={m.id === episodeId ? '1' : '0'}
                                    onClick={() => goEpisode(m.id)}
                                >
                                    <span className={styles.epNo}>EP {m.episodeNo}</span>
                                    <span className={styles.epTitle}>{m.title}</span>
                                    <span className={styles.epStatus} data-status={m.status}>{m.status}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            </aside>

            {/* 가운데: 에피소드 편집 */}
            <main className={styles.mainColumn}>
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h1 className={styles.sectionTitle}>에피소드 편집</h1>
                        <div className={styles.sectionTools}>
                            <button className={styles.secondaryBtn} type="button" onClick={() => router.push(`/palace2/works/${workId}`)}>
                                상세로 보기
                            </button>
                            <button className={styles.primaryBtn} type="button" onClick={onSave} disabled={!episode || saving}>
                                {saving ? '저장 중…' : '저장'}
                            </button>
                        </div>
                    </div>

                    <div className={styles.metaRow}>
                        <div className={styles.metaBadge}>EP {episode?.episodeNo ?? '-'}</div>
                        <input
                            className={styles.input}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="에피소드 제목"
                        />
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>본문</h2>
                        <div className={styles.hint}>빈 줄(2줄)로 문단 분리 · 문단 수 {paragraphs.length}</div>
                    </div>

                    <textarea
                        className={styles.textarea}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="여기에 1화 내용을 작성하세요…"
                    />
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>문단별 이미지 앵커(작가 지정)</h2>
                    </div>

                    <div className={styles.paragraphList}>
                        {paragraphs.map((p, idx) => {
                            const localAnchors = anchors.filter(a => a.afterParagraphIndex === idx);
                            return (
                                <div key={`pl_${idx}`} className={styles.paragraphItem}>
                                    <div className={styles.paragraphHead}>
                                        <div className={styles.paragraphIndex}>P{idx + 1}</div>
                                        <button className={styles.smallBtn} type="button" onClick={() => addAuthorAnchor(idx)}>
                                            + 이 문단 뒤에 이미지
                                        </button>
                                    </div>

                                    <div className={styles.paragraphText}>{p}</div>

                                    {localAnchors.length > 0 ? (
                                        <div className={styles.anchorRow}>
                                            {localAnchors.map(a => (
                                                <div key={a.id} className={styles.anchorChip} data-source={a.source}>
                                                    <span className={styles.anchorLabel}>AUTHOR · after P{a.afterParagraphIndex + 1}</span>
                                                    <button className={styles.linkBtn} type="button" onClick={() => removeAnchor(a.id)}>
                                                        제거
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>

            {/* 우측: 미리보기 */}
            <aside className={styles.rightColumn}>
                <section className={styles.sidePanel}>
                    <div className={styles.sideTitle}>Preview</div>
                    <div className={styles.previewTop}>
                        <div className={styles.previewWork}>{workTitle}</div>
                        <div className={styles.previewEp}>EP {episode?.episodeNo ?? '-'} · {title || '(untitled)'}</div>
                    </div>

                    <div className={styles.previewFeed}>
                        {previewBlocks.map(b => {
                            if (b.type === 'text') return <p key={b.key} className={styles.previewParagraph}>{b.text}</p>;
                            const a = b.anchor!;
                            return (
                                <figure key={b.key} className={styles.previewImage}>
                                    <div className={styles.previewImageFrame}>
                                        <div className={styles.previewImagePlaceholder} aria-hidden />
                                        <div className={styles.previewBadgeRow}>
                                            <span className={styles.badge}>AUTHOR</span>
                                            <span className={styles.badgeMuted}>after P{a.afterParagraphIndex + 1}</span>
                                        </div>
                                    </div>
                                    <figcaption className={styles.previewCaption}>{a.caption ?? 'image anchor'}</figcaption>
                                </figure>
                            );
                        })}
                    </div>
                </section>
            </aside>
        </div>
    );
}
