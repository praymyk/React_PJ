'use client';

import { useState } from 'react';

import common from '@components/palace/test/B/DefaultContent.module.scss';
import styles from '@components/palace/test/B/DetailSection/Detail.module.scss';
import type { Row } from '@/app/palace/test/b/data';

type Props = {
    ticket: Row | null;
    statusClassOf: (status: Row['status']) => string;
};

// 탭 종류
type TabKey = 'conversation' | 'customer' | 'events';

export default function DetailSection({ ticket, statusClassOf }: Props) {
    const [activeTab, setActiveTab] = useState<TabKey>('events');

    if (!ticket) {
        return (
            <section className={common.detailPane}>
                <div className={styles.emptyDetail}>
                    왼쪽에서 티켓을 선택하면 상세 정보가 여기에 표시됩니다.
                </div>
            </section>
        );
    }

    return (
        <section className={common.detailPane}>
            {/* 1. 상단 헤더 영역 */}
            <header className={common.paneHeader}>
                <div className={styles.detailHeaderLeft}>
                    <div className={styles.detailTitleRow}>
                        <h2 className={styles.detailTitle}>
                            {ticket.title}
                        </h2>
                        <span
                            className={`${common.statusBadge} ${statusClassOf(
                                ticket.status,
                            )}`}
                        >
                            {ticket.status}
                        </span>
                    </div>
                    <div className={styles.detailSub}>
                        티켓 번호 {ticket.id} · 담당{' '}
                        <strong>{ticket.assignee}</strong>
                    </div>
                </div>
            </header>

            {/* 2. 중간: 기본 정보 카드 영역 */}
            <div className={styles.detailMain}>
                <section className={styles.summaryCard}>
                    <h3 className={styles.sectionTitle}>상담 처리 내역</h3>
                    <p className={styles.summaryText}>
                        {ticket.description}
                    </p>
                </section>

                {/* 3. 하단: 탭 + 탭 내용 영역 */}
                <section className={styles.tabSection}>
                    {/* 탭 버튼 줄 (Dooreay 대화 내역 / 고객정보 / 이벤트) */}
                    <nav className={styles.tabNav}>
                        <button
                            type="button"
                            className={
                                activeTab === 'conversation'
                                    ? `${styles.tabButton} ${styles.tabButtonActive}`
                                    : styles.tabButton
                            }
                            onClick={() => setActiveTab('conversation')}
                        >
                            A 내역
                        </button>
                        <button
                            type="button"
                            className={
                                activeTab === 'customer'
                                    ? `${styles.tabButton} ${styles.tabButtonActive}`
                                    : styles.tabButton
                            }
                            onClick={() => setActiveTab('customer')}
                        >
                            B 정보
                        </button>
                        <button
                            type="button"
                            className={
                                activeTab === 'events'
                                    ? `${styles.tabButton} ${styles.tabButtonActive}`
                                    : styles.tabButton
                            }
                            onClick={() => setActiveTab('events')}
                        >
                            C 이벤트
                        </button>
                    </nav>

                    {/* 탭별 패널 */}
                    <div className={styles.tabPanel}>
                        {activeTab === 'conversation' && (
                            <div className={styles.timelinePlaceholder}>
                                A 내역 탭입니다.
                                <br />
                                나중에 A 내용 여기로
                            </div>
                        )}

                        {activeTab === 'customer' && (
                            <div className={styles.timelinePlaceholder}>
                                B 정보 탭입니다.
                                <br />
                                B 정보 추가영역.
                            </div>
                        )}

                        {activeTab === 'events' && (
                            <div className={styles.timelinePlaceholder}>
                                {/* 기존 “이벤트 / 처리 이력” 내용 자리 */}
                                C 이벤트 이력.
                                <br />
                                나중에
                                여기에 표시하면 됩니다.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </section>
    );
}