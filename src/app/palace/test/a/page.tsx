import DefaultContent from '@components/palace/test/A/DefaultContent';
import { getDefaultPageData } from './data';

type RawSearchParams = {
    page?: string;
    pageSize?: string;
    keyword?: string;
    status?: string;
};

type PageProps = {
    searchParams: Promise<RawSearchParams>;
};

export default async function Page({ searchParams }: PageProps) {

    const resolved = await searchParams;

    const { rows, total, page, pageSize } =
        await getDefaultPageData(resolved);

    return (
        <DefaultContent
            initialRows={rows}
            page={page}
            total={total}
            pageSize={pageSize}
        />
    );
}