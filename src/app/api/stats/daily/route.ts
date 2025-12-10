import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@lib/db/aicc';
import type { Row } from '@/app/palace/stats/daily/data';

function getMonthRange(month: string) {
    // month: '2025-10'
    const [yearStr, monthStr] = month.split('-');
    const year = Number(yearStr);
    const m = Number(monthStr); // 1~12

    const monthStart = `${month}-01`;

    // 다음 달 1일 계산
    const nextMonthDate = new Date(year, m, 1); // JS: month 인자 = 실제월
    const nextMonth =
        `${nextMonthDate.getFullYear()}-` +
        String(nextMonthDate.getMonth() + 1).padStart(2, '0') +
        '-01';

    return { monthStart, monthEnd: nextMonth };
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const companyId = searchParams.get('companyId'); // 예: '1'
    const month = searchParams.get('month');         // 예: '2025-10'

    if (!companyId || !month) {
        return NextResponse.json(
            { error: 'companyId와 month(YYYY-MM)는 필수입니다.' },
            { status: 400 },
        );
    }

    const { monthStart, monthEnd } = getMonthRange(month);

    const sql = `
    SELECT
        ua.agent_id                           AS id,
        ua.agent_name                         AS name,
        ua.ps_auths_id                        AS ext,
        CASE ua.state
          WHEN 'Y' THEN 'active'
          ELSE 'inactive'
        END                                   AS status,
        MIN(DATE(cs.start_time))              AS startDate,
        MAX(DATE(cs.start_time))              AS endDate,
        COUNT(DISTINCT DATE(cs.start_time))   AS useCount,
        GROUP_CONCAT(
          DISTINCT DATE_FORMAT(cs.start_time, '%Y-%m-%d')
          ORDER BY DATE(cs.start_time)
          SEPARATOR ','
        )                                     AS useDaysCsv
    FROM usr_agent ua
    LEFT JOIN call_session cs
      ON cs.agent_id = ua.agent_id
      AND cs.start_time >= ?
      AND cs.start_time <  ?
    WHERE ua.company_id = ?
    GROUP BY
        ua.agent_id,
        ua.agent_name,
        ua.ps_auths_id,
        ua.state
    ORDER BY ua.agent_name
  ` as const;

    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query<any[]>(sql, [
            monthStart,
            monthEnd,
            companyId,
        ]);

        const data: Row[] = rows.map((r) => ({
            id: String(r.id),
            name: r.name,
            ext: r.ext === null ? null : String(r.ext),
            status: r.status === 'active' ? 'active' : 'inactive',
            startDate: r.startDate ? String(r.startDate) : '',
            endDate: r.endDate ? String(r.endDate) : '',
            useCount: Number(r.useCount ?? 0),
            useDays: r.useDaysCsv
                ? String(r.useDaysCsv).split(',').filter(Boolean)
                : [],
        }));

        return NextResponse.json(data);
    } catch (err) {
        console.error('[API /stats/daily] error:', err);
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 },
        );
    } finally {
        conn.release();
    }
}