import axios from 'axios';

// 1. Axios 인스턴스 생성
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // .env에서 주소 가져옴
    withCredentials: true, // 전역 설정으로 추가 (모든 요청에 쿠키 포함)
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10초 대기 후 응답 없으면 에러 처리
});

// 2. 요청 인터셉터 > 토큰 헤더 탑제
api.interceptors.request.use((config) => {
    if (typeof window === 'undefined') return config;

    // 1. 로컬 스토리지에서 토큰 꺼내기
    const token = localStorage.getItem('accessToken');

    // 2. 토큰이 '존재할 때만' 헤더에 추가
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    // 3. 토큰이 없으면(로그인 시도 중이면) 그냥 원본 config 그대로 리턴 -> 헤더 없이 날아감
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

export default api;