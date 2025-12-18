'use client';

import React from 'react';
import styles from '@components/palace/SummaryCard.module.scss';
import { TodayMyCallSummaryData } from '@/app/palace/data';

type Props = {
    /** 금일 나의 콜 요약 데이터 */
    data: TodayMyCallSummaryData;
};

function formatSecondsToMmSs(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remain = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remain
        .toString()
        .padStart(2, '0')}`;
}

/** 금일 나의 콜 현황 */
export function TodayMyCallSummaryCard({ data }: Props) {
    const myTotalCalls =
        data.myInboundCount +
        data.myOutboundCount +
        data.myCallbackCount;

    const safeTotal = myTotalCalls > 0 ? myTotalCalls : 1;

    const rows = [
        {
            key: 'inbound',
            label: '인바운드',
            count: data.myInboundCount,
        },
        {
            key: 'outbound',
            label: '아웃바운드',
            count: data.myOutboundCount,
        },
        {
            key: 'callback',
            label: '콜백',
            count: data.myCallbackCount,
        },
    ] as const;

    return (
        <section className={styles.card}>
            <header className={styles.cardHeader}>
                <div className={styles.summaryTitleBlock}>
                    <div className={styles.summaryTitleRow}>
                        <h2 className={styles.cardTitle}>
                            금일 나의 전화 상담 현황
                        </h2>
                        <span className={styles.summaryTag}>Today</span>
                    </div>
                    <p className={styles.summarySub}>
                        전체 인바운드{' '}
                        {data.totalInboundCount.toLocaleString()}
                        건 중 내가 처리한 콜 기준
                    </p>
                </div>

                <div className={styles.summaryTotal}>
                    <div className={styles.summaryTotalLabel}>MY CALLS</div>
                    <div className={styles.summaryTotalValue}>
                        {myTotalCalls.toLocaleString()}
                        <span className={styles.summaryTotalUnit}>
                            건
                        </span>
                    </div>
                </div>
            </header>

            {/* 콜 타입별 분포 (인바운드 / 아웃바운드 / 콜백) */}
            <div className={styles.summaryChannels}>
                {rows.map((row) => {
                    const percent = Math.round(
                        (row.count / safeTotal) * 100,
                    );

                    return (
                        <div
                            key={row.key}
                            className={styles.summaryChannelRow}
                        >
                            <div
                                className={
                                    styles.summaryChannelLabel
                                }
                            >
                                {row.label}
                            </div>
                            <div
                                className={
                                    styles.summaryChannelCount
                                }
                            >
                                {row.count.toLocaleString()}건
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

            {/* 하단: 평균 통화 시간 뱃지 */}
            <footer className={styles.summaryFooter}>
                <div className={styles.summaryFooterLabel}>
                    평균 통화 시간
                </div>
                <div className={styles.summaryFooterBadges}>
                    <span className={styles.summaryBadgePrimary}>
                        전체 평균{' '}
                        {formatSecondsToMmSs(
                            data.avgTalkTimeAllSec,
                        )}
                    </span>
                    <span className={styles.summaryBadgeMuted}>
                        나의 평균{' '}
                        {formatSecondsToMmSs(
                            data.avgTalkTimeMySec,
                        )}
                    </span>
                </div>
            </footer>
        </section>
    );
}