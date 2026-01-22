const BASE_URL = process.env.NEXT_PUBLIC_API_URL
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    // 1. 로컬 스토리지에서 토큰 꺼내기
    let token = null;
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('accessToken');
    }

    // 2. 헤더 설정 (기존 헤더 + 토큰)
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}), // ★ 토큰 있으면 자동 추가
    };

    // 3. 실제 요청 보내기
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // 4. 토큰이 만료되어 401 에러가 나면 로그인 페이지 이동
    if (response.status === 401) {
        if (typeof window !== 'undefined') {
            alert("로그인이 만료되었습니다.");
            localStorage.removeItem('accessToken'); // 썩은 토큰 삭제
            window.location.href = '/login';
        }
    }

    return response;
}