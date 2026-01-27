import { buildCookieHeader } from '@/utils/ssrCookie';
import { getCompanyIdSSR } from '@/api/auth';
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

export async function getDefaultPageData(raw: RawSearchParams) {
    const cookieHeader = await buildCookieHeader();
    const companyId = await getCompanyIdSSR(cookieHeader);

    const page = Number(raw.page ?? '1') || 1;
    const pageSize = Number(raw.pageSize ?? '10') || 10;

    const rawStatus = raw.status?.trim();
    const rawSortBy = raw.sortBy?.trim();
    const rawSortDir = raw.sortDir?.trim();

    const params = {
        companyId,
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

    return getCustomersPaged<CustomerRow>(
        { ...params, companyId },
        { cookie: cookieHeader }
    );
}