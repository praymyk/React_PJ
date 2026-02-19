'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import PalaceLayout from '@components/layout/palace/PalaceLayout';
import api from '@utils/axios';

function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                await api.get('/api/auth/me');
                if (!mounted) return;
                setReady(true);
            } catch {
                router.replace(`/login?next=${encodeURIComponent(pathname)}`);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [router, pathname]);

    if (!ready) return null;
    return <>{children}</>;
}

export default function TestLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <PalaceLayout>{children}</PalaceLayout>
        </AuthGuard>
    );
}