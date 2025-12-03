'use client';

import { useEffect, useState } from 'react';
import { useSidebar } from '@/contexts/sidebar.context';
import styles from '@components/sidebar/DefaultContent.module.scss';
import { SidebarItem } from '@/data/sidebarItems';
import { useLayoutSpace } from '@/contexts/layoutSpace.context';

/*** 사이드바 바로가기 아이콘 ***/
interface SidebarProps {
    items: SidebarItem[];
}

export default function DefaultContent({ items }: SidebarProps) {
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

export function SidebarPanelTabs({ items }: SidebarProps) {
    const { selectedPage, setSelectedPage } = useSidebar();

    const handleClick = (item: SidebarItem) => {
        // 이미 열려있는 패널을 다시 클릭한 경우 → 닫기
        if (selectedPage === item) {
            setSelectedPage(null);
            return;
        }

        // 다른 패널 클릭 → 해당 패널 열기
        setSelectedPage(item);
    };
    return (
        <div className={styles.panelTabsContainer}>
            {items.map((item, index) => (
                <button
                    key={index}
                    type="button"
                    className={styles.panelTabItem}
                    onClick={() => handleClick(item)}
                >
                    <item.icon className={styles.panelTabIcon} />
                    <span className={styles.panelTabLabel}>{item.label}</span>
                </button>
            ))}
        </div>
    );
}


/*** 사이드 바 패널 ***/
export function Panel({ items }: SidebarProps) {
    const { selectedPage, setSelectedPage } = useSidebar();
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    const { top, bottom } = useLayoutSpace();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedPage(null);
        };
        if (selectedPage) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }

    }, [selectedPage, setSelectedPage]);

    useEffect(() => {
        if (selectedPage) {
            setShouldRender(true);
            setTimeout(() => setIsVisible(true), 20);
        } else if (shouldRender) {
            setIsVisible(false);
            const timeout = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [selectedPage, shouldRender]);

    if (!shouldRender || !selectedPage) return null;

    const Component = selectedPage.component;

    return (
        <div
            className={`${styles.rightPanelWrapper} ${!isVisible ? styles.rightPanelExit : ''}`}
            style={{
                '--top-offset': `${top}px`,
                '--bottom-offset': `${bottom}px`,
            } as React.CSSProperties}
        >
            {/* 실제 내용 패널 */}
            <div className={styles.rightPanel}>
                {/* panelTab */}
                <div className={styles.panelTab}>
                    <SidebarPanelTabs items={items} />
                </div>

                <div className={styles.panelBody}>
                    <Component />
                </div>

                <button onClick={() => setSelectedPage(null)}>닫기</button>
            </div>
        </div>
    );
}