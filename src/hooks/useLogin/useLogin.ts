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

            await login({ username, password });

            const maxAge = rememberId ? 60 * 60 * 24 * 30 : 0;
            document.cookie = `rememberedLoginId=${rememberId ? encodeURIComponent(username) : ''}; path=/; max-age=${maxAge}`;

            router.push('/palace');

        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.message || err.message || '로그인 실패.';
            setError(msg);
            setLoading(false); // 실패했을 때만 로딩 끔 (다시 입력해야 하니까)
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