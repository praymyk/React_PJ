import { getUserById, getUsersPaged } from '@/lib/db/reactpj/users';
import type { UserRow } from '@/lib/db/reactpj/users';

export type DetailPageData = {
  user: UserRow;
  userList: UserRow[];
  total: number;
  page: number;
  pageSize: number;
};

export async function getDetailPageData(
  id: string,
  page: number,
  pageSize: number,
): Promise<DetailPageData | null> {
  const user = await getUserById(id);
  if (!user) return null;

  const { rows, total } = await getUsersPaged(page, pageSize);

  return {
    user,
    userList: rows,
    total,
    page,
    pageSize,
  };
}