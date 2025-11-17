'use client';

import { useEffect, useState } from 'react';
import { useSidebar } from '@/contexts/sidebar.context';
import styles from '@/styles/components/sidebar/Sidebar.module.scss';
import { SidebarItem } from '@/data/sidebarItems';
import { useLayoutSpace} from "@/contexts/layoutSpace.context";

/*** 사이드바 바로가기 아이콘 ***/
    export default function Sidebar({ items }: { items: SidebarItem[] }) {
    const [isMobile, setIsMobile] = useState(false);
    const { setSelectedPage } = useSidebar();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <aside className={styles.sidebarContainer} style={{ position: 'sticky' }}>
            {items.map((item, index) => (
                <div key={index} className={styles.ribbonWrapper}>
                    <a
                        href="#"
                        className={styles.ribbonItem}
                        onClick={(e) => {
                            e.preventDefault();
                            setSelectedPage(item);
                        }}
                    >
                        <item.icon className={styles.ribbonIcon} />
                        <span className={styles.ribbonLabel}>{item.label}</span>
                    </a>
                </div>
            ))}
        </aside>
    );
}

/*** 사이드 바 패널 ***/
export function Panel() {
    const { selectedPage, setSelectedPage } = useSidebar();
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    const { top, bottom } = useLayoutSpace();

    // ESC 키 닫기
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedPage(null);
        };
        if (selectedPage) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [selectedPage]);

    useEffect(() => {
        if (selectedPage) {
            setShouldRender(true);

            // 패널이 마운트된 직후 애니메이션이 시작되도록 약간 지연
            setTimeout(() => setIsVisible(true), 20);
        } else if (shouldRender) {
            // 닫힐 때 : 먼저 애니메이션을 실행하고
            setIsVisible(false);

            // 애니메이션이 끝난 후 DOM 제거
            const timeout = setTimeout(() => setShouldRender(false), 300); // CSS 트랜지션 시간과 동일하게 맞춤
            return () => clearTimeout(timeout);
        }
    }, [selectedPage]);

    // 렌더 필요 없으면 패널 자체를 렌더하지 않음
    if (!selectedPage) return null;

    const Component = selectedPage.component;

    return (
        <div
            className={`${styles.rightPanel} ${!isVisible ? styles.rightPanelExit : ''}`}
            style={{
                '--top-offset': `${top}px`,
                '--bottom-offset': `${bottom}px`
            } as React.CSSProperties}
        >
            <Component />
            <button onClick={() => setSelectedPage(null)}>닫기</button>
        </div>
    );
}