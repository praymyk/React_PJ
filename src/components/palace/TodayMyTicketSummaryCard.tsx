'use client';

import React from 'react';
import styles from '@components/palace/SummaryCard.module.scss';

import { TodayMyTicketSummaryData } from '@/app/palace/data';

type Props = {
    /**
     * 금일 나의 티켓/채널 기반 티켓 요약 데이터
     * - phoneTicketCount: 전화 채널로 생성된 티켓 수
     * - chatTicketCount: 채팅(웹챗/메신저 등)으로 생성된 티켓 수
     * - etcTicketCount: 그 외 채널(이메일, 방문, 기타)로 생성된 티켓 수
     * - myOpenTicketCount: 내가 담당 중인 (미종결) 티켓 수
     * - myClosedTodayCount: 오늘 내가 종결 처리한 티켓 수
     */
    data: TodayMyTicketSummaryData;
};

export function TodayMyTicketSummaryCard({ data }: Props) {
    const totalTickets =
        data.phoneTicketCount + data.chatTicketCount + data.etcTicketCount;

    const safeTotal = totalTickets > 0 ? totalTickets : 1;

    const channels = [
        {
            key: 'phone',
            label: '전화',
            count: data.phoneTicketCount,
        },
        {
            key: 'chat',
            label: '채팅',
            count: data.chatTicketCount,
        },
        {
            key: 'etc',
            label: '기타',
            count: data.etcTicketCount,
        },
    ] as const;

    return (
        <section
            className={styles.card}
        >
            <header className={styles.cardHeader}>
                <div className={styles.summaryTitleBlock}>
                    <div className={styles.summaryTitleRow}>
                        <h2 className={styles.cardTitle}>
                            금일 나의 티켓 현황
                        </h2>
                        <span className={styles.summaryTag}>Today</span>
                    </div>
                    <p className={styles.summarySub}>
                        내가 처리한 티켓 현황을 확인용
                    </p>
                </div>

                <div className={styles.summaryTotal}>
                    <div className={styles.summaryTotalLabel}>TOTAL</div>
                    <div className={styles.summaryTotalValue}>
                        {totalTickets.toLocaleString()}
                        <span className={styles.summaryTotalUnit}>
                            건
                        </span>
                    </div>
                </div>
            </header>

            {/* 채널별 분포 영역 */}
            <div className={styles.summaryChannels}>
                {channels.map((ch) => {
                    const percent = Math.round((ch.count / safeTotal) * 100);

                    return (
                        <div
                            key={ch.key}
                            className={styles.summaryChannelRow}
                        >
                            <div
                                className={
                                    styles.summaryChannelLabel
                                }
                            >
                                {ch.label}
                            </div>
                            <div
                                className={
                                    styles.summaryChannelCount
                                }
                            >
                                {ch.count.toLocaleString()}건
                                <span
                                    className={
                                        styles.summaryChannelPercent
                                    }
                                >
                                    {percent}%
                                </span>
                            </div>
                            <div
                                className={
                                    styles.summaryChannelBarTrack
                                }
                            >
                                <div
                                    className={
                                        styles.summaryChannelBarFill
                                    }
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 하단: 오늘 처리 상태 간단 뱃지 */}
            <footer className={styles.summaryFooter}>
                <div className={styles.summaryFooterLabel}>
                    오늘 처리 상태
                </div>
                <div className={styles.summaryFooterBadges}>
                    <span className={styles.summaryBadgePrimary}>
                        완료 {data.myClosedTodayCount.toLocaleString()}건
                    </span>
                    <span className={styles.summaryBadgeMuted}>
                        진행중 {data.myOpenTicketCount.toLocaleString()}건
                    </span>
                </div>
            </footer>
        </section>
    );
}