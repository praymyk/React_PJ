'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './Stats.module.scss';

import type { Row, Name } from '@/app/palace/stats/daily/data';
import { format, subMonths, getDaysInMonth as dfGetDaysInMonth, getDay } from 'date-fns';

// month 문자열 얻는 헬퍼 (기본: 오늘 기준)
function getCurrentMonthKey() {
    return format(new Date(), 'yyyy-MM'); // 예: '2025-12'
}

function getDaysInMonth(monthKey: string): number {
    const [yearStr, monthStr] = monthKey.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr); // 1~12

    // month-1 로 Date 만들고, date-fns 의 getDaysInMonth 사용
    return dfGetDaysInMonth(new Date(year, month - 1, 1));
}

export default function StatsDailyContent() {
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 조회 월 + 회사 ID
    const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonthKey());

    const [companyId, setCompanyId] = useState<string>('');       // 선택된 회사
    const [companies, setCompanies] = useState<Name[]>([]);       // 회사 목록
    const [companyLoading, setCompanyLoading] = useState(true);

    // 임시로 몇 개 월 선택 옵션
    const monthOptions = useMemo(() => {
        const base = new Date();

        // 최근 3개월: 0, 1, 2개월 전
        const arr = Array.from({ length: 3 }, (_, i) =>
            format(subMonths(base, i), 'yyyy-MM'),
        );

        // 오래된 월 → 최신 월
        return arr.sort();
    }, []);

    // 선택된 월에 대한 일수
    const daysInSelectedMonth = selectedMonth ? getDaysInMonth(selectedMonth) : 0;

    // API 호출 ( 월별 내선 사용 현황 )
    useEffect(() => {
        if (!companyId) {
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const params = new URLSearchParams({
                    companyId,
                    month: selectedMonth,
                });

                const res = await fetch(`/api/stats/daily?${params.toString()}`);
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                const data: Row[] = await res.json();
                setRows(data);
            } catch (err) {
                console.error('[StatsDailyContent] fetch error:', err);

                const message =
                    err instanceof Error
                        ? err.message
                        : '데이터를 불러오는데 실패했습니다.';

                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [companyId, selectedMonth]);

    // 회사 목록 불러오기
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setCompanyLoading(true);

                const res = await fetch('/api/common/companies');
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                const data: Name[] = await res.json();
                setCompanies(data);

                // 아직 companyId 가 안 정해졌으면 첫 번째 회사로 기본 선택
                if (data.length > 0 && !companyId) {
                    setCompanyId(data[0].id);
                }
            } catch (err) {
                console.error('[StatsDailyContent] companies fetch error:', err);
                // 필요하면 별도 에러 상태를 두고 메시지 표시해도 됨
            } finally {
                setCompanyLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    // 로딩/에러 처리
    if (loading || companyLoading) {
        return (
            <div className={styles.root}>
                <div className={styles.loading}>로딩 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.root}>
                <div className={styles.error}>{error}</div>
            </div>
        );
    }

    return (
        <div className={styles.root}>
            {/* 상단 컨트롤 바 */}
            <div className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>내선별 월간 사용 현황</h1>
                    <p>
                        사용자별로 선택한 월에 몇 일 동안 내선을 사용했는지, 그리고
                        사용 날짜가 어떻게 분포되어 있는지 확인 가능
                    </p>
                </div>

                <div className={styles.controls}>
                    {/* 조회 월 선택 */}
                    <label className={styles.monthLabel}>
                        조회 월
                        <select
                            className={styles.monthSelect}
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            {monthOptions.map((month) => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </label>

                    {/* 업체 ID 선택 (1~10) */}
                    <label className={styles.monthLabel}>
                        업체
                        <select
                            className={styles.monthSelect}
                            value={companyId}
                            onChange={(e) => setCompanyId(e.target.value)}
                            disabled={companyLoading || companies.length === 0}
                        >
                            {companyLoading && (
                                <option>불러오는 중...</option>
                            )}

                            {!companyLoading && companies.length === 0 && (
                                <option>업체 없음</option>
                            )}

                            {!companyLoading &&
                                companies.length > 0 &&
                                companies.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} (ID: {c.id})
                                    </option>
                                ))}
                        </select>
                    </label>
                </div>
            </div>

            {/* 메인 콘텐츠: 사용자별 카드 */}
            <div className={styles.cards}>
                {rows.map((row) => {
                    // 선택된 월에 해당하는 사용 일자만 필터링
                    const monthDays = row.useDays
                        .filter((d) => selectedMonth && d.startsWith(selectedMonth))
                        .map((d) => Number(d.slice(8, 10))); // '2025-10-05' → 5

                    const usedDaySet = new Set(monthDays);
                    const usedCount = usedDaySet.size;

                    return (
                        <div key={row.id} className={styles.card}>
                            {/* 왼쪽: 요약 정보 */}
                            <div className={styles.cardInfo}>
                                <div className={styles.avatar}>
                                    <span>{row.name?.[0] ?? '?'}</span>
                                </div>
                                <div className={styles.infoText}>
                                    <div className={styles.nameRow}>
                                        <span className={styles.name}>{row.name}</span>
                                        <span className={styles.ext}>
                                            #{
                                                row.ext != null
                                                    ? row.ext
                                                    : '없음'
                                            }
                                        </span>
                                    </div>
                                    <div className={styles.metaRow}>
                                        <span
                                            className={
                                                row.status === 'active'
                                                    ? styles.badgeActive
                                                    : styles.badgeInactive
                                            }
                                        >
                                          {row.status === 'active' ? '사용중' : '비활성'}
                                        </span>
                                        <span className={styles.countText}>
                                          {selectedMonth
                                              ? `${selectedMonth} 기준 사용일수 ${usedCount}일`
                                              : `사용일수 ${row.useCount}일`}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 오른쪽: 월별 사용일자 그리드(heatmap) */}
                            <div className={styles.cardHeatmap}>
                                {selectedMonth ? (
                                    <>
                                        <div className={styles.heatmapHeader}>
                                            <span>{selectedMonth}</span>
                                            <span className={styles.heatmapLegend}>
                                            <span className={styles.dotUsed} /> 사용일
                                            <span className={styles.dotEmpty} /> 미사용
                                          </span>
                                        </div>

                                        <div className={styles.heatmapGrid}>
                                            {(() => {
                                                const [yearStr, monthStr] = selectedMonth.split('-');
                                                const year = Number(yearStr);
                                                const monthIndex = Number(monthStr) - 1; // 0~11

                                                return Array.from({ length: daysInSelectedMonth }, (_, idx) => {
                                                    const day = idx + 1;
                                                    const isUsed = usedDaySet.has(day);
                                                    const label = day.toString().padStart(2, '0');

                                                    // 해당 날짜 객체
                                                    const date = new Date(year, monthIndex, day);
                                                    const dow = getDay(date);            // 0: 일, 6: 토
                                                    const isWeekend = dow === 0 || dow === 6;

                                                    const cellClass = [
                                                        styles.dayCell,
                                                        isUsed && styles.dayCellUsed,
                                                        isWeekend && styles.dayCellWeekend, // 주말이면 추가
                                                    ]
                                                        .filter(Boolean)
                                                        .join(' ');

                                                    return (
                                                        <div key={day} className={cellClass}>
                                                            <span className={styles.dayLabel}>{label}</span>
                                                        </div>
                                                    );
                                                });
                                            })()}
                                        </div>
                                    </>
                                ) : (
                                    <div className={styles.heatmapEmpty}>
                                        조회할 월 데이터가 없습니다.
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {rows.length === 0 && (
                    <div className={styles.emptyState}>
                        표시할 내선 사용 데이터가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}