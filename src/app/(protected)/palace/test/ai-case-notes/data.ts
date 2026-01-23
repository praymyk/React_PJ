import type {
    TemplateKind,
    TemplateSearchParams,
    TemplateSortKey,
    SortDirection,
} from '@/lib/db/reactpj/templates';

/** 화면에서 쓰는 템플릿 종류 */
export type { TemplateKind };

/** URL(SearchParams) 원본 타입 */
export type RawSearchParams = {
    page?: string;
    pageSize?: string;
    companyId?: string;
    kind?: string;
    keyword?: string; // title 검색용
    sortBy?: string;
    sortDir?: string;
};

export type ParsedListParams = {
    page: number;
    pageSize: number;
    filters: TemplateSearchParams;
};

/** kind string → TemplateKind 정제 */
export function normalizeKind(rawKind: string | null | undefined): TemplateKind {
    const v = rawKind?.trim();
    return v === 'case_note' || v === 'inquiry_reply' || v === 'sms_reply'
        ? (v as TemplateKind)
        : 'case_note';
}

/** sortBy string → TemplateSortKey 정제 */
export function normalizeSortBy(rawSortBy: string | null | undefined): TemplateSortKey | undefined {
    const v = rawSortBy?.trim();
    return v === 'id' || v === 'title' || v === 'createdAt' || v === 'updated_at'
        ? (v as TemplateSortKey)
        : undefined;
}

/** sortDir string → SortDirection 정제 */
export function normalizeSortDir(rawSortDir: string | null | undefined): SortDirection | undefined {
    const v = rawSortDir?.trim();
    return v === 'asc' || v === 'desc' ? (v as SortDirection) : undefined;
}

/** RawSearchParams → (page/pageSize + filters) 로 정제 */
export function parseTemplateListParams(raw: RawSearchParams): ParsedListParams {
    const page = Number(raw.page ?? '1') || 1;
    const pageSize = Number(raw.pageSize ?? '20') || 20;

    const companyId = Number(raw.companyId ?? '1') || 1;

    const kind = normalizeKind(raw.kind);
    const sortBy = normalizeSortBy(raw.sortBy);
    const sortDir = normalizeSortDir(raw.sortDir);

    const filters: TemplateSearchParams = {
        companyId,
        kind,
        keyword: raw.keyword?.trim() || undefined,
        sortBy,
        sortDir,
    };

    return { page, pageSize, filters };
}

/** (선택) URLSearchParams 만들기 헬퍼: 클라이언트 fetch용 */
export function buildTemplateListQuery(params: {
    companyId: number;
    kind: TemplateKind;
    page?: number;
    pageSize?: number;
    keyword?: string;
    sortBy?: TemplateSortKey;
    sortDir?: SortDirection;
}) {
    const sp = new URLSearchParams();
    sp.set('companyId', String(params.companyId));
    sp.set('kind', params.kind);
    sp.set('page', String(params.page ?? 1));
    sp.set('pageSize', String(params.pageSize ?? 20));

    if (params.keyword?.trim()) sp.set('keyword', params.keyword.trim());
    if (params.sortBy) sp.set('sortBy', params.sortBy);
    if (params.sortDir) sp.set('sortDir', params.sortDir);

    return sp.toString();
}

/** API 응답 타입(티켓처럼 DTO를 여기서 관리) */
export type TemplateListApiResponse = {
    ok: boolean;
    data: {
        rows: Array<{
            id: number;
            company_id: number;
            kind: TemplateKind;
            title: string;
            prompt: string | null;
            content: string;
            created_by: number | null;
            created_at: string; // ISO
            updated_at: string; // ISO
        }>;
        total: number;
        page: number;
        pageSize: number;
    };
};