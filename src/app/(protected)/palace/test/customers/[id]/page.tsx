import { notFound } from 'next/navigation';
import DetailContent from '@components/palace/test/customers/DetailContent';
import { getDetailPageData } from './data';

import type { CustomerSearchParams } from '@/types/customer';

type PageProps = {
    params: Promise<{ id: string }>;
    searchParams: Promise<CustomerSearchParams>;
};

export default async function Page({ params, searchParams }: PageProps) {
    // Next.js 15+: params와 searchParams는 await 처리 필요
    const { id } = await params;
    const raw = await searchParams;

    // SSR 데이터 로딩 (리스트 + 상세 병렬 조회 로직 포함)
    const data = await getDetailPageData(id, raw);

    if (!data) notFound();

    return (
        <DetailContent
            customer={data.customer}
            customerList={data.customerList}
            page={data.page}
            pageSize={data.pageSize}
            total={data.total}
        />
    );
}