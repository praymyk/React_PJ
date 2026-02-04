import DefaultContent from '@components/palace/ticket/DefaultContent';
import { getCompanyIdSSR } from '@/api/auth';
import { buildCookieHeader } from "@utils/ssrCookie";

export default async function Page() {

    const cookieHeader = await buildCookieHeader();
    const companyId = await getCompanyIdSSR(cookieHeader);

    return <DefaultContent initialCompanyId={companyId} />;
}