/** 퀘스트(티켓) 정보 목업 ***/
export type Row = {
    id: string;
    title: string;
    description: string;
    assignee: string; // 담당자
    status: '접수' | '진행중' | '종료' | '취소';
};

export const mockRows: Row[] = [
    {
        id: 'Q-0001',
        title: '상담 이력 내보내기 오류',
        description:
            '상담 이력 엑셀 다운로드 시 “알 수 없는 오류가 발생했습니다” 메시지가 뜹니다.',
        assignee: '김나나',
        status: '접수',
    },
    {
        id: 'Q-0002',
        title: '내선 사용량 통계 데이터 불일치',
        description:
            '통화 수치가 관리자 페이지와 상담원 페이지에서 서로 다르게 표시됩니다.',
        assignee: '이나나',
        status: '진행중',
    },
    {
        id: 'Q-0003',
        title: '다크 모드 전환 시 화면 깜빡임',
        description:
            '다크 모드 전환 버튼 클릭 시 짧게 흰 화면이 깜빡이는 현상이 있습니다.',
        assignee: '박나나',
        status: '종료',
    },
    {
        id: 'Q-0004',
        title: '프로필 이미지 업로드 실패',
        description:
            '5MB 이하 PNG 파일 업로드 시에도 “파일 용량 초과” 경고가 나옵니다.',
        assignee: '정나나',
        status: '취소',
    },
    {
        id: 'Q-0005',
        title: '실시간 모니터링 지연',
        description:
            '실시간 대시보드의 통화 건수 업데이트가 1분 이상 지연되는 것 같습니다.',
        assignee: '오나나',
        status: '진행중',
    },
];


/** 티켓과 연결된 문의 정보 타입 */
export type InquiryRow = {
    id: string;            // 문의 ID
    ticketId: string;      // 어떤 티켓(Q-0001…)에 연결된 문의인지
    type: '통화' | '접수' | '기타'; // 문의 타입
    name: string;          // 이름
    receivedAt: string;    // 접수 일시 (YYYY-MM-DD HH:mm)
    content: string;       // 문의 내용 요약
};

/** 목업 데이터 */
export const mockInquiries: InquiryRow[] = [
    // Q-0001 관련 문의
    {
        id: 'INQ-0001',
        ticketId: 'Q-0001',
        type: '통화',
        name: '홍나나',
        receivedAt: '2023-06-02 17:31',
        content: '교환 접수 문의 드립니다.',
    },
    {
        id: 'INQ-0002',
        ticketId: 'Q-0001',
        type: '통화',
        name: '이나나',
        receivedAt: '2023-05-25 16:48',
        content: '배송 확인 요청드립니다.',
    },
    {
        id: 'INQ-0003',
        ticketId: 'Q-0001',
        type: '통화',
        name: '큐나나',
        receivedAt: '2023-05-25 14:27',
        content: '배송 문의드립니다. 택배 조회가 되지 않습니다.',
    },
    {
        id: 'INQ-0004',
        ticketId: 'Q-0001',
        type: '통화',
        name: '임나나',
        receivedAt: '2023-05-25 14:12',
        content: '결제가 안 됩니다. 카드 오류 문의.',
    },

    // Q-0002 관련 문의
    {
        id: 'INQ-0005',
        ticketId: 'Q-0002',
        type: '접수',
        name: '김나나',
        receivedAt: '2023-07-01 10:12',
        content: '통계 데이터가 실제 통화 수와 다릅니다.',
    },
    {
        id: 'INQ-0006',
        ticketId: 'Q-0002',
        type: '통화',
        name: '박나나',
        receivedAt: '2023-07-02 09:45',
        content: '일별 통계 기준 시간이 어떻게 되나요?',
    },

    // Q-0003 관련 문의
    {
        id: 'INQ-0007',
        ticketId: 'Q-0003',
        type: '통화',
        name: '최나나',
        receivedAt: '2023-08-10 15:20',
        content: '다크 모드에서 화면이 깜빡이는 현상이 있습니다.',
    },
];