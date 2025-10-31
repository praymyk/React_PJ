import styles from '@/styles/layout/PalaceLayout.module.scss';

export default function PalaceLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.palaceLayout}>
            <aside className={styles.sidebar}>좌측 메뉴</aside>
            <main className={styles.mainContent}>
                {children}
            </main>
            <aside className={styles.miniSidebar}>우측 미니 메뉴</aside>
        </div>
    );
}