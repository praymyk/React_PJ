import { NextRequest, NextResponse } from 'next/server';
import { getUsersPaged } from '@/lib/db/reactpj/users';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const page = Number(searchParams.get('page') ?? '1') || 1;
        const pageSize = Number(searchParams.get('pageSize') ?? '10') || 10;

        const result = await getUsersPaged(page, pageSize);

        return NextResponse.json(result);
    } catch (error) {
        console.error('[GET /api/common/users] error:', error);
        return NextResponse.json(
            { message: '유저 목록을 가져오는데 실패했습니다.' },
            { status: 500 },
        );
    }
}