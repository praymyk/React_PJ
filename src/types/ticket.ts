export type TicketStatusType = 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'CANCELED';

export type CustomerTicketRow = {
    id: number;
    customerId: number;
    title: string;
    description: string;
    status: TicketStatusType;
    submittedAt: string;
    createdAt: string;
};

export const TICKET_STATUS_CONFIG: Record<TicketStatusType, { label: string; textVar: string }> = {
    OPEN: {
        label: '접수',
        textVar: '--text-badge-open',
    },
    IN_PROGRESS: {
        label: '진행중',
        textVar: '--text-badge-progress',
    },
    DONE: {
        label: '종료',
        textVar: '--text-badge-done',
    },
    CANCELED: {
        label: '취소',
        textVar: '--text-badge-canceled',
    },
};