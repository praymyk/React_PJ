import { NextRequest, NextResponse } from 'next/server';

import { getUserFromRequest } from '@lib/auth/session';
import {
    findUserById,
    updateUserProfile,
} from '@/lib/db/reactpj/users';


export async function GET(req: NextRequest) {
    const sessionUser = getUserFromRequest(req);
    if (!sessionUser) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = Number(sessionUser.id);

    const user = await findUserById(userId);
    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
        id: user.id,
        account: user.account,
        public_id: user.public_id,
        name: user.name,
        profile_name: user.profile_name,
        email: user.email,
        username: user.profile_name ?? user.name,
        extension: user.extension,
        status: user.status,
        created_at: user.created_at,
        deactivated_at: user.deactivated_at,
        updated_at: user.updated_at,
    });
}

export async function PATCH(req: NextRequest) {
    const sessionUser = getUserFromRequest(req);
    if (!sessionUser) {
        return NextResponse.json(
            { message: 'Unauthorized' },
            { status: 401 },
        );
    }

    try {
        const body = await req.json();
        const {
            account,
            name,
            profile_name,
            email,
            status,
        } = body ?? {};

        await updateUserProfile(Number(sessionUser.id), {
            account,
            name,
            profile_name,
            email,
            status,
        });

        const updated = await findUserById(Number(sessionUser.id));
        if (!updated) {
            return NextResponse.json(
                { message: '사용자를 찾을 수 없습니다.' },
                { status: 404 },
            );
        }

        // 프론트에서 쓰는 Profile 구조로 매핑
        return NextResponse.json({
            id: updated.id,
            account: updated.account,
            public_id: updated.public_id,
            name: updated.name,
            profile_name: updated.profile_name,
            email: updated.email,
            username: updated.profile_name ?? updated.name,
            extension: updated.extension,
            status: updated.status,
            created_at: updated.created_at,
            deactivated_at: updated.deactivated_at,
            updated_at: updated.updated_at,
        });
    } catch (error) {
        console.error('[PATCH /api/common/users/me] error:', error);
        return NextResponse.json(
            { message: '프로필 저장에 실패했습니다.' },
            { status: 500 },
        );
    }
}