'use client';

import styles from '@components/palace/DefaultContent.module.scss';

import { TodayMyTicketSummaryCard } from '@components/palace/TodayMyTicketSummaryCard';
import { ChannelTicketSummaryCard } from '@components/palace/ChannelTicketSummaryCard';
import { TodayMyCallSummaryCard } from '@components/palace/TodayMyCallSummaryCard';
import { TodayCallDetailCard } from '@components/palace/TodayCallDetailCard';
import { Last24HoursTrendCard } from '@components/palace/Last24HoursTrendCard';
import { NoticeListCard } from '@components/palace/NoticeListCard';
import { KnowledgeListCard } from '@components/palace/KnowledgeListCard';

import {
    mockTodayMyTicketSummaryData,
    mockChannelTicketSummaryData,
    mockTodayMyCallSummaryData,
    mockTodayCallDetailRows,
    mockKnowledgeList,
    mockNoticeList,
    mockLast24HoursTrendData,

} from '@/app/(protected)/palace/data';

export default function DefaultContent() {
    return (
        <div className={styles.contentGrid}>
            {/* 좌측 메인 컬럼: 오늘 요약 + 트렌드 */}
            <div className={styles.mainColumn}>
                {/* 1행: 티켓 기준 현황 */}
                <div className={styles.summaryRow}>
                    <TodayMyTicketSummaryCard
                        data={mockTodayMyTicketSummaryData} />
                    <ChannelTicketSummaryCard
                        data={mockChannelTicketSummaryData}
                    />
                </div>

                {/* 2행: 전화 상담 기준 현황 */}
                <div className={styles.summaryRow}>
                    <TodayMyCallSummaryCard data={mockTodayMyCallSummaryData} />
                    <TodayCallDetailCard data={mockTodayCallDetailRows} />
                </div>

                {/* 3행: 최근 24시간 트렌드 */}
                <Last24HoursTrendCard data={mockLast24HoursTrendData} />
            </div>

            {/* 우측: 공지 / 지식관리 사이드 컬럼 */}
            <aside className={styles.sideColumn}>
                <NoticeListCard  items={mockNoticeList} />
                <KnowledgeListCard items={mockKnowledgeList} />
            </aside>
        </div>
    );
}