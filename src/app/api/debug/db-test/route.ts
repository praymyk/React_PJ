// root/api/debug/db-test DB 접속 여부 체크
import { NextResponse } from 'next/server';
import { reactpjPool } from '@/lib/db/reactpj/pool';

export async function GET() {
    try {
        const [rows] = await reactpjPool.query('SELECT 1 AS v');
        return NextResponse.json({
            ok: true,
            rows,
            host: process.env.REACTPJ_DB_HOST,
            db: process.env.REACTPJ_DB_NAME,
        });
    } catch (err: any) {
        console.error('DB TEST ERROR:', err);
        return NextResponse.json(
            {
                ok: false,
                message: String(err?.message ?? err),
                code: err?.code,
                errno: err?.errno,
            },
            { status: 500 },
        );
    }
}