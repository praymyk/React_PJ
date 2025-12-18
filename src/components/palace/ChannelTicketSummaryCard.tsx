'use client';

import React from 'react';
import styles from '@components/palace/SummaryCard.module.scss';
import { ChannelTicketSummaryData } from '@/app/palace/data';

type Props = {
/**
     * 금일 채널별 티켓 집계 데이터
     * - rows: 채널별 (전화 / 문자 / 메일 등) 접수/처리/미처리/평균 처리시간
     */
    data: ChannelTicketSummaryData;
};

export function ChannelTicketSummaryCard({ data }: Props) {
    const { rows } = data;

    const totalReceived = rows.reduce(
        (sum, r) => sum + r.receivedCount,
        0,
    );
    const totalProcessed = rows.reduce(
        (sum, r) => sum + r.processedCount,
        0,
    );
    const totalPending = rows.reduce(
        (sum, r) => sum + r.pendingCount,
        0,
    );

    // 처리 건수 기준 가중 평균 처리 시간
    const totalAvgMinutes =
        totalProcessed > 0
            ? Math.round(
                rows.reduce(
                    (sum, r) =>
                        sum + r.avgHandlingMinutes * r.processedCount,
                    0,
                ) / totalProcessed,
            )
            : null;

    return (
        <section
            className={styles.card}
        >
            <header className={styles.cardHeader}>
                <div className={styles.summaryTitleBlock}>
                    <div className={styles.summaryTitleRow}>
                        <h2 className={styles.cardTitle}>
                            금일 채널별 티켓 현황
                        </h2>
                        <span className={styles.summaryTag}>
                            Today
                        </span>
                    </div>
                    <p className={styles.summarySub}>
                        채널별 접수·처리 현황을 한 눈에 확인합니다.
                    </p>
                </div>

                <div className={styles.summaryTotal}>
                    <div className={styles.summaryTotalLabel}>TOTAL</div>
                    <div className={styles.summaryTotalValue}>
                        {totalReceived.toLocaleString()}
                        <span className={styles.summaryTotalUnit}>
                            건
                        </span>
                    </div>
                </div>
            </header>

            <div className={styles.cardBody}>
                <div className={styles.summaryTableWrapper}>
                    <table className={styles.summaryTable}>
                        <thead>
                        <tr>
                            <th scope="col">채널</th>
                            <th scope="col">접수</th>
                            <th scope="col">처리</th>
                            <th scope="col">미처리</th>
                            <th scope="col">평균 처리시간</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((row) => (
                            <tr key={row.channel}>
                                <td className={styles.summaryTableCellLabel}>
                                    {row.channel}
                                </td>
                                <td className={styles.summaryTableCellNumber}>
                                    {row.receivedCount.toLocaleString()}
                                </td>
                                <td className={styles.summaryTableCellNumber}>
                                    {row.processedCount.toLocaleString()}
                                </td>
                                <td className={styles.summaryTableCellNumber}>
                                    {row.pendingCount.toLocaleString()}
                                </td>
                                <td className={styles.summaryTableCellNumber}>
                                    {row.avgHandlingMinutes}분
                                </td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot>
                        <tr className={styles.summaryTableTotalRow}>
                            <td className={styles.summaryTableTotalLabel}>
                                합계
                            </td>
                            <td className={styles.summaryTableTotalNumber}>
                                {totalReceived.toLocaleString()}
                            </td>
                            <td className={styles.summaryTableTotalNumber}>
                                {totalProcessed.toLocaleString()}
                            </td>
                            <td className={styles.summaryTableTotalNumber}>
                                {totalPending.toLocaleString()}
                            </td>
                            <td className={styles.summaryTableTotalNumber}>
                                {totalAvgMinutes != null
                                    ? `${totalAvgMinutes}분`
                                    : '-'}
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </section>
    );
}