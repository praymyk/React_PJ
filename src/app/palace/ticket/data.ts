/** 화면에서 쓰는 티켓 Row 타입 */
export type Row = {
    id: string;
    title: string;
    description: string;
    assignee: string; // 담당자 표시용 문자열 (예: 이름 or "미배정")
    status: '접수' | '진행중' | '종료' | '취소';
};

/** 티켓 목록 API 응답 타입 */
export type TicketListApiResponse = {
    rows: {
        id: string;
        title: string;
        description: string;
        assignee_id: string | null;
        status: '접수' | '진행중' | '종료' | '취소';
    }[];
    page: number;
    pageSize: number;
    total: number;
};

/** 티켓 상세 API 응답 타입 (단일 티켓) */
export type TicketDetailApiResponse = {
    id: string;
    title: string;
    description: string;
    status: '접수' | '진행중' | '종료' | '취소';
    company_id: number;
    customer_id: string;
    assignee_id: string | null;
    channel: '전화' | '채팅' | '이메일' | '기타';
    submitted_at: string;  // JSON으로 오면 ISO 문자열이라 string으로 두는 게 편함
    closed_at: string | null;
    created_at: string;
    updated_at: string;
};

/** 티켓 이벤트(타임라인) Row 타입 */
export type TicketEventRow = {
    id: number;
    ticketId: string;
    eventType:
        | '문의접수'
        | '상담기록'
        | '상담사메모'
        | '고객메모'
        | '상태변경'
        | '티켓병합'
        | '티켓분리'
        | '시스템';
    channel: '전화' | '채팅' | '이메일' | '기타' | null;
    authorUserId: string | null;
    customerId: string | null;
    content: string;
    createdAt: string; // ISO 문자열
};

/** 특정 티켓(+병합된 서브 티켓 포함)의 이벤트 리스트 응답 */
export type TicketEventListApiResponse = {
    ticketId: string;          // 기준 티켓 ID (요청한 id)
    events: TicketEventRow[];  // 타임라인 이벤트 목록
};
