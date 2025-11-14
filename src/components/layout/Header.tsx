'use client';

import { useEffect, useState } from 'react';
import styles from '@styles/layout/Header.module.scss';

export default function Header() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    return (
        <header className={styles.header}>
            <span>Header NYAM NYAM</span>
            <button onClick={() => setDarkMode(prev => !prev)} style={{ marginLeft: 'auto' }}>
                다크모드
            </button>
        </header>
    );
}