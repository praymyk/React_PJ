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

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
        <body>
        <MainLayout>{children}</MainLayout>
        </body>
        </html>
    );
}