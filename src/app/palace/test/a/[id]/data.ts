import { getUserById, getUsers } from '@/lib/db/reactpj';
import type { UserRow } from '@/lib/db/reactpj';

export type DetailPageData = {
    user: UserRow;
    userList: UserRow[];
};

export async function getDetailPageData(id: string): Promise<DetailPageData | null> {
    const user = await getUserById(id);
    if (!user) return null;

    const userList = await getUsers();
    return { user, userList };
}