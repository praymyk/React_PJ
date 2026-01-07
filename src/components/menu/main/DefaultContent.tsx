'use client';

import Link from 'next/link';
import { useEffect, useState, type MouseEvent, useRef } from 'react';
import styles from '@components/menu/main/DefaultContent.module.scss';

import { MenuItem, submenuRegistry, type SubMenuItem } from '@/data/menuItems';
import {usePathname} from "next/navigation";

type MainMenuProps = {
    items: MenuItem[];
    offsetTop? : number;
};

const MOBILE_BREAKPOINT = 768;

export default function DefaultContent({ items, offsetTop = 0 }: MainMenuProps) {
    const stickyTop = `calc(${offsetTop}px + var(--layout-menu-offset))`;
    const [isMobile, setIsMobile] = useState(false);
    const [openPath, setOpenPath] = useState<string | null>(null);
    const [submenuOffset, setSubmenuOffset] = useState<number>(0);

    const desktopListRef = useRef<HTMLUListElement | null>(null);

    const pathname = usePathname();

    // PC 서브메뉴 패널용 상태 (내용/열림 여부 분리)
    const [panelPath, setPanelPath] = useState<string | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    /** 뷰포트 기준으로 모바일 여부 판별 */
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
            setIsMobile(mobile);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /** 해당 path에 서브메뉴가 존재하는지 여부 */
    const hasSubmenu = (path: string) =>
        Object.prototype.hasOwnProperty.call(submenuRegistry, path);

    /** 서브메뉴 아이템 가져오기 */
    const getSubmenuItems = (path: string): SubMenuItem[] => {
        return (submenuRegistry as Record<string, SubMenuItem[]>)[path] ?? [];
    };

    /** 모바일: 메인 메뉴 터치 시 서브메뉴 토글 (아래로 접기/펴기) */
    const handleMainClickMobile = (
        e: MouseEvent<HTMLAnchorElement>,
        path: string,
    ) => {
        if (!isMobile) return; // PC면 여기서 바로 종료 → 기본 링크 동작

        const isRootPalace = path === '/palace';
        const hasSub = hasSubmenu(path);

        if (isRootPalace) {
            // 아무 것도 안 하면 Link 기본 동작(라우팅) 수행
            return;
        }

        // 서브메뉴가 있는 나머지 메인메뉴는 토글만, 라우팅 X
        if (hasSub) {
            e.preventDefault();
            setOpenPath(prev => (prev === path ? null : path));
            return;
        }

        // TODO: 서브메뉴 없는 일반 메뉴라면 그냥 라우팅 해야함
    };

    /** PC: 호버 시 특정 path 열기 + 해당 li 높이에 맞게 서브메뉴 offset 계산 */
    const handleMouseEnterDesktop = (path: string, e: MouseEvent<HTMLLIElement>) => {
        if (isMobile) return;

        // 패널 닫기 예약되어 있던 타이머가 있으면 취소
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }

        if (!hasSubmenu(path)) {
            setIsPanelOpen(false);
            setPanelPath(null);
            return;
        }

        setPanelPath(path);
        setIsPanelOpen(true);

        const listEl = desktopListRef.current;
        const itemEl = e.currentTarget as HTMLElement;

        if (listEl && itemEl) {
            const listRect = listEl.getBoundingClientRect();
            const itemRect = itemEl.getBoundingClientRect();
            const offset = itemRect.top - listRect.top;
            setSubmenuOffset(offset);
        }
    };

    /*** PC: 메인 메뉴 중 마지막 대상 호버시 가장 아래쪽 패딩 값 제거용 ***/
    const [isLastItemHovered, setIsLastItemHovered] = useState(false);

    /** PC: 메뉴 영역에서 마우스 나가면 닫기 */
    const handleMouseLeaveDesktop = () => {
        if (isMobile) return;

        setIsPanelOpen(false);
        setIsLastItemHovered(false);

        // 애니메이션 종료 후 내용 정리 (메모리 관리)
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
        }
        closeTimeoutRef.current = setTimeout(() => {
            setPanelPath(null);
            closeTimeoutRef.current = null;
        }, 350);
    };

    /** PC용 서브메뉴: 현재 panelPath 기준으로만 오른쪽 패널에서 렌더 */
    const activeSubmenuItems: SubMenuItem[] =
        !isMobile && panelPath && hasSubmenu(panelPath)
            ? getSubmenuItems(panelPath)
            : [];

    // 언마운트 시 패널 닫기 타이머 정리
    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    return (
        <nav className={styles.menuContainer}
             aria-label="메인 메뉴"
             style={{ top: stickyTop }} >
            {isMobile ? (
                // ======================
                //   모바일 레이아웃
                //   - 메인 메뉴 아래로 서브메뉴 슬라이드다운
                // ======================
                <ul className={styles.menuListMobile}>
                    {items.map(({ label, icon: Icon, path }) => {
                        const isOpen = openPath === path;
                        const isRootPalace = path === '/palace';

                        const isActive = isRootPalace
                            ? pathname === '/palace' // 대시보드는 홈일 때만
                            : pathname === path || pathname.startsWith(path + '/');

                        const submenuItems = hasSubmenu(path)
                            ? getSubmenuItems(path)
                            : [];

                        return (
                            <li
                                key={path}
                                className={styles.menuItemWrapperMobile}
                            >
                                <Link
                                    href={path}
                                    className={
                                        isActive
                                            ? `${styles.menuItem} ${styles['menuItem--active']}`
                                            : styles.menuItem
                                    }
                                    onClick={e => handleMainClickMobile(e, path)}
                                >
                                    <Icon className={styles.menuIcon} />
                                    <span className={styles.menuLabel}>
                                        {label}
                                    </span>
                                </Link>

                                {submenuItems.length > 0 && (
                                    <ul
                                        className={`${styles.submenuMobile} ${
                                            isOpen
                                                ? styles.submenuMobileOpen
                                                : ''
                                        }`}
                                    >
                                        {submenuItems.map(
                                            ({
                                                 label: subLabel,
                                                 icon: SubIcon,
                                                 path: subPath,
                                             }) => (
                                                <li
                                                    key={subPath}
                                                    className={
                                                        styles.submenuItemWrapper
                                                    }
                                                >
                                                    <Link
                                                        href={subPath}
                                                        className={
                                                            styles.submenuItem
                                                        }
                                                    >
                                                        <SubIcon
                                                            className={
                                                                styles.submenuIcon
                                                            }
                                                        />
                                                        <span
                                                            className={
                                                                styles.submenuLabel
                                                            }
                                                        >
                                                            {subLabel}
                                                        </span>
                                                    </Link>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            ) : (
                // ======================
                //   PC 레이아웃
                //   - 좌측: 아이콘 컬럼(항상 정렬 유지)
                //   - 우측: 서브메뉴 패널 (호버된 메인 메뉴 높이에 맞게 아래로 내려감)
                // ======================
                <div
                    className={`${styles.menuLayoutDesktop} ${
                        isLastItemHovered ? styles.lastItemHovered : ''
                    }`}
                    onMouseLeave={handleMouseLeaveDesktop}
                >
                    {/* 좌측: 메인 메뉴 아이콘 컬럼 */}
                    <ul
                        className={styles.menuListDesktop}
                        ref={desktopListRef}
                    >
                        {items.map(({ label, icon: Icon, path }, index) => {
                            const isRootPalace = path === '/palace';

                            const isActive = isRootPalace
                                ? pathname === '/palace' // 정확히 /palace 일 때만 활성
                                : pathname === path || pathname.startsWith(path + '/');

                            const hasSub = hasSubmenu(path);
                            const isLast = index === items.length - 1;

                            return (
                                <li
                                    key={path}
                                    className={styles.menuItemWrapperDesktop}
                                    onMouseEnter={e => {
                                        handleMouseEnterDesktop(path, e);
                                        setIsLastItemHovered(isLast);
                                    }}
                                >
                                    <Link
                                        href={path}
                                        className={
                                            isActive
                                                ? `${styles.menuItem} ${styles['menuItem--active']}`
                                                : styles.menuItem
                                        }
                                        onClick={e => {
                                            // /palace 는 라우팅 O
                                            if (isRootPalace) {
                                                return;
                                            }
                                            // 서브메뉴 있는 나머지 메인 메뉴는 라우팅 막기
                                            if (hasSub) {
                                                e.preventDefault();
                                            }
                                            // 서브메뉴 없는 메뉴라면 그대로 라우팅 (확장용)
                                        }}
                                    >
                                        <Icon className={styles.menuIcon} />
                                        <span className={styles.menuLabel}>
                                            {label}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* 우측: 서브메뉴 패널 */}
                    <div
                        className={`${styles.submenuPanelDesktop} ${
                            isPanelOpen && activeSubmenuItems.length > 0
                                ? styles.submenuPanelDesktopOpen
                                : ''
                        }`}
                        style={{
                            marginTop: submenuOffset, // 호버한 메인 메뉴 높이만큼 아래로
                        }}
                    >
                        {activeSubmenuItems.length > 0 && (
                            <ul className={styles.submenuListDesktop}>
                                {activeSubmenuItems.map(
                                    ({
                                         label: subLabel,
                                         icon: SubIcon,
                                         path: subPath,
                                     }) => (
                                        <li
                                            key={subPath}
                                            className={
                                                styles.submenuItemWrapper
                                            }
                                        >
                                            <Link
                                                href={subPath}
                                                className={
                                                    styles.submenuItem
                                                }
                                            >
                                                <SubIcon
                                                    className={
                                                        styles.submenuIcon
                                                    }
                                                />
                                                <span
                                                    className={
                                                        styles.submenuLabel
                                                    }
                                                >
                                                    {subLabel}
                                                </span>
                                            </Link>
                                        </li>
                                    ),
                                )}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
