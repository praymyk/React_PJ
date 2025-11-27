export type Row = {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'inactive';
};

// 실제 서비스에서는 API에서 가져오겠지만, 지금은 mock
export const mockRows: Row[] = [
    { id: 'u-001', name: '홍냐냐', email: 'hong@example.com', status: 'active' },
    { id: 'u-002', name: '김냐냐', email: 'kim@example.com', status: 'inactive' },
    { id: 'u-003', name: '이냐냐', email: 'lee@example.com', status: 'active' },
];