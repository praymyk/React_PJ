import { useState, useEffect } from 'react';
import { login } from '@/api/auth';
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
            const res = await login({ username, password });

            // 아이디 저장
            const maxAge = rememberId ? 60 * 60 * 24 * 30 : 0;
            document.cookie = `rememberedLoginId=${rememberId ? encodeURIComponent(username) : ''}; path=/; max-age=${maxAge}`;

            // Hybrid: accessToken 저장
            sessionStorage.setItem('accessToken', res.accessToken);

            router.push('/palace');

        } catch (err: any) {
            console.error(err);

            setLoading(false);

            const msg = err?.message || '로그인 실패.';
            setError(msg);
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