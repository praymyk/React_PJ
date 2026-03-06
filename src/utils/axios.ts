import axios, {
    AxiosInstance,
    AxiosError,
    InternalAxiosRequestConfig,
    AxiosResponse,
} from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface CustomRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// -----------------------------
// 백 공통 응답 타입(프론트용)
// -----------------------------
type ApiError = { code?: string; message?: string };
type ApiResponse<T> = { ok: boolean; data: T; error?: ApiError };

function isApiResponse(x: any): x is ApiResponse<any> {
    return x && typeof x === 'object' && typeof x.ok === 'boolean' && 'data' in x;
}

function isLikelyJsonResponse(response: AxiosResponse): boolean {
    const ct = String(response.headers?.['content-type'] ?? '').toLowerCase();
    return ct.includes('application/json') || ct.includes('+json');
}

// -----------------------------
// access token storage (CSR)
// -----------------------------
const ACCESS_TOKEN_KEY = 'accessToken';

function getAccessTokenCSR(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

function setAccessTokenCSR(token: string) {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
}

function clearAccessTokenCSR() {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
}

// -----------------------------
// refresh 전용 클라이언트(인터셉터 없음)
// -----------------------------
const refreshClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // refreshToken 쿠키 전송
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

async function requestRefreshToken(isServer: boolean, cookieHeader?: string): Promise<string> {
    const { data: body } = await refreshClient.post<ApiResponse<{ accessToken: string }>>(
        '/api/auth/refresh',
        {},
        {
            headers: {
                ...(isServer && cookieHeader ? { Cookie: cookieHeader } : {}),
            },
        }
    );

    if (!isApiResponse(body)) throw new Error('Invalid refresh response shape');
    if (!body.ok) throw new Error(body.error?.message || 'Refresh failed');

    const token = body.data?.accessToken;
    if (!token) throw new Error('Refresh succeeded but no access token returned.');
    return token;
}

function shouldSkipRefresh(url?: string): boolean {
    if (!url) return false;
    return (
        url.includes('/api/auth/login') ||
        url.includes('/api/auth/refresh') ||
        url.includes('/api/auth/logout')
    );
}

// -----------------------------
// 인터셉터 부착
// -----------------------------
function attachInterceptors(instance: AxiosInstance, isServer: boolean, cookieHeader?: string) {

    // 0) 요청: CSR에서는 accessToken을 Bearer로 주입
    instance.interceptors.request.use((config) => {
        const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;
        if (token) {
            config.headers = config.headers ?? {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        //FormData면 Content-Type 제거
        if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
            if (config.headers) {
                delete (config.headers as any)['Content-Type'];
                delete (config.headers as any)['content-type'];
            }
        }

        return config;
    });

    instance.interceptors.response.use(
        // 1) 성공 응답: ApiResponse면 언랩 + ok=false면 throw
        (response: AxiosResponse) => {
            if (!isLikelyJsonResponse(response)) return response;

            const body = response.data;

            if (isApiResponse(body)) {
                if (!body.ok) {
                    const err = new Error(body.error?.message || 'Unknown API Error');
                    (err as any).code = body.error?.code;
                    throw err;
                }
                response.data = body.data;
            }

            return response;
        },

        // 2) 실패 응답: (A) ApiResponse.fail 언랩 → (B) 401/403이면 refresh 후 재시도
        async (axiosError: AxiosError) => {
            const originalRequest = axiosError.config as CustomRequestConfig | undefined;
            if (!originalRequest) return Promise.reject(axiosError);

            const status = axiosError.response?.status;

            // ApiResponse.fail > 메시지 추출
            const errBody: any = axiosError.response?.data;
            const apiFailMessage =
                isApiResponse(errBody) && !errBody.ok
                    ? (errBody.error?.message || 'Unknown API Error')
                    : null;
            const apiFailCode =
                isApiResponse(errBody) && !errBody.ok
                    ? errBody.error?.code
                    : undefined;

            // 401/403이면 refresh 시도 (auth endpoint 제외)
            if ((status === 401 || status === 403) && !originalRequest._retry && !shouldSkipRefresh(originalRequest.url)) {
                originalRequest._retry = true;
                try {
                    const newAccessToken = await requestRefreshToken(isServer, cookieHeader);
                    if (!isServer) setAccessTokenCSR(newAccessToken);

                    originalRequest.headers = originalRequest.headers ?? {};
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    return instance(originalRequest);
                } catch (refreshError) {
                    if (!isServer && typeof window !== 'undefined') {
                        clearAccessTokenCSR();
                        window.location.href = '/login';
                    }
                    return Promise.reject(refreshError);
                }
            }

            // refresh 대상이 아니면, ApiResponse.fail 메시지로 reject
            if (apiFailMessage) {
                const e = new Error(apiFailMessage);
                (e as any).code = apiFailCode;
                return Promise.reject(e);
            }

            return Promise.reject(axiosError);
        }
    );
}

// -----------------------------
// CSR 인스턴스
// -----------------------------
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

attachInterceptors(api, false);

export default api;

// -----------------------------
// SSR 인스턴스
// -----------------------------
export function createServerApi(cookieHeader?: string): AxiosInstance {
    const serverInstance = axios.create({
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
        timeout: 10000,
    });

    attachInterceptors(serverInstance, true, cookieHeader);
    return serverInstance;
}