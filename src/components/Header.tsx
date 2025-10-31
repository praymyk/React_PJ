'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/layout/Header.module.scss';

export default function Header() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    return (
        <header className={styles.header}>
            <span>냠냠 헤더</span>
            <button onClick={() => setDarkMode(prev => !prev)} style={{ marginLeft: 'auto' }}>
                Toggle Dark Mode
            </button>
        </header>
    );
}