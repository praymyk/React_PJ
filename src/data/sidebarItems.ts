import { FaBell, FaEnvelope, FaUser } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import APanel from '@components/layout/sidebar/sidebar-panels/A-Panel';
import BPanel from '@components/layout/sidebar/sidebar-panels/B-Panel';
import CPanel from '@components/layout/sidebar/sidebar-panels/C-Panel';

export interface SidebarItem {
    label: string;
    icon: IconType;
    component: React.FC;
}

export type SideGroup = 'A' | 'B' | 'C';

export const sidebarRegistry: Record<SideGroup, SidebarItem[]> = {
    A: [
        { label: '알림', icon: FaBell, component: APanel },
        { label: '메시지', icon: FaEnvelope, component: BPanel },
        { label: '내 정보', icon: FaUser, component: CPanel },
    ],
    B: [],
    C: [],
};