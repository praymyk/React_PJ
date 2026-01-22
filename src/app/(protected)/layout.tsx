import type { Metadata } from 'next';
import '@styles/theme/tokens.scss';
import '@styles/theme/globals.scss';

import MainLayout from '@components/layout/main/MainLayout';
import AuthGuard from "@components/auth/AuthGuard";

export const metadata: Metadata = {
    title: 'IPCC React',
    description: 'IPCC dashboard powered by Next.js',
};


export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {

    return (
        <html lang="ko">
        <body>
        {/*  AuthGuard로 토큰이 있는지 검사  */}
        <AuthGuard>
            <MainLayout>{children}</MainLayout>
        </AuthGuard>
        </body>
        </html>
    );
}