import { useState, useEffect } from 'react';
import api from '@utils/axios';
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

            const response = await api.post('/api/auth/login', {
                username,
                password
            });

            const data = response.data;

            // 사용자 설정(다크모드) 처리
            const darkModeFromServer = Boolean(data.preferences?.darkMode);
            if (typeof window !== 'undefined') {
                document.documentElement.classList.toggle('dark', darkModeFromServer);
                window.localStorage.setItem(
                    'theme',
                    darkModeFromServer ? 'dark' : 'light',
                );
            }

            // ★ 쿠키 기반 아이디 저장 (클라이언트 로직)
            if (rememberId) {
                document.cookie = [
                    `rememberedLoginId=${encodeURIComponent(username)}`,
                    'path=/',
                    'max-age=' + 60 * 60 * 24 * 30,
                ].join('; ');
            } else {
                document.cookie = [
                    'rememberedLoginId=',
                    'path=/',
                    'max-age=0',
                ].join('; ');
            }

            router.push('/palace');

        } catch (err: any) {
            console.error(err);

            const msg =
                err.response?.data?.message ||
                err.message ||
                '로그인 실패. 다시 시도해주세요.';

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