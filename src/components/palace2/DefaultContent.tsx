'use client';

import { useRouter } from 'next/navigation';
import styles from '@components/palace2/DefaultContent.module.scss';

type WorkCard = {
    id: string;
    title: string;
    author: string;
    tags: string[];
    mode: 'Interactive' | 'Mystery' | 'Visual';
    progress?: number;
};

const MODE_PILLS = [
    { key: 'all', label: '전체' },
    { key: 'interactive', label: '선택형' },
    { key: 'mystery', label: '추리형' },
    { key: 'visual', label: '비주얼형' },
] as const;

const dummy: WorkCard[] = [
    { id: 'w1', title: '13번 방의 진실', author: '노아르', tags: ['추리', '단서'], mode: 'Mystery', progress: 40 },
    { id: 'w2', title: '심야의 선택지', author: '루나', tags: ['로맨스', '선택'], mode: 'Interactive' },
    { id: 'w3', title: '네온의 도시', author: '케이바이트', tags: ['사이버펑크', '비주얼'], mode: 'Visual', progress: 65 },
    { id: 'w4', title: '알리바이 나무', author: '헤지', tags: ['추리', '분기'], mode: 'Mystery' },
    { id: 'w5', title: '여름 루트', author: '미라', tags: ['선택형', '일상'], mode: 'Interactive', progress: 12 },
    { id: 'w6', title: '꿈의 프레임', author: '아스터', tags: ['비주얼', '판타지'], mode: 'Visual' },
];

export default function DefaultContent() {
    /*** 더미 페이지 이동 기능 ***/
    const router = useRouter();

    const goDetail = (id: string) => {
        router.push(`/palace2/works/${id}`);
    };

    return (
        <div className={styles.contentGrid}>
            {/* 좌측 메인 컬럼 */}
            <div className={styles.mainColumn}>
                {/* 1행: Hero + 모드/CTA */}
                <section className={styles.hero}>
                    <div className={styles.heroHead}>
                        <div className={styles.heroHeadTop}>
                            <div>
                                <h1 className={styles.heroTitle}>
                                    읽기만 하는 소설은 그만, <span className={styles.accent}>구체화 해보자</span>.
                                </h1>
                                <p className={styles.heroDesc}>
                                    선택지로 이야기를 바꾸고, 추리 힌트를 얻고, AI 장면 비주얼로 몰입하는 인터랙티브 소설 커뮤니티.
                                </p>
                            </div>

                            {/* 작가 CTA: 우측 상단 */}
                            <div className={styles.authorCtas}>
                                <button
                                    className={styles.smallBtn}
                                    type="button"
                                    onClick={() => router.push('/palace2/studio/new')}
                                >
                                    + 작품 등록
                                </button>
                                <button
                                    className={styles.smallBtn}
                                    type="button"
                                    onClick={() => router.push('/palace2/studio')}
                                >
                                    내 작품
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.heroControls}>
                        <div className={styles.pills} role="tablist" aria-label="Modes">
                            {MODE_PILLS.map(p => (
                                <button key={p.key} className={styles.pill} type="button">
                                    {p.label}
                                </button>
                            ))}
                        </div>

                        <div className={styles.heroCtas}>
                            <button className={styles.primaryBtnLg} type="button">지금 플레이</button>
                            <button className={styles.secondaryBtnLg} type="button">작품 둘러보기</button>
                        </div>
                    </div>
                </section>

                {/* 2행: Discovery */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>작품 탐색</h2>
                        <div className={styles.sectionTools}>
                            <button className={styles.chip} type="button">인기</button>
                            <button className={styles.chip} type="button">신작</button>
                            <button className={styles.chip} type="button">추천</button>
                        </div>
                    </div>

                    <div className={styles.grid}>
                        {dummy.map(work => (
                            <article key={work.id} className={styles.card}>
                                <div className={styles.cardTop}>
                                    <div className={styles.cover} aria-hidden />
                                    <div className={styles.cardMeta}>
                                        <div className={styles.cardTitleRow}>
                                            <h3 className={styles.cardTitle}>{work.title}</h3>
                                            <span className={styles.modeBadge} data-mode={work.mode}>
                                               {work.mode}
                                            </span>
                                        </div>

                                        <p className={styles.cardAuthor}>작가 {work.author}</p>

                                        <div className={styles.tagRow}>
                                            {work.tags.map(t => (
                                                <span key={t} className={styles.tag}>#{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.cardBottom}>
                                    <div className={styles.progressWrap}>
                                        <div className={styles.progressBar} aria-hidden>
                                            <div
                                                className={styles.progressFill}
                                                style={{ width: `${work.progress ?? 0}%` }}
                                            />
                                        </div>
                                        <span className={styles.progressText}>
                                          {work.progress ? `${work.progress}%` : 'Start'}
                                        </span>
                                    </div>

                                    <div className={styles.cardActions}>
                                        <button
                                            className={styles.secondaryBtn}
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                goDetail(work.id);
                                            }}
                                        >
                                            상세보기
                                        </button>

                                        <button
                                            className={styles.primaryBtn}
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/palace2/works/${work.id}`);

                                            }}
                                        >
                                            플레이
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>

            {/* 우측 사이드 컬럼 */}
            <aside className={styles.sideColumn}>
                <section className={styles.sidePanel}>
                    <div className={styles.sideTitle}>이어보기</div>

                    <div className={styles.continueItem}>
                        <div className={styles.continueThumb} aria-hidden />
                        <div className={styles.continueBody}>
                            <div className={styles.continueSub}>3화 · 65%</div>
                            <div className={styles.continueSub}>2장 · 40%</div>
                        </div>
                        <button className={styles.smallBtn} type="button">이어하기</button>
                    </div>

                    <div className={styles.continueItem}>
                        <div className={styles.continueThumb} aria-hidden />
                        <div className={styles.continueBody}>
                            <div className={styles.continueName}>The Case: Room 13</div>
                            <div className={styles.continueSub}>Chapter 2 · 40%</div>
                        </div>
                        <button className={styles.smallBtn} type="button">이어하기</button>
                    </div>
                </section>

                <section className={styles.sidePanel}>
                    <div className={styles.sideTitle}>최근 선택</div>
                    <ul className={styles.choiceList}>
                        <li className={styles.choiceItem}><span className={styles.choiceDot} aria-hidden /> “A번 문을 연다” 선택</li>
                        <li className={styles.choiceItem}><span className={styles.choiceDot} aria-hidden /> “증거를 숨긴다” 선택</li>
                        <li className={styles.choiceItem}><span className={styles.choiceDot} aria-hidden /> “협상한다” 선택</li>
                    </ul>
                </section>

                <section className={styles.sidePanel}>
                    <div className={styles.sideTitle}>Notices</div>
                    <div className={styles.notice}>
                        <div className={styles.noticeTitle}>New: Visual Mode Beta</div>
                        <div className={styles.noticeDesc}>장면 비주얼 생성 기능이 베타로 오픈됐어요.</div>
                    </div>
                </section>
            </aside>
        </div>
    );
}