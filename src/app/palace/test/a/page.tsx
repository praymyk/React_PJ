import { getUsers } from '@/lib/db/reactpj';
import DefaultContent from '@components/palace/test/A/DefaultContent';

export default async function Page() {
    const users = await getUsers();
    return <DefaultContent initialRows={users} />;
}