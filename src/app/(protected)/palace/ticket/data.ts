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
        assignee_id: number | null;
        status: '접수' | '진행중' | '종료' | '취소';
    }[];
    page: number;
    pageSize: number;
    total: number;
};

/** 티켓 상세 API 응답 타입 (단일 티켓) */
export type TicketDetailApiResponse = {
    id: number;
    title: string;
    description: string;
    status: '접수' | '진행중' | '종료' | '취소';
    company_id: number;
    customer_id: number;
    assignee_id: number | null;
    channel: '전화' | '채팅' | '이메일' | '기타';
    submitted_at: string;  // TODO : 등록 정보 JSON 타입 저장 대비
    closed_at: string | null;
    created_at: string;
    updated_at: string;
};

/** 티켓 이벤트(타임라인) Row 타입 */
export type TicketEventRow = {
    id: number;
    ticketId: number;
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
    authorUserId: number | null;
    customerId: number | null;
    content: string;
    createdAt: string;
};

/** 특정 티켓(+병합된 서브 티켓 포함)의 이벤트 리스트 응답 */
export type TicketEventListApiResponse = {
    ticketId: number;          // 기준 티켓 ID (요청한 id)
    events: TicketEventRow[];  // 이벤트 목록
    page: number;
    pageSize: number;
    total: number;
};
