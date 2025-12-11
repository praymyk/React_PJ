'use client';

import { useRouter } from 'next/navigation';
import {
    Table,
    type Column,
} from '@components/common/TableForm/Table';
import type { UserRow } from '@/lib/db/reactpj';

type Mode = 'list' | 'detail';

type Props = {
    rows: UserRow[];
    mode?: Mode;
    selectedIndex?: number | null;
    columns: Column<UserRow>[];
};

export default function TableSection({
                                              rows,
                                              mode = 'list',
                                              selectedIndex = null,
                                              columns,
}: Props) {
    const router = useRouter();

    const handleRowClick = (row: UserRow) => {
        if (mode === 'list') {
            // 첫 리스트 → 'detail' 페이지로 이동
            router.push(`/palace/test/a/${row.id}`);
        } else {
            // TODO mode === 'detail' 인 경우 사용 예정
            router.push(`/palace/test/a/${row.id}`);
        }
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