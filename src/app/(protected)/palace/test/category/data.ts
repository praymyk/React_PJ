// src/api/category.ts
import { buildCookieHeader } from '@/utils/ssrCookie';
import { createServerApi } from '@utils/axios';

import { fetchCategoryPageData } from '@/api/category';

import type {
    CategoryPageApiResponse,
} from '@/types/category';

import type {
    CategoryKind,
    CategoryLevel,
    CategoryNode,
    CategoryKindOption,
} from '@components/palace/test/category/DefaultContent';

type CategoryPageParams = {
    companyId: string;
};

export type CategoryPageData = {
    companyId: number;
    kindOptions: CategoryKindOption[];
    initialNodes: CategoryNode[];
    initialSelectedKind: CategoryKind;
};

// ======================================================
// SSR 데이터 로더
// ======================================================

export async function getCategoryPageData(
    params: CategoryPageParams,
): Promise<CategoryPageData> {
    const companyId = Number(params.companyId);

    // 1. 쿠키 헤더 준비 (SSR 인증용)
    const cookieHeader = await buildCookieHeader();

    // 2. SSR용 클라이언트 생성
    const serverClient = createServerApi(cookieHeader);

    try {
        // 3. 공통 API 함수 호출 (client 주입)
        const apiData = await fetchCategoryPageData({ companyId }, serverClient);

        // 4. API 응답(DTO) -> UI용 데이터(initialNodes)로 변환
        return transformToPageData(apiData);

    } catch (error) {
        console.error('[SSR] 카테고리 조회 실패:', error);
        // 에러 시 빈 데이터 반환
        return {
            companyId,
            kindOptions: [],
            initialNodes: [],
            initialSelectedKind: 'consult',
        };
    }
}

// ======================================================
// 데이터 변환 헬퍼 (DTO -> UI Model)
// ======================================================

function transformToPageData(apiData: CategoryPageApiResponse): CategoryPageData {
    // 1) Kind 옵션 변환
    const kindOptions: CategoryKindOption[] = apiData.kinds.map((k) => ({
        value: k.code as CategoryKind,
        label: k.name,
    }));

    // 2) Nodes 변환
    const initialNodes: CategoryNode[] = apiData.categories.map((row) => {
        // kindId로 code 찾기
        const kindCode = apiData.kinds.find((k) => k.id === row.kindId)?.code ?? 'consult';

        return {
            id: row.id,          // clientId (조회 시엔 DB ID와 동일하게 설정)
            dbId: row.id,        // DB PK
            kind: kindCode as CategoryKind,
            level: row.level as CategoryLevel,
            name: row.name,
            parentId: row.parentId,
            sortOrder: row.sortOrder,
            active: row.isActive,
        };
    });

    const initialSelectedKind: CategoryKind = kindOptions[0]?.value ?? 'consult';

    return {
        companyId: apiData.companyId,
        kindOptions,
        initialNodes,
        initialSelectedKind,
    };
}