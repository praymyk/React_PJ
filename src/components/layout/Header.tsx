'use client';

import { useEffect, useState } from 'react';
import styles from '@components/layout/Header.module.scss';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function Header() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    return (
        <header className={styles.header}>
            <span>Header NYAM NYAM</span>
            <button
                type="button"
                className={styles.themeToggle}
                data-active={darkMode} // 다크모드 여부를 스타일링에 사용
                onClick={() => setDarkMode(prev => !prev)}
                aria-label={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
                title={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
                {darkMode ? (
                    <FiSun className={styles.themeToggleIcon} />
                ) : (
                    <FiMoon className={styles.themeToggleIcon} />
                )}
            </button>
        </header>
    );
}