import styles from '@styles/layout/PalaceLayout.module.scss';
import MainMenu from '@components/menu/MainMenu';
import { menuRegistry } from '@/data/menuItems';
import { SidebarProvider } from '@/contexts/sidebar.context';
import { useLayoutSidebar } from '@/contexts/layoutSidebar.context';
import Sidebar, { Panel as SidebarPanel } from '@components/sidebar/Sidebar';
import { sidebarRegistry } from '@/data/sidebarItems';

export default function PalaceLayout({ children }: { children: React.ReactNode }) {
    const { showRightSidebar } = useLayoutSidebar();

    return (
        <SidebarProvider>
            <div className={styles.palaceLayout}>
                <aside className={styles.menu}>
                    <MainMenu items={menuRegistry.palace} />
                </aside>

                <section className={styles.mainContent}>{children}</section>

                {showRightSidebar && (
                    <aside className={styles.sidebar}>
                        <Sidebar items={sidebarRegistry.A} />
                    </aside>
                )}

                {/* 실제 열리는 우측 패널 */}
                <SidebarPanel />
            </div>
        </SidebarProvider>
    );
}