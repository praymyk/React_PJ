import {
    getCategoryKinds,
    getCategoriesByCompany,
} from '@lib/db/reactpj/category';
import type {
    CategoryKind,
    CategoryLevel,
    CategoryNode,
    CategoryKindOption,
} from '@components/palace/test/category/DefaultContent';

type CategoryPageParams = {
    companyId: string;  // 현재는 required로 강제
};

export type CategoryPageData = {
    companyId: number;
    kindOptions: CategoryKindOption[];
    initialNodes: CategoryNode[];
    initialSelectedKind: CategoryKind;
};

export async function getCategoryPageData(
    params: CategoryPageParams,
): Promise<CategoryPageData> {
    const companyId = Number(params.companyId);

    const [kindRows, categoryRows] = await Promise.all([
        getCategoryKinds(),
        getCategoriesByCompany(companyId),
    ]);

    const kindOptions: CategoryKindOption[] = kindRows.map((row) => ({
        value: row.code as CategoryKind,
        label: row.name,
    }));

    const initialNodes: CategoryNode[] = categoryRows.map((row) => ({
        id: row.id,          // clientId = dbId ( 조회 시 동일 )
        dbId: row.id,        // DB PK
        kind: (kindRows.find((k) => k.id === row.kind_id)?.code ?? 'consult') as CategoryKind,
        level: row.level as CategoryLevel,
        name: row.name,
        parentId: row.parent_id,  // 부모 clientId = 부모 dbId (초기 로드는 동일)
        sortOrder: row.sort_order,
        active: row.is_active === 1,
    }));

    const initialSelectedKind: CategoryKind =
        kindOptions[0]?.value ?? 'consult';

    return {
        companyId,
        kindOptions,
        initialNodes,
        initialSelectedKind,
    };
}