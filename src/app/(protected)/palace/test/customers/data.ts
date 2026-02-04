import { buildCookieHeader } from '@/utils/ssrCookie';
import { getCompanyIdSSR } from '@/api/auth';
import { createServerApi } from '@utils/axios';
import { AxiosInstance } from 'axios';

import type {
    CustomerRow,
    CustomerSearchParams
} from '@/types/customer';

import type {
    PaginatedResponse
} from '@/types/common'

export type CustomerApiParams = {
    companyId: number;
    page: number;
    pageSize: number;
    keyword?: string;
    status?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
};

// ======================================================
// 데이터 로더 (SSR)
// ======================================================

export async function getDefaultPageData(raw: CustomerSearchParams) {
    const cookieHeader = await buildCookieHeader();
    const companyId = await getCompanyIdSSR(cookieHeader);

    if (!companyId) return emptyListResult();

    // API 호출용 파라미터 변환
    const params = parseSearchParams(raw, companyId);

    // SSR용 클라이언트 생성
    const client = createServerApi(cookieHeader);

    return fetchCustomerList(client, params);
}

// ======================================================
// 고객 리스트 조회 ( 고객 상세 조회 페이지 내 > 리스트 조회 시 재활용)
// ======================================================

export async function fetchCustomerList(
    client: AxiosInstance,
    params: CustomerApiParams
): Promise<PaginatedResponse<CustomerRow>> {
    try {
        const { data } = await client.get<PaginatedResponse<CustomerRow>>('/api/customers', {
            params, // axios가 객체를 쿼리스트링으로 변환
        });
        return data;
    } catch (error) {
        console.error('[SSR] 고객 목록 조회 실패:', error);
        return emptyListResult();
    }
}

// ------------------------------------------------------
// 헬퍼
// ------------------------------------------------------

export function parseSearchParams(raw: CustomerSearchParams, companyId: number): CustomerApiParams {
    const rawStatus = raw.status?.trim();
    const rawSortBy = raw.sortBy?.trim();
    const rawSortDir = raw.sortDir?.trim();

    return {
        companyId,
        page: Number(raw.page ?? '1') || 1,
        pageSize: Number(raw.pageSize ?? '10') || 10,
        keyword: raw.keyword?.trim() || undefined,
        status: (rawStatus === 'active' || rawStatus === 'inactive') ? rawStatus : undefined,
        sortBy: ['id', 'name', 'email', 'status', 'created_at'].includes(rawSortBy || '') ? rawSortBy : undefined,
        sortDir: (rawSortDir === 'asc' || rawSortDir === 'desc') ? (rawSortDir as 'asc' | 'desc') : undefined,
    };
}

function emptyListResult(): PaginatedResponse<CustomerRow> {
    return { rows: [], total: 0, page: 1, pageSize: 10 };
}