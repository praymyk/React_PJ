'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
    Table,
    type Column,
} from '@components/common/TableForm/Table';
import type { CustomerRow } from '@/types/customer';

type Mode = 'list' | 'detail';

type Props = {
    rows: CustomerRow[];
    mode?: Mode;
    selectedIndex?: number | null;
    columns: Column<CustomerRow>[];

    currentPage?: number;
    pageSize?: number;
};

export default function TableSection({
                                         rows,
                                         columns,
                                         mode = 'list',
                                         selectedIndex = null,
                                         currentPage,
                                         pageSize,
                                     }: Props) {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleRowClick = (row: CustomerRow) => {
        const sp = new URLSearchParams(searchParams.toString());

        // page / pageSize 유지
        if (currentPage && currentPage > 1) {
            sp.set('page', String(currentPage));
        } else {
            sp.delete('page');
        }
        if (pageSize && pageSize > 0) {
            sp.set('pageSize', String(pageSize));
        } else {
            sp.delete('pageSize');
        }


        if (mode === 'list') {
            // 상세페이지 이동
            const query = sp.toString();
            const href = query
                ? `/palace/test/customers/${row.id}?${query}`
                : `/palace/test/customers/${row.id}`;

            router.push(href);
        } else {
            // 상세페이지 안 > 검색 조건 유지
            const query = sp.toString();

            const basePath = pathname.replace(/\/[^/]+$/, '');
            const href = query
                ? `${basePath}/${row.id}?${query}`
                : `${basePath}/${row.id}`;

            router.push(href);
        }
    };

    const handleHeaderClick = (column: Column<CustomerRow>, _columnIndex: number) => {
        if (!column.sortable || !column.sortKey) return;

        const sp = new URLSearchParams(searchParams.toString());
        const currentSortBy = sp.get('sortBy');
        const currentSortDir = sp.get('sortDir') === 'desc' ? 'desc' : 'asc';

        const nextSortBy = column.sortKey;
        let nextSortDir: 'asc' | 'desc' = 'asc';

        if (currentSortBy === column.sortKey) {
            nextSortDir = currentSortDir === 'asc' ? 'desc' : 'asc';
        }

        sp.set('sortBy', nextSortBy);
        sp.set('sortDir', nextSortDir);
        sp.set('page', '1');

        const href = `${pathname}?${sp.toString()}`;
        router.push(href);
    };

    const sortByParam = searchParams.get('sortBy');
    const sortDirParam = searchParams.get('sortDir');

    const currentSortKey = sortByParam ?? null;
    const currentSortDir: 'asc' | 'desc' | null =
        sortByParam ? (sortDirParam === 'desc' ? 'desc' : 'asc') : null;

    return (
        <Table<CustomerRow>
            rows={rows}
            columns={columns}
            getRowKey={(row) => row.id}
            onRowClick={handleRowClick}
            onHeaderClick={handleHeaderClick}
            currentSortKey={currentSortKey}      // 예: 'id' | 'name' | 'email'
            currentSortDir={currentSortDir}      // 'asc' | 'desc' | null
            initialSelectedIndex={selectedIndex}
        />
    );
}