import type { PaginatedResponse } from '@/types/common';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'CANCELED';

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
    OPEN: '접수',
    IN_PROGRESS: '진행중',
    DONE: '종료',
    CANCELED: '취소',
};

export type TicketEventType =
    | 'CREATED' | 'LOG' | 'NOTE_AGENT' | 'NOTE_CUSTOMER'
    | 'STATUS_CHANGED' | 'MERGED' | 'SPLIT' | 'SYSTEM';
export const TICKET_EVENT_LABELS: Record<TicketEventType, string> = {
    CREATED: '문의접수',
    LOG: '상담기록',
    NOTE_AGENT: '상담사메모',
    NOTE_CUSTOMER: '고객메모',
    STATUS_CHANGED: '상태변경',
    MERGED: '티켓병합',
    SPLIT: '티켓분리',
    SYSTEM: '시스템',
};

export type TicketChannel = 'CALL' | 'CHAT' | 'EMAIL' | 'ETC';
export const TICKET_CHANNEL_LABELS: Record<TicketChannel, string> = {
    CALL: '전화',
    CHAT: '채팅',
    EMAIL: '이메일',
    ETC: '기타',
};

export type TicketApiRow = {
    id: number;
    title: string;
    description: string;
    assigneeId: number | null;
    status: TicketStatus;
};

/** 티켓 목록 API 응답 타입 */
export type TicketListApiResponse = PaginatedResponse<TicketApiRow>;

/** 티켓 이벤트(타임라인) Row 타입 */
export type TicketEventRow = {
    id: number;
    ticketId: number;
    eventType: TicketEventType;
    channel: TicketChannel | null;
    authorUserId: number | null;
    customerId: number | null;
    content: string;
    createdAt: string;
    meta?: string | null;
};

/** 티켓 상세 API 응답 타입 (단일 티켓) */
export type TicketDetailApiResponse = {
    id: number;
    title: string;
    description: string;
    status: TicketStatus;
    companyId: number;
    customerId: number;
    assigneeId: number | null;
    channel: TicketChannel;
    submittedAt: string;
    closedAt: string | null;
    createdAt: string;
    updatedAt: string;
};

/** 특정 티켓(+병합된 서브 티켓 포함)의 이벤트 리스트 응답 */
export type TicketEventListApiResponse = PaginatedResponse<TicketEventRow> & {
    ticketId: number;
};