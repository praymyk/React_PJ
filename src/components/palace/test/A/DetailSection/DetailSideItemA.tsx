'use client';

import styles from './DetailSideItem.module.scss';
import { useEffect, useState } from 'react';

import type { UserRow } from '@/lib/db/reactpj';
import type { UserHistoryRow } from '@/lib/db/reactpj';

type Props = {
    row: UserRow;
};

export default function DetailSideItemA({ row }: Props) {
    const [historyItems, setHistoryItems] = useState<UserHistoryRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchHistory = async () => {
            if (!row?.id) {
                setHistoryItems([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const res = await fetch(
                    `/api/common/users/${encodeURIComponent(row.id)}/histories`,
                );
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                const data: UserHistoryRow[] = await res.json();
                if (!cancelled) {
                    setHistoryItems(data);
                }
            } catch (err) {
                console.error('[DetailSideItemA] history fetch error:', err);
                if (!cancelled) {
                    setError('이력 정보를 불러오지 못했습니다.');
                    setHistoryItems([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchHistory();

        return () => {
            cancelled = true;
        };
    }, [row.id]);

    return (
        <div className={styles.bottomPanel}>
            <h3 className={styles.bottomPanelTitle}>현재 진행중인 이력</h3>

            {/* 1) 로딩 상태 */}
            {loading && (
                <div className={styles.bottomPanelLoading}>
                    <span className={styles.loadingLabel}>
                        이력 정보를 불러오는 중이에요
                    </span>
                    <span className={styles.typingDots}>
                        <span />
                        <span />
                        <span />
                    </span>
                </div>
            )}

            {/* 2) 에러 상태 */}
            {!loading && error && (
                <p className={styles.bottomPanelError}>
                    {error}
                </p>
            )}

            {/* 3) 정상 데이터 / 빈 데이터 */}
            {!loading && !error && (
                historyItems.length === 0 ? (
                    <p className={styles.bottomPanelEmpty}>
                        현재 진행중인 이력이 없습니다.
                    </p>
                ) : (
                    <ul className={styles.historyList}>
                        {historyItems.map((item) => (
                            <li key={item.id} className={styles.historyItem}>
                                <div className={styles.historyRowTop}>
                                    <span className={styles.historyDate}>
                                        {new Date(item.event_date)
                                            .toLocaleDateString('ko-KR')}
                                    </span>
                                    <span className={styles.historyStatus}>
                                        {item.status}
                                    </span>
                                </div>
                                <div className={styles.historyTitle}>
                                    {item.title}
                                </div>
                            </li>
                        ))}
                    </ul>
                )
            )}
        </div>
    );
}