import { NextRequest, NextResponse } from 'next/server';
import {
    getTicketsByCompany,
    type TicketSortKey,
} from '@/lib/db/reactpj/tickets';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // 1) companyId
        const companyId = Number(searchParams.get('companyId'));

        // 2) 페이지 번호
        const page = Number(searchParams.get('page') ?? '1') || 1;

        // 3) 페이지 사이즈 (MiniSearchForm pageSize)
        const rawPageSize = searchParams.get('pageSize') ?? '20';
        const pageSize =
            rawPageSize === 'all'
                ? 1000 // all은 일단 넉넉하게 1000개로 처리 (나중에 조절 가능)
                : Number(rawPageSize) || 20;

        // 4) 상태 필터 (옵션)
        const statusParam = searchParams.get('status');
        const allowedStatus = ['접수', '진행중', '종료', '취소'] as const;
        const status = allowedStatus.includes(statusParam as any)
            ? (statusParam as (typeof allowedStatus)[number])
            : undefined;

        // 5) 정렬 조건 (MiniSearchForm의 name="at")
        const sortParam = (searchParams.get('at') ??
            'receivedAt:desc') as TicketSortKey;

        // 6) DB 조회 ( rows + total + page + pageSize 리턴)
        const {
            rows,
            total,
            page: currentPage,
            pageSize: currentPageSize,
        } = await getTicketsByCompany(companyId, {
            status,
            sort: sortParam,
            page,
            pageSize,
        });

        // 7) 화면용 응답 형태로 매핑
        const response = {
            rows: rows.map((r) => ({
                id: r.id,
                title: r.title,
                description: r.description,
                assignee_id: r.assignee_id,
                status: r.status,
            })),
            page: currentPage,
            pageSize: currentPageSize,
            total,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('[GET /api/common/tickets] error:', error);
        return NextResponse.json(
            { message: '티켓 목록을 가져오는데 실패했습니다.' },
            { status: 500 },
        );
    }
}