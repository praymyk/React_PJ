export type UserStatus = 'active' | 'inactive';

export type UserInfo = {
    id: number;
    companyId: number;
    name: string;
    profileName?: string | null;
    email?: string | null;
    extension?: string | null;
};

export type UserPreferences = {
    darkMode: boolean;
};

/** 내정보(프로필) 조회용 type */
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

/** /api/auth/login 응답 body */
export type LoginResponse = {
    message?: string;
    user: UserInfo;
    preferences: UserPreferences;
};

/** /api/auth/me 응답 */
export type MeResponse = {
    user: UserInfo;
    preferences: UserPreferences;
};

