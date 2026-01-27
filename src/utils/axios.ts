import axios, {AxiosInstance} from 'axios';

// 1. Axios 인스턴스 생성
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // .env에서 주소 가져옴
    withCredentials: true, // 전역 설정으로 추가 (모든 요청에 쿠키 포함)
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10초 대기 후 응답 없으면 에러 처리
});

// 2. 요청 인터셉터  ( TODO: 로깅 용도로 활용 가능 )
api.interceptors.request.use((config) => {
    if (typeof window === 'undefined') return config;
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