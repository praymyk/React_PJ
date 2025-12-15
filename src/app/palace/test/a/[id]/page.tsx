import { notFound } from 'next/navigation';
import DetailContent from '@components/palace/test/A/DetailContent';
import {
    getDetailPageData,
    type DetailRawSearchParams,
} from './data';

type PageProps = {
    params: { id: string };
    searchParams: Promise<DetailRawSearchParams>;
};

export default async function Page({ params, searchParams }: PageProps) {
    const raw = await searchParams;

    const data = await getDetailPageData(params.id, raw);
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