import type { Metadata } from 'next';
import '@styles/theme/tokens.scss';
import '@styles/theme/globals.scss';

import MainLayout from '@components/layout/main/MainLayout';
import AuthGuard from '@components/auth/AuthGuard';

export const metadata: Metadata = {
    title: 'IPCC React',
    description: 'IPCC dashboard powered by Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    // 깜빡임 방지용 스크립트 html에 dark 적용
    const themeScript = `
        (function() {
            try {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            } catch (e) {}
        })();
    `;

    return (
        <html lang="ko" suppressHydrationWarning>
        <head>
            {/* 렌더링 차단을 방지하기 위해 가장 먼저 실행 */}
            <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        </head>
        <body>
        <AuthGuard>
            <MainLayout>{children}</MainLayout>
        </AuthGuard>
        </body>
        </html>
    );
}