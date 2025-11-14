'use client';

import { createContext, useContext } from 'react';

export const LayoutSpaceContext
    = createContext<{ top: number; bottom: number }>({ top: 0, bottom: 0 });

export const useLayoutSpace
    = () => useContext(LayoutSpaceContext);