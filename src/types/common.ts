export interface PagedResult<T> {
    rows: T[];
    total: number;
    page: number;
    pageSize: number;
}