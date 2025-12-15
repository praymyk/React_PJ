'use client';

import {createContext, useContext, useEffect, useState} from 'react';
import type { SidebarItem } from '@/data/sidebarItems';

type SidebarContextValue = {
    selectedPanel: SidebarItem | null;
    setSelectedPanel: (item: SidebarItem | null) => void;
};

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [selectedPanel, setSelectedPanel] = useState<SidebarItem | null>(null)

    return (
        <SidebarContext.Provider value={{ selectedPanel, setSelectedPanel }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const ctx = useContext(SidebarContext);
    if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
    return ctx;
}