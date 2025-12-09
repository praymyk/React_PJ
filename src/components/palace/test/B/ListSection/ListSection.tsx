'use client';

import common from '@components/palace/test/B/DefaultContent.module.scss';
import styles from '@components/palace/test/B/ListSection/ListSection.module.scss';
import type { Row } from '@/app/palace/test/b/data';
import SearchForm from "@components/common/SearchForm/MiniSearchForm";
import { searchRegistry } from "@/app/palace/test/b/searchFields";

type Props = {
    rows: Row[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    // 상태 > css 클래스 이름
    statusClassOf: (status: Row['status']) => string;
};

export default function ListSection({
                                              rows,
                                              selectedId,
                                              onSelect,
                                              statusClassOf,
                                          }: Props) {

    const fields = searchRegistry.searchItems;

    const handleSearch = ( values: Record<string, string>) => {
        console.log('검색 값:', values)
        // TODO: 여기서 values를 이용해서 API 호출하거나
        //       mockRows를 클라이언트에서 필터링하는 로직 추가
    }

    return (
        <section className={common.listPane}>
            <header className={common.paneHeader}>
                <div className={common.paneTitleRow}>
                    <h2 className={common.paneTitle}>티켓 목록</h2>
                    <span className={common.paneMeta}>총 {rows.length}건</span>
                </div>

                <SearchForm fields={fields} onSearch={handleSearch} />
            </header>

            {/* 목록 전용 스크롤 영역 */}
            <div className={styles.listBody}>
                <ul className={styles.ticketList}>
                    {rows.map((row) => {
                        const isActive = row.id === selectedId;
                        return (
                            <li
                                key={row.id}
                                className={
                                    isActive
                                        ? `${styles.ticketItem} ${styles.ticketItemActive}`
                                        : styles.ticketItem
                                }
                                onClick={() => onSelect(row.id)}
                            >
                                <div className={styles.ticketItemHeader}>
                                    <span className={styles.ticketId}>{row.id}</span>
                                    <span
                                        className={`${common.statusBadge} ${statusClassOf(
                                            row.status,
                                        )}`}
                                    >
                                {row.status}
                            </span>
                                </div>
                                <div className={styles.ticketTitle}>{row.title}</div>
                                <div className={styles.ticketMeta}>
                            <span className={styles.ticketAssignee}>
                                담당: {row.assignee}
                            </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}