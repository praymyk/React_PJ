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

// ApiResponse 판별(최소 조건)
function isApiResponse(x: any): x is ApiResponse<any> {
    return (
        x &&
        typeof x === 'object' &&
        typeof x.ok === 'boolean' &&
        'data' in x
    );
}

// JSON 응답인지 판단(파일 다운로드/바이너리 응답 보호)
function isLikelyJsonResponse(response: AxiosResponse): boolean {
    const ct = String(response.headers?.['content-type'] ?? '').toLowerCase();
    // 보통 JSON이면 application/json 또는 +json
    return ct.includes('application/json') || ct.includes('+json');
}

// -----------------------------
// refresh 전용 클라이언트(인터셉터 없음)
// - 재귀/무한루프 방지용
// - export 하지 않음(내부 전용)
// -----------------------------
const refreshClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

// refresh 호출(SSR 쿠키 헤더 주입 가능)
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

    if (!isApiResponse(body)) {
        throw new Error('Invalid refresh response shape');
    }
    if (!body.ok) {
        throw new Error(body.error?.message || 'Refresh failed');
    }

    const token = body.data?.accessToken;
    if (!token) {
        throw new Error('Refresh succeeded but no access token returned.');
    }
    return token;
}

// -----------------------------
// 인터셉터 부착
// -----------------------------
function attachInterceptors(
    instance: AxiosInstance,
    isServer: boolean,
    cookieHeader?: string
) {
    instance.interceptors.response.use(
        // 1) 성공 응답: ApiResponse면 언랩 + ok=false면 throw
        (response: AxiosResponse) => {
            // JSON이 아닐 가능성이 있으면(파일 등) 언랩 시도 자체를 건너뜀
            if (!isLikelyJsonResponse(response)) return response;

            const body = response.data;

            if (isApiResponse(body)) {
                if (!body.ok) {
                    const err = new Error(body.error?.message || 'Unknown API Error');
                    (err as any).code = body.error?.code;
                    throw err;
                }
                // 언랩: 이후 호출부에서는 res.data가 곧 payload(T)
                response.data = body.data;
            }

            return response;
        },

        // 2) 실패 응답: 401/403 → refresh 후 재시도
        async (error: AxiosError) => {
            const originalRequest = error.config as CustomRequestConfig | undefined;

            if (!originalRequest) {
                return Promise.reject(error);
            }

            const status = error.response?.status;

            if ((status === 401 || status === 403) && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const newAccessToken = await requestRefreshToken(isServer, cookieHeader);

                    // 재요청에 Bearer 주입
                    originalRequest.headers = originalRequest.headers ?? {};
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    // 원래 요청 재시도(이 요청은 instance 인터셉터 적용됨)
                    return instance(originalRequest);
                } catch (refreshError) {
                    // refresh 실패 시: CSR은 로그인으로, SSR은 상위에서 처리
                    if (!isServer && typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
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