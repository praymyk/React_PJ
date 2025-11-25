import styles from '@components/layout/PalaceLayout.module.scss';
import MainMenu from '@components/menu/MainMenu';
import { menuRegistry } from '@/data/menuItems';
import { SidebarProvider, useSidebar } from '@/contexts/sidebar.context';
import { useLayoutSidebar } from '@/contexts/layoutSidebar.context';
import Sidebar, { Panel as SidebarPanel } from '@components/sidebar/Sidebar';
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

    useEffect(() => {
        setSelectedPage(null);
    }, [pathname, setSelectedPage]);

    return (
        <div className={styles.palaceLayout}>
            <aside className={styles.menu}>
                <MainMenu items={menuRegistry.palace} />
            </aside>

            <section className={styles.mainContent}>
                {children}
            </section>

            {/* selectedPage가 없을 때만 리본 사이드바 표시 */}
            {showRightSidebar && !selectedPage && (
                <aside className={styles.sidebar}>
                    <Sidebar items={sidebarRegistry.A} />
                </aside>
            )}

            {/* 실제 열리는 우측 패널: 여기에도 같은 items 전달 */}
            <SidebarPanel items={sidebarRegistry.A} />
        </div>
    );
}