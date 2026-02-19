'use client';

import { useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function GlobalError({
                                        error,
                                        reset,
                                    }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Sentry 같은 에러 수집 도구에 에러를 로깅할 수 있습니다.
        console.error('Global Error Caught:', error);
    }, [error]);

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', minHeight: '100vh', backgroundColor: '#fef2f2',
            textAlign: 'center', padding: '2rem'
        }}>
            <FaExclamationTriangle size={64} color="#ef4444" style={{ marginBottom: '1.5rem' }} />
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7f1d1d', marginBottom: '1rem' }}>
                일시적인 오류가 발생했습니다.
            </h1>
            <p style={{ color: '#991b1b', marginBottom: '2rem', fontSize: '1.125rem', lineHeight: '1.5' }}>
                페이지를 불러오는 중 문제가 발생했습니다.<br />
                잠시 후 다시 시도해 주세요.
            </p>
            <button
                onClick={() => reset()}
                style={{
                    padding: '0.75rem 1.5rem', backgroundColor: '#ef4444', color: 'white',
                    borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '600'
                }}
            >
                다시 시도하기
            </button>
        </div>
    );
}