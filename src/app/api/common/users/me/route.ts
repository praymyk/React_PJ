import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@lib/auth/session';
import { findUserById } from '@lib/db/reactpj/users';

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