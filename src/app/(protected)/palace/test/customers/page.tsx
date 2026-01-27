import DefaultContent from '@components/palace/test/customers/DefaultContent';
import { getDefaultPageData } from './data';

type RawSearchParams = {
    page?: string;
    pageSize?: string;
    keyword?: string;
    status?: string;
};

type PageProps = {
    // Next 15 / React 19 스타일: searchParams가 Promise로 들어옴
    searchParams: Promise<RawSearchParams>;
};

export default async function Page({ searchParams }: PageProps) {
    // 1) URL 쿼리 언래핑
    const resolved = await searchParams;

    // 2) DB 조회 (SSR)
    const { rows, total, page, pageSize } = await getDefaultPageData(resolved);

    console.log(await getDefaultPageData(resolved));

    // 3) 클라 컴포넌트에 "조회 결과"를 props로 전달
    return (
        <DefaultContent
            initialRows={rows}
            page={page}
            total={total}
            pageSize={pageSize}
            // 검색폼 초기값 유지를 위해 전달
            initialKeyword={resolved.keyword ?? ''}
            initialStatus={resolved.status ?? ''}
        />
    );
}