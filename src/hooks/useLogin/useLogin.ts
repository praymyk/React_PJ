import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [rememberId, setRememberId] = useState(false);
    const router = useRouter();

    // 최초 > 저장된 아이디 로드
    useEffect(() => {

        const match = document.cookie.match(
            /(?:^|;\s*)rememberedLoginId=([^;]+)/
        );
        if (match) {
            const saved = decodeURIComponent(match[1]);
            setUsername(saved);
            setRememberId(true);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                const msg =
                    (data && data.message) ||
                    '로그인에 실패했습니다. 아이디/비밀번호를 확인해주세요.';
                throw new Error(msg);
            }

            // TODO: 로그인 직후 클라이언트에서 적용할 계정별 설정들을 처리하는 위치.
            //  - 현재는 darkMode만 반영 중
            //    여기에서 data.preferences.* 를 읽어 전역 상태/스토어에 저장 필요
            const darkModeFromServer = Boolean(data.preferences?.darkMode);
            if (typeof window !== 'undefined') {
                document.documentElement.classList.toggle('dark', darkModeFromServer);
                window.localStorage.setItem(
                    'theme',
                    darkModeFromServer ? 'dark' : 'light',
                );
            }

            // ★ 쿠키 기반 세션
            // 아이디 저장 옵션 처리(로그인ID > Cookie)
            if (rememberId) {
                // 30일 유지
                document.cookie = [
                    `rememberedLoginId=${encodeURIComponent(username)}`,
                    'path=/',
                    'max-age=' + 60 * 60 * 24 * 30,
                ].join('; ');
            } else {
                // 쿠키 삭제
                document.cookie = [
                    'rememberedLoginId=',
                    'path=/',
                    'max-age=0',
                ].join('; ');
            }
            // 로그인 후 이동
            router.push('/palace');

        } catch (err) {
            console.error(err);
            const msg =
                err instanceof Error
                    ? err.message
                    : '로그인 실패. 다시 시도해주세요.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return {
        username,
        setUsername,
        password,
        setPassword,
        loading,
        error,
        handleSubmit,
        rememberId,
        setRememberId,
    };
}