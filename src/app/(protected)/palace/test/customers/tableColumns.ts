import type { Column } from '@components/common/TableForm/Table';
import type { Row } from '@/app/(protected)/palace/test/customers/data';

export const tableColumns: Column<Row>[] = [
    {
        header: 'ID',
        render: (row) => row.id,
        width: '120px',
        sortable: true,
        sortKey: 'id',
    },
    {
        header: '이름',
        render: (row) => row.name,
        sortable: true,
        sortKey: 'name',
    },
    {
        header: '이메일',
        render: (row) => row.email,
        sortable: true,
        sortKey: 'email',
    },
    {
        header: '상태',
        render: (row) => (row.status === 'active' ? '활성' : '비활성'),
        width: '80px',
        sortable: true,
        sortKey: 'status',
    },
];