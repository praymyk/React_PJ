import type { Metadata } from 'next';
import '@styles/theme/tokens.scss';
import '@styles/theme/globals.scss';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import MainLayout from '@components/layout/main/MainLayout';

export const metadata: Metadata = {
    title: 'IPCC React',
    description: 'IPCC dashboard powered by Next.js',
};


export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {

    const cookieHeader = (await cookies())
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join('; ');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: { Cookie: cookieHeader },
        cache: 'no-store',
    });

    if (!res.ok) redirect('/login');

    return (
        <html lang="ko">
        <body>
        <MainLayout>{children}</MainLayout>
        </body>
        </html>
    );
}