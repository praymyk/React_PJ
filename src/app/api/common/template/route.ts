import { NextRequest } from 'next/server';
import { getResponseTemplatesPaged } from '@/lib/db/reactpj/templates';
import {
    parseTemplateListParams,
    type TemplateListApiResponse,
} from '@/app/(protected)/palace/test/ai-case-notes/data';

export async function GET(req: NextRequest) {
    try {
        const sp = req.nextUrl.searchParams;

        const { page, pageSize, filters } = parseTemplateListParams({
            page: sp.get('page') ?? undefined,
            pageSize: sp.get('pageSize') ?? undefined,
            companyId: sp.get('companyId') ?? undefined,
            kind: sp.get('kind') ?? undefined,
            keyword: sp.get('keyword') ?? undefined,
            sortBy: sp.get('sortBy') ?? undefined,
            sortDir: sp.get('sortDir') ?? undefined,
        });

        const result = await getResponseTemplatesPaged({ page, pageSize, ...filters });

        const body: TemplateListApiResponse = {
            ok: true,
            data: {
                rows: result.rows.map((r) => ({
                    id: r.id,
                    company_id: r.company_id,
                    kind: r.kind,
                    title: r.title,
                    prompt: r.prompt,
                    content: r.content,
                    created_by: r.created_by,
                    created_at: r.created_at.toISOString(),
                    updated_at: r.updated_at.toISOString(),
                })),
                total: result.total,
                page: result.page,
                pageSize: result.pageSize,
            },
        };

        return Response.json(body, { status: 200 });
    } catch (err) {
        console.error('[GET /api/common/response-templates] error:', err);
        return Response.json(
            { ok: false, message: '서버 오류가 발생했습니다.' },
            { status: 500 },
        );
    }
}