'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // 1. 공용 페이지(로그인/회원가입)는 검사 없이 통과
        const publicPaths = ['/login', '/register'];
        if (publicPaths.includes(pathname)) {
            setIsAuthorized(true);
            return;
        }

        // 2. 토큰 확인
        const token = localStorage.getItem('accessToken');

        if (!token) {
            // 토큰이 없으면 -> 권한 없음(false) 유지하고 -> 로그인으로 강제 이동
            setIsAuthorized(false);
            router.replace('/login');
        } else {
            // 토큰이 있으면 -> 권한 부여(true) -> 화면 렌더링 시작
            setIsAuthorized(true);

            // 3. 다크모드 등 설정 복구
            const theme = localStorage.getItem('theme');
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [pathname, router]);

    if (!isAuthorized) {
        return null;
        // TODO : <div className="loading">로딩중...</div> 구현 필요
    }

    return <>{children}</>;
}