'use client';

import { useState } from 'react';

import common from '@components/palace/ticket/DefaultContent.module.scss';
import styles from '@components/palace/ticket/DetailSection/Detail.module.scss';
import type { TicketDetailApiResponse } from '@/app/palace/ticket/data';

type Props = {
    ticket: TicketDetailApiResponse | null;
    statusClassOf: (status: TicketDetailApiResponse['status']) => string;
};

// 탭 종류
type TabKey = 'conversation' | 'customer' | 'events';

export default function DetailSection({ ticket, statusClassOf }: Props) {
    const [activeTab, setActiveTab] = useState<TabKey>('events');

    // 담당자 라벨 (티켓 없을 때도 안전하게)
    const assigneeLabel = ticket?.assignee_id
        ? `담당 ${ticket.assignee_id}`
        : '미배정';

    const hasTicket = !!ticket;

    return (
        <section className={common.detailPane}>
            {/* 1. 상단 헤더 + 요약 카드 */}
            <section className={`${common.paneCard} ${styles.detailTopPane}`}>
                <header className={common.paneHeader}>
                    <div className={styles.detailHeaderLeft}>
                        <div className={styles.detailTitleRow}>
                            <h2 className={styles.detailTitle}>
                                {hasTicket ? ticket!.title : '티켓 상세'}
                            </h2>

                            {hasTicket && (
                                <span
                                    className={`${common.statusBadge} ${statusClassOf(ticket!.status)}`}
                                >
                                    {ticket!.status}
                                </span>
                            )}
                        </div>

                        <div className={styles.detailSub}>
                            {hasTicket ? (
                                <>
                                    티켓 번호 {ticket!.id} ·{' '}
                                    <strong>{assigneeLabel}</strong>
                                </>
                            ) : (
                                <>티켓 목록에서 하나를 선택하면 상세 정보가 여기에 표시됩니다.</>
                            )}
                        </div>
                    </div>
                </header>

                <div className={styles.detailMain}>
                    <section className={styles.summaryCard}>
                        <h3 className={styles.sectionTitle}>상담 처리 내역</h3>
                        <p className={styles.summaryText}>
                            {hasTicket
                                ? ticket!.description
                                : '티켓을 선택하면 초기 문의 내용과 처리 내역이 이 영역에 표시됩니다.'}
                        </p>
                    </section>
                </div>
            </section>

            {/* 2. 하단: 탭 + 탭 내용 카드 */}
            <section className={`${common.paneCard} ${styles.detailBottomPane}`}>
                <div className={styles.detailMain}>
                    <section className={styles.tabSection}>
                        {/* 탭 버튼은 항상 표시 */}
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

                        <div className={styles.tabPanel}>
                            {!hasTicket ? (
                                // 티켓이 없을 때는 탭과 상관없이 공통 안내만
                                <div className={styles.timelinePlaceholder}>
                                    상담 내역, 고객 정보, 이벤트 이력은
                                    <br />
                                    티켓을 선택하면 이 영역에 표시됩니다.
                                </div>
                            ) : (
                                <>
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
                                            C 이벤트 이력.
                                            <br />
                                            나중에 여기에 표시하면 됩니다.
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </section>
                </div>
            </section>
        </section>
    );
}