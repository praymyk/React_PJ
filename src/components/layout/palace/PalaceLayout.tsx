import styles from '@components/layout/palace/PalaceLayout.module.scss';
import MainMenuContent from '@components/menu/main/DefaultContent';
import { menuRegistry } from '@/data/menuItems';
import { useLayoutSpace } from '@/contexts/layoutSpace.context';
import { SidebarProvider, useSidebar } from '@/contexts/sidebar.context';
import { useLayoutSidebar } from '@/contexts/layoutSidebar.context';
import SubMenuContent, { Panel as SidebarPanel } from '@components/layout/sidebar/DefaultContent';
import { sidebarRegistry } from '@/data/sidebarItems';

export default function PalaceLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <PalaceLayoutContent>{children}</PalaceLayoutContent>
        </SidebarProvider>
    );
}

function PalaceLayoutContent({ children }: { children: React.ReactNode }) {
    const { showRightSidebar, setShowRightSidebar } = useLayoutSidebar();
    const { top, bottom } = useLayoutSpace();

    /** sidebar Panel 선택 **/
    const { selectedPanel } = useSidebar();

    return (
        <div className={styles.palaceLayout}>
            <aside className={styles.menu}>
                <MainMenuContent items={menuRegistry.palace} offsetTop={top} />

                <button
                    type="button"
                    className={styles.sidebarToggleButton}
                    onClick={() => setShowRightSidebar(!showRightSidebar)}
                >
                    {showRightSidebar ? '우측 숨김' : '우측 보임'}
                </button>
            </aside>

            <section className={styles.mainContent}>
                {children}
            </section>

            {/* 패널이 열려있을 땐 리본 사이드바 숨김 */}
            {showRightSidebar && !selectedPanel && (
                <aside className={styles.sidebar}>
                    <SubMenuContent items={sidebarRegistry.A} />
                </aside>
            )}

            {/* 실제 열리는 우측 패널: 여기에도 같은 items 전달 */}
            <SidebarPanel items={sidebarRegistry.A} />
        </div>
    );
}