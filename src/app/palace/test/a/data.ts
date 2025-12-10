/** 고객 정보 목업 ***/
export type Row = {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'inactive';
};

// 실제 서비스에서는 API에서 가져오겠지만, 지금은 mock
export const mockRows: Row[] = [
    { id: 'u-001', name: '2냐냐', email: 'hong@example.com', status: 'active' },
    { id: 'u-002', name: '2냐냐', email: 'kim@example.com', status: 'inactive' },
    { id: 'u-003', name: '2냐냐', email: 'lee@example.com', status: 'active' },
];

/** 고객 이력 목업 ***/
export type HistoryItem = {
    date: string;
    title: string;
    status: string;
}

export const mockHistoryById: Record<string, HistoryItem[]> = {
    'u-001': [
        { date: '2025-03-01', title: '문의 접수',     status: '진행중' },
        { date: '2025-03-03', title: '추가 자료 요청', status: '완료' },
    ],
    'u-002': [
        { date: '2025-02-11', title: '회원 정보 수정', status: '완료' },
    ],
    // 나머지 ID는 데이터가 없으면 빈 배열로 처리
};