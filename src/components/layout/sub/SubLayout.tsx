import { useEffect } from 'react';
import { useLayoutSidebar } from '@/contexts/layoutSidebar.context';
import styles from '@components/layout/sub/SubLayout.module.scss';

/*** left menu + right sub menu ***/
export default function SubLayout({ children, items = null }: { children: React.ReactNode; items: null }) {
    const { setShowRightSidebar } = useLayoutSidebar();

    useEffect(() => {
        setShowRightSidebar(false); // 우측 메뉴 숨김
        return () => setShowRightSidebar(true); // 나갈 때 복구
    }, []);

    return (
        <div className={styles.subLayout}>
            {/*<aside className={styles.subLayoutMenu}>*/}
            {/*    <SubLayoutMenu items={items} /> TODO : 서브레이아웃 전용 메뉴 */}
            {/*</aside>*/}

            <section className={styles.subContents}>
                {children}
            </section>
        </div>
    );
}