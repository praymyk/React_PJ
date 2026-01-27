import api, { createServerApi } from '@utils/axios';
import type {CustomersPagedParams} from '@/types/customer';
import type {CustomersPagedResponse} from '@/types/customer';

// 서버에서 호출할 때 쿠키 값 > options 제공
export async function getCustomersPaged<Row>(
    params: CustomersPagedParams,
    options?: { cookie?: string }
): Promise<CustomersPagedResponse<Row>> {

    const client =
        typeof window === 'undefined'
            ? createServerApi(options?.cookie)
            : api;

    const res = await client.get<CustomersPagedResponse<Row>>('/api/customers', {
        params,
    });

    return res.data;
}