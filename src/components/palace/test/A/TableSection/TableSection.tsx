'use client';

import { useRouter } from 'next/navigation';
import {
    Table,
    type Column,
} from '@components/common/TableForm/Table';
import type { UserRow } from '@/lib/db/reactpj/users';

type Mode = 'list' | 'detail';

type Props = {
    rows: UserRow[];
    mode?: Mode;
    selectedIndex?: number | null;
    columns: Column<UserRow>[];

    currentPage?: number;
    pageSize?: number;
};

export default function TableSection({
                                         rows,
                                         mode = 'list',
                                         selectedIndex = null,
                                         columns,
                                         currentPage,
                                         pageSize,

}: Props) {
    const router = useRouter();

    const handleRowClick = (row: UserRow) => {
        const sp = new URLSearchParams();

        if (currentPage && currentPage > 1) {
            sp.set('page', String(currentPage));
        }
        if (pageSize && pageSize > 0) {
            sp.set('pageSize', String(pageSize));
        }

        const query = sp.toString();
        const base = `/palace/test/a/${row.id}`;
        const href = query ? `${base}?${query}` : base;

        router.push(href);
    };

    return (
        <Table<UserRow>
            rows={rows}
            columns={columns}
            getRowKey={(row) => row.id}
            onRowClick={handleRowClick}
            initialSelectedIndex={selectedIndex}
        />
    );
}