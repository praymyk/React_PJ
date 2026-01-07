import type { Metadata } from 'next';
import '@styles/theme/tokens.scss';
import '@styles/theme/globals.scss';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

const SESSION_COOKIE_NAME = 'palace_session';
const SESSION_SECRET = process.env.SESSION_SECRET ?? 'dev-secret';

import MainLayout from '@components/layout/main/MainLayout';

export const metadata: Metadata = {
    title: 'IPCC React',
    description: 'IPCC dashboard powered by Next.js',
};

type SessionPayload = {
    id: string;
    name: string;
    email: string;
    darkMode?: boolean;  // 로그인 시 createSessionCookie에 넣어준 필드
};

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
        redirect('/login');
    }

    let isDark = false;

    try {
        const decoded = jwt.verify(token, SESSION_SECRET) as SessionPayload;
        isDark = !!decoded.darkMode;
    } catch {
        // 토큰 깨져있으면 세션 무효 → 로그인으로 튕기기
        redirect('/login');
    }

    // TODO: 여기에서 다크 모드 외에 계정별 커스텀 설정을 함께 반영 가능 위치
    //  - 예: 계정별 커스텀 폰트사이즈, 계정별 등급, etc..
    //  - 세션 페이로드(SessionPayload)에 필드를 추가한 뒤,
    //    Provider나 context로 내려서 클라이언트 전역에서 참조하도록 확장.


    return (
        <html lang="ko" className={isDark ? 'dark' : ''}>
        <body>
        <MainLayout>{children}</MainLayout>
        </body>
        </html>
    );
}