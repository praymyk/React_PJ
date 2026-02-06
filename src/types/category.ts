export type CategoryApiParams = {
    companyId: number;
};

export type CategoryKindResponse = {
    id: number;
    code: string;
    name: string;
};

export type CategoryResponse = {
    id: number;
    kindId: number;
    parentId: number | null;
    level: number;
    name: string;
    sortOrder: number;
    isActive: boolean;
};

export type CategoryPageApiResponse = {
    companyId: number;
    kinds: CategoryKindResponse[];
    categories: CategoryResponse[];
};

// 3. 트리 저장용 타입 (CSR에서 사용)
export type CategoryTreeSaveRequest = {
    companyId: number;
    kind: string;
    nodes: {
        id: number | null;
        clientId: number;
        parentClientId: number | null;
        level: number;
        name: string;
        sortOrder: number;
        active: boolean;
    }[];
};