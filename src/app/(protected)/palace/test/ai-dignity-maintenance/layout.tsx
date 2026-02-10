'use client';

import SubLayout from '@components/layout/sub/SubLayout';

export default function TestLayout({ children }: { children: React.ReactNode }) {
    return <SubLayout items={ null }>{children}</SubLayout>;
}