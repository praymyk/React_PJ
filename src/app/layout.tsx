import type { Metadata } from 'next';
import '@/styles/theme/tokens.scss'; // 토큰 먼저
import '@/styles/globals.scss';      // 나머지 전역 스타일

import MainLayout from '@components/layout/MainLayout';

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