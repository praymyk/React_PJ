export type CustomerRow = {
    id: number;
    name: string;
    email: string;
    status: 'active' | 'inactive';
    createdAt: string;
};

// 검색 파라미터 타입
export type CustomerSearchParams = {
    page?: string;
    pageSize?: string;
    keyword?: string;
    status?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
};

export const CUSTOMER_STATUS_CONFIG = {
    active: {
        label: '활성',
        color: 'var(--color-status-active)',
    },
    inactive: {
        label: '비활성',
        color: 'var(--color-status-inactive)',
    },
};