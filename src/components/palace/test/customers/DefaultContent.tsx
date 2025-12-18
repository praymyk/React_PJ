'use client';

import { useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import SearchForm from '@components/common/SearchForm/SearchForm';
import TableSection from '@components/palace/test/customers/TableSection/TableSection';
import { searchRegistry } from '@/app/palace/test/users/searchFields';
import { tableColumns } from '@/app/palace/test/users/tableColumns';
import type { Row } from '@/app/palace/test/users/data';
import styles from '@components/palace/test/customers/DefaultContent.module.scss';

type Props = {
    initialRows: Row[];
    total: number;
    page: number;
    pageSize: number;

    // 검색폼 초기값 유지용 (선택)
    initialKeyword?: string;
    initialStatus?: string;
};

export default function DefaultContent({
                                           initialRows,
                                           total,
                                           page,
                                           pageSize,
                                           initialKeyword = '',
                                           initialStatus = '',
                                       }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const fields = searchRegistry.searchItems;

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(total / pageSize)),
        [total, pageSize],
    );

    /** 검색 버튼 클릭 → URL 쿼리만 변경 → 서버에서 다시 SSR */
    const handleSearch = (values: Record<string, string>) => {
        const sp = new URLSearchParams(searchParams.toString());

        Object.entries(values).forEach(([key, val]) => {
            const v = (val ?? '').trim();
            if (v) {
                sp.set(key, v);
            } else {
                sp.delete(key);
            }
        });

        sp.delete('page');

        router.push(`${pathname}?${sp.toString()}`, { scroll: false });
    };

    /** 페이지 이동시 URL만 변경, 데이터는 SSR로 다시 가져오기 */
    const goToPage = (nextPage: number) => {
        const safePage = Math.min(Math.max(nextPage, 1), totalPages);

        const sp = new URLSearchParams(searchParams.toString());
        if (safePage === 1) {
            sp.delete('page');
        } else {
            sp.set('page', String(safePage));
        }

        router.push(`${pathname}?${sp.toString()}`, { scroll: false });
    };

    const handlePrevPage = () => {
        goToPage(page - 1);
    };

    const handleNextPage = () => {
        goToPage(page + 1);
    };

    return (
        <div className={styles.root}>
            테스트 / 고객 목록

            <SearchForm
                fields={fields}
                onSearch={handleSearch}
                // 검색폼에 URL 기준 초기값 세팅
                initialValues={{
                    keyword: initialKeyword,
                    status: initialStatus,
                }}
            />

            {/* SSR로 가져온 rows를 그대로 테이블에 전달 */}
            <TableSection
                rows={initialRows}
                columns={tableColumns}
                mode="list"
                currentPage={page}
                pageSize={pageSize}
            />

            {/* 페이징 UI */}
            <div className={styles.paginationBar}>
                <button
                    type="button"
                    onClick={handlePrevPage}
                    disabled={page <= 1}
                >
                    이전
                </button>

                <span className={styles.paginationInfo}>
                  {page} / {totalPages} 페이지
                  <span> (총 {total}건)</span>
                </span>

                <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={page >= totalPages}
                >
                    다음
                </button>
            </div>
        </div>
    );
}