'use client'; // 나중에 서버 컴포넌트로 빼고 싶으면 이거 제거해도 됨

import TestDefaultContent from '@components/test/A/TestDefaultContent';
import styles from './A.module.scss';
import { mockRows, type Row } from './data';

export default function TestPage() {
    return (
        <div className={styles.root}>
            테스트/a 경로 페이지 전용 내용

            {/*
                테이블 > 공용 MasterTable.tsx 사용
              */}
            <TestDefaultContent rows={mockRows} mode="list"/>
        </div>
    );
}