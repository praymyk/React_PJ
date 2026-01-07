import { reactpjPool } from './pool';
import type { RowDataPacket } from 'mysql2/promise';

export type UserPreferencesRow = RowDataPacket & {
    id: number;
    user_id: number;
    dark_mode: 0 | 1;
    default_page_size: number;
};

export type UserPreferences = {
    userId: number;         // DB users.id (숫자 PK)
    darkMode: boolean;
    defaultPageSize: number;
};


// 1) 조회
export async function getUserPreferences(userId: number): Promise<UserPreferences> {
    const [rows] = await reactpjPool.query<UserPreferencesRow[]>(
        `
            SELECT id, user_id, dark_mode, default_page_size
            FROM user_preferences
            WHERE user_id = ?
        `,
        [userId],
    );

    if (rows.length === 0) {
        return {
            userId,
            darkMode: false,
            defaultPageSize: 20,
        };
    }

    const row = rows[0];
    return {
        userId: row.user_id,
        darkMode: row.dark_mode === 1,
        defaultPageSize: row.default_page_size,
    };
}

// 2) 저장/업서트
export async function upsertUserPreferences(input: UserPreferences): Promise<void> {
    const { userId, darkMode, defaultPageSize } = input;

    await reactpjPool.query(
        `
            INSERT INTO user_preferences (user_id, dark_mode, default_page_size)
            VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE
                                     dark_mode = VALUES(dark_mode),
                                     default_page_size = VALUES(default_page_size)
        `,
        [userId, darkMode ? 1 : 0, defaultPageSize],
    );
}