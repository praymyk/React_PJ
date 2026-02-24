'use client';

import { useMemo, useState } from 'react';
import '@/styles/theme/globals.scss';
import styles from './PlayContent.module.scss';

type AnchorSource = 'AI' | 'AUTHOR';

type Block =
    | {
    type: 'text';
    id: string;
    paragraphId: string;
    content: string;
}
    | {
    type: 'image';
    id: string;
    anchorId: string;
    afterParagraphId: string;
    source: AnchorSource;
    caption?: string;
    spoilerLevel?: 0 | 1 | 2; // 0: none, 1: blur, 2: hidden
    status: 'ready' | 'pending' | 'failed';
    // TODO :  실제로는 url이 오겠지만 UI용으로 placeholder를 씀
};

type Choice = { id: string; label: string };

type Scene = {
    id: string;
    title: string;
    blocks: Block[];
    choices?: Choice[];
};

const mockScenes: Scene[] = [
    {
        id: 's1',
        title: 'Scene 1 — The Door',
        blocks: [
            {
                type: 'text',
                id: 't1',
                paragraphId: 'p1',
                content:
                    '복도 끝, 13번 방 앞에 섰다. 문은 잠겨 있었고, 손잡이엔 오래된 스크래치가 겹겹이 남아 있었다.',
            },
            {
                type: 'text',
                id: 't2',
                paragraphId: 'p2',
                content:
                    '바닥에는 누군가 급히 끌고 간 듯한 자국. 하지만 먼지는 가지런히 정리되어 있었다. 누군가 일부러 흔적을 감춘 걸까?',
            },
            {
                type: 'image',
                id: 'i1',
                anchorId: 'a1',
                afterParagraphId: 'p2',
                source: 'AI',
                caption: '13번 방 앞 복도 — 분위기 컷',
                spoilerLevel: 1,
                status: 'pending',
            },
            {
                type: 'text',
                id: 't3',
                paragraphId: 'p3',
                content:
                    '문틈 아래로는 희미한 빛이 새어 나왔다. 안에는 누군가 있는 걸까? 아니면 자동 조명일까?',
            },
        ],
        choices: [
            { id: 'c1', label: '문을 두드린다' },
            { id: 'c2', label: '열쇠 구멍을 들여다본다' },
            { id: 'c3', label: '주변 단서를 더 찾는다' },
        ],
    },
    {
        id: 's2',
        title: 'Scene 2 — Witness',
        blocks: [
            {
                type: 'text',
                id: 't4',
                paragraphId: 'p4',
                content:
                    '목격자는 고개를 숙인 채로 말했다. “그날은 아무도 13번 방으로 들어가지 않았어요.”',
            },
            {
                type: 'text',
                id: 't5',
                paragraphId: 'p5',
                content:
                    '하지만 그의 신발 밑창에는 젖은 페인트가 묻어 있었다. 이 복도는 오늘 아침 페인트칠을 했다고 들었는데.',
            },
            {
                type: 'image',
                id: 'i2',
                anchorId: 'a2',
                afterParagraphId: 'p5',
                source: 'AUTHOR',
                caption: '작가 지정: 목격자 클로즈업(표정/손)',
                spoilerLevel: 0,
                status: 'ready',
            },
            {
                type: 'text',
                id: 't6',
                paragraphId: 'p6',
                content:
                    '당신은 질문을 바꿨다. “그럼, 누가 이 복도에 가장 오래 있었죠?” 목격자의 눈동자가 한순간 흔들렸다.',
            },
        ],
    },
];

type RightTab = 'notes' | 'choices' | 'settings';

export default function PlayContent() {
    // 사용자 설정: AI 이미지 보기 활성화(읽기 화면에서 인라인 노출 여부)
    const [aiImageEnabled, setAiImageEnabled] = useState<boolean>(true);

    // 스포일러(blur/hidden) 해제 상태 관리
    const [revealed, setRevealed] = useState<Record<string, boolean>>({});

    // 우측 패널 탭
    const [rightTab, setRightTab] = useState<RightTab>('notes');

    // 선택 히스토리(더미)
    const [choiceHistory, setChoiceHistory] = useState<string[]>(['문을 두드린다']);

    // 현재 선택지(더미: 첫 Scene의 choices)
    const currentChoices = mockScenes[0].choices ?? [];

    const blocksToRender = useMemo(() => {
        // AI 이미지 OFF면 AI source image 블록은 렌더에서 제외
        return mockScenes.map(scene => {
            const filteredBlocks = scene.blocks.filter(b => {
                if (b.type !== 'image') return true;
                if (b.source === 'AI' && !aiImageEnabled) return false;
                return true;
            });
            return { ...scene, blocks: filteredBlocks };
        });
    }, [aiImageEnabled]);

    const toggleReveal = (blockId: string) => {
        setRevealed(prev => ({ ...prev, [blockId]: !prev[blockId] }));
    };

    const onPickChoice = (c: Choice) => {
        setChoiceHistory(prev => [c.label, ...prev].slice(0, 10));
        // TODO : 여기서 다음 Scene 로딩 / 상태 저장 / API 호출로 이어짐
    };

    return (
        <div className={styles.contentGrid}>
            {/* ===== Main Column: Reader Feed ===== */}
            <main className={styles.mainColumn}>
                {/* Top header (작품 제목/모드/진행 등) */}
                <header className={styles.readerTop}>
                    <div className={styles.readerTitleRow}>
                        <div className={styles.readerTitle}>
                            13번 방의 진실 <span className={styles.readerSub}>· w1</span>
                        </div>
                        <div className={styles.readerTopActions}>
                            <button className={styles.ghostBtn} type="button">
                                모드: Mystery
                            </button>
                            <button className={styles.ghostBtn} type="button">
                                저장
                            </button>
                        </div>
                    </div>

                    <div className={styles.readerMetaRow}>
                        <span className={styles.metaItem}>진행 40%</span>
                        <span className={styles.metaDot} aria-hidden />
                        <span className={styles.metaItem}>최근: Episode 3</span>
                    </div>
                </header>

                {/* Reader feed */}
                <section className={styles.readerFeed}>
                    {blocksToRender.map(scene => (
                        <div key={scene.id} className={styles.scene}>
                            <div className={styles.sceneTitle}>{scene.title}</div>

                            <div className={styles.sceneBlocks}>
                                {scene.blocks.map(block => {
                                    if (block.type === 'text') {
                                        return (
                                            <p key={block.id} className={styles.paragraph} data-pid={block.paragraphId}>
                                                {block.content}
                                            </p>
                                        );
                                    }

                                    // image block
                                    const isRevealed = !!revealed[block.id];
                                    const spoiler = block.spoilerLevel ?? 0;

                                    // spoilerLevel 2: hidden(기본 숨김) -> 인라인 카드만 보이고 이미지 내용은 막음
                                    const isHidden = spoiler === 2 && !isRevealed;
                                    const isBlurred = spoiler === 1 && !isRevealed;

                                    return (
                                        <figure
                                            key={block.id}
                                            className={styles.imageBlock}
                                            data-source={block.source}
                                            data-status={block.status}
                                        >
                                            <div
                                                className={styles.imageFrame}
                                                data-blur={isBlurred ? '1' : '0'}
                                                data-hidden={isHidden ? '1' : '0'}
                                            >
                                                {/* 실제론 img 태그 + url. 지금은 placeholder */}
                                                <div className={styles.imagePlaceholder} aria-hidden />

                                                {/* Pending overlay */}
                                                {block.status === 'pending' ? (
                                                    <div className={styles.imageOverlay}>
                                                        <div className={`${styles.spinner} uSpinner`} aria-hidden />
                                                        <div className={styles.overlayText}>이미지 생성 중…</div>
                                                    </div>
                                                ) : null}

                                                {/* Spoiler overlay */}
                                                {(spoiler === 1 || spoiler === 2) && !isRevealed ? (
                                                    <div className={styles.spoilerOverlay}>
                                                        <div className={styles.spoilerText}>
                                                            {spoiler === 2 ? '스포일러로 숨김 처리됨' : '스포일러 블러 처리됨'}
                                                        </div>
                                                        <button
                                                            className={styles.secondaryBtn}
                                                            type="button"
                                                            onClick={() => toggleReveal(block.id)}
                                                        >
                                                            보기
                                                        </button>
                                                    </div>
                                                ) : null}
                                            </div>

                                            <figcaption className={styles.captionRow}>
                                                <span className={styles.caption}>
                                                  {block.caption ?? 'Image'}
                                                </span>
                                                                        <span className={styles.badge} data-source={block.source}>
                                                  {block.source === 'AUTHOR' ? 'AUTHOR' : 'AI'}
                                                </span>

                                                {(spoiler === 1 || spoiler === 2) ? (
                                                    <button
                                                        className={styles.linkBtn}
                                                        type="button"
                                                        onClick={() => toggleReveal(block.id)}
                                                    >
                                                        {isRevealed ? '숨기기' : '보기'}
                                                    </button>
                                                ) : null}
                                            </figcaption>
                                        </figure>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </section>

                {/* Bottom sticky: choices */}
                <div className={styles.choiceDock} role="region" aria-label="Choices">
                    <div className={styles.choiceDockInner}>
                        <div className={styles.choiceDockTitle}>다음 행동을 선택</div>
                        <div className={styles.choiceRow}>
                            {currentChoices.map(c => (
                                <button
                                    key={c.id}
                                    className={styles.choiceBtn}
                                    type="button"
                                    onClick={() => onPickChoice(c)}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* ===== Right Column: Panel ===== */}
            <aside className={styles.sideColumn}>
                <section className={styles.sidePanel}>
                    <div className={styles.sideHeader}>
                        <div className={styles.sideTitle}>Panel</div>
                        <div className={styles.sideTabs}>
                            <button
                                className={styles.tab}
                                data-active={rightTab === 'notes' ? '1' : '0'}
                                type="button"
                                onClick={() => setRightTab('notes')}
                            >
                                Notes
                            </button>
                            <button
                                className={styles.tab}
                                data-active={rightTab === 'choices' ? '1' : '0'}
                                type="button"
                                onClick={() => setRightTab('choices')}
                            >
                                Choices
                            </button>
                            <button
                                className={styles.tab}
                                data-active={rightTab === 'settings' ? '1' : '0'}
                                type="button"
                                onClick={() => setRightTab('settings')}
                            >
                                Settings
                            </button>
                        </div>
                    </div>

                    <div className={styles.sideBody}>
                        {rightTab === 'notes' ? (
                            <div className={styles.panelBlock}>
                                <div className={styles.panelTitle}>단서 노트</div>
                                <div className={styles.noteItem}>
                                    <div className={styles.noteK}>단서</div>
                                    <div className={styles.noteV}>복도 바닥 끌림 자국 + 먼지 정리</div>
                                </div>
                                <div className={styles.noteItem}>
                                    <div className={styles.noteK}>의심</div>
                                    <div className={styles.noteV}>목격자 진술 모순 가능</div>
                                </div>
                                <button className={styles.secondaryBtn} type="button">
                                    + 노트 추가
                                </button>
                            </div>
                        ) : null}

                        {rightTab === 'choices' ? (
                            <div className={styles.panelBlock}>
                                <div className={styles.panelTitle}>선택 히스토리</div>
                                <ul className={styles.historyList}>
                                    {choiceHistory.map((h, idx) => (
                                        <li key={`${h}-${idx}`} className={styles.historyItem}>
                                            <span className={styles.dot} aria-hidden />
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}

                        {rightTab === 'settings' ? (
                            <div className={styles.panelBlock}>
                                <div className={styles.panelTitle}>읽기 설정</div>

                                <label className={styles.toggleRow}>
                                    <span className={styles.toggleLabel}>AI 이미지 인라인 표시</span>
                                    <input
                                        type="checkbox"
                                        checked={aiImageEnabled}
                                        onChange={(e) => setAiImageEnabled(e.target.checked)}
                                    />
                                </label>

                                <div className={styles.settingHint}>
                                    OFF면 <span className={styles.badge} data-source="AI">AI</span> 앵커 이미지는 숨겨지고,
                                    <span className={styles.badge} data-source="AUTHOR">AUTHOR</span> 앵커는 그대로 표시됩니다.
                                </div>

                                <div className={styles.hr} />

                                <button className={styles.ghostBtn} type="button">
                                    스포일러 기본: 블러
                                </button>
                                <button className={styles.ghostBtn} type="button">
                                    이미지 품질: 표준
                                </button>
                            </div>
                        ) : null}
                    </div>
                </section>
            </aside>
        </div>
    );
}