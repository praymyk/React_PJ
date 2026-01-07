import { reactpjPool } from './pool';
import type { RowDataPacket } from 'mysql2/promise';

export type UserRow = RowDataPacket & {
    id: number;
    account: string;
    public_id: string;
    name: string;
    profile_name: string | null;
    email: string;
    extension: string | null;
    password_hash: string;
    status: 'active' | 'inactive' | 'hidden';
    created_at: string;
    deactivated_at: string | null;
    updated_at: string;
};

// 로그인 ID 또는 이메일로 조회
export async function findUserByLoginId(loginId: number): Promise<UserRow | null> {
    const [rows] = await reactpjPool.query<UserRow[]>(
        `
            SELECT
                id,
                name,
                profile_name,
                email,
                extension,
                password_hash,
                status
            FROM users
            WHERE account = ? OR email = ?
            LIMIT 1
        `,
        [loginId, loginId],
    );

    return rows[0] ?? null;
}

// User ID( PK )로 조회
export async function findUserById(userId: number): Promise<UserRow | null> {
    const [rows] = await reactpjPool.query<UserRow[]>(
        `
            SELECT
                id,
                account,
                public_id,
                name,
                profile_name,
                email,
                extension,
                status,
                created_at,
                deactivated_at,
                updated_at
            FROM users
            WHERE id = ?
            LIMIT 1
        `,
        [userId],
    );

    return rows[0] ?? null;
}

export type UpdateUserProfileInput = {
    account?: string;
    name?: string;
    profile_name?: string | null;
    email?: string;
    status?: 'active' | 'inactive' | 'hidden';
};

export async function updateUserProfile(
    userId: number,
    input: UpdateUserProfileInput,
): Promise<void> {
    const { account, name, profile_name, email, status } = input;

    await reactpjPool.query(
        `
        UPDATE users
        SET
          account      = COALESCE(?, account),
          name         = COALESCE(?, name),
          profile_name = COALESCE(?, profile_name),
          email        = COALESCE(?, email),
          status       = COALESCE(?, status),
          updated_at   = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [
            account ?? null,
            name ?? null,
            profile_name ?? null,
            email ?? null,
            status ?? null,
            userId,
        ],
    );
}