'use client';

import styles from '@/app/(public)/login/Login.module.scss';
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
        rememberId,
        setRememberId,
    } = useLogin();

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <h1 className={styles.loginTitle}> 냠냠프로젝트 로그인</h1>
                <p className={styles.loginSubtitle}>
                    냠냠사이트 확인을 위해 계정으로 로그인해주세요.
                </p>
                {error && (
                    <p className={styles.errorText}>{error}</p>
                )}
                <form className={styles.loginForm} onSubmit={handleSubmit}>
                    <input
                        className={styles.loginInput}
                        type="text"
                        placeholder="아이디"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                    />
                    <input
                        className={styles.loginInput}
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />

                    <button
                        type="submit"
                        className={styles.loginButton}
                        disabled={loading}
                    >
                        {loading ? '로그인 중...' : '로그인'}
                    </button>

                    <div className={styles.loginActions}>
                        <label className={styles.rememberRow}>
                            <input
                                type="checkbox"
                                checked={rememberId}
                                onChange={(e) => setRememberId(e.target.checked)}
                            />
                            <span>아이디 저장</span>
                        </label>
                    </div>
                </form>
            </div>
        </div>
    );
}