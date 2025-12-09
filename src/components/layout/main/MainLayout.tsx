// src/components/layout/main/MainLayout.tsx
'use client';

import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import Header from '@components/layout/header/Header';
import footerStyles from '@components/layout/footer/Footer.module.scss';
import headerStyles from '@components/layout/header/Header.module.scss';

import { LayoutSpaceContext } from '@/contexts/layoutSpace.context';
import { LayoutSidebarProvider } from '@/contexts/layoutSidebar.context';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const headerRef = useRef<HTMLElement>(null);
    const footerRef = useRef<HTMLElement>(null);
    const [layoutSpace, setLayoutSpace] = useState({ top: 0, bottom: 0 });

    /*** 메뉴+사이드바 스크롤 고정을 위한 헤더/푸터 공간 계산 ***/
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

                <main
                    style={
                        {
                            // CSS 커스텀 프로퍼티로 헤더/푸터 높이 전달
                            '--layout-header-height': `${layoutSpace.top}px`,
                            '--layout-footer-height': `${layoutSpace.bottom}px`,
                        } as CSSProperties
                    }
                >
                    {children}
                </main>

                <footer ref={footerRef} className={footerStyles.footer}>
                    Footer
                </footer>
            </LayoutSidebarProvider>
        </LayoutSpaceContext.Provider>
    );
}