import { createServerApi } from '@utils/axios';

export type MeResponse = {
    id: number;
    companyId: number;
    name: string;
    profileName?: string;
    email: string;
    extension?: string;
};

export async function getMeSSR(cookieHeader: string) {
    const api = createServerApi(cookieHeader);
    const res = await api.get<MeResponse>('/api/auth/me');
    return res.data;
}

export async function getCompanyIdSSR(cookieHeader: string) {
    const me = await getMeSSR(cookieHeader);
    return me.companyId;
}