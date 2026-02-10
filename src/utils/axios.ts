import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface CustomRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

function attachRefreshInterceptor(instance: AxiosInstance, isServer: boolean, cookieHeader?: string) {

    // 응답 인터셉터
    instance.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as CustomRequestConfig;

            // [조건] 401(인증 만료) 또는 403(권한 없음) && 아직 재시도 안 함
            if (
                (error.response?.status === 401 || error.response?.status === 403) &&
                originalRequest &&
                !originalRequest._retry
            ) {
                originalRequest._retry = true; // 무한 루프 방지
                console.log(`[${isServer ? 'SSR' : 'CSR'}] Token expired. Attempting refresh...`);

                try {
                    // 1. 토큰 갱신 요청
                    const refreshResponse = await axios.post(
                        `${BASE_URL}/api/auth/refresh`,
                        {},
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                // SSR일 경우 쿠키 헤더를 직접 실어줘야 함
                                ...(isServer && cookieHeader ? { Cookie: cookieHeader } : {}),
                            },
                            withCredentials: true, // CSR일 경우 브라우저 쿠키 자동 포함
                        }
                    );

                    // 2. 새 토큰 추출 (백엔드 응답 구조에 따름)
                    const newAccessToken = refreshResponse.data.message || refreshResponse.data.accessToken;

                    if (!newAccessToken) {
                        throw new Error('Refresh succeeded but no access token returned.');
                    }

                    // 3. 재요청 헤더 설정 (Bearer 토큰 주입)
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    console.log(`[${isServer ? 'SSR' : 'CSR'}] Retry with new token success.`);

                    // 4. 원래 요청 재시도
                    return instance(originalRequest);

                } catch (refreshError) {
                    console.error(`[${isServer ? 'SSR' : 'CSR'}] Refresh failed. Logout.`);

                    // 클라이언트(브라우저) 환경이라면 로그인 페이지로 이동
                    if (!isServer && typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }

                    // SSR 환경 > Page/Layout이 처리하게 함
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );
}

// ----------------------------------------------------------------------
// 클라이언트용(CSR) 인스턴스
// ----------------------------------------------------------------------
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

// 클라이언트용 인터셉터 부착
attachRefreshInterceptor(api, false);

export default api;

// ----------------------------------------------------------------------
// 서버용(SSR) 인스턴스
// ----------------------------------------------------------------------
export function createServerApi(cookieHeader?: string): AxiosInstance {
    const serverInstance = axios.create({
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
        timeout: 10000,
    });

    // 서버용 인터셉터 부착 (쿠키 헤더 전달)
    attachRefreshInterceptor(serverInstance, true, cookieHeader);

    return serverInstance;
}