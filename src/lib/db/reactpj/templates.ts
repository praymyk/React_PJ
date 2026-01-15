import 'server-only';
import type { RowDataPacket } from 'mysql2/promise';
import { reactpjPool } from '@/lib/db/reactpj/pool';

export type TemplateKind = 'case_note' | 'inquiry_reply' | 'sms_reply';

export type ResponseTemplateRow = RowDataPacket & {
    id: number;
    company_id: number;
    kind: TemplateKind;
    title: string;
    prompt: string | null;
    content: string;
    created_by: number | null;
    created_at: Date;
    updated_at: Date;
};

export type TemplateSortKey = 'id' | 'title' | 'created_at' | 'updated_at';
export type SortDirection = 'asc' | 'desc';

export type TemplateSearchParams = {
    companyId: number;
    kind: TemplateKind;
    keyword?: string;
    sortBy?: TemplateSortKey;
    sortDir?: SortDirection;
};

export type PagedResult<T> = {
    rows: T[];
    total: number;
    page: number;
    pageSize: number;
};

type CountRow = RowDataPacket & { total: number };

export async function getResponseTemplatesPaged(
    params: { page: number; pageSize: number } & TemplateSearchParams,
): Promise<PagedResult<ResponseTemplateRow>> {
    const { page, pageSize, companyId, kind, keyword, sortBy, sortDir } = params;

    const safePage = page > 0 ? page : 1;
    const safePageSize = pageSize > 0 ? pageSize : 20;
    const offset = (safePage - 1) * safePageSize;

    const where: string[] = [];
    const q: Array<string | number> = [];

    where.push('company_id = ?');
    q.push(companyId);

    where.push('kind = ?');
    q.push(kind);

    if (keyword && keyword.trim() !== '') {
        where.push('(title LIKE ?)');
        q.push(`%${keyword.trim()}%`);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const sortKeyMap: Record<TemplateSortKey, string> = {
        id: 'id',
        title: 'title',
        created_at: 'created_at',
        updated_at: 'updated_at',
    };

    const orderBy =
        sortBy && sortKeyMap[sortBy]
            ? `ORDER BY ${sortKeyMap[sortBy]} ${sortDir === 'asc' ? 'ASC' : 'DESC'}`
            : `ORDER BY created_at DESC`;

    // total
    const [countRows] = await reactpjPool.query<CountRow[]>(
        `
    SELECT COUNT(*) AS total
    FROM response_templates
    ${whereSql}
    `,
        q,
    );
    const total = countRows[0]?.total ?? 0;

    // rows
    const [rows] = await reactpjPool.query<ResponseTemplateRow[]>(
        `
    SELECT
      id,
      company_id,
      kind,
      title,
      prompt,
      content,
      created_by,
      created_at,
      updated_at
    FROM response_templates
    ${whereSql}
    ${orderBy}
    LIMIT ? OFFSET ?
    `,
        [...q, safePageSize, offset],
    );

    return {
        rows,
        total,
        page: safePage,
        pageSize: safePageSize,
    };
}