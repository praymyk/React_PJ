import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getMeSSR } from '@/api/auth';
import { getWorkSSR } from '@/api/works';
import StudioEpisodeEditorContent from '@components/palace2/studio/StudioEpisodeEditorContent';

export default async function StudioEpisodeEditorPage({
    params,
}: {
    params: Promise<{ workId: string; episodeId: string }>;
}) {
    const { workId } = await params;
    const cookieHeader = (await cookies()).toString();

    try {
        // 1. 현재 로그인 사용자 정보 조회
        const me = await getMeSSR(cookieHeader);

        // 2. 작품 상세 정보 조회
        const work = await getWorkSSR(workId, cookieHeader);

        // 3. 소유권 체크 (작품 작성자와 현재 사용자가 일치하는지)
        // 백엔드 데이터 구조에 따라 me.user.id 또는 me.id 등을 확인해야 함
        const userId = me.user?.id || (me as any).id;
        
        if (work.authorUserId !== userId) {
            console.warn(`[Security] Unauthorized access: User ${userId} tried to access Work ${workId}`);
            // 권한이 없으면 스튜디오 메인으로 튕김
            redirect('/palace2/studio');
        }

    } catch (error) {
        // 리다이렉트 예외는 무시하고 다른 에러만 처리
        if ((error as any).digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        
        console.error('Permission check failed:', error);
        // 세션 만료 등의 사유로 정보를 가져오지 못하면 로그인 페이지로
        redirect('/login');
    }

    return <StudioEpisodeEditorContent />;
}
