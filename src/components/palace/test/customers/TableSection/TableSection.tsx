'use client';

import { useState, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
    Table,
    type Column,
} from '@components/common/TableForm/Table';
import type { Row } from '@/app/(protected)/palace/test/customers/data';

type Mode = 'list' | 'detail';

type Props = {
    rows: Row[];
    mode?: Mode;
    selectedIndex?: number | null;
    columns: Column<Row>[];

    currentPage?: number;
    pageSize?: number;
};

type SortState = {
    columnIndex: number | null;
    direction: 'asc' | 'desc';
};

export default function TableSection({
                                         rows,
                                         columns,
                                         mode = 'list',
                                         selectedIndex = null,
                                         currentPage,
                                         pageSize,
                                     }: Props) {
    const [sortState, setSortState] = useState<SortState>({
        columnIndex: null,
        direction: 'asc',
    });

    const sortedRows = useMemo(() => {
        if (sortState.columnIndex === null) return rows;

        const column = columns[sortState.columnIndex];
        if (!column || !column.sortable || !column.sortAccessor) {
            return rows;
        }

        const direction = sortState.direction;

        return [...rows].sort((a, b) => {
            const va = column.sortAccessor!(a);
            const vb = column.sortAccessor!(b);

            if (va == null && vb == null) return 0;
            if (va == null) return 1;
            if (vb == null) return -1;

            if (typeof va === 'number' && typeof vb === 'number') {
                return direction === 'asc' ? va - vb : vb - va;
            }

            const sa = String(va);
            const sb = String(vb);
            const cmp = sa.localeCompare(sb);
            return direction === 'asc' ? cmp : -cmp;
        });
    }, [rows, columns, sortState]);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleRowClick = (row: Row) => {
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

    const handleHeaderClick = (column: Column<Row>, columnIndex: number) => {
        if (!column.sortable) return;

        setSortState((prev) => {
            if (prev.columnIndex === columnIndex) {
                // 컬럼 클릭 → 방향 토글
                return {
                    columnIndex,
                    direction: prev.direction === 'asc' ? 'desc' : 'asc',
                };
            }
            // 첫 클릭 > asc 로 시작
            return {
                columnIndex,
                direction: 'asc',
            };
        });
    };

    return (
        <Table<Row>
            rows={sortedRows}
            columns={columns}
            getRowKey={(row) => row.id}
            onRowClick={handleRowClick}
            onHeaderClick={handleHeaderClick}
            initialSelectedIndex={selectedIndex}
        />
    );
}