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
    const cookieHeader = (await cookies())
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join('; ');

    let me;
    try {
        me = await getMeSSR(cookieHeader);
    } catch {
        redirect('/login');
    }

    const isDark = Boolean(me.preferences?.darkMode);

    return (
        <html lang="ko" className={isDark ? 'dark' : ''}>
        <body>
        <MainLayout>{children}</MainLayout>
        </body>
        </html>
    );
}