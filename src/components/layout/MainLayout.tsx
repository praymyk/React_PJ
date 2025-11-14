'use client';

import React from 'react';
import { useEffect, useRef, useState } from 'react';
import Header from '@components/layout/Header';
import footerStyles from '@styles/layout/Footer.module.scss';
import headerStyles from '@styles/layout/Header.module.scss';

import { LayoutSpaceContext } from '@/contexts/layoutSpace.context';
import { LayoutSidebarProvider } from '@/contexts/layoutSidebar.context';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const headerRef = useRef<HTMLElement>(null);
    const footerRef = useRef<HTMLElement>(null);
    const [layoutSpace, setLayoutSpace] = useState({ top: 0, bottom: 0 });

    /*** 메뉴+사이드바 스크롤 고정을 위한 헤더 공간 계산 ***/
    useEffect(() => {
        const updateSpace = () => {
            const headerHeight = headerRef.current?.offsetHeight ?? 0;
            const footerHeight = footerRef.current?.offsetHeight ?? 0;
            setLayoutSpace({ top: headerHeight, bottom: footerHeight });
        };

        const observer = new ResizeObserver(updateSpace);
        if (headerRef.current) observer.observe(headerRef.current);
        if (footerRef.current) observer.observe(footerRef.current);

        updateSpace();

        return () => observer.disconnect();
    }, []);

    return (
        <LayoutSpaceContext.Provider value={layoutSpace}>
            <LayoutSidebarProvider>
                <header ref={headerRef} className={headerStyles.header}>
                    <Header />
                </header>

                <main style={{
                        paddingTop: layoutSpace.top,
                        minHeight: `calc(100vh - ${layoutSpace.bottom}px)`,
                        display: 'flex'
                }}>
                    {children}
                </main>

                <footer ref={footerRef} className={footerStyles.footer}>
                    Footer
                </footer>
            </LayoutSidebarProvider>
        </LayoutSpaceContext.Provider>
    );
}