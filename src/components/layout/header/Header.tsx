'use client';

import { useEffect, useState } from 'react';
import api from '@utils/axios';

import styles from '@components/layout/header/Header.module.scss';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function Header() {

    const [darkMode, setDarkMode] = useState<boolean | null>(null);

    useEffect(() => {
        // 1. 마운트 직후 현재 상태 동기화 (AuthGuard가 세팅한 값 읽기)
        setDarkMode(document.documentElement.classList.contains('dark'));

        // 2. html 태그의 class 속성 변화를 실시간 감시
        const observer = new MutationObserver(() => {
            setDarkMode(document.documentElement.classList.contains('dark'));
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'], // class 속성만 콕 집어서 감시
        });

        // 3. 멀티 탭 동기화
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'theme') {
                const isNowDark = e.newValue === 'dark';
                setDarkMode(isNowDark);
                document.documentElement.classList.toggle('dark', isNowDark);
            }
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            observer.disconnect();
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleToggleTheme = async () => {
        if (darkMode === null) return;

        const next = !darkMode;
        setDarkMode(next);

        // (1) DOM 클래스 및 브라우저 저장소 즉시 반영
        document.documentElement.classList.toggle('dark', next);
        localStorage.setItem('theme', next ? 'dark' : 'light');

        // (2) DB 환경설정 업데이트
        try {
            await api.post('/api/common/users/me/preferences', {
                darkMode: next,
            });
        } catch (e) {
            console.warn('[Header] 테마 설정 저장 실패 (화면 상태만 유지)', e);
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/api/auth/logout');
        } catch (e) {
            console.warn('[Header] logout request failed', e);
        } finally {
            try {
                localStorage.removeItem('theme');
                sessionStorage.clear();

            } catch (_) {}
            window.location.href = '/login';
        }
    };

    // 아직 마운트되기 전(null)
    if (darkMode === null) return null;

    return (
        <header className={styles.header}>
            <span>Header NYANG NYANG</span>

            <div className={styles.headerActions}>
                <button
                    type="button"
                    className={styles.logoutButton}
                    onClick={handleLogout}
                    aria-label="로그아웃"
                    title="로그아웃"
                >
                    로그아웃
                </button>

                <button
                    type="button"
                    className={styles.themeToggle}
                    data-active={darkMode}
                    onClick={handleToggleTheme}
                    aria-label={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
                    title={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
                >
                    {darkMode ? (
                        <FiSun className={styles.themeToggleIcon} />
                    ) : (
                        <FiMoon className={styles.themeToggleIcon} />
                    )}
                </button>
            </div>
        </header>
    );
}