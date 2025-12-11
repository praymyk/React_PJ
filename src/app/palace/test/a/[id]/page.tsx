import { notFound } from 'next/navigation';
import DetailContent from '@components/palace/test/A/DetailContent';
import { getDetailPageData } from './data';

type PageProps = { params: { id: string } };

export default async function Page({ params }: PageProps) {
    const data = await getDetailPageData(params.id);
    if (!data) {
        notFound();
    }

    return (
        <DetailContent
            user={data.user}
            userList={data.userList}
        />
    );
}