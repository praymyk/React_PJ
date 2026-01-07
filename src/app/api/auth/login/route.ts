import { NextRequest, NextResponse } from 'next/server';
import { findUserByLoginId } from '@/lib/db/reactpj/users';
import { getUserPreferences } from "@lib/db/reactpj/userPreferences";
import { createSessionCookie } from '@/lib/auth/session';
import bcrypt from 'bcryptjs';


export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json(
                { message: '아이디와 비밀번호를 입력해주세요.' },
                { status: 400 },
            );
        }

        const user = await findUserByLoginId(username);
        if (!user) {
            return NextResponse.json(
                { message: '존재하지 않는 계정입니다.' },
                { status: 401 },
            );
        }

        if (user.status !== 'active') {
            return NextResponse.json(
                { message: '비활성화된 계정입니다.' },
                { status: 403 },
            );
        }

        // ★ 비밀번호 검증 (bcrypt)
        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) {
            return NextResponse.json(
                { message: '비밀번호가 올바르지 않습니다.' },
                { status: 401 },
            );
        }

        // ★ 세션(JWT) 쿠키 발급
        const prefs = await getUserPreferences(user.id);

        const res = NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                profileName: user.profile_name,
                email: user.email,
                extension: user.extension,
            },
            preferences: {
                darkMode: prefs.darkMode,
            },
        });

        return createSessionCookie(res, {
            id: String(user.id),
            name: user.name,
            email: user.email,
            darkMode: prefs.darkMode,
        });
    } catch (e) {
        console.error('[POST /api/auth/login] error:', e);
        return NextResponse.json(
            { message: '로그인 처리 중 오류가 발생했습니다.' },
            { status: 500 },
        );
    }
}