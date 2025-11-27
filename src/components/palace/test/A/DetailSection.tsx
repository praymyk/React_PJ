'use client';

import styles from './TestA.module.scss';
import type { Row } from '@/app/palace/test/a/data';

type Props = {
    row: Row;
};

export default function TestADetailSection({ row }: Props) {
    return (
        <div className={styles.detailLayout}>
            {/* 왼쪽: 기본 상세 카드 */}
            <div className={styles.detailRoot}>
                <h2>{row.name} 상세 정보</h2>
                <p><strong>ID:</strong> {row.id}</p>
                <p><strong>이메일:</strong> {row.email}</p>
                <p>
                    <strong>상태:</strong>{' '}
                    {row.status === 'active' ? '활성' : '비활성'}
                </p>
            </div>

            {/* 오른쪽: 추가 정보/버튼 영역 */}
            <div className={styles.detailSide}>
                {/* 여기에 세로 버튼들 / 추가 정보 */}
                <button className={styles.sideActionBtn}>이력 조회</button>
                <button className={styles.sideActionBtn}>로그 보기</button>
                <button className={styles.sideActionBtn}>기타 액션</button>
            </div>
        </div>
    );
}