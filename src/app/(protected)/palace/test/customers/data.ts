import { getCustomersPaged, type CustomerSortKey, type CustomerSearchParams, type CustomerRow } from '@lib/db/reactpj/customers';

export type Row = CustomerRow;

type RawSearchParams = {
    page?: string;
    pageSize?: string;
    keyword?: string;
    status?: string;
    sortBy?: string;
    sortDir?: string;
};

export async function getDefaultPageData(raw: RawSearchParams) {
    const page = Number(raw.page ?? '1') || 1;
    const pageSize = Number(raw.pageSize ?? '10') || 10;

    const rawStatus = raw.status?.trim();
    const rawSortBy = raw.sortBy?.trim();
    const rawSortDir = raw.sortDir?.trim();

    const filters: CustomerSearchParams = {
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
                ? (rawSortBy as CustomerSortKey)
                : undefined,
        sortDir:
            rawSortDir === 'asc' || rawSortDir === 'desc'
                ? (rawSortDir as 'asc' | 'desc')
                : undefined,
    };

    return getCustomersPaged({
        page,
        pageSize,
        ...filters,
    });
}