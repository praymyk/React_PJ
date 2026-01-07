import { getCustomersPaged, type CustomerSearchParams, type CustomerRow } from '@lib/db/reactpj/customers';

export type Row = CustomerRow;

type RawSearchParams = {
    page?: string;
    pageSize?: string;

    keyword?: string;
    status?: string;
};

export async function getDefaultPageData(raw: RawSearchParams) {
    const page = Number(raw.page ?? '1') || 1;
    const pageSize = Number(raw.pageSize ?? '10') || 10;

    const rawStatus = raw.status?.trim(); // ★ 공백 제거

    const filters: CustomerSearchParams = {
        keyword: raw.keyword?.trim() || undefined,
        status:
            rawStatus === 'active' || rawStatus === 'inactive'
                ? (rawStatus as 'active' | 'inactive')
                : undefined,
    };

    return getCustomersPaged({
        page,
        pageSize,
        ...filters,
    });
}