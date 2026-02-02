import type { Metadata } from 'next';
import '@styles/theme/tokens.scss';
import '@styles/theme/globals.scss';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const DEV_BYPASS_AUTH = process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true';

import MainLayout from '@components/layout/main/MainLayout';
import { getMeSSR } from '@/api/auth';

export const metadata: Metadata = {
    title: 'IPCC React',
    description: 'IPCC dashboard powered by Next.js',
};


export default async function RootLayout({ children }: { children: React.ReactNode }) {

    const cookieHeader = (await cookies())
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join('; ');

    let me;

    try {
        if (DEV_BYPASS_AUTH) {
            // 도메인/HTTPS 세팅 전 임시: 로그인된 것처럼 동작
            me = {
                id: 'temp-user',
                username: '개발용임시계정',
                preferences: {
                    darkMode: true,
                },
            };
        } else {
            // TODO: 도메인 발급시 이것만
            me = await getMeSSR(cookieHeader);
        }
    } catch {
        // 개발용 우회 모드에서는 리다이렉트 하지 않음
        if (!DEV_BYPASS_AUTH) {
            redirect('/login');
        }
        // TODO : 도메인 발급시는 이것만
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