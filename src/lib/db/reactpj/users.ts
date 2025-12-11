import type { RowDataPacket } from 'mysql2/promise';
import { reactpjPool } from './pool';

export type UserRow = RowDataPacket & {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'inactive';
    created_at: Date;
};

/** 페이징 결과 타입 */
export type PagedResult<T> = {
    rows: T[];
    total: number;
    page: number;
    pageSize: number;
};

export async function getUsers(): Promise<UserRow[]> {
    const [rows] = await reactpjPool.query<UserRow[]>(
        `
      SELECT id, name, email, status, created_at
      FROM users
      ORDER BY id
    `,
    );
    return rows;
}

/**
 * (신규) DB 레벨에서 LIMIT/OFFSET으로 잘라오는 페이징 전용 함수
 */
export async function getUsersPaged(
    page: number,
    pageSize: number,
): Promise<PagedResult<UserRow>> {
    const safePage = page > 0 ? page : 1;
    const safePageSize = pageSize > 0 ? pageSize : 10;
    const offset = (safePage - 1) * safePageSize;

    // 1) 실제 목록
    const [rows] = await reactpjPool.query<UserRow[]>(
        `
        SELECT id, name, email, status, created_at
        FROM users
        ORDER BY id
        LIMIT ? OFFSET ?
        `,
        [safePageSize, offset],
    );

    // 2) 전체 개수 (페이지 수 계산용)
    const [countRows] = await reactpjPool.query<
        (RowDataPacket & { total: number })[]
    >(
        `
        SELECT COUNT(*) AS total
        FROM users
        `,
    );

    const total = countRows[0]?.total ?? 0;

    return {
        rows,
        total,
        page: safePage,
        pageSize: safePageSize,
    };
}

export async function getUserById(id: string): Promise<UserRow | null> {
    const [rows] = await reactpjPool.query<UserRow[]>(
        `
      SELECT id, name, email, status, created_at
      FROM users
      WHERE id = ?
    `,
        [id],
    );
    return rows[0] ?? null;
}