import api, { createServerApi } from '@utils/axios';

export type WorkMode = 'NORMAL' | 'INTERACTIVE' | 'MYSTERY' | 'VISUAL';
export type WorkStatus = 'DRAFT' | 'PUBLISHED' | 'PRIVATE' | 'DELETED';

export type WorkCreateRequest = {
    companyId: number;
    authorUserId: number;
    title: string;
    description?: string;
    tags?: string[];
    mode: WorkMode;
    aiImageEnabled: boolean;
};

export type WorkCreateResponse = {
    id: number;
    companyId: number;
    authorUserId: number;
    title: string;
    description?: string | null;
    mode: WorkMode;
    aiImageEnabled: boolean;
    status: 'DRAFT' | 'PUBLISHED' | 'PRIVATE' | 'DELETED';
    thumbnailUrl?: string | null;
};

export type WorkSummary = {
    id: number;
    title: string;
    mode: WorkMode;
    status: WorkStatus;
    thumbnailUrl?: string | null;
    updatedAt?: string | null;
    createdAt?: string | null;
};

/**
 * 1. 새 작품 생성
 */
export async function createWork(payload: WorkCreateRequest): Promise<WorkCreateResponse> {
    const res = await api.post<WorkCreateResponse>('/api/works', payload);
    return res.data;
}

/**
 * 2. 단일 작품 상세 조회 (CSR)
 */
export async function getWork(workId: string | number): Promise<WorkCreateResponse> {
    const res = await api.get<WorkCreateResponse>(`/api/works/${workId}`);
    return res.data;
}

/**
 * 3. 단일 작품 상세 조회 (SSR)
 */
export async function getWorkSSR(workId: string | number, cookieHeader: string): Promise<WorkCreateResponse> {
    const serverApi = createServerApi(cookieHeader);
    const { data } = await serverApi.get<WorkCreateResponse>(`/api/works/${workId}`);
    return data;
}

/**
 * 4. 작품 썸네일 업로드
 */
export async function uploadWorkThumbnail(workId: number, file: File): Promise<string> {
    const fd = new FormData();
    fd.append('file', file);

    const res = await api.post<string>(`/api/works/${workId}/thumbnail`, fd, {
        headers: { },
    });

    return res.data;
}

/**
 * 5. 내 작품 목록 조회
 */
export async function listMyWorks(): Promise<WorkSummary[]> {
    // 백엔드: GET /api/works/my
    const res = await api.get<WorkSummary[]>('/api/works/my');
    return res.data;
}