import api, { createServerApi } from '@utils/axios';
import type { MeResponse } from '@/types/user';

export type LoginRequest = {
    username: string;
    password: string;
};

export type LoginResponse = {
    accessToken: string;
    profile: MeResponse;
};

/**
 * CSR 로그인
 */
export async function login(req: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/api/auth/login', req);
    return data;
}

/**
 * CSR: 현재 사용자 조회
 */
export async function getMe(): Promise<MeResponse> {
    const { data } = await api.get<MeResponse>('/api/auth/me');
    return data;
}

/**
 * SSR: 현재 사용자 조회
 */
export async function getMeSSR(cookieHeader: string): Promise<MeResponse> {
    const serverApi = createServerApi(cookieHeader);
    const { data } = await serverApi.get<MeResponse>('/api/auth/me');
    return data;
}

export async function getCompanyIdSSR(cookieHeader: string): Promise<number> {
    const me = await getMeSSR(cookieHeader);
    return me.user.companyId;
}