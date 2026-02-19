'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@utils/axios';
import styles from './SignupPage.module.scss';

export default function SignupPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        account: '',
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
    });

    const [loading, setLoading] = useState(false);

    const [globalError, setGlobalError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setGlobalError('');
    };

    useEffect(() => {
        if (formData.passwordConfirm.length > 0) {
            if (formData.password !== formData.passwordConfirm) {
                setPasswordError('비밀번호가 일치하지 않습니다.');
            } else {
                setPasswordError('');
            }
        } else {
            setPasswordError('');
        }
    }, [formData.password, formData.passwordConfirm]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setGlobalError('');

        // 1. 프론트엔드 빈 값 검증
        if (!formData.account || !formData.name || !formData.email || !formData.password) {
            setGlobalError('모든 필수 항목을 입력해 주세요.');
            return;
        }

        // 2. 비밀번호 불일치 상태면 제출 차단
        if (passwordError || formData.password !== formData.passwordConfirm) {
            setGlobalError('비밀번호를 다시 확인해 주세요.');
            return;
        }

        setLoading(true);

        try {
            await api.post('/api/auth/signup', {
                account: formData.account,
                name: formData.name,
                email: formData.email,
                password: formData.password,
                companyId: 1,
            });

            alert('회원가입이 완료되었습니다! 로그인해 주세요.');
            router.push('/login');

        } catch (err: any) {
            console.error(err);
            setGlobalError(err.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.signupContainer}>
            <div className={styles.signupCard}>
                <h1 className={styles.signupTitle}>계정 만들기</h1>
                <p className={styles.signupSubtitle}>서비스 이용을 위해 정보를 입력해주세요.</p>

                <form className={styles.signupForm} onSubmit={handleSubmit}>

                    <div className={styles.inputGroup}>
                        <label className={styles.signupLabel}>
                            이메일<span className={styles.labelRequired}>*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            className={styles.signupInput}
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@email.com"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.signupLabel}>
                            이름<span className={styles.labelRequired}>*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            className={styles.signupInput}
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="홍길동"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.signupLabel}>
                            아이디<span className={styles.labelRequired}>*</span>
                        </label>
                        <input
                            type="text"
                            name="account"
                            className={styles.signupInput}
                            value={formData.account}
                            onChange={handleChange}
                            placeholder="로그인에 사용할 아이디"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.signupLabel}>
                            비밀번호<span className={styles.labelRequired}>*</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            className={styles.signupInput}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="비밀번호 입력"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.signupLabel}>
                            비밀번호 확인<span className={styles.labelRequired}>*</span>
                        </label>
                        <input
                            type="password"
                            name="passwordConfirm"
                            className={styles.signupInput}
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            placeholder="비밀번호 다시 입력"
                            required
                        />
                        {/* 비밀번호 검증 에러 */}
                        {passwordError && <div className={styles.errorText}>{passwordError}</div>}
                    </div>

                    {/* 전체 폼 또는 API 에러 메시지 렌더링 */}
                    {globalError && <div className={styles.errorText}>{globalError}</div>}

                    <button
                        type="submit"
                        className={styles.signupButton}
                        disabled={loading || !!passwordError}
                    >
                        {loading ? '가입 처리 중...' : '회원가입'}
                    </button>
                </form>

                <div className={styles.loginRow}>
                    이미 계정이 있으신가요?
                    <Link href="/login" className={styles.loginLink}>
                        로그인
                    </Link>
                </div>
            </div>
        </div>
    );
}