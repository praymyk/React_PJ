// src/app/palace/test/TestDefaultContent.tsx
'use client';

import { MasterDetailTable, Column } from '@components/common/MasterDetailTable/MasterDetailTable';

type Row = {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'inactive';
};

const mockRows: Row[] = [
    { id: 'u-001', name: '홍냐냐', email: 'hong@example.com', status: 'active' },
    { id: 'u-002', name: '김냐냐', email: 'kim@example.com', status: 'inactive' },
    { id: 'u-003', name: '이냐냐', email: 'lee@example.com', status: 'active' },
];

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

export default function TestDefaultContent() {
    return (
        <MasterDetailTable<Row>
            rows={mockRows}
            columns={columns}
            getRowKey={(row) => row.id}
            renderDetail={(row) =>
                row ? (
                    <div>
                        <h2>{row.name} 상세 정보</h2>
                        <p>ID: {row.id}</p>
                        <p>이메일: {row.email}</p>
                        <p>상태: {row.status === 'active' ? '활성' : '비활성'}</p>
                    </div>
                ) : (
                    <div>행을 선택하면 상세 정보가 표시됩니다.</div>
                )
            }
        />
    );
}