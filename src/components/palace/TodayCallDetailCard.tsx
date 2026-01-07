'use client';

import React from 'react';
import cardStyles from '@components/palace/SummaryCard.module.scss';
import type { TodayCallDetailRow } from '@/app/(protected)/palace/data';

type Props = {
    /** 금일 콜 상세 전체 목록 (전체 + 내 콜을 여기서 필터링) */
    data: TodayCallDetailRow[];
};

type TabKey = 'all' | 'mine';

function formatTalkSeconds(sec: number): string {
    if (!sec || sec <= 0) return '-';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s
        .toString()
        .padStart(2, '0')}`;
}

export function TodayCallDetailCard({ data }: Props) {
    const [activeTab, setActiveTab] = React.useState<TabKey>('all');

    const myCalls = React.useMemo(
        () => data.filter((row) => row.isMine),
        [data],
    );

    const rowsToShow = activeTab === 'all' ? data : myCalls;

    return (
        <section className={cardStyles.card}>
            <header className={cardStyles.cardHeader}>
                <div className={cardStyles.summaryTitleBlock}>
                    <div className={cardStyles.summaryTitleRow}>
                        <h2 className={cardStyles.cardTitle}>
                            금일 전화 상담 상세 현황
                        </h2>
                    </div>
                    <p className={cardStyles.summarySub}>
                        인바운드 / 아웃바운드 통합 콜 이력을
                        전체 / 내 콜 기준으로 전환해서 확인합니다.
                    </p>
                </div>

                {/* 탭 스위처: 전체 / 내 콜 */}
                <div className={cardStyles.summaryTabSwitcher}>
                    <button
                        type="button"
                        className={`${cardStyles.summaryTabButton} ${
                            activeTab === 'all'
                                ? cardStyles.summaryTabButtonActive
                                : ''
                        }`}
                        onClick={() => setActiveTab('all')}
                    >
                        전체
                        <span className={cardStyles.summaryTabCount}>
                            {data.length.toLocaleString()}건
                        </span>
                    </button>
                    <button
                        type="button"
                        className={`${cardStyles.summaryTabButton} ${
                            activeTab === 'mine'
                                ? cardStyles.summaryTabButtonActive
                                : ''
                        }`}
                        onClick={() => setActiveTab('mine')}
                    >
                        내 콜
                        <span className={cardStyles.summaryTabCount}>
                            {myCalls.length.toLocaleString()}건
                        </span>
                    </button>
                </div>
            </header>

            {/* 상세 테이블 */}
            <div className={cardStyles.summaryTableWrapper}>
                <table className={cardStyles.summaryTable}>
                    <thead>
                    <tr>
                        <th>인입일시</th>
                        <th>상담시간</th>
                        <th>인/아웃</th>
                        <th>연락처</th>
                        <th>티켓 ID</th>
                        <th>담당자</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rowsToShow.length === 0 ? (
                        <tr>
                            <td
                                colSpan={6}
                                className={
                                    cardStyles.summaryTableCellLabel
                                }
                            >
                                표시할 콜 이력이 없습니다.
                            </td>
                        </tr>
                    ) : (
                        rowsToShow.map((row) => (
                            <tr key={row.id}>
                                <td
                                    className={
                                        cardStyles.summaryTableCellLabel
                                    }
                                >
                                    {row.occurredAt}
                                </td>
                                <td
                                    className={
                                        cardStyles.summaryTableCellNumber
                                    }
                                >
                                    {formatTalkSeconds(row.talkSeconds)}
                                </td>
                                <td
                                    className={
                                        cardStyles.summaryTableCellCenter
                                    }
                                >
                                        <span
                                            className={`${cardStyles.summaryDirectionPill} ${
                                                row.direction === 'IN'
                                                    ? cardStyles.summaryDirectionIn
                                                    : cardStyles.summaryDirectionOut
                                            }`}
                                        >
                                            {row.direction === 'IN'
                                                ? '인바운드'
                                                : '아웃바운드'}
                                        </span>
                                </td>
                                <td
                                    className={
                                        cardStyles.summaryTableCellLabel
                                    }
                                >
                                    {row.customerNumber}
                                </td>
                                <td
                                    className={
                                        cardStyles.summaryTableCellLabel
                                    }
                                >
                                    {row.ticketId ?? '-'}
                                </td>
                                <td
                                    className={
                                        cardStyles.summaryTableCellLabel
                                    }
                                >
                                    {row.agentName}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}