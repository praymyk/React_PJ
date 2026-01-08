// root/api/debug/envinfo
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        host: process.env.REACTPJ_DB_HOST,
        port: process.env.REACTPJ_DB_PORT,
        user: process.env.REACTPJ_DB_USER,
        name: process.env.REACTPJ_DB_NAME,
    });
}