
import { reactpjPool } from './pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export type CustomerRow = RowDataPacket & {
    id: number;
    name: string;
    email: string;
    status: 'active' | 'inactive';
    created_at: Date;
};

type CreateCustomerInput = {
    name: string;
    email: string;
    status: 'active' | 'inactive';
};

/** 페이징 결과 타입 */
export type PagedResult<T> = {
    rows: T[];
    total: number;
    page: number;
    pageSize: number;
};

/** 검색 조건 **/
export type CustomerSortKey = 'id' | 'name' | 'email' | 'status' | 'created_at';
export type SortDirection = 'asc' | 'desc';

export type CustomerSearchParams = {
    keyword?: string;
    status?: 'active' | 'inactive';
    sortBy?: CustomerSortKey;
    sortDir?: SortDirection;
};

/**
 * USER 조회 페이징 전용 함수
 */
export async function getCustomersPaged(
    params: {
        page: number;
        pageSize: number;
    } & CustomerSearchParams,
): Promise<PagedResult<CustomerRow>> {
    const { page, pageSize, keyword, status, sortBy, sortDir } = params;

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

    if (status) {
        where.push('status = ?');
        queryParams.push(status);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    // 정렬 컬럼 리스트
    const sortKeyMap: Record<CustomerSortKey, string> = {
        id: 'id',
        name: 'name',
        email: 'email',
        status: 'status',
        created_at: 'created_at',
    };

    const sortColumn =
        (sortBy && sortKeyMap[sortBy]) ? sortKeyMap[sortBy] : 'id';
    const direction = sortDir === 'desc' ? 'DESC' : 'ASC';

    const sql = `
    SELECT id, name, email, status, created_at
    FROM customers
    ${whereSql}
    ORDER BY ${sortColumn} ${direction}
    LIMIT ? OFFSET ?
  `;

    const [rows] = await reactpjPool.query<CustomerRow[]>(sql, [
        ...queryParams,
        safePageSize,
        offset,
    ]);

    const [countRows] = await reactpjPool.query<
        (RowDataPacket & { total: number })[]
    >(
        `
      SELECT COUNT(*) AS total
      FROM customers
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

export async function getCustomerById(id: string): Promise<CustomerRow | null> {
    const [rows] = await reactpjPool.query<CustomerRow[]>(
        `
      SELECT id, name, email, status, created_at
      FROM customers
      WHERE id = ?
    `,
        [id],
    );
    return rows[0] ?? null;
}

/** 고객 1명 생성 후, 생성된 행을 리턴 */
export async function createCustomer(
    input: CreateCustomerInput,
): Promise<CustomerRow> {
    const conn = await reactpjPool.getConnection();
    try {
        await conn.beginTransaction();

        const [result] = await conn.query<ResultSetHeader>(
            `
            INSERT INTO customers (
              name,
              email,
              status,
              created_at
            )
            VALUES (?, ?, ?, NOW())
            `,
            [
                input.name,
                input.email,
                input.status,
            ],
        );

        const newId = result.insertId;

        const [rows] = await conn.query<CustomerRow[]>(
            `
            SELECT
              id,
              name,
              email,
              status,
              created_at
            FROM customers
            WHERE id = ?
            `,
            [newId],
        );

        await conn.commit();

        return rows[0];
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}

