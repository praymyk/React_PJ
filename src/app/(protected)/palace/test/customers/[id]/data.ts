import {
    getCustomerById,
    getCustomersPaged,
    type CustomerRow,
    type CustomerSearchParams,
} from '@lib/db/reactpj/customers';

/**
 * 상세 페이지 사용하는 최종 데이터
 */
export type DetailPageData = {
    customer: CustomerRow;
    customerList: CustomerRow[];
    total: number;
    page: number;
    pageSize: number;

    keyword?: string;
    status?: string;
};

/**
 * URL 쿼리(raw) 검색조건 데이터 형태
 */
export type DetailRawSearchParams = {
    page?: string;
    pageSize?: string;
    keyword?: string;
    status?: string;
};

export async function getDetailPageData(
    id: string,
    raw: DetailRawSearchParams,
): Promise<DetailPageData | null> {

    // 1) 유저 ID
    const customer = await getCustomerById(id);
    if (!customer) return null;

    // 2) page / pageSize 숫자로 변환 + 기본값
    const page = Number(raw.page ?? '1') || 1;
    const pageSize = Number(raw.pageSize ?? '10') || 10;

    // 3) status 필터
    const rawStatus = raw.status?.trim();

    // DB 쿼리용 검색 파라미터 생성
    const filters: CustomerSearchParams = {
        // keyword: 빈 문자열 > undefined
        keyword: raw.keyword?.trim() || undefined,
        // status: 'active' or 'inactive'
        status:
            rawStatus === 'active' || rawStatus === 'inactive'
                ? (rawStatus as 'active' | 'inactive')
                : undefined,
    };

    const { rows, total, page: resolvedPage, pageSize: resolvedPageSize } =
        await getCustomersPaged({
            page,
            pageSize,
            ...filters,
        });

    return {
        customer,
        customerList: rows,
        total,
        page: resolvedPage,
        pageSize: resolvedPageSize,
        keyword: filters.keyword,
        status: filters.status,
    };
}