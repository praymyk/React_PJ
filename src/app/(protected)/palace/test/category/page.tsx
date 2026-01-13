import DefaultContent from '@components/palace/test/category/DefaultContent';
import { getCategoryPageData } from './data';

// TODO: 임시 company_id 추후 바로보는 카테고리 주체 정의 필요
const DEFAULT_COMPANY_ID = 1;

export default async function Page() {
    const { kindOptions, initialNodes, initialSelectedKind } =
        await getCategoryPageData({ companyId: String(DEFAULT_COMPANY_ID) });

    return (
        <DefaultContent
            companyId={DEFAULT_COMPANY_ID}
            kindOptions={kindOptions}
            initialNodes={initialNodes}
            initialSelectedKind={initialSelectedKind}
        />
    );
}