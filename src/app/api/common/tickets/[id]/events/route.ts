import { NextRequest, NextResponse } from 'next/server';
import { getTicketEventsForTicketCluster } from '@/lib/db/reactpj/tickets';
import type {
    TicketEventListApiResponse,
} from '@/app/palace/ticket/data';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;

        // DB에서 이벤트 타임라인 조회
        const rows = await getTicketEventsForTicketCluster(id);

        const response: TicketEventListApiResponse = {
            ticketId: id,
            events: rows.map((r) => ({
                id: r.id,
                ticketId: r.ticket_id,
                eventType: r.event_type,
                channel: r.channel,
                authorUserId: r.author_user_id,
                customerId: r.customer_id,
                content: r.content ?? '',
                createdAt: r.created_at.toISOString(),
            })),
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('[GET /api/common/tickets/[id]/events] error:', error);
        return NextResponse.json(
            { message: '티켓 이벤트 목록을 가져오는데 실패했습니다.' },
            { status: 500 },
        );
    }
}