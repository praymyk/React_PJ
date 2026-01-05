'use client';

import common from '@components/palace/ticket/DefaultContent.module.scss';
import styles from '@components/palace/ticket/ListSection/ListSection.module.scss';
import type { Row } from '@/app/palace/ticket/data';
import SearchForm from "@components/common/SearchForm/MiniSearchForm";
import { searchRegistry } from "@/app/palace/ticket/searchFields";

type Props = {
    rows: Row[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    statusClassOf: (status: Row['status']) => string;
    /** 검색 조건이 바뀔 때 상위(DefaultContent)로 전달 */
    onSearch: (values: Record<string, string>) => void;
    /** 목록 로딩 여부 */
    loading?: boolean;
    /** 목록 조회 에러 메시지 */
    error?: string | null;

    /** 페이징 */
    page: number;
    totalPages: number;
    total: number;
    /** 페이지 변경 시 호출 (상위 component에서 URL 갱신) */
    onPageChange: (nextPage: number) => void;
    /** MiniSearchForm에 전달할 초기 값 (첫 방문 시 기본 선택) */
    initialSearchValues?: Record<string, string>;
};

export default function ListSection({
    rows,
    selectedId,
    onSelect,
    statusClassOf,
    onSearch,
    loading = false,
    error = null,
    page,
    totalPages,
    total,
    onPageChange,
    initialSearchValues,
}: Props) {
    const fields = searchRegistry.searchItems;

    return (
        <section className={common.listPane}>
            <header className={common.paneHeader}>
                <div className={common.paneTitleRow}>
                    <h2 className={common.paneTitle}>티켓 목록</h2>
                    <span className={common.paneMeta}>총 {total}건</span>
                </div>

                {/* MiniSearchForm */}
                <SearchForm
                    fields={fields}
                    onSearch={onSearch}
                    initialValues={initialSearchValues}
                />
            </header>

            {/* 목록 전용 스크롤 영역 */}
            <div className={common.listBody}>
                {loading ? (
                    <div className={styles.listLoading}>
                        티켓 목록을 불러오는 중입니다...
                    </div>
                ) : error ? (
                    <div className={styles.listError}>{error}</div>
                ) : rows.length === 0 ? (
                    <div className={styles.listEmpty}>
                        조건에 맞는 티켓이 없습니다.
                    </div>
                ) : (
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
                )}
            </div>
            <div className={common.paginationBar}>
                <button
                    type="button"
                    className={common.pageButton}
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                >
                    이전
                </button>

                <span className={common.paginationInfo}>
                    {page} / {totalPages} 페이지
                </span>

                <button
                    type="button"
                    className={common.pageButton}
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                >
                    다음
                </button>
            </div>
        </section>
    );
}