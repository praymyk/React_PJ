import type { RowDataPacket } from 'mysql2/promise';
import { reactpjPool } from './pool';

export type CategoryKindRow = RowDataPacket & {
    id: number;
    code: 'consult' | 'reserve' | 'etc' | string;
    name: string;
    description: string | null;
    is_active: 0 | 1;
    created_at: Date;
    updated_at: Date;
};

export type CategoryRow = RowDataPacket & {
    id: number;
    kind_id: number;
    company_id: number;
    parent_id: number | null;
    level: number;
    name: string;
    sort_order: number;
    is_active: 0 | 1;
    created_at: Date;
    updated_at: Date;
};

/** 활성화된 카테고리 종류 목록 */
export async function getCategoryKinds(): Promise<CategoryKindRow[]> {
    const [rows] = await reactpjPool.query<CategoryKindRow[]>(
        `
      SELECT
        id,
        code,
        name,
        description,
        is_active,
        created_at,
        updated_at
      FROM category_kind
      WHERE is_active = 1
      ORDER BY id ASC
    `,
    );
    return rows;
}

/** 특정 회사의 카테고리 트리 전체 조회 */
export async function getCategoriesByCompany(
    companyId: number,
): Promise<CategoryRow[]> {
    const [rows] = await reactpjPool.query<CategoryRow[]>(
        `
      SELECT
        id,
        kind_id,
        company_id,
        parent_id,
        level,
        name,
        sort_order,
        is_active,
        created_at,
        updated_at
      FROM category
      WHERE company_id = ?
      ORDER BY level ASC, parent_id ASC, sort_order ASC, id ASC
    `,
        [companyId],
    );
    return rows;
}