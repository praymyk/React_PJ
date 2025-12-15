import styles from '@components/layout/sub/SubLayout.module.scss';

/*** left menu + right sub menu ***/
export default function SubLayout({ children, items = null }: { children: React.ReactNode; items: null }) {

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