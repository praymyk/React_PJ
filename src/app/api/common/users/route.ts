import { NextRequest, NextResponse } from 'next/server';
import {
    getTicketsByCompany,
    type TicketSortKey,
} from '@/lib/db/reactpj/tickets';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const companyId = Number(searchParams.get('companyId') ?? '0');
        if (!companyId) {
            return NextResponse.json(
                { message: 'companyId는 필수입니다.' },
                { status: 400 },
            );
        }

        // 정렬 (MiniSearchForm에서 name="at")
        const atParam = (searchParams.get('at') ??
            'receivedAt:desc') as TicketSortKey;

        // page
        const page = Number(searchParams.get('page') ?? '1') || 1;

        // pageSize: MiniSearchForm의 name="pageSize"
        const pageSizeParam = searchParams.get('pageSize') ?? '20';
        const pageSize =
            pageSizeParam === 'all'
                ? 1000 // all은 임시로 넉넉하게
                : Number(pageSizeParam) || 20;

        const result = await getTicketsByCompany(companyId, {
            sort: atParam,
            page,
            pageSize,
            // TODO : status 필터 추가하고 싶으면 searchParams 읽도록 추가 필요
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('[GET /api/common/tickets] error:', error);
        return NextResponse.json(
            { message: '티켓 목록을 가져오는데 실패했습니다.' },
            { status: 500 },
        );
    }
}