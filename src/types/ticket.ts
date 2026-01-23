import type {RowDataPacket} from "mysql2/promise";

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface TicketRow {
    id: number;
    title: string;
    description?: string;
    status: TicketStatus;
    assigneeName?: string;
    createdAt: string;
}

export interface TicketSearchParams {
    page?: number;
    pageSize?: number;
    keyword?: string;
    status?: TicketStatus | 'ALL';
    managerId?: number;
}

export type CustomerTicketRow = RowDataPacket & {
    id: number;
    customer_id: number;
    submitted_at: Date;
    title: string;
    description: string;
    status: string;
    created_at: Date;
};