import type { Metadata } from 'next';
import '@styles/theme/tokens.scss';
import '@styles/theme/globals.scss';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import MainLayout from '@components/layout/main/MainLayout';
import { getMeSSR } from '@/api/auth'

export const metadata: Metadata = {
    title: 'IPCC React',
    description: 'IPCC dashboard powered by Next.js',
};


export default async function RootLayout({ children }: { children: React.ReactNode }) {
    // 1. [임시 주석] 쿠키 파싱 부분 주석 처리 (에러 방지)
    /*
    const cookieHeader = (await cookies())
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join('; ');
    */

    let me;

    try {
        // 2. [임시 주석] 실제 서버 통신 막기
        // me = await getMeSSR(cookieHeader);

        // 3. [임시 추가] 강제로 로그인된 척 가짜 데이터 넣기
        // (preferences.darkMode를 읽어야 하므로 최소한의 구조는 맞춰줍니다)
        me = {
            id: 'temp-user',
            username: '개발용임시계정',
            preferences: {
                darkMode: true // 테스트하고 싶은 테마(true: 다크, false: 라이트)로 변경 가능
            }
        };

    } catch {
        // 4. [임시 주석] 로그인 실패 시 리다이렉트 막기
        // redirect('/login');

        // 혹시 모를 에러 대비
        me = { preferences: { darkMode: false } };
    }

    const isDark = Boolean(me?.preferences?.darkMode);

    return (
        <html lang="ko" className={isDark ? 'dark' : ''}>
        <body>
        <MainLayout>{children}</MainLayout>
        </body>
        </html>
    );
}