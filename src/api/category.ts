import api from '@utils/axios';
import { AxiosInstance } from 'axios';
import type {
    CategoryApiParams,
    CategoryPageApiResponse,
    CategoryTreeSaveRequest
} from '@/types/category';

// SSR/CSR 겸용 조회 함수
export async function fetchCategoryPageData(
    params: CategoryApiParams,
    client?: AxiosInstance
): Promise<CategoryPageApiResponse> {
    const apiClient = client ?? api;
    const { data } = await apiClient.get<CategoryPageApiResponse>('/api/categories/page-data', {
        params,
    });
    return data;
}

export async function saveCategoryTree(payload: CategoryTreeSaveRequest) {
    await api.post('/api/categories/tree', payload);
}