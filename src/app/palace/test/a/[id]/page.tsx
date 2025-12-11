import { notFound } from 'next/navigation';
import DetailContent from '@components/palace/test/A/DetailContent';
import { getDetailPageData } from './data';

type PageProps = {
    params: { id: string };
    searchParams: {
        page?: string;
        pageSize?: string;
    };
};

export default async function Page({ params, searchParams }: PageProps) {
    const id = params.id;

    const page = Number(searchParams.page ?? '1') || 1;
    const pageSize = Number(searchParams.pageSize ?? '10') || 10;

    const data = await getDetailPageData(id, page, pageSize);
    if (!data) {
        notFound();
    }

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