'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getMe } from '@/api/auth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (pathname === '/login') {
            setReady(true);
            return;
        }

        console.log("사용자 인증");

        let mounted = true;

        const checkSession = async () => {
            try {
                const userData = await getMe();
                if (!mounted) return;

                const isDark = userData.preferences?.darkMode;
                if (isDark) {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('theme', 'light');
                }

                setReady(true);
            } catch (error) {
                if (!mounted) return;
                router.replace(`/login?next=${encodeURIComponent(pathname)}`);
            }
        };

        checkSession();

        return () => {
            mounted = false;
        };
    }, [router, pathname]);

    if (!ready) return null;

    return <>{children}</>;
}