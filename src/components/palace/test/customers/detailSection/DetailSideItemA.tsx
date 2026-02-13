'use client';

import styles from './DetailSideItem.module.scss';
import { useEffect, useState } from 'react';
import api from '@utils/axios'

import type { CustomerRow } from '@/types/customer';
import { CustomerTicketRow, TICKET_STATUS_CONFIG } from '@/types/ticket';

type Props = {
    row: CustomerRow;
};

export default function DetailSideItemA({ row }: Props) {
    const [historyItems, setHistoryItems] = useState<CustomerTicketRow[]>([]);
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
                const { data } = await api.get<{ rows: CustomerTicketRow[] }>(
                    `/api/common/customers/${encodeURIComponent(row.id)}/tickets`
                );

                if (!cancelled) {
                    setHistoryItems(data.rows ?? []);
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

            {loading && (
                <div className={styles.bottomPanelLoading}>
                    <span className={styles.loadingLabel}>
                        이력 정보를 불러오는 중이에요
                    </span>
                    <span className={styles.typingDots}>
                        <span /><span /><span />
                    </span>
                </div>
            )}

            {!loading && error && (
                <p className={styles.bottomPanelError}>{error}</p>
            )}

            {!loading && !error && (
                historyItems.length === 0 ? (
                    <p className={styles.bottomPanelEmpty}>
                        현재 진행중인 이력이 없습니다.
                    </p>
                ) : (
                    <ul className={styles.historyList}>
                        {historyItems.map((item) => {

                            const ticketConfig = TICKET_STATUS_CONFIG[item.status] || {
                                label: item.status,
                                textVar: 'inherit'
                            };

                            return (
                                <li key={item.id} className={styles.historyItem}>
                                    <div className={styles.historyRowTop}>
                                        <span className={styles.historyDate}>
                                            {new Date(item.submittedAt)
                                                .toLocaleDateString('ko-KR')}
                                        </span>
                                        {/* 상태 뱃지 */}
                                        <span
                                            className={styles.historyStatus}
                                            style={{
                                                color: `var(${ticketConfig.textVar})`
                                            }}
                                        >
                                            {ticketConfig.label}
                                        </span>
                                    </div>
                                    <div className={styles.historyTitle}>
                                        {item.title}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )
            )}
        </div>
    );
}