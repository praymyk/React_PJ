export type TodayMyTicketSummaryData = {
    /** 전화 채널로 생성된 티켓 수 */
    phoneTicketCount: number;
    /** 채팅(웹챗/메신저 등)으로 생성된 티켓 수 */
    chatTicketCount: number;
    /** 이메일/방문/기타 등 나머지 채널로 생성된 티켓 수 */
    etcTicketCount: number;
    /** 내가 담당 중인 미종결 티켓 수 */
    myOpenTicketCount: number;
    /** 오늘 내가 완료 처리한 티켓 수 */
    myClosedTodayCount: number;
};

export const mockTodayMyTicketSummaryData: TodayMyTicketSummaryData = {
    phoneTicketCount: 12,
    chatTicketCount: 8,
    etcTicketCount: 3,
    myOpenTicketCount: 5,
    myClosedTodayCount: 7,
};

/** 채널별 티켓 집계용 타입 */
export type ChannelTicketSummaryRow = {
    /** 채널명 (예: 전화, 문자, 메일) */
    channel: string;
    /** 해당 채널로 접수된 티켓 수 */
    receivedCount: number;
    /** 처리 완료 티켓 수 */
    processedCount: number;
    /** 미처리(진행중/대기) 티켓 수 */
    pendingCount: number;
    /** 평균 처리 시간 (분 단위) */
    avgHandlingMinutes: number;
};

export type ChannelTicketSummaryData = {
    rows: ChannelTicketSummaryRow[];
};

/** 채널별 티켓 집계 더미 데이터 */
export const mockChannelTicketSummaryData: ChannelTicketSummaryData = {
    rows: [
        {
            channel: '전화',
            receivedCount: 18,
            processedCount: 14,
            pendingCount: 4,
            avgHandlingMinutes: 7,
        },
        {
            channel: '문자',
            receivedCount: 9,
            processedCount: 6,
            pendingCount: 3,
            avgHandlingMinutes: 12,
        },
        {
            channel: '메일',
            receivedCount: 6,
            processedCount: 4,
            pendingCount: 2,
            avgHandlingMinutes: 20,
        },
    ],
};


/** 금일 나의 콜 요약 데이터 */
export type TodayMyCallSummaryData = {
    /** 오늘 전체 인바운드 콜 수 (센터 전체 기준) */
    totalInboundCount: number;
    /** 오늘 내가 응대한 인바운드 콜 수 */
    myInboundCount: number;
    /** 오늘 내가 발신한 아웃바운드 콜 수 */
    myOutboundCount: number;
    /** 오늘 내가 처리 완료한 콜백 콜 수 */
    myCallbackCount: number;
    /** 오늘 전체 평균 통화 시간 (초 단위) */
    avgTalkTimeAllSec: number;
    /** 오늘 나의 평균 통화 시간 (초 단위) */
    avgTalkTimeMySec: number;
};

export const mockTodayMyCallSummaryData: TodayMyCallSummaryData = {
    totalInboundCount: 128,   // 전체 인바운드
    myInboundCount: 34,       // 내가 받은 인바운드
    myOutboundCount: 18,      // 내가 건 아웃바운드
    myCallbackCount: 6,       // 내가 처리한 콜백
    avgTalkTimeAllSec: 260,   // 04:20
    avgTalkTimeMySec: 305,    // 05:05
};



/** 금일 콜 상세 행 단위 데이터 */
export type TodayCallDetailRow = {
    /** PK 용 내부 ID */
    id: string;
    /** 인입 일시 (표시용 문자열) */
    occurredAt: string; // 예: '2025-12-16 09:12:33'
    /** 통화 시간 (초 단위) */
    talkSeconds: number;
    /** 인아웃 분기 */
    direction: 'IN' | 'OUT';
    /** 고객 연락처 */
    customerNumber: string;
    /** 연동된 티켓 ID (없을 수도 있음) */
    ticketId: string | null;
    /** 상담 담당자 이름 */
    agentName: string;
    /** "내 콜" 여부 플래그 */
    isMine: boolean;
};

/** 금일 콜 상세 더미 데이터 (전체 목록) */
export const mockTodayCallDetailRows: TodayCallDetailRow[] = [
    {
        id: '1',
        occurredAt: '2025-12-16 09:12:33',
        talkSeconds: 312,
        direction: 'IN',
        customerNumber: '010-1234-5678',
        ticketId: 'TCK-20251216-001',
        agentName: '홍길동',
        isMine: true,
    },
    {
        id: '2',
        occurredAt: '2025-12-16 09:25:10',
        talkSeconds: 185,
        direction: 'OUT',
        customerNumber: '010-9876-5432',
        ticketId: 'TCK-20251216-002',
        agentName: '홍길동',
        isMine: true,
    },
    {
        id: '3',
        occurredAt: '2025-12-16 10:02:47',
        talkSeconds: 0,
        direction: 'IN',
        customerNumber: '010-5555-1111',
        ticketId: null,
        agentName: '이민수',
        isMine: false,
    },
    {
        id: '4',
        occurredAt: '2025-12-16 11:18:03',
        talkSeconds: 420,
        direction: 'IN',
        customerNumber: '010-3333-2222',
        ticketId: 'TCK-20251216-005',
        agentName: '이민수',
        isMine: false,
    },
    {
        id: '5',
        occurredAt: '2025-12-16 13:41:20',
        talkSeconds: 260,
        direction: 'OUT',
        customerNumber: '010-7777-8888',
        ticketId: 'TCK-20251216-008',
        agentName: '홍길동',
        isMine: true,
    },
];


/** 공지사항 리스트 아이템 */
export type NoticeListItem = {
    id: string;
    /** 머리말/카테고리 (예: 시스템, 운영, 인사 등) */
    category: string;
    /** 공지 제목 */
    title: string;
    /** 작성일 (YYYY-MM-DD 표기) */
    createdAt: string;
    /** 중요 공지 여부 (상단 고정용) */
    isPinned?: boolean;
};

/** 공지사항 더미 데이터 */
export const mockNoticeList: NoticeListItem[] = [
    {
        id: 'n1',
        category: '시스템',
        title: '[점검 안내] IPCC 시스템 정기 점검 (12/20 02:00~04:00)',
        createdAt: '2025-12-15',
        isPinned: true,
    },
    {
        id: 'n2',
        category: '운영',
        title: '12월 상담 품질 점검 일정 및 기준 안내',
        createdAt: '2025-12-12',
        isPinned: true,
    },
    {
        id: 'n3',
        category: '인사',
        title: '2025년 연말연시 휴무 및 근무 일정 공지',
        createdAt: '2025-12-10',
    },
    {
        id: 'n4',
        category: '공지',
        title: '지식관리(KB) 검색 가이드 업데이트 안내',
        createdAt: '2025-12-09',
    },
];

/** 지식관리(KB) 리스트 아이템 */
export type KnowledgeListItem = {
    id: string;
    /** 머리말/카테고리 (예: FAQ, 스크립트, 업무지침 등) */
    category: string;
    /** 문서 제목 */
    title: string;
    /** 등록/최종 수정일 */
    createdAt: string;
};

export const mockKnowledgeList: KnowledgeListItem[] = [
    {
        id: 'k1',
        category: 'FAQ',
        title: '상담 중 콜백 예약 처리 방법',
        createdAt: '2025-12-14',
    },
    {
        id: 'k2',
        category: '스크립트',
        title: '[청담점] 초진 상담 오프닝 멘트 예시',
        createdAt: '2025-12-13',
    },
    {
        id: 'k3',
        category: '업무지침',
        title: '장기 미접촉 고객 티켓 정리 규칙',
        createdAt: '2025-12-11',
    },
    {
        id: 'k4',
        category: 'FAQ',
        title: 'IVR 장애 시 수동 전화 연결 대응 매뉴얼',
        createdAt: '2025-12-08',
    },
];

/** 최근 24시간 시간대별 트렌드 포인트 */
export type Last24HoursTrendPoint = {
    /** 시간 라벨 (예: '09시', '10시') */
    hourLabel: string;
    /** 해당 시간에 생성된 티켓 수 */
    ticketCreated: number;
    /** 해당 시간에 처리(종결)된 티켓 수 */
    ticketResolved: number;
    /** 해당 시간에 인입된 콜 수 */
    callInbound: number;
    /** 해당 시간에 응대한 콜 수 */
    callAnswered: number;
};

export type Last24HoursTrendData = {
    points: Last24HoursTrendPoint[];
};

/** 최근 24시간 트렌드 더미 데이터 (예: 2시간 단위 12포인트) */
export const mockLast24HoursTrendData: Last24HoursTrendData = {
    points: [
        { hourLabel: '00시', ticketCreated: 2, ticketResolved: 1, callInbound: 5,  callAnswered: 4 },
        { hourLabel: '02시', ticketCreated: 1, ticketResolved: 1, callInbound: 3,  callAnswered: 3 },
        { hourLabel: '04시', ticketCreated: 0, ticketResolved: 1, callInbound: 2,  callAnswered: 2 },
        { hourLabel: '06시', ticketCreated: 3, ticketResolved: 2, callInbound: 8,  callAnswered: 7 },
        { hourLabel: '08시', ticketCreated: 5, ticketResolved: 4, callInbound: 15, callAnswered: 13 },
        { hourLabel: '10시', ticketCreated: 7, ticketResolved: 6, callInbound: 22, callAnswered: 19 },
        { hourLabel: '12시', ticketCreated: 6, ticketResolved: 5, callInbound: 20, callAnswered: 17 },
        { hourLabel: '14시', ticketCreated: 8, ticketResolved: 7, callInbound: 24, callAnswered: 21 },
        { hourLabel: '16시', ticketCreated: 5, ticketResolved: 6, callInbound: 18, callAnswered: 16 },
        { hourLabel: '18시', ticketCreated: 4, ticketResolved: 5, callInbound: 14, callAnswered: 12 },
        { hourLabel: '20시', ticketCreated: 3, ticketResolved: 4, callInbound: 10, callAnswered: 9 },
        { hourLabel: '22시', ticketCreated: 2, ticketResolved: 3, callInbound: 7,  callAnswered: 6 },
    ],
};