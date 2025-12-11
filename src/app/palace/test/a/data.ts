import { getUsersPaged } from '@/lib/db/reactpj/users';

export async function getDefaultPageData(page: number, pageSize: number) {
    const result = await getUsersPaged(page, pageSize);
    return { userList: result.rows, total: result.total };
}