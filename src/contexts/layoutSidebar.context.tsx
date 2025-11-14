'use client';

import { createContext, useContext, useState } from 'react';

type LayoutSidebarContextType = {
    showRightSidebar: boolean;
    setShowRightSidebar: (visible: boolean) => void;
};

const LayoutSidebarContext = createContext<LayoutSidebarContextType | null>(null);

/*** 우측 사이드바 컨트롤용 ***/
export function LayoutSidebarProvider({ children }: { children: React.ReactNode }) {
    const [showRightSidebar, setShowRightSidebar] = useState(true);

    return (
        <LayoutSidebarContext.Provider value={{ showRightSidebar, setShowRightSidebar }}>
            {children}
        </LayoutSidebarContext.Provider>
    );
}

export function useLayoutSidebar() {
    const ctx = useContext(LayoutSidebarContext);
    if (!ctx) throw new Error('useLayoutSidebar must be used within LayoutSidebarProvider');
    return ctx;
}