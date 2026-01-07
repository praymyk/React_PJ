'use client';

import React from 'react';
import cardStyles from '@components/palace/SummaryCard.module.scss';
import listStyles from '@components/palace/SideListCard.module.scss';

import { KnowledgeListItem, mockKnowledgeList } from '@/app/(protected)/palace/data';

type Props = {
items?: KnowledgeListItem[];
};

export function KnowledgeListCard({ items }: Props) {
    const data = React.useMemo(
        () => (items ?? mockKnowledgeList).slice().sort((a, b) =>
            b.createdAt.localeCompare(a.createdAt),
        ),
        [items],
    );

    return (
        <section className={cardStyles.card}>
            <header className={cardStyles.cardHeader}>
                <div className={cardStyles.summaryTitleBlock}>
                    <div className={cardStyles.summaryTitleRow}>
                        <h2 className={cardStyles.cardTitle}>지식관리</h2>
                    </div>
                    <p className={cardStyles.summarySub}>
                        자주 쓰는 FAQ · 스크립트 · 업무지침을 최신순으로 보여줍니다.
                    </p>
                </div>
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
                                className={listStyles.sideListRow}
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