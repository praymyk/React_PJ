import api from '@utils/axios';
import { AxiosInstance } from 'axios';
import { ApiResponse } from '@/types/api';

import type {
    CategoryApiParams,
    CategoryPageApiResponse,
    CategoryTreeSaveRequest
} from '@/types/category';



// SSR/CSR 겸용 조회 함수
export async function fetchCategoryPageData(
    params: CategoryApiParams,
    client?: AxiosInstance
): Promise<CategoryPageApiResponse> { // 여기 리턴 타입은 순수 데이터 유지
    const apiClient = client ?? api;

    const { data } = await apiClient.get<CategoryPageApiResponse>('/api/categories/page-data', {
        params,
    });

    if (!data) {
        throw new Error('응답 데이터가 비어있습니다.');
    }

    return data;
}

export async function saveCategoryTree(payload: CategoryTreeSaveRequest) {
    await api.post('/api/categories/tree', payload);
}