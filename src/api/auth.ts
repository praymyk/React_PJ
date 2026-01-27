import api, { createServerApi } from '@utils/axios';
import type { LoginResponse, MeResponse } from '@/types/user';

export type LoginRequest = {
    username: string;
    password: string;
};

/**
 * CSR 로그인
 * - 서버 > Set-Cookie로 accessToken/refreshToken(HttpOnly) 심음
 * - 프론트 > response body로 user/preferences만 받음
 */
export async function login(req: LoginRequest): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>('/api/auth/login', req);
    return res.data;
}

/**
 * SSR에서 현재 사용자 조회
 * - RootLayout/layout.tsx에서 쿠키를 백엔드로 포워딩할 때 사용
 */
export async function getMeSSR(cookieHeader: string): Promise<MeResponse> {
    const serverApi = createServerApi(cookieHeader);
    const res = await serverApi.get<MeResponse>('/api/auth/me');
    return res.data;
}

export async function getCompanyIdSSR(cookieHeader: string): Promise<number> {
    const me = await getMeSSR(cookieHeader);
    return me.user.companyId;
}

/**
 *  TODO : CSR > me 조회 dyd
 * - withCredentials: true > 쿠키 자동 포함
 */
export async function getMe(): Promise<MeResponse> {
    const res = await api.get<MeResponse>('/api/auth/me');
    return res.data;
}

/**
 * TODO : refresh 엔드포인트 > 쿠키 포워딩해서 호출
 */
export async function refreshSSR(cookieHeader: string) {
    const serverApi = createServerApi(cookieHeader);
    const res = await serverApi.post('/api/auth/refresh');
    return res.data;
}