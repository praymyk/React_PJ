'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '@components/menu/SubMenu.module.scss';
import type { MenuItem } from '@/data/menuItems';

export default function DefaultContent({ items }: { items: MenuItem[] }) {
    const [isMobile, setIsMobile] = useState(false);
    const [containerWidth, setContainerWidth] = useState<string>('220px');

    // TODO: 권한 처리 추가 예정
    // const userRole = auth.user.role;
    // const filteredItems = items.filter(i => !i.roles || i.roles.includes(userRole));

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            const mobile = w <= 768;
            setIsMobile(mobile);
            setContainerWidth(mobile ? '60px' : '130px');
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <nav
            className={`${styles.menuContainer} ${isMobile ? styles.iconOnly : ''}`}
            style={{
                position: 'sticky',
                width: containerWidth,
                transition: 'width 240ms ease',
            }}
        >
            <ul className={styles.menuList}>
                {/*{filteredItems.map(({ label, icon: Icon, path }) => (*/}
                {items.map(({ label, icon: Icon, path }) => (
                    <Link key={path} href={path} className={styles.menuItem}>
                        <Icon className={styles.menuIcon} />
                        <span className={styles.menuLabel}>{label}</span>
                    </Link>
                ))}
            </ul>
        </nav>
    );
}