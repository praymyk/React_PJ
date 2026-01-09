// 이미 있는 내용
import {
    getCustomersPaged,
    type CustomerSortKey,
    type CustomerSearchParams,
    type CustomerRow,
    getCustomerById,
} from '@lib/db/reactpj/customers';

export type Row = CustomerRow;

export type RawSearchParams = {
    page?: string;
    pageSize?: string;
    keyword?: string;
    status?: string;
    sortBy?: string;
    sortDir?: string;
};

// 상세 페이지에서도 panel 같은 거 쓸 수 있으면 여기 같이 넣어도 됨
export type DetailRawSearchParams = RawSearchParams & {
    panel?: string;
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

// 상세 페이지용 데이터 로더 ( 정렬 )
export async function getDetailPageData(
    id: string,
    raw: DetailRawSearchParams,
) {
    // 1) 리스트 데이터 (정렬/검색/페이지네이션 포함)
    const list = await getDefaultPageData(raw);

    // 2) 선택된 고객 찾기 (현재 페이지 rows에서 먼저 찾고, 없으면 DB에서 직접 조회)
    let customer = list.rows.find((c) => c.id === Number(id)) ?? null;

    if (!customer) {
        customer = await getCustomerById(id);
        if (!customer) {
            return null;
        }
    }

    return {
        customer,
        customerList: list.rows,
        page: list.page,
        pageSize: list.pageSize,
        total: list.total,
    };
}