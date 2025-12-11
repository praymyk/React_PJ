import 'server-only';
import mysql, { type Pool, type RowDataPacket } from 'mysql2/promise';

// HMR 대비해서 싱글톤 패턴
const globalForReactpj = global as unknown as {
    reactpjPool?: Pool;
};

export const reactpjPool: Pool =
    globalForReactpj.reactpjPool ??
    mysql.createPool({
        host: process.env.REACTPJ_DB_HOST,
        port: Number(process.env.REACTPJ_DB_PORT ?? 3306),
        user: process.env.REACTPJ_DB_USER,
        password: process.env.REACTPJ_DB_PASS,
        database: process.env.REACTPJ_DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });

if (process.env.NODE_ENV !== 'production') {
    globalForReactpj.reactpjPool = reactpjPool;
}

/*** 고객 정보 ***/
export type UserRow = RowDataPacket & {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'inactive';
    created_at: Date;
};

/*** 고객 이력 ***/
export type UserHistoryRow = {
    id: number;
    user_id: string;
    event_date: Date;
    title: string;
    content: string;
    status: string;
    created_at: Date;
};

// --- Repository 함수들 ---

export async function getUsers(): Promise<UserRow[]> {
    const [rows] = await reactpjPool.query<UserRow[]>(
        `
            SELECT
                id,
                name,
                email,
                status,
                created_at
            FROM users
            ORDER BY id
        `,
    );
    return rows;
}

export async function getUserById(id: string): Promise<UserRow | null> {
    const [rows] = await reactpjPool.query<UserRow[]>(
        `
            SELECT
                id,
                name,
                email,
                status,
                created_at
            FROM users
            WHERE id = ?
        `,
        [id],
    );
    return rows[0] ?? null;
}


export async function getUserHistories(userId: string): Promise<UserHistoryRow[]> {
    const [rows] = await reactpjPool.query(
        `
    SELECT
      id,
      user_id,
      event_date,
      title,
      content,
      status,
      created_at
    FROM user_histories
    WHERE user_id = ?
    ORDER BY event_date DESC, id DESC
    `,
        [userId],
    );

    return rows as UserHistoryRow[];
}
