import type { Metadata } from 'next';
import '@/styles/globals.scss';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
    title: 'IPCC React',
    description: 'IPCC dashboard powered by Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <body>
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}