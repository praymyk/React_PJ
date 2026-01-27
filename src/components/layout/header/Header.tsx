'use client';

import { useEffect, useState } from 'react';
import api from '@utils/axios';
import { useRouter } from 'next/navigation';
import styles from '@components/layout/header/Header.module.scss';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function Header() {
    const router = useRouter();

    // 브라우저에서 계정 다크 모드 상태를 못 읽은 초기
    const [darkMode, setDarkMode] = useState<boolean | null>(null);

    // 1) 서버 > <html class="dark"> 기준
    useEffect(() => {
        if (typeof document === 'undefined') return;

        /** 설정에서 다크모드 변경시 동기화용 함수 */
        const syncThemeState = () => {
            const isDark = document.documentElement.classList.contains('dark');
            setDarkMode(isDark);
        };

        // 1. 처음 마운트 될 때 실행
        syncThemeState();

        // 2. 다른 컴포넌트(설정 페이지)에서 'theme-change' 이벤트 발동시
        window.addEventListener('theme-change', syncThemeState);

        return () => {
            window.removeEventListener('theme-change', syncThemeState);
            window.removeEventListener('storage', syncThemeState);
        };


    }, []);

    // 2) 다크모드 토글 핸들러: DOM + localStorage + 서버 설정까지 한 번에 갱신
    const handleToggleTheme = async () => {

        if (darkMode === null) return;

        const next = !darkMode;
        setDarkMode(next);

        // (1) DOM 클래스 즉시 반영 → 화면은 바로 바뀜 (깜빡임 없음)
        if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', next);

            // ★브라우저 저장소에 상태 저장 (페이지 이동 시 기억용)
            localStorage.setItem('theme', next ? 'dark' : 'light');
        }

        // (2) DB 환경설정 업데이트
        try {
            await api.post('/api/common/users/me/preferences', {
                darkMode: next,
            });
        } catch (e) {
            console.warn('[Header] 테마 설정 저장 실패 (화면 상태만 유지)', e);
        }
    };

    const handleLogout = () => {
        // 1. 개인 설정 삭제 (다크모드)
        localStorage.removeItem('theme');
        document.documentElement.classList.remove('dark');

        // 2. 로그인 페이지로 이동
        router.replace('/login');
    };

    // 3) 다크 모드 렌더:서버/클라이언트 모두 동일한 마크업을 내보내도록
    const isDark = darkMode === true;

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
                    data-active={isDark}
                    onClick={handleToggleTheme}
                    aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
                    title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
                >
                    {isDark ? (
                        <FiSun className={styles.themeToggleIcon} />
                    ) : (
                        <FiMoon className={styles.themeToggleIcon} />
                    )}
                </button>
            </div>
        </header>
    );
}