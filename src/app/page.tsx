'use client';

import { useRouter } from 'next/navigation';
import styles from '@styles/index//Home.module.scss';

export default function Home() {
    const router = useRouter();

    return (
        <div className={styles.homeContainer}>
            <h1>REACT</h1>
            <p>REACT 기반 서비스 폼 제작 중.</p>
            <button onClick={() => router.push('/login')}>
                로그인 화면으로 이동
            </button>
        </div>
    );
}