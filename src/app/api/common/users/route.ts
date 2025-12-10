import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/db/reactpj';

export async function GET() {
    try {
        const users = await getUsers();
        return NextResponse.json(users);
    } catch (error) {
        console.error('[GET /api/users] error:', error);
        return NextResponse.json(
            { message: '유저 목록을 가져오는데 실패했습니다.' },
            { status: 500 },
        );
    }
}