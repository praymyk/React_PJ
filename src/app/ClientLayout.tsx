'use client';

import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import footerStyles from '@/styles/layout/Footer.module.scss';
import headerStyles from '@/styles/layout/Header.module.scss';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const headerRef = useRef<HTMLElement>(null);
    const footerRef = useRef<HTMLElement>(null);
    const [padding, setPadding] = useState({ top: 0, bottom: 0 });

    useEffect(() => {
        const updatePadding = () => {
            const headerHeight = headerRef.current?.offsetHeight ?? 0;
            const footerHeight = footerRef.current?.offsetHeight ?? 0;
            setPadding({ top: headerHeight, bottom: footerHeight });
        };

        const observer = new ResizeObserver(updatePadding);
        if (headerRef.current) observer.observe(headerRef.current);
        if (footerRef.current) observer.observe(footerRef.current);

        updatePadding();

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <header ref={headerRef} className={headerStyles.header}>
                <Header />
            </header>
            <main style={{ paddingTop: padding.top, paddingBottom: padding.bottom }}>
                {children}
            </main>
            <footer ref={footerRef} className={footerStyles.footer}>
                Footer
            </footer>
        </>
    );
}