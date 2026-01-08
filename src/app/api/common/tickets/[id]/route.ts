import { NextRequest, NextResponse } from 'next/server';
import { getTicketById } from '@/lib/db/reactpj/tickets';
import type { TicketDetailApiResponse } from '@/app/(protected)/palace/ticket/data';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;

        const ticketId = Number(id);
        if (Number.isNaN(ticketId)) {
            return NextResponse.json(
                { message: '잘못된 티켓 ID 입니다.' },
                { status: 400 },
            );
        }

        const row = await getTicketById(ticketId);

        if (!row) {
            return NextResponse.json(
                { message: '해당 ID의 티켓을 찾을 수 없습니다.' },
                { status: 404 },
            );
        }

        // DB Row -> 화면용 타입으로 매핑
        const response: TicketDetailApiResponse = {
            id: row.id,
            title: row.title,
            description: row.description,
            status: row.status,
            company_id: row.company_id,
            customer_id: row.customer_id,
            assignee_id: row.assignee_id,
            channel: row.channel,
            submitted_at: row.submitted_at.toISOString(),
            closed_at: row.closed_at ? row.closed_at.toISOString() : null,
            created_at: row.created_at.toISOString(),
            updated_at: row.updated_at.toISOString(),
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('[GET /api/common/tickets/[id]] error:', error);
        return NextResponse.json(
            { message: '티켓 상세 정보를 가져오는데 실패했습니다.' },
            { status: 500 },
        );
    }
}