import { cookies } from 'next/headers';
import { getCustomersPaged } from '@/api/customers';
import type { CustomerRow } from '@/types/customer';

type RawSearchParams = {
    page?: string;
    pageSize?: string;
    keyword?: string;
    status?: string;
    sortBy?: string;
    sortDir?: string;
};

async function buildCookieHeader() {
    const store = await cookies();
    return store
        .getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join('; ');
}

export async function getDefaultPageData(raw: RawSearchParams) {
    const page = Number(raw.page ?? '1') || 1;
    const pageSize = Number(raw.pageSize ?? '10') || 10;

    const rawStatus = raw.status?.trim();
    const rawSortBy = raw.sortBy?.trim();
    const rawSortDir = raw.sortDir?.trim();

    const params = {
        page,
        pageSize,
        keyword: raw.keyword?.trim() || undefined,
        status:
            rawStatus === 'active' || rawStatus === 'inactive'
                ? (rawStatus as 'active' | 'inactive')
                : undefined,
        sortBy:
            rawSortBy === 'id' ||
            rawSortBy === 'name' ||
            rawSortBy === 'email' ||
            rawSortBy === 'status' ||
            rawSortBy === 'created_at'
                ? (rawSortBy as any)
                : undefined,
        sortDir:
            rawSortDir === 'asc' || rawSortDir === 'desc'
                ? (rawSortDir as 'asc' | 'desc')
                : undefined,
    };

    // SSR 환경 >  쿠키 API로 포워딩
    const cookieHeader = await buildCookieHeader();
    console.log('[SSR cookieHeader]', cookieHeader); // <-- 이거

    return getCustomersPaged<CustomerRow>(params, { cookie: cookieHeader });
}