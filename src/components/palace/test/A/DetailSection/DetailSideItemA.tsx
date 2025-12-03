'use client';

import styles from './DetailSideItem.module.scss';

import type { Row } from '@/app/palace/test/a/data';
import { mockHistoryById } from '@/app/palace/test/a/data';

type Props = {
    row: Row;
};

export default function DetailSideItemA({ row }: Props) {
    const historyItems = mockHistoryById[row.id] ?? [];

    return (
        <div className={styles.bottomPanel}>
            <h3 className={styles.bottomPanelTitle}>현재 진행중인 이력</h3>
            {historyItems.length === 0 ? (
                <p className={styles.bottomPanelEmpty}>
                    현재 진행중인 이력이 없습니다.
                </p>
            ) : (
                <ul className={styles.historyList}>
                    {historyItems.map((item, idx) => (
                        <li key={idx} className={styles.historyItem}>
                            <div className={styles.historyRowTop}>
                                <span className={styles.historyDate}>{item.date}</span>
                                <span className={styles.historyStatus}>{item.status}</span>
                            </div>
                            <div className={styles.historyTitle}>{item.title}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}