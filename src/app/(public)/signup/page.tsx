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
    const [accountError, setAccountError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleAccountBlur = async () => {
        if (!formData.account) {
            setAccountError('');
            return;
        }

        try {
            // 백엔드에 아이디 중복 확인 API 호출 (아직 안 만들었다면 만들어야 합니다!)
            await api.get(`/api/auth/check-account?account=${formData.account}`);
            setAccountError(''); // 통과하면 에러 메시지 초기화
        } catch (err: any) {
            // 백엔드에서 409 Conflict 등의 에러를 던지면 캐치
            setAccountError('이미 사용 중인 아이디입니다.');
        }
    };

    // 이메일 입력칸에서 포커스가 벗어날 때 실행되는 함수
    const handleEmailBlur = async () => {
        if (!formData.email) {
            setEmailError('');
            return;
        }

        try {
            await api.get(`/api/auth/check-email?email=${formData.email}`);
            setEmailError('');
        } catch (err: any) {
            setEmailError('이미 가입된 이메일입니다.');
        }
    };

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
                            {emailError && <span className={styles.labelError}>{emailError}</span>}
                        </label>
                        <input
                            type="email"
                            name="email"
                            className={`${styles.signupInput} ${emailError ? styles.inputError : ''}`}
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleEmailBlur}
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
                            {accountError && <span className={styles.labelError}>{accountError}</span>}
                        </label>
                        <input
                            type="text"
                            name="account"
                            className={`${styles.signupInput} ${accountError ? styles.inputError : ''}`}
                            value={formData.account}
                            onChange={handleChange}
                            onBlur={handleAccountBlur}
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
                            {passwordError && <span className={styles.labelError}>{passwordError}</span>}
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