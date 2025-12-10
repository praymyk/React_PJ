import 'server-only';
import mysql, { type Pool, type RowDataPacket } from 'mysql2/promise';

export type UserRow = RowDataPacket & {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'inactive';
    created_at: Date;
};

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