export type ApiError = {
    code: string;
    message: string;
    // optional: status?: number;
    // optional: traceId?: string;
    // optional: fieldErrors?: Record<string, string>;
};

export type ApiResponse<T> = {
    ok: boolean;
    data: T | null;
    error: ApiError | null;
};

