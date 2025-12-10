import { notFound } from 'next/navigation';
import { getUserById } from '@/lib/db/reactpj';
import TestADetailContent from '@components/palace/test/A/DetailContent';

type PageProps = {
    params: {
        id: string;
    };
};

export default async function Page({ params }: PageProps) {
    const { id } = params;

    const user = await getUserById(id);

    if (!user) {
        // 없는 id면 404로 보냄
        notFound();
    }

    return <TestADetailContent user={user} />;
}