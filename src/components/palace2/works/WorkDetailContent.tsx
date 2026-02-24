'use client';

import { useRouter } from 'next/navigation';
import styles from './WorkDetailContent.module.scss';

type WorkMode = 'Normal' | 'Interactive' | 'Mystery' | 'Visual';

type Episode = {
    id: string;
    title: string;
    summary?: string;
    readTimeMin?: number;
    isLocked?: boolean;
};

type WorkDetail = {
    id: string;
    title: string;
    author: string;
    tags: string[];
    updatedAt: string;
    stats: {
        rating: number;
        views: number;
        likes: number;
        bookmarks: number;
    };
    contentWarning?: string[];
    synopsis: string;
    creatorNote?: string;
    modes: WorkMode[];
    episodes: Episode[];
    progress?: {
        lastEpisodeTitle: string;
        percent: number;
        lastPlayedAt: string;
    };
    visualCredits?: {
        used: number;
        limit: number;
    };
    hintLevel?: 'Low' | 'Medium' | 'High';
    difficulty?: 'Easy' | 'Normal' | 'Hard';
};

const mock: WorkDetail = {
    id: 'w1',
    title: 'The Case: Room 13',
    author: 'NoirK',
    tags: ['mystery', 'clue', 'branch'],
    updatedAt: '2026-02-20',
    stats: { rating: 4.7, views: 12840, likes: 932, bookmarks: 211 },
    contentWarning: ['폭력 묘사', '심리적 긴장'],
    synopsis:
        '13번 방에서 일어난 실종 사건. 당신은 목격자의 진술과 숨겨진 단서들을 조합해 진실에 다가가야 한다.',
    creatorNote:
        '추리 모드에서는 힌트가 단계적으로 제공됩니다. 스포일러 방지를 위해 일부 비주얼은 토글로 숨겨져 있어요.',
    modes: ['Normal', 'Mystery', 'Interactive', 'Visual'],
    episodes: [
        { id: 'e1', title: 'Episode 1 — The Door', summary: '첫 단서: 잠긴 문', readTimeMin: 7 },
        { id: 'e2', title: 'Episode 2 — Witness', summary: '목격자의 모순', readTimeMin: 9 },
        { id: 'e3', title: 'Episode 3 — Keyhole', summary: '열쇠 구멍 너머', readTimeMin: 11 },
        { id: 'e4', title: 'Episode 4 — Room 13', summary: '사건의 중심', readTimeMin: 12, isLocked: true },
    ],
    progress: {
        lastEpisodeTitle: 'Episode 3 — Keyhole',
        percent: 40,
        lastPlayedAt: '2026-02-19 22:10',
    },
    visualCredits: { used: 18, limit: 60 },
    hintLevel: 'Medium',
    difficulty: 'Normal',
};

export default function WorkDetailContent() {
    const router = useRouter();

    const work = mock;

    return (
        <div className={styles.contentGrid}>
            {/* 좌측 메인 컬럼 */}
            <div className={styles.mainColumn}>
                {/* Breadcrumb / Tabs */}
                <div className={styles.topBar}>
                    <div className={styles.breadcrumb}>Home &gt; Works &gt; {work.title}</div>
                    <div className={styles.tabs}>
                        <button className={styles.tab} type="button">
                            Overview
                        </button>
                        <button className={styles.tab} type="button">
                            Reviews
                        </button>
                        <button className={styles.tab} type="button">
                            Gallery
                        </button>
                        <button className={styles.tab} type="button">
                            Routes
                        </button>
                    </div>
                </div>

                {/* Header Block */}
                <section className={styles.headerCard}>
                    <div className={styles.headerInner}>
                        <div className={styles.cover} aria-hidden />
                        <div className={styles.headerMeta}>
                            <div className={styles.titleRow}>
                                <h1 className={styles.title}>{work.title}</h1>
                                <div className={styles.headerActions}>
                                    <button className={styles.ghostBtn} type="button">
                                        Follow
                                    </button>
                                    <button className={styles.ghostBtn} type="button">
                                        Share
                                    </button>
                                </div>
                            </div>

                            <div className={styles.author}>by {work.author}</div>

                            <div className={styles.tagRow}>
                                {work.tags.map(t => (
                                    <span key={t} className={styles.tag}>
                                       #{t}
                                    </span>
                                ))}
                            </div>

                            <div className={styles.statsRow}>
                                <span className={styles.stat}>
                                  ★ {work.stats.rating.toFixed(1)}
                                </span>
                                <span className={styles.stat}>Views {work.stats.views.toLocaleString()}</span>
                                <span className={styles.stat}>Updated {work.updatedAt}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Synopsis / Creator Note */}
                <section className={styles.sectionCard}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Synopsis</h2>
                    </div>

                    <p className={styles.bodyText}>{work.synopsis}</p>

                    {work.contentWarning?.length ? (
                        <div className={styles.warnBox}>
                            <div className={styles.warnTitle}>Content Warnings</div>
                            <div className={styles.warnItems}>
                                {work.contentWarning.map(w => (
                                <span key={w} className={styles.warnTag}>
                                    {w}
                                </span>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {work.creatorNote ? (
                        <div className={styles.noteBox}>
                            <div className={styles.noteTitle}>Creator Note</div>
                            <p className={styles.noteText}>{work.creatorNote}</p>
                        </div>
                    ) : null}
                </section>

                {/* Episodes */}
                <section className={styles.sectionCard}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Episodes</h2>
                        <div className={styles.sectionTools}>
                            <button className={styles.chip} type="button">
                                Start from Ep1
                            </button>
                            <button className={styles.chip} type="button">
                                Replay routes
                            </button>
                        </div>
                    </div>

                    <div className={styles.episodeList}>
                        {work.episodes.map(ep => (
                            <div key={ep.id} className={styles.episodeItem} data-locked={ep.isLocked ? '1' : '0'}>
                                <div className={styles.episodeMeta}>
                                    <div className={styles.episodeTitle}>
                                        {ep.title}
                                        {ep.isLocked ? <span className={styles.lockBadge}>Locked</span> : null}
                                    </div>
                                    {ep.summary ? <div className={styles.episodeSummary}>{ep.summary}</div> : null}
                                </div>

                                <div className={styles.episodeActions}>
                                    {typeof ep.readTimeMin === 'number' ? (
                                        <span className={styles.readTime}>{ep.readTimeMin}m</span>
                                    ) : null}
                                    <button className={styles.secondaryBtn} type="button" disabled={!!ep.isLocked}>
                                        Open
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* 우측 사이드 컬럼 */}
            <aside className={styles.sideColumn}>
                {/* Start / Continue */}
                <section className={styles.sidePanel}>
                    <div className={styles.sideTitle}>Start / Continue</div>

                    <div className={styles.modeRow}>
                        <div className={styles.modeLabel}>Mode</div>
                        <div className={styles.modePills}>
                            {work.modes.map(m => (
                                <button key={m} className={styles.pill} type="button">
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.sideBtns}>
                        <button
                            className={styles.primaryBtnLg}
                            type="button"
                            onClick={() => router.push(`/palace2/play/${work.id}`)}
                        >
                            Play Now
                        </button>

                        <button
                            className={styles.secondaryBtnLg}
                            type="button"
                            disabled={!work.progress}
                            onClick={() => router.push(`/palace2/play/${work.id}`)}
                        >
                            Continue
                        </button>
                    </div>
                </section>

                {/* Progress / Save */}
                <section className={styles.sidePanel}>
                    <div className={styles.sideTitle}>Progress</div>

                    {work.progress ? (
                        <>
                            <div className={styles.progressLine}>
                                <div className={styles.progressName}>{work.progress.lastEpisodeTitle}</div>
                                <div className={styles.progressPercent}>{work.progress.percent}%</div>
                            </div>
                            <div className={styles.progressBar} aria-hidden>
                                <div className={styles.progressFill} style={{ width: `${work.progress.percent}%` }} />
                            </div>
                            <div className={styles.progressSub}>Last played: {work.progress.lastPlayedAt}</div>

                            <div className={styles.sideRowActions}>
                                <button className={styles.ghostBtn} type="button">
                                    Reset
                                </button>
                                <button className={styles.ghostBtn} type="button">
                                    New Run
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className={styles.muted}>아직 진행 기록이 없어요.</div>
                    )}
                </section>

                {/* Quick Info */}
                <section className={styles.sidePanel}>
                    <div className={styles.sideTitle}>Quick Info</div>

                    <div className={styles.kv}>
                        <div className={styles.k}>Difficulty</div>
                        <div className={styles.v}>{work.difficulty ?? '-'}</div>
                    </div>
                    <div className={styles.kv}>
                        <div className={styles.k}>Hint Level</div>
                        <div className={styles.v}>{work.hintLevel ?? '-'}</div>
                    </div>
                    <div className={styles.kv}>
                        <div className={styles.k}>Visual Credits</div>
                        <div className={styles.v}>
                            {work.visualCredits ? `${work.visualCredits.used}/${work.visualCredits.limit}` : '-'}
                        </div>
                    </div>
                </section>

                {/* Community */}
                <section className={styles.sidePanel}>
                    <div className={styles.sideTitle}>Community</div>

                    <div className={styles.communityGrid}>
                        <div className={styles.communityItem}>
                            <div className={styles.communityK}>Likes</div>
                            <div className={styles.communityV}>{work.stats.likes.toLocaleString()}</div>
                        </div>
                        <div className={styles.communityItem}>
                            <div className={styles.communityK}>Bookmarks</div>
                            <div className={styles.communityV}>{work.stats.bookmarks.toLocaleString()}</div>
                        </div>
                    </div>

                    <div className={styles.sideRowActions}>
                        <button className={styles.secondaryBtn} type="button">
                            Comments
                        </button>
                        <button className={styles.secondaryBtn} type="button">
                            Add to Library
                        </button>
                    </div>
                </section>
            </aside>
        </div>
    );
}