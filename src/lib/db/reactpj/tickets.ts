import type { RowDataPacket } from 'mysql2/promise';
import { reactpjPool } from './pool';

export type UserTicketEventsRow = RowDataPacket & {
    id: number;
    user_id: string;
    event_date: Date;
    title: string;
    content: string;
    status: string;
    created_at: Date;
};

export async function getUserTicketEvents(userId: string): Promise<UserTicketEventsRow[]> {
    const [rows] = await reactpjPool.query<UserTicketEventsRow[]>(
        `
      SELECT
        id,
        user_id,
        event_date,
        title,
        content,
        status,
        created_at
      FROM ticket_events
      WHERE user_id = ?
      ORDER BY event_date DESC, id DESC
    `,
        [userId],
    );
    return rows;
}