import styles from '@components/layout/palace/PalaceLayout.module.scss';
import MainMenuContent from '@components/menu/main/DefaultContent';
import { menuRegistry } from '@/data/menuItems';
import { useLayoutSpace } from '@/contexts/layoutSpace.context';
import { SidebarProvider, useSidebar } from '@/contexts/sidebar.context';
import { useLayoutSidebar } from '@/contexts/layoutSidebar.context';
import SubMenuContent, { Panel as SidebarPanel } from '@components/sidebar/DefaultContent';
import { sidebarRegistry } from '@/data/sidebarItems';
import {useEffect} from "react";
import { usePathname } from 'next/navigation';

export default function PalaceLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <PalaceLayoutContent>{children}</PalaceLayoutContent>
        </SidebarProvider>
    );
}

function PalaceLayoutContent({ children }: { children: React.ReactNode }) {
    const { showRightSidebar } = useLayoutSidebar();
    const { selectedPage, setSelectedPage } = useSidebar();
    const pathname = usePathname();

    const { top, bottom } = useLayoutSpace();

    useEffect(() => {
        setSelectedPage(null);
    }, [pathname, setSelectedPage]);

    return (
        <div className={styles.palaceLayout}>
            <aside className={styles.menu}>
                <MainMenuContent items={menuRegistry.palace} offsetTop={top} />
            </aside>

            <section className={styles.mainContent}>
                {children}
            </section>

            {/* selectedPage가 없을 때만 리본 사이드바 표시 */}
            {showRightSidebar && !selectedPage && (
                <aside className={styles.sidebar}>
                    <SubMenuContent items={sidebarRegistry.A} />
                </aside>
            )}

            {/* 실제 열리는 우측 패널: 여기에도 같은 items 전달 */}
            <SidebarPanel items={sidebarRegistry.A} />
        </div>
    );
}