import { useEffect } from 'react';
import { useLayoutSidebar } from '@/contexts/layoutSidebar.context';
import styles from '@components/layout/SubLayout.module.scss';

import {MenuItem} from "@/data/menuItems";

/*** left menu + right sub menu ***/
export default function SubLayout({ children, items }: { children: React.ReactNode; items: MenuItem[] }) {
    const { setShowRightSidebar } = useLayoutSidebar();

    useEffect(() => {
        setShowRightSidebar(false); // 우측 메뉴 숨김
        return () => setShowRightSidebar(true); // 나갈 때 복구
    }, []);

    return (
        <div className={styles.subLayout}>
            {/*<aside className={styles.subMenu}>*/}
            {/*    <SubMenu items={items} /> /!* 여기서 그룹 선택 *!/*/}
            {/*</aside>*/}

            <section className={styles.subContents}>
                {children}
            </section>
        </div>
    );
}