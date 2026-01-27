import api, { createServerApi } from '@utils/axios';

export type CustomersPagedParams = {
    page: number;
    pageSize: number;
    keyword?: string;
    status?: 'active' | 'inactive';
    sortBy?: 'id' | 'name' | 'email' | 'status' | 'created_at';
    sortDir?: 'asc' | 'desc';
};

export type CustomersPagedResponse<Row> = {
    rows: Row[];
    total: number;
    page: number;
    pageSize: number;
};

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