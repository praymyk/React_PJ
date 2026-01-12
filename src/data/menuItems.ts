import {
    FaHome,
    FaFlask,
    FaChartPie,
    FaCogs,
    FaRegCircle,
    FaRegDotCircle,
    FaUserCircle,
    FaTicketAlt,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';

export interface MenuItem {
    label: string;
    icon: IconType;
    path: string;
    roles?: string[];  // 허용된 역할 추가
}
export interface SubMenuItem {
    label: string;
    icon: IconType;
    path: string;
    roles?: string[];  // 허용된 역할 추가
}

export type MenuGroup = 'palace' | 'settings' | 'stats' | 'test' | 'main';
export type SubMenuGroup = '/palace/test' | '/palace/stats' | '/palace/settings';


// 섹션(그룹)별 메뉴 레지스트리
export const menuRegistry: Record<MenuGroup, MenuItem[]> = {
    palace: [
        { label: '대시보드', icon: FaHome, path: '/palace' },
        { label: '티켓',     icon: FaTicketAlt, path: '/palace/ticket' },
        { label: '테스트',   icon: FaFlask, path: '/palace/test' },
        { label: '통계',     icon: FaChartPie, path: '/palace/stats' },
        { label: '내 정보',   icon: FaUserCircle, path: '/palace/profile' },
        { label: '설정',     icon: FaCogs, path: '/palace/settings' },
    ],
    settings: [],
    stats: [],
    test: [],
    main: [],
};

// 테스트 섹션(그룹) 하위 메뉴 레지스트리
export const submenuRegistry: Record<SubMenuGroup, SubMenuItem[]> = {
    '/palace/test': [
        { label: '고객정보 관리', icon: FaRegCircle, path: '/palace/test/customers' },
        { label: '카테고리 관리', icon: FaRegCircle, path: '/palace/test/category' },
        { label: '다', icon: FaRegCircle, path: '/palace/test/c' },
    ],
    '/palace/stats': [
        { label: '일별 통계', icon: FaRegDotCircle, path: '/palace/stats/daily' },
        { label: '상담원 통계', icon: FaRegDotCircle, path: '/palace/stats/agent' },
    ],
    '/palace/settings': [
        { label: '환경 설정', icon: FaRegCircle, path: '/palace/settings/env' },
        { label: '권한 설정', icon: FaRegCircle, path: '/palace/settings/auth' },
    ],
};