'use client';

import styles from './DetailSection.module.scss';

export type DetailSideAction = {
    key: string;          // 버튼마다 고유 key
    label: string;        // 버튼에 표시할 글자
    onClick?: () => void; // (선택) 클릭 시 실행할 함수
};

type Props = {
    actions: DetailSideAction[];
    activeKey?: string | null;
};

export default function DetailSideActions({ actions, activeKey }: Props) {
    return (
        <div className={styles.detailSide}>
            {actions.map(action => {
                const isActive = activeKey === action.key;

                return (
                    <button
                        key={action.key}
                        type="button"
                        className={
                            isActive
                                ? `${styles.sideActionBtn} ${styles['sideActionBtn--active']}`
                                : styles.sideActionBtn
                        }
                        onClick={action.onClick}
                        aria-pressed={isActive}
                    >
                        {action.label}
                    </button>
                );
            })}
        </div>
    );
}