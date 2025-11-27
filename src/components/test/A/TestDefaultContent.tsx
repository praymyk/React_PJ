'use client';

import { useRouter } from 'next/navigation';
import {
    MasterTable,
    type Column,
} from '@components/common/MasterDetailTable/MasterTable';
import type { Row } from '@/app/palace/test/a/data';

type Mode = 'list' | 'detail';

type Props = {
    rows: Row[];
    mode?: Mode;
    selectedIndex?: number | null;
};

const columns: Column<Row>[] = [
    {
        header: 'ID',
        render: row => row.id,
        width: '120px',
    },
    {
        header: '이름',
        render: row => row.name,
    },
    {
        header: '이메일',
        render: row => row.email,
    },
    {
        header: '상태',
        render: row => (row.status === 'active' ? '활성' : '비활성'),
        width: '80px',
    },
];

export default function TestDefaultContent({
                                               rows,
                                               mode = 'list',
                                               selectedIndex = null}: Props) {
    const router = useRouter();

    const handleRowClick = (row: Row) => {
        if (mode === 'list') {
            // 목록 → 상세 페이지로 이동
            router.push(`/palace/test/a/${row.id}`);
        } else {
            // mode === 'detail' 인 경우
            // 원하면 여기서도 다른 상세로 이동하게 해도 되고, 아무 것도 안 해도 됨
            router.push(`/palace/test/a/${row.id}`);
        }
    };

    return (
        <MasterTable<Row>
            rows={rows}
            columns={columns}
            getRowKey={(row) => row.id}
            onRowClick={handleRowClick}
            initialSelectedIndex={selectedIndex}
        />
    );
}