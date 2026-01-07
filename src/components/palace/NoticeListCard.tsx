'use client';

import React from 'react';
import cardStyles from '@components/palace/SummaryCard.module.scss';
import listStyles from '@components/palace/SideListCard.module.scss';

import { NoticeListItem, mockNoticeList } from '@/app/(protected)/palace/data';

type Props = {
    items?: NoticeListItem[];
};

export function NoticeListCard({ items }: Props) {
    const data = React.useMemo(() => {
        const base = items ?? mockNoticeList;
        // pinned 먼저, 그 다음 최신순
        return [...base].sort((a, b) => {
            const pinnedDiff = (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0);
            if (pinnedDiff !== 0) return pinnedDiff;
            return b.createdAt.localeCompare(a.createdAt);
        });
    }, [items]);

    return (
        <section className={cardStyles.card}>
            <header className={cardStyles.cardHeader}>
                <div className={cardStyles.summaryTitleBlock}>
                    <div className={cardStyles.summaryTitleRow}>
                        <h2 className={cardStyles.cardTitle}>공지사항</h2>
                        {/* 필요하면 여기에도 작은 Tag 붙일 수 있음 */}
                    </div>
                    <p className={cardStyles.summarySub}>
                        중요 공지를 우선으로, 최근 등록 순으로 보여줍니다.
                    </p>
                </div>
                {/* 향후: 더보기 버튼 / 새창 열기 등 액션 자리 */}
            </header>

            <div className={cardStyles.cardBody}>
                <div className={listStyles.sideListWrapper}>
                    <table className={listStyles.sideListTable}>
                        <thead>
                        <tr>
                            <th>분류</th>
                            <th>제목</th>
                            <th>작성일</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item) => (
                            <tr
                                key={item.id}
                                className={`${listStyles.sideListRow} ${
                                    item.isPinned
                                        ? listStyles.sideListRowPinned
                                        : ''
                                }`}
                            >
                                <td>
                                        <span
                                            className={
                                                listStyles.sideListCategoryPill
                                            }
                                        >
                                            {item.category}
                                        </span>
                                </td>
                                <td>
                                        <span
                                            className={listStyles.sideListTitle}
                                            title={item.title}
                                        >
                                            {item.title}
                                        </span>
                                </td>
                                <td className={listStyles.sideListDate}>
                                    {item.createdAt}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}