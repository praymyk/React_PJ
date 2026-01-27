import axios, {AxiosInstance, InternalAxiosRequestConfig} from 'axios';

// 1. Axios 인스턴스 생성
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // .env에서 주소 가져옴
    withCredentials: true, // 전역 설정으로 추가 (모든 요청에 쿠키 포함)
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10초 대기 후 응답 없으면 에러 처리
});

// 로깅 on/off ( TODO : 운영에선 0 필수 )
const HTTP_LOG = process.env.NEXT_PUBLIC_HTTP_LOG === '1';

function fullUrl(config: InternalAxiosRequestConfig) {
    const base = config.baseURL ?? '';
    const url = config.url ?? '';
    return `${base}${url}`;
}

function safeParams(params: any) {
    try {
        if (!params) return undefined;
        if (typeof params === 'string') return params;
        if (params instanceof URLSearchParams) return params.toString();
        return params;
    } catch {
        return '[unserializable params]';
    }
}

// 2. 요청 인터셉터 ( 로깅 용도 )
api.interceptors.request.use((config) => {
    if (!HTTP_LOG) return config;

    // 소요시간 측정용
    (config as any).meta = { startAt: Date.now() };

    const isServer = typeof window === 'undefined';
    const url = fullUrl(config);

    console.log('[HTTP REQ]', {
        env: isServer ? 'SSR' : 'CSR',
        method: (config.method ?? 'GET').toUpperCase(),
        url,
        params: safeParams(config.params),
        data: config.data,
    });

    return config;
});

// 3. 응답 인터셉터 (401 에러 감지 및 처리)
api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {

                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// SSR(서버)에서 쓸 인스턴스 팩토리
export function createServerApi(cookieHeader?: string): AxiosInstance {
    return axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
            'Content-Type': 'application/json',
            ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
        timeout: 10000,
    });
}

export default api;