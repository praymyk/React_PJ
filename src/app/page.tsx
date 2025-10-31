'use client';

import { useRouter } from 'next/navigation';
import styles from '@/styles/page//Home.module.scss';

export default function Home() {
    const router = useRouter();

    return (
        <div className={styles.homeContainer}>
            <h1>REACT</h1>
            <p>서비스에 오신 것을 환영합니다.</p>
            <button onClick={() => router.push('/login')}>
                로그인 화면으로 이동
            </button>
        </div>
    );
}