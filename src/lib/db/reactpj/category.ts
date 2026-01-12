import type {ResultSetHeader, RowDataPacket} from 'mysql2/promise';
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

export type CategoryTreeSaveNode = {
    id: number | null;             // DB PK (신규면 null)
    clientId: number;              // 프론트 전용 ID (표기용)
    parentClientId: number | null; // 부모 clientId
    level: number;
    name: string;
    sortOrder: number;
    active: boolean;
};

export type CategoryKindCode = 'consult' | 'reserve' | 'etc' | string;

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
        AND is_active = 1
      ORDER BY level ASC, parent_id ASC, sort_order ASC, id ASC
    `,
        [companyId],
    );
    return rows;
}

/** 선택 업체 카테고리 트리 전체 반영 */
export async function replaceCategoryTreeForKind(params: {
    companyId: number;
    kind: CategoryKindCode;
    nodes: CategoryTreeSaveNode[];
}): Promise<void> {

    const { companyId, kind, nodes } = params;

    const conn = await reactpjPool.getConnection();
    try {
        await conn.beginTransaction();

        // 1) kind_id 조회
        const [kindRows] = await conn.query<RowDataPacket[]>(
            `SELECT id FROM category_kind WHERE code = ?`,
            [kind],
        );
        if (kindRows.length === 0) {
            throw new Error(`Unknown category kind code: ${kind}`);
        }
        const kindId = kindRows[0].id as number;

        // 2) 기존 카테고리 로드 (해당 company + kind)
        const [existingRows] = await conn.query<RowDataPacket[]>(
            `
      SELECT
        id,
        parent_id,
        level,
        name,
        sort_order,
        is_active
      FROM category
      WHERE company_id = ? AND kind_id = ?
      ORDER BY level ASC, parent_id ASC, sort_order ASC, id ASC
      `,
            [companyId, kindId],
        );

        const existingById = new Map<number, RowDataPacket>();
        for (const row of existingRows) {
            existingById.set(row.id as number, row);
        }

        // 3) payload에 포함된 기존 PK 집합
        const payloadExistingIds = new Set<number>();
        for (const n of nodes) {
            if (n.id != null) {
                payloadExistingIds.add(n.id);
            }
        }

        // 4) 삭제 대상: DB에는 있는데 payload에는 없는 PK
        const deleteIds: number[] = [];
        for (const [id] of existingById) {
            if (!payloadExistingIds.has(id)) {
                deleteIds.push(id);
            }
        }

        // 5) clientId → dbPk 매핑 테이블
        const clientToDbId = new Map<number, number>();

        // 5-1) 기존 노드 먼저 채워 넣기 (id === clientId로 가정)
        for (const n of nodes) {
            if (n.id != null) {
                clientToDbId.set(n.clientId, n.id);
            }
        }

        // 6) 신규 노드만 모으기
        const newNodes = nodes.filter((n) => n.id == null);

        // 7) 신규 노드 INSERT (부모가 이미 등록된 것부터 순차적으로)
        const insertedClientIds = new Set<number>();
        let safety = 0;

        while (insertedClientIds.size < newNodes.length) {
            if (safety++ > 20) {
                throw new Error(
                    'Unable to resolve new category tree parents (cyclic or invalid tree?)',
                );
            }

            let progress = false;

            for (const node of newNodes) {
                if (insertedClientIds.has(node.clientId)) continue;

                const parentClientId = node.parentClientId;
                let parentDbId: number | null = null;

                if (parentClientId != null) {
                    parentDbId = clientToDbId.get(parentClientId) ?? null;
                    // 부모가 아직 INSERT 안된 경우 > 다음 라운드에서 다시 시도
                    if (parentDbId == null) continue;
                }

                // soft-delete 된 동일한 카테고리가 있는지 확인
                const [reviveRows] = await conn.query<RowDataPacket[]>(
                    `
                        SELECT id
                        FROM category
                        WHERE company_id = ?
                          AND kind_id = ?
                          AND parent_id <=> ?
              AND name = ?
              AND is_active = 0
            LIMIT 1
                    `,
                    [companyId, kindId, parentDbId, node.name],
                );

                if (reviveRows.length > 0) {
                    const reviveId = reviveRows[0].id as number;

                    await conn.query(
                        `
                UPDATE category
                SET
                  parent_id  = ?,
                  level      = ?,
                  sort_order = ?,
                  is_active  = ?
                WHERE id = ?
                  AND company_id = ?
                  AND kind_id = ?
                `,
                        [
                            parentDbId,
                            node.level,
                            node.sortOrder,
                            node.active ? 1 : 0,
                            reviveId,
                            companyId,
                            kindId,
                        ],
                    );

                    // 이후 parent 계산에 쓸 수 있도록 매핑
                    clientToDbId.set(node.clientId, reviveId);
                    insertedClientIds.add(node.clientId);

                    // reviveId가 deleteIds 안에 들어있다면 제거
                    const idx = deleteIds.indexOf(reviveId);
                    if (idx >= 0) {
                        deleteIds.splice(idx, 1);
                    }

                    progress = true;
                    continue;
                }

                // soft-delete 대상이 없으면 새로 INSERT
                const [result] = await conn.query<ResultSetHeader>(
                    `
              INSERT INTO category (
                kind_id,
                company_id,
                parent_id,
                level,
                name,
                sort_order,
                is_active
              )
              VALUES (?, ?, ?, ?, ?, ?, ?)
              `,
                    [
                        kindId,
                        companyId,
                        parentDbId,
                        node.level,
                        node.name,
                        node.sortOrder,
                        node.active ? 1 : 0,
                    ],
                );

                const newId = result.insertId;
                clientToDbId.set(node.clientId, newId);
                insertedClientIds.add(node.clientId);
                progress = true;
            }

            if (!progress) {
                break;
            }
        }

        if (insertedClientIds.size < newNodes.length) {
            throw new Error(
                'Some new nodes could not be inserted (parentClientId mismatch?)',
            );
        }

        // 8) 기존 노드 UPDATE (parent 포함)
        for (const node of nodes) {
            if (node.id == null) continue; // 신규는 이미 INSERT하면서 값 세팅

            const parentClientId = node.parentClientId;
            let parentDbId: number | null = null;

            if (parentClientId != null) {
                parentDbId = clientToDbId.get(parentClientId) ?? null;

                if (parentDbId == null) {
                    throw new Error(
                        `Parent not resolved for existing node clientId=${node.clientId} parentClientId=${parentClientId}`,
                    );
                }
            }

            await conn.query(
                `
                    UPDATE category
                    SET
                      parent_id  = ?,
                      level      = ?,
                      name       = ?,
                      sort_order = ?,
                      is_active  = ?
                    WHERE id = ? AND company_id = ? AND kind_id = ?
                    `,
                [
                    parentDbId,
                    node.level,
                    node.name,
                    node.sortOrder,
                    node.active ? 1 : 0,
                    node.id,
                    companyId,
                    kindId,
                ],
            );
        }

        // 9) 삭제 > is_active = 0 ( 소프트 삭제 )
        if (deleteIds.length > 0) {
            await conn.query(
                `
                    UPDATE category
                    SET is_active = 0
                    WHERE company_id = ?
                      AND kind_id = ?
                      AND id IN ( ${deleteIds.map(() => '?').join(',')} )
                `,
                [companyId, kindId, ...deleteIds],
            );
        }

        await conn.commit();
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}