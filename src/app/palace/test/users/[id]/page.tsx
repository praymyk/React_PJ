import { notFound } from 'next/navigation';
import DetailContent from '@components/palace/test/customers/DetailContent';
import {
    getDetailPageData,
    type DetailRawSearchParams,
} from './data';

type PageProps = {
    params: Promise<{ id: string }>;
    searchParams: Promise<DetailRawSearchParams>;
};

export default async function Page({ params, searchParams }: PageProps) {
    const { id } = await params;
    const raw = await searchParams;

    const data = await getDetailPageData(id, raw);
    if (!data) notFound();

    return (
        <DetailContent
            user={data.user}
            userList={data.userList}
            page={data.page}
            pageSize={data.pageSize}
            total={data.total}
        />
    );
}