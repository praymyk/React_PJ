/** 공통 페이징 응답 래퍼 */
export type PaginatedResponse<T> = {
    rows: T[];
    total: number;
    page: number;
    pageSize: number;
};