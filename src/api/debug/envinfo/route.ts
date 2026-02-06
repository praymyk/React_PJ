// root/api/debug/envinfo
import { NextResponse } from 'next/server';

export async function GET() {
    // 서버 로그 찍기
    console.log('[/api/debug/envinfo] process.env.REACTPJ_DB_HOST =', process.env.REACTPJ_DB_HOST);
    console.log('[/api/debug/envinfo] full env snapshot (filtered) =', {
        host: process.env.REACTPJ_DB_HOST,
        port: process.env.REACTPJ_DB_PORT,
        user: process.env.REACTPJ_DB_USER,
        name: process.env.REACTPJ_DB_NAME,
        nodeEnv: process.env.NODE_ENV,
    });

    return NextResponse.json({
        host: process.env.REACTPJ_DB_HOST ?? null,
        port: process.env.REACTPJ_DB_PORT ?? null,
        user: process.env.REACTPJ_DB_USER ?? null,
        name: process.env.REACTPJ_DB_NAME ?? null,
        nodeEnv: process.env.NODE_ENV ?? null,
    });
}