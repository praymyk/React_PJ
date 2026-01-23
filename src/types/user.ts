export type Profile = {
    companyId: number;
    id: number;
    account: string;
    publicId: string;
    name: string;
    profile_name: string | null;
    email: string;
    username: string;
    extension: string | null;
    status: 'active' | 'inactive' | 'hidden';
    createdAt: string;
    deactivatedAt: string | null;
    updatedAt: string;
};