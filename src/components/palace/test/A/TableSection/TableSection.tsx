'use client';

import { useRouter } from 'next/navigation';
import {
    Table,
    type Column,
} from '@components/common/TableForm/Table';
import type { Row } from '@/app/palace/test/a/data';

type Mode = 'list' | 'detail';

type Props = {
    rows: Row[];
    mode?: Mode;
    selectedIndex?: number | null;
    columns: Column<Row>[];
};

export default function TableSection({
                                              rows,
                                              mode = 'list',
                                              selectedIndex = null,
                                              columns,
}: Props) {
    const router = useRouter();

    const handleRowClick = (row: Row) => {
        if (mode === 'list') {
            // 첫 리스트 → 'detail' 페이지로 이동
            router.push(`/palace/test/a/${row.id}`);
        } else {
            // mode === 'detail' 인 경우
            router.push(`/palace/test/a/${row.id}`);
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