import { NextRequest, NextResponse } from 'next/server';
import {
    getCategoryKinds,
    getCategoriesByCompany,
} from '@/lib/db/reactpj/category';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const companyId = Number(searchParams.get('companyId') ?? '1') || 1;

        const [kindRows, categoryRows] = await Promise.all([
            getCategoryKinds(),
            getCategoriesByCompany(companyId),
        ]);

        return NextResponse.json({
            companyId,
            kinds: kindRows,
            categories: categoryRows,
        });
    } catch (err) {
        console.error('[GET /api/common/categories] error:', err);
        return NextResponse.json(
            { message: '카테고리 정보를 가져오는데 실패했습니다.' },
            { status: 500 },
        );
    }
}