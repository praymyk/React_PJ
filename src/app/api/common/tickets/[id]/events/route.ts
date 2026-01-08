import { NextRequest, NextResponse } from 'next/server';
import {
    getTicketEventsForTicketCluster,
    getTicketById,
    createTicketEvent,
} from '@/lib/db/reactpj/tickets';
import type {
    TicketEventListApiResponse,
} from '@/app/(protected)/palace/ticket/data';

// GET: 티켓 이벤트 타임라인 + 페이징
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;

        // URL 파라미터는 항상 string → DB용 number 로 변환
        const ticketId = Number(id);
        if (Number.isNaN(ticketId)) {
            return NextResponse.json(
                { message: '잘못된 티켓 ID 입니다.' },
                { status: 400 },
            );
        }

        // DB에서 이벤트 타임라인 조회
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get('page') ?? '1') || 1;
        const pageSize = Number(searchParams.get('pageSize') ?? '20') || 20;

        const {
            rows,
            total,
            page: currentPage,
            pageSize: currentPageSize,
        } = await getTicketEventsForTicketCluster(ticketId, {
            page,
            pageSize,
        });

        const response: TicketEventListApiResponse = {
            ticketId,
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
            page: currentPage,
            pageSize: currentPageSize,
            total,
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

// POST: 티켓 이벤트(메모) 추가
export async function POST(
    req: NextRequest,
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

        // 1) 티켓 존재 여부 확인
        const ticket = await getTicketById(ticketId);
        if (!ticket) {
            return NextResponse.json(
                { message: '티켓을 찾을 수 없습니다.' },
                { status: 404 },
            );
        }

        // 2) 요청 본문 파싱
        const body = await req.json().catch(() => null);
        const rawContent = (body?.content ?? '').trim();
        const eventType =
            body?.eventType ??
            '상담사메모'; // 기본값: 상담사 메모

        const authorUserId: number | null =
            typeof body?.authorUserId === 'number' ? body.authorUserId : null;

        const meta = body?.meta ?? null;

        if (!rawContent) {
            return NextResponse.json(
                { message: '메모 내용을 입력해 주세요.' },
                { status: 400 },
            );
        }

        // 3) 이벤트 생성
        const insertedId = await createTicketEvent({
            ticketId: ticket.id,
            companyId: ticket.company_id,
            eventType,
            channel: null,
            authorUserId,
            customerId: ticket.customer_id,
            content: rawContent,
            meta,
        });

        return NextResponse.json(
            {
                id: insertedId,
                message: '티켓 메모가 저장되었습니다.',
            },
            { status: 201 },
        );
    } catch (error) {
        console.error(
            '[POST /api/common/tickets/[id]/events] error:',
            error,
        );
        return NextResponse.json(
            { message: '티켓 메모를 저장하는 데 실패했습니다.' },
            { status: 500 },
        );
    }
}