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
 * 클라이언트에 저장된 인증 관련 상태를 정리한다.
 */
export function clearClientAuthState(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('theme');
    sessionStorage.clear();
}

/**
 * 로그아웃 API를 호출하고 클라이언트 인증 상태를 정리한다.
 */
export async function logout(): Promise<void> {
    try {
        await api.post('/api/auth/logout');
    } finally {
        clearClientAuthState();
    }
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
