'use client';

import {createContext, useContext, useEffect, useState} from 'react';
import type { SidebarItem } from '@/data/sidebarItems';

type SidebarContextType = {
    selectedPage: SidebarItem | null;
    setSelectedPage: (item: SidebarItem | null) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [selectedPage, setSelectedPage] = useState<SidebarItem | null>(null);

    return (
        <SidebarContext.Provider value={{ selectedPage, setSelectedPage }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const ctx = useContext(SidebarContext);
    if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
    return ctx;
}