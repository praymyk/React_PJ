'use client';

import { useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import styles from '@components/palace/test/customers/DefaultContent.module.scss';

import DetailSection from '@components/palace/test/customers/detailSection/DetailSection';
import SearchForm from '@components/common/SearchForm/SearchForm';
import TableSection from '@components/palace/test/customers/tableSection/TableSection';

import { searchRegistry } from '@/app/(protected)/palace/test/customers/searchFields';
import { tableColumns } from '@/app/(protected)/palace/test/customers/tableColumns';

import type { CustomerRow } from '@/lib/db/reactpj/customers';

type Props = {
    customer: CustomerRow;
    customerList: CustomerRow[];
    page: number;
    pageSize: number;
    total: number;
};

export default function DetailContent({
    customer,
    customerList,
    page,
    pageSize,
    total,
}: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // 선택된 유저 id > props
    const selectedId = customer.id;

    // 리스트에서 하이라이트용 인덱스
    const selectedIndex = customerList.findIndex((u) => u.id === selectedId);
    const safeSelectedIndex = selectedIndex >= 0 ? selectedIndex : null;

    const fields = searchRegistry.searchItems;

    const initialSearchValues = useMemo(
        () => ({
            keyword: searchParams.get('keyword') ?? '',
            status: searchParams.get('status') ?? '',
        }),
        [searchParams],
    );

    const currentPage = useMemo(() => {
        const fromUrl = Number(searchParams.get('page') ?? page) || page || 1;
        return fromUrl;
    }, [searchParams, page]);

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(total / pageSize)),
        [total, pageSize],
    );

    const goToPage = (nextPage: number) => {
        const safePage = Math.min(Math.max(nextPage, 1), totalPages);

        const sp = new URLSearchParams(searchParams.toString());
        if (safePage === 1) {
            sp.delete('page');
        } else {
            sp.set('page', String(safePage));
        }
        sp.set('pageSize', String(pageSize));

        router.push(`${pathname}?${sp.toString()}`, { scroll: false });
    };

    const handlePrevPage = () => {
        goToPage(currentPage - 1);
    };

    const handleNextPage = () => {
        goToPage(currentPage + 1);
    };

    const handleSearch = (values: Record<string, string>) => {
        console.log('검색 값:', values);
        // TODO: 검색값으로 API 호출
        const sp = new URLSearchParams(searchParams.toString());

        Object.entries(values).forEach(([key, val]) => {
            const v = (val ?? '').trim();
            if (v) {
                sp.set(key, v);
            } else {
                sp.delete(key);
            }
        });

        // 검색하면 항상 1페이지로 초기화
        sp.delete('page');

        router.push(`${pathname}?${sp.toString()}`, { scroll: false });
    };

    return (
        <div className={styles.root}>
            {/* 상단: 선택된 유저 상세 */}
            <DetailSection row={customer} />

            {/* 중간: 검색 폼 */}
            <SearchForm
                fields={fields}
                onSearch={handleSearch}
                initialValues={initialSearchValues}
            />

            {/* 하단: 유저 리스트 테이블 (선택된 행 하이라이트) */}
            <TableSection
                rows={customerList}
                columns={tableColumns}
                mode="detail"
                selectedIndex={safeSelectedIndex}
                currentPage={currentPage}
                pageSize={pageSize}
            />

            <div className={styles.paginationBar}>
                <button
                    type="button"
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1}
                >
                    이전
                </button>

                <span className={styles.paginationInfo}>
                    {currentPage} / {totalPages} 페이지
                    <span> (총 {total}건)</span>
                </span>

                <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                >
                    다음
                </button>
            </div>
        </div>
    );
}