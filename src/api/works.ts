import api from '@utils/axios';

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

export async function createWork(payload: WorkCreateRequest): Promise<WorkCreateResponse> {
    const res = await api.post<WorkCreateResponse>('/api/works', payload);
    return res.data;
}


export async function uploadWorkThumbnail(workId: number, file: File): Promise<string> {
    const fd = new FormData();
    fd.append('file', file);

    const res = await api.post<string>(`/api/works/${workId}/thumbnail`, fd, {
        headers: { },
    });

    return res.data;
}

export async function listMyWorks(authorUserId: number): Promise<WorkSummary[]> {
    // 백엔드 엔드포인트: GET /api/works?authorUserId=123
    const res = await api.get<WorkSummary[]>('/api/works', {
        params: { authorUserId },
    });
    return res.data;
}