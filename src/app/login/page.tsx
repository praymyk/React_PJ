'use client';

import styles from '@styles/index/Login.module.scss';
import { useLogin } from '@hooks/useLogin/useLogin';

export default function LoginPage() {
    const {
        username,
        setUsername,
        password,
        setPassword,
        loading,
        error,
        handleSubmit,
    } = useLogin();

    return (
        <div className={styles.loginContainer}>
            <h1>로그인</h1>
            <form className={styles.loginForm} onSubmit={handleSubmit}>
                <input
                    className={styles.loginInput}
                    type="text"
                    placeholder="아이디"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className={styles.loginInput}
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? '로그인 중...' : '로그인'}
                </button>
            </form>
        </div>
    );
}