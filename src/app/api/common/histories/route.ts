import { NextRequest, NextResponse } from 'next/server';
import { getUserHistories } from '@/lib/db/reactpj';
import type { HistoryItem } from '@/app/palace/test/a/data';

type RouteContext = {
    params: { id: string };
};

export async function GET(_req: NextRequest, { params }: RouteContext) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: 'Missing user id' }, { status: 400 });
    }

    try {
        const rows = await getUserHistories(id);

        // DB Row → 화면용 HistoryItem 으로 매핑
        const payload: HistoryItem[] = rows.map((r) => ({
            date: r.event_date.toISOString().slice(0, 10), // 'YYYY-MM-DD'
            title: r.title,
            status: r.status,
            content: r.content,
        }));

        return NextResponse.json(payload);
    } catch (err) {
        console.error('[GET /api/common/users/[id]/histories] error:', err);
        return NextResponse.json(
            { error: 'Failed to load user histories' },
            { status: 500 },
        );
    }
}