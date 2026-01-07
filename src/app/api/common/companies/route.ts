import { NextResponse } from 'next/server';
import type { Name } from '@/app/(protected)/palace/stats/daily/data';
import { pool } from '@lib/db/aicc';

export async function GET() {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query<any[]>(
        `
            SELECT
            company_id   AS id,
            company_name AS name
            FROM org_company
            WHERE state = 'Y'
            ORDER BY company_name
            `
        );

        const companies: Name[] = rows.map((r) => ({
            id: String(r.id),
            name: String(r.name),
        }));

        return NextResponse.json(companies);
    } catch (err) {
        console.error('[GET /api/common/companies] error:', err);
        return NextResponse.json(
            { message: '회사 목록을 가져오는데 실패했습니다.' },
            { status: 500 },
        );
    } finally {
        conn.release();
    }
}