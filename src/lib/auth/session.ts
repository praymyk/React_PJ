import jwt from 'jsonwebtoken';
import type { NextRequest, NextResponse } from 'next/server';


const SESSION_COOKIE_NAME = 'palace_session';
const SESSION_SECRET = process.env.SESSION_SECRET ?? 'dev-secret';
const DEFAULT_MAX_AGE = Number(process.env.SESSION_MAX_AGE ?? '28800'); // 8h

export type SessionUser = {
    id: string;
    name: string;
    email: string;
    darkMode?: boolean;
};

export function createSessionCookie(
    res: NextResponse,
    user: SessionUser,
): NextResponse {
    const payload = {
        sub: user.id,
        name: user.name,
        email: user.email,
        darkMode: user.darkMode,
    };

    const token = jwt.sign(payload, SESSION_SECRET, {
        expiresIn: DEFAULT_MAX_AGE, // seconds
    });

    res.cookies.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: DEFAULT_MAX_AGE,
    });

    return res;
}

export function clearSessionCookie(res: NextResponse) {
    res.cookies.set(SESSION_COOKIE_NAME, '', {
        httpOnly: true,
        path: '/',
        maxAge: 0,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    });
    return res;
}

export function getUserFromRequest(req: NextRequest): SessionUser | null {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, SESSION_SECRET) as jwt.JwtPayload;
        return {
            id: decoded.sub as string,
            name: decoded.name as string,
            email: decoded.email as string,
            darkMode: decoded.darkMode as boolean | undefined,
        };
    } catch {
        return null;
    }
}