import DefaultContent from '@components/palace/test/A/DefaultContent';
import { getDefaultPageData } from './data';

type PageProps = { searchParams: { page?: number } };

export default async function Page({ searchParams }: PageProps) {
    const page = Number(searchParams.page ?? '1') || 1;
    const pageSize = 2;

    const { userList, total } = await getDefaultPageData(page, pageSize);

    return (
        <DefaultContent
            initialRows={userList}
            page={page}
            total={total}
            pageSize={pageSize}
        />
    );
}