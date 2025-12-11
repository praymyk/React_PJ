'use client';

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import styles from './DetailSection.module.scss';
import type { UserRow } from '@/lib/db/reactpj/users';

import DetailSideActions, {
    type DetailSideAction,
} from '@components/palace/test/A/DetailSection/DetailSideActions';

import DetailSideItemA from '@components/palace/test/A/DetailSection/DetailSideItemA';

// 아래쪽 어떤 패널이 열려있는지 표현할 타입
type ActivePanel = 'history' | 'logs' | 'extra' | null;

type Props = {
    row: UserRow;
}

export default function DetailSection({ row }: Props) {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // TODO : 쿼리 URL에 선택 user 의 사이드 메뉴 선택 값 활용 용도
    const rawPanel = searchParams.get('panel') as ActivePanel | null;

    // 쿼리가 비어 있으면 'history(이력 조회)'를 기본값으로 사용
    const activePanel: ActivePanel = rawPanel ?? 'history';

    const setPanel = (panel: ActivePanel) => {
        const sp = new URLSearchParams(searchParams.toString());

        if (panel) sp.set('panel', panel);
        else sp.delete('panel');

        router.push(`${pathname}?${sp.toString()}`, { scroll: false });
    };

    const actions: DetailSideAction[] = [
        {
            key: 'history',
            label: '이력 조회',
            onClick: () =>
                setPanel(rawPanel === 'history' ? null : 'history'),
        },
        {
            key: 'logs',
            label: '로그 보기',
            onClick: () =>
                setPanel(rawPanel === 'logs' ? null : 'logs'),
        },
        {
            key: 'extra',
            label: '기타 액션',
            onClick: () =>
                setPanel(rawPanel === 'extra' ? null : 'extra'),
        },
    ];

    return (
        <div className={styles.detailSectionRoot}>
            {/* 1) 상단: 기본정보 카드 + 버튼들 */}
            <div className={styles.detailLayout}>
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

                <DetailSideActions
                    actions={actions}
                    activeKey={activePanel}
                />
            </div>

            {/* 2) 하단: 패널(이력 / 로그 / 기타) 영역 */}
            <section className={styles.historySection}>
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

            </section>
        </div>
    );
}