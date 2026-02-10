import {buildCookieHeader} from "@utils/ssrCookie";
import {getCompanyIdSSR} from "@/api/auth";

import DefaultContentInner from "./DefaultContentInner"

export default async function DefaultContent() {

    const cookieHeader = await buildCookieHeader();
    const companyId = await getCompanyIdSSR(cookieHeader);

    return (
        <DefaultContentInner companyId={companyId} />
    );
}