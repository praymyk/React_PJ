import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function useLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter(); // 추가

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // const response = await fetch('/api/login', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ username, password }),
            // });
            //
            // if (!response.ok) {
            //     throw new Error('로그인 실패');
            // }
            //
            // const data = await response.json();
            // console.log('로그인 성공:', data);

            // 예: 토큰 저장 및 페이지 이동
            // localStorage.setItem('token', data.token);
            // router.push('/dashboard');

            // 임시로 fetch 대신 가짜 응답 생성
            await new Promise((resolve) => setTimeout(resolve, 500)); // 네트워크 지연 시뮬레이션

            const response = {
                ok: true,
                json: async () => ({
                    token: 'mock-token-12345',
                    username,
                    message: '로그인 성공 (mock)',
                }),
            };

            if (!response.ok) {
                throw new Error('로그인 실패');
            }

            const data = await response.json();
            console.log('로그인 성공 (mock):', data);

            // 이동 처리
            router.push('/palace'); // 원하는 경로로 이동
        } catch (err) {
            console.error(err);
            setError('로그인 실패. 다시 시도해주세요.');
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
    };
}