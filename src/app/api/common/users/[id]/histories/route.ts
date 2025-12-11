import { NextRequest, NextResponse } from 'next/server';
import { getUserHistories } from '@lib/db/reactpj';

type RouteContext = {
    params: { id: string };
};

export async function GET(
    _req: NextRequest,
    { params }: RouteContext,
) {
    try {
        const histories = await getUserHistories(params.id);

        return NextResponse.json(histories);
    } catch (error) {
        console.error('[GET /api/common/users/[id]/histories] error:', error);
        return NextResponse.json(
            { message: '유저 이력 목록을 가져오는데 실패했습니다.' },
            { status: 500 },
        );
    }
}