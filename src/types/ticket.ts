import type {RowDataPacket} from "mysql2/promise";

export type CustomerTicketRow = RowDataPacket & {
    id: number;
    customerId: number;
    submittedAt: Date;
    title: string;
    description: string;
    status: string;
    createdAt: Date;
};