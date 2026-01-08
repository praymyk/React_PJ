import { NextRequest, NextResponse } from 'next/server';
import { getCustomerTicket } from '@/lib/db/reactpj/tickets';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;

        const customerId = Number(id);
        if (Number.isNaN(customerId)) {
            return NextResponse.json(
                { message: '잘못된 고객 ID 입니다.' },
                { status: 400 },
            );
        }

        const rows = await getCustomerTicket(customerId);

        // 화면용 응답 형태로 매핑
        const response = rows.map(r => ({
            id: r.id,
            title: r.title,
            status: r.status,
            submitted_at: r.submitted_at,
        }));

        return NextResponse.json(response);
    } catch (error) {
        console.error('[GET /api/common/customers/[id]/ticket] error:', error);
        return NextResponse.json(
            { message: '유저 이력 목록을 가져오는데 실패했습니다.' },
            { status: 500 },
        );
    }
}