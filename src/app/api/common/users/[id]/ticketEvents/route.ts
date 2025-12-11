import { NextRequest, NextResponse } from 'next/server';
import { getUserTicketEvents } from '@/lib/db/reactpj/tickets';

type RouteContext = {
    params: { id: string };
};

export async function GET(
    _req: NextRequest,
    { params }: RouteContext,
) {
    try {
        const ticketEvents = await getUserTicketEvents(params.id);

        return NextResponse.json(ticketEvents);
    } catch (error) {
        console.error('[GET /api/common/users/[id]/ticketEvents] error:', error);
        return NextResponse.json(
            { message: '유저 이력 목록을 가져오는데 실패했습니다.' },
            { status: 500 },
        );
    }
}