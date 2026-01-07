import { NextRequest, NextResponse } from 'next/server';
import {
    getUserPreferences,
    upsertUserPreferences,
} from '@lib/db/reactpj/userPreferences';
import { getUserFromRequest } from '@lib/auth/session';

// TODO: 사용자 환경설정의 싱글 엔드포인트.
//    계정별 커스텀 값이 생기면 이 엔드포인트의 GET/POST 응답 스키마를 확장 필요
export async function GET(req: NextRequest) {
    try {
        const sessionUser = getUserFromRequest(req);
        if (!sessionUser) {
            return NextResponse.json(
                { message: '로그인이 필요합니다.' },
                { status: 401 },
            );
        }

        const userId = Number(sessionUser.id);
        if (!Number.isFinite(userId)) {
            return NextResponse.json(
                { message: '세션 정보가 올바르지 않습니다.' },
                { status: 400 },
            );
        }

        const prefs = await getUserPreferences(userId);

        // TODO: 새로운 환경설정 필드를 userPreferences 테이블에 추가시
        //       아래 JSON 응답에도 함께 포함해서 클라이언트에서 한번에 로드하도록!
        return NextResponse.json({
            userId: prefs.userId,
            darkMode: prefs.darkMode,
        });
    } catch (err) {
        console.error('[GET /api/common/users/me/preferences] error:', err);
        return NextResponse.json(
            { message: '환경설정을 불러오지 못했습니다.' },
            { status: 500 },
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const sessionUser = getUserFromRequest(req);
        if (!sessionUser) {
            return NextResponse.json(
                { message: '로그인이 필요합니다.' },
                { status: 401 },
            );
        }

        const userId = Number(sessionUser.id);
        if (!Number.isFinite(userId)) {
            return NextResponse.json(
                { message: '세션 정보가 올바르지 않습니다.' },
                { status: 400 },
            );
        }

        const body = await req.json();

        const darkMode = Boolean(body.darkMode);
        const defaultPageSize = Number(body.defaultPageSize ?? 20) || 20;

        await upsertUserPreferences({
            userId,
            darkMode,
            defaultPageSize,
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[POST /api/common/users/me/preferences] error:', err);
        return NextResponse.json(
            { message: '환경설정을 저장하는 중 오류가 발생했습니다.' },
            { status: 500 },
        );
    }
}