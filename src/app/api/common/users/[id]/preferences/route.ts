import { NextRequest, NextResponse } from 'next/server';
import {
    getUserPreferences,
    upsertUserPreferences,
} from '@/lib/db/reactpj/userPreferences';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const prefs = await getUserPreferences(id);

        return NextResponse.json({
            userId: prefs.userId,
            darkMode: prefs.darkMode,
            defaultPageSize: prefs.defaultPageSize,
        });
    } catch (err) {
        console.error('[GET /api/common/users/[id]/preferences] error:', err);
        return NextResponse.json(
            { message: '환경설정을 불러오지 못했습니다.' },
            { status: 500 },
        );
    }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await req.json();

        const darkMode = Boolean(body.darkMode);
        const defaultPageSize = Number(body.defaultPageSize ?? 20) || 20;

        await upsertUserPreferences({
            userId: id,
            darkMode,
            defaultPageSize,
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[POST /api/common/users/[id]/preferences] error:', err);
        return NextResponse.json(
            { message: '환경설정을 저장하는 중 오류가 발생했습니다.' },
            { status: 500 },
        );
    }
}