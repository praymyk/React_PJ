import { NextRequest, NextResponse } from 'next/server';
import {
    replaceCategoryTreeForKind,
    type CategoryKindCode,
    type CategoryTreeSaveNode,
} from '@lib/db/reactpj/category';

type SaveCategoryRequest = {
    companyId: number;
    kind: CategoryKindCode;
    nodes: CategoryTreeSaveNode[];
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const companyId = Number(body.companyId);
        const kind = body.kind as 'consult' | 'reserve' | 'etc' | string;
        const nodes = body.nodes as {
            id: number | null;
            clientId: number;
            parentClientId: number | null;
            level: number;
            name: string;
            sortOrder: number;
            active: boolean;
        }[];

        if (!companyId || !kind || !Array.isArray(nodes)) {
            return NextResponse.json(
                { ok: false, message: 'Invalid payload' },
                { status: 400 },
            );
        }

        await replaceCategoryTreeForKind({ companyId, kind, nodes });

        return NextResponse.json({ ok: true });
    } catch (err: any) {
        console.error('[POST /api/common/categories/tree] error:', err);
        return NextResponse.json(
            { ok: false, message: 'internal error' },
            { status: 500 },
        );
    }
}