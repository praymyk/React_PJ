import type { Metadata } from 'next';
import '@styles/theme/tokens.scss';
import '@styles/theme/globals.scss';

export const metadata: Metadata = {
    title: 'IPCC React',
    description: 'IPCC dashboard powered by Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
            <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        </head>
        <body>
        {children}
        </body>
        </html>
    );
}