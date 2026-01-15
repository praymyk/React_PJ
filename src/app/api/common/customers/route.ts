import { NextRequest } from 'next/server';
import { createCustomer } from '@/lib/db/reactpj/customers';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            name,
            email,
            status,
        } = body as {
            name?: string;
            email?: string;
            status?: 'active' | 'inactive';
        };

        // TODO : 입력 필드 검증
        if (!name || !email) {
            return Response.json(
                { ok: false, message: 'name, email은 필수입니다.' },
                { status: 400 },
            );
        }

        const created = await createCustomer({
            name,
            email,
            status: status ?? 'active',
        });

        return Response.json(
            { ok: true, data: created },
            { status: 201 },
        );
    } catch (err) {
        console.error('[POST /api/common/customers] error:', err);
        return Response.json(
            { ok: false, message: '서버 오류가 발생했습니다.' },
            { status: 500 },
        );
    }
}