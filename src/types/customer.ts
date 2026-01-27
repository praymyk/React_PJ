import type { RowDataPacket } from "mysql2/promise";

export type CustomerRow = RowDataPacket & {
    id: number;
    name: string;
    email: string;
    status: 'active' | 'inactive';
    created_at: Date;
};

type CreateCustomerInput = {
    name: string;
    email: string;
    status: 'active' | 'inactive';
};

/** 페이징 결과 타입 */
export type PagedResult<T> = {
    rows: T[];
    total: number;
    page: number;
    pageSize: number;
};

/** 검색 조건 **/
export type CustomerSortKey = 'id' | 'name' | 'email' | 'status' | 'created_at';
export type SortDirection = 'asc' | 'desc';

export type CustomerSearchParams = {
    keyword?: string;
    status?: 'active' | 'inactive';
    sortBy?: CustomerSortKey;
    sortDir?: SortDirection;
};

/** 고객 정보 리스트 검색&정렬&페이징용 type */
export type CustomersPagedParams = {
    companyId: number;
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
