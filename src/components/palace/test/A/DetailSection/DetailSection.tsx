'use client';

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import styles from './DetailSection.module.scss';
import type { Row } from '@/app/palace/test/a/data';

import DetailSideActions, {
    type DetailSideAction,
} from '@components/palace/test/A/DetailSection/DetailSideActions';

import DetailSideItemA from '@components/palace/test/A/DetailSection/DetailSideItemA';

// 아래쪽 어떤 패널이 열려있는지 표현할 타입
type ActivePanel = 'history' | 'logs' | 'extra' | null;

type Props = {
    row: Row;
}

export default function DetailSection({ row }: Props) {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // 어떤 패널이 열려있는지 상태로 관리
    const activePanel = (searchParams.get('panel') as ActivePanel) ?? null;

    const setPanel = (panel: ActivePanel) => {

        // URL 쿼리 업데이트
        const sp = new URLSearchParams(searchParams.toString());

        if (panel) {
            sp.set('panel', panel);
        } else {
            sp.delete('panel');
        }

        router.push(`${pathname}?${sp.toString()}`, { scroll: false });
    };

    const actions: DetailSideAction[] = [
        {
            key: 'history',
            label: '이력 조회',
            onClick: () => {
                setPanel(activePanel === 'history' ? null : 'history');
            },
        },
        {
            key: 'logs',
            label: '로그 보기',
            onClick: () => {
                setPanel(activePanel === 'logs' ? null : 'logs');
            },
        },
        {
            key: 'extra',
            label: '기타 액션',
            onClick: () => {
                setPanel(activePanel === 'extra' ? null : 'extra');
            },
        },
    ];

    return (
        <div className={styles.detailSectionRoot}>
            {/* 위쪽: 왼쪽 상세 카드 + 오른쪽 버튼 */}
            <div className={styles.detailLayout}>
                {/* 왼쪽: 기본 상세 카드 */}
                <div className={styles.detailRoot}>
                    <h2>{row.name} 상세 정보</h2>
                    <p>
                        <strong>ID:</strong> {row.id}
                    </p>
                    <p>
                        <strong>이메일:</strong> {row.email}
                    </p>
                    <p>
                        <strong>상태:</strong>{' '}
                        {row.status === 'active' ? '활성' : '비활성'}
                    </p>
                </div>

                {/* 오른쪽: 추가 정보/버튼 영역 */}
                <DetailSideActions
                    actions={actions}
                    activeKey={activePanel}/>
            </div>

            {/* 아래쪽: 선택된 패널(이력/로그/기타) 내용 표시 영역 */}
            {activePanel === 'history' && (
                <DetailSideItemA row={row} />
            )}

            {activePanel === 'logs' && (
                <div className={styles.bottomPanel}>
                    <h3 className={styles.bottomPanelTitle}>로그 보기</h3>
                    <p>여기에 row.id={row.id} 에 대한 로그 내용</p>
                </div>
            )}

            {activePanel === 'extra' && (
                <div className={styles.bottomPanel}>
                    <h3 className={styles.bottomPanelTitle}>기타 액션</h3>
                    <p>추가 정보나 기능 영역</p>
                </div>
            )}
        </div>
    );
}