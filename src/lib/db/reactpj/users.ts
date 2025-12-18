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

/** 검색 조건 **/
export type UserSearchParams = {
    keyword?: string;
    status?: 'active' | 'inactive';
};

/**
 * USER 조회 페이징 전용 함수
 */
export async function getUsersPaged(
    params: {
        page: number;
        pageSize: number;
    } & UserSearchParams,
): Promise<PagedResult<UserRow>> {
    const { page, pageSize, keyword, status } = params;

    const safePage = page > 0 ? page : 1;
    const safePageSize = pageSize > 0 ? pageSize : 10;
    const offset = (safePage - 1) * safePageSize;

    const where: string[] = [];
    const queryParams: (string | number)[] = [];

    if (keyword && keyword.trim() !== '') {
        where.push('(name LIKE ? OR email LIKE ?)');
        const like = `%${keyword.trim()}%`;
        queryParams.push(like, like);
    }

    // 타입 'active' | 'inactive' | undefined
    if (status) {
        where.push('status = ?');
        queryParams.push(status);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    // 최종 SQL + 바인딩 파라미터 로그
    const sql = `
        SELECT id, name, email, status, created_at
        FROM users
        ${whereSql}
        ORDER BY id
        LIMIT ? OFFSET ?
    `;

    const [rows] = await reactpjPool.query<UserRow[]>(sql, [
        ...queryParams,
        safePageSize,
        offset,
    ]);

    const [countRows] = await reactpjPool.query<
        (RowDataPacket & { total: number })[]
    >(
        `
            SELECT COUNT(*) AS total
            FROM users
                     ${whereSql}
        `,
        queryParams,
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