'use client';

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

    return (
        <Table<Row>
            rows={rows}
            columns={columns}
            getRowKey={(row) => row.id}
            onRowClick={handleRowClick}
            initialSelectedIndex={selectedIndex}
        />
    );
}