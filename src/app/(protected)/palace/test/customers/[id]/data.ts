import { buildCookieHeader } from '@/utils/ssrCookie';
import { getCompanyIdSSR } from '@/api/auth';
import { createServerApi } from '@utils/axios';
import {AxiosInstance} from "axios";
import {ApiResponse} from "@/types/api";

import type { CustomerRow, CustomerSearchParams } from '@/types/customer';

import {
    fetchCustomerList,
    parseSearchParams
} from '../data';


// ======================================================
// 상세 페이지용 데이터 로더 (SSR)
// ======================================================

export async function getDetailPageData(id: string, raw: CustomerSearchParams) {
    const cookieHeader = await buildCookieHeader();
    const companyId = await getCompanyIdSSR(cookieHeader);

    if (!companyId) return null;

    const client = createServerApi(cookieHeader);

    const listParams = parseSearchParams(raw, companyId);

    try {
        // 3. [핵심] 병렬 호출 (리스트 + 상세정보 동시 요청)
        const [listResponse, detailData] = await Promise.all([
            fetchCustomerList(client, listParams),
            fetchCustomerDetail(client, id)
        ]);

        // 상세 데이터가 없으면 null 반환 (404 처리용)
        if (!detailData) return null;

        return {
            customer: detailData,           // 상세 정보
            customerList: listResponse.rows,// 사이드바 목록용 리스트

            // 페이징 유지를 위한 메타 정보
            page: listResponse.page,
            pageSize: listResponse.pageSize,
            total: listResponse.total,
        };

    } catch (error) {
        console.error(`[SSR] 상세 페이지 로딩 에러 (id=${id}):`, error);
        return null;
    }
}

// ======================================================
// 상세 조회 API 호출 (Private)
// =================================
async function fetchCustomerDetail(
    client: AxiosInstance,
    id: string
): Promise<CustomerRow | null> {
    try {
        const { data: responseBody } = await client.get<ApiResponse<CustomerRow>>(`/api/customers/${id}`);

        if (!responseBody.data) {
            return null;
        }

        return responseBody.data;

    } catch (error) {
        // 404나 권한 없음 등 에러 시 null 반환
        return null;
    }
}