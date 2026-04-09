import api from '@utils/axios';

// --- [타입 정의] ---

export type EpisodeStatus = 'DRAFT' | 'PUBLISHED' | 'PRIVATE' | 'DELETED';
export type AnchorSource = 'AUTHOR' | 'SYSTEM' | 'USER';

// 리스트(좌측 패널)에 뿌려줄 요약 정보 DTO
export type EpisodeSummary = {
    id: string;
    workId: string;
    episodeNo: number;
    title: string;
    status: EpisodeStatus;
    createdAt?: string;
    updatedAt?: string;
};

// 이미지 앵커 정보
export type Anchor = {
    id: string;
    afterParagraphIndex: number;
    source: AnchorSource;
    caption?: string;
    spoilerLevel?: number;
};

// 에피소드 상세 정보 (편집기 중앙/우측 패널용)
export type EpisodeDetail = {
    id: string;
    workId: string;
    episodeNo: number;
    title: string;
    body: string;
    paragraphs: string[];
    anchors: Anchor[];
    status: EpisodeStatus;
    createdAt?: string;
    updatedAt?: string;
};


// --- [API 호출 ] ---
export async function listEpisodes(workId: string | number): Promise<EpisodeSummary[]> {
    const res = await api.get<EpisodeSummary[]>(`/api/works/${workId}/episodes`);
    return res.data;
}

/**
 * 2. 선택 에피소드 상세 조회
 */
export async function getEpisode(workId: string | number, episodeId: string | number): Promise<EpisodeDetail> {
    const res = await api.get<EpisodeDetail>(`/api/works/${workId}/episodes/${episodeId}`);
    return res.data;
}

/**
 * 3. 새 에피소드 생성
 */
export async function createEpisode(
    workId: string | number,
    payload: Partial<EpisodeDetail>
): Promise<EpisodeDetail> {
    const res = await api.post<EpisodeDetail>(`/api/works/${workId}/episodes`, payload);
    return res.data;
}

/**
 * 4. 에피소드 내용 저장(수정)
 */
export async function updateEpisode(
    workId: string | number,
    episodeId: string | number,
    payload: Partial<EpisodeDetail>
): Promise<EpisodeDetail> {
    const res = await api.put<EpisodeDetail>(`/api/works/${workId}/episodes/${episodeId}`, payload);
    return res.data;
}