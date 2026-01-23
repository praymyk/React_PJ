'use client';

import { useState,  useEffect, FormEvent } from 'react';
import api from '@utils/axios'
import styles from '@components/palace/test/customers/modal/CustomerCreateModal.module.scss'

interface Company {
    id: number;
    name: string;
}

type CustomerCreateModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
};


export default function CustomerCreateModal({
                                                isOpen,
                                                onClose,
                                                onSuccess,
                                            }: CustomerCreateModalProps) {

    const [companies, setCompanies] = useState<Company[]>([]); // 업체 목록
    const [companyId, setCompanyId] = useState<number | ''>(''); // 선택된 업체 ID
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive'>('active');
    const [phone, setPhone] = useState('');
    const [organization, setOrganization] = useState('');
    const [memo, setMemo] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [loadingCompanies, setLoadingCompanies] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        const fetchCompanies = async () => {
            setLoadingCompanies(true);
            try {
                const res = await api.get('/api/companies');
                setCompanies(res.data);
            } catch (err) {
                console.error('업체 목록 로드 실패:', err);
                setErrorMsg('업체 정보를 불러오지 못했습니다.');
            } finally {
                setLoadingCompanies(false);
            }
        };

        fetchCompanies();
    }, [isOpen]);

    if (!isOpen) return null;

    const resetForm = () => {
        setCompanyId('');
        setName('');
        setEmail('');
        setStatus('active');
        setPhone('');
        setOrganization('');
        setMemo('');
        setErrorMsg(null);
    };

    const handleClose = () => {
        if (submitting) return;
        resetForm();
        onClose();
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (submitting) return;

        // 간단한 검증
        if (!name.trim()) {
            setErrorMsg('이름을 입력해 주세요.');
            return;
        }
        if (!email.trim()) {
            setErrorMsg('이메일을 입력해 주세요.');
            return;
        }

        setErrorMsg(null);
        setSubmitting(true);

        try {
            await api.post('/api/customers', {
                companyId: Number(companyId),
                name: name.trim(),
                email: email.trim(),
                status,
                phone: phone.trim() || undefined,
                organization: organization.trim() || undefined,
                memo: memo.trim() || undefined,
            });

            // 성공 시 폼 리셋 + 모달 닫기
            alert('고객이 등록되었습니다.');
            resetForm();
            onClose();

            // TODO : 고객 정보 등록 후 이벤트 추가 영역
            if (onSuccess) onSuccess();

        } catch (err) {
            console.error(err);
            setErrorMsg('저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.backdrop} role="dialog" aria-modal="true">
            <div className={styles.dialog}>
                {/* 헤더 */}
                <header className={styles.header}>
                    <h2 className={styles.title}>고객 등록</h2>
                    <button
                        type="button"
                        className={styles.iconButton}
                        onClick={handleClose}
                        aria-label="닫기"
                    >
                        ×
                    </button>
                </header>

                {/* 바디 */}
                <form className={styles.body} onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <label className={styles.label}>
                            업체<span className={styles.requiredMark}>*</span>
                        </label>
                        <select
                            className={styles.select}
                            value={companyId}
                            onChange={(e) => setCompanyId(Number(e.target.value))}
                            required
                            // 1. 로딩 중일 때
                            disabled={loadingCompanies}
                        >
                            {/* 2. 로딩 상태에 따라 안내 문구를 다르게 표시 */}
                            <option value="">
                                {loadingCompanies ? '목록을 불러오는 중...' : '업체를 선택해 주세요'}
                            </option>

                            {/* 3. 데이터가 있을 때만 렌더링 */}
                            {!loadingCompanies && companies.map((company) => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.label}>
                            이름<span className={styles.requiredMark}>*</span>
                        </label>
                        <input
                            className={styles.input}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="예: 홍냐냐"
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.label}>
                            이메일<span className={styles.requiredMark}>*</span>
                        </label>
                        <input
                            className={styles.input}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="예: user@example.com"
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.label}>상태</label>
                        <select
                            className={styles.select}
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value === 'inactive' ? 'inactive' : 'active')
                            }
                        >
                            <option value="active">활성</option>
                            <option value="inactive">비활성</option>
                        </select>
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.label}>연락처</label>
                        <input
                            className={styles.input}
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="예: 010-1234-5678"
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.label}>소속/회사명</label>
                        <input
                            className={styles.input}
                            type="text"
                            value={organization}
                            onChange={(e) => setOrganization(e.target.value)}
                            placeholder="예: 냠냠 .inc"
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.label}>메모</label>
                        <textarea
                            className={styles.textarea}
                            rows={3}
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            placeholder="고객 특이사항, 참고 메모 등을 입력해 주세요."
                        />
                    </div>

                    {errorMsg && <div className={styles.errorText}>{errorMsg}</div>}

                    {/* 푸터 */}
                    <footer className={styles.footer}>
                        <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={handleClose}
                            disabled={submitting}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className={styles.primaryButton}
                            disabled={submitting}
                        >
                            {submitting ? '저장 중…' : '등록'}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
}