import { notFound } from 'next/navigation';
import { mockRows, type Row } from '../data';
import styles from '../A.module.scss';
import TestDefaultContent from "@components/test/A/TestDefaultContent"; // 필요하면 재사용, 없으면 새 모듈 만들어도 됨

type Props = {
    params: {
        id: string;
    };
};

export default function TestDetailPage({ params }: Props) {
    const { id } = params;
    const row = mockRows.find((r: Row) => r.id === id);

    if (!row) {
        notFound();
    }

    const selectedIndex = mockRows.findIndex((r: Row) => r.id === id);
    const safeSelectedIndex = selectedIndex >= 0 ? selectedIndex : null;

    return (
        <div className={styles.root}>
            테스트/a 경로 페이지 전용 내용

            <div className={styles.detailRoot}>
                <h2>{row.name} 상세 정보</h2>
                <p><strong>ID:</strong> {row.id}</p>
                <p><strong>이메일:</strong> {row.email}</p>
                <p>
                    <strong>상태:</strong>{' '}
                    {row.status === 'active' ? '활성' : '비활성'}
                </p>
            </div>
            <TestDefaultContent
                rows={mockRows}
                mode="detail"
                selectedIndex = {safeSelectedIndex}
            />
        </div>
    );
}