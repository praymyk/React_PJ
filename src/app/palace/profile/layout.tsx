'use client';

import SubLayout from '@components/layout/SubLayout';
import { submenuRegistry } from '@/data/menuItems';

export default function TestLayout({ children }: { children: React.ReactNode }) {
    const submenuItems = submenuRegistry['/palace/test'];

    return <SubLayout items={submenuItems}>{children}</SubLayout>;
}