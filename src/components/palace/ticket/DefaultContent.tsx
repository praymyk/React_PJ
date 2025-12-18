'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import styles from '@components/palace/ticket/DefaultContent.module.scss';

import ListSection from '@components/palace/ticket/ListSection/ListSection';
import DetailSection from '@components/palace/ticket/DetailSection/DetailSection';
import NoteSection from '@components/palace/ticket/NoteSection/NoteSection';
import InquirySection from '@components/palace/ticket/InquirySection/InquirySection';

import type {
    Row,
    TicketListApiResponse,
    TicketDetailApiResponse,
    TicketEventListApiResponse,
} from '@/app/palace/ticket/data';

// ======================================================
// 상태별 뱃지 스타일 매핑
// ======================================================
const STATUS_CLASS: Record<Row['status'], string> = {
    접수: styles.statusOpen,
    진행중: styles.statusInProgress,
    종료: styles.statusDone,
    취소: styles.statusCanceled,
};
const statusClassOf = (status: Row['status']) => STATUS_CLASS[status];

// ======================================================
// 첫 방문 기본 검색값 (MiniSearchForm 과 동기화 필요)
//  - at       : 정렬 기준
//  - pageSize : 1페이지당 티켓 수
// ======================================================
const DEFAULT_SEARCH_VALUES: Record<string, string> = {
    at: 'receivedAt:desc',
    pageSize: '1',
};

export default function DefaultContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // --------------------------------------------------
    // 티켓 목록(리스트) 영역 상태
    // --------------------------------------------------
    const [rows, setRows] = useState<Row[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(total / pageSize)),
        [total, pageSize],
    );

    // --------------------------------------------------
    // 선택된 티켓 ID + 선택 티켓(간단 정보)
    //    - selectedId    : 선택 티켓 ID
    // --------------------------------------------------
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const selectedTicket =
        rows.find((row) => row.id === selectedId) ?? null;

    // --------------------------------------------------
    // 검색폼 → URL 쿼리 동기화
    //    - MiniSearchForm onChange 시점
    //    - 검색 조건을 URL에 반영
    // --------------------------------------------------
    const handleSearch = (values: Record<string, string>) => {
        const sp = new URLSearchParams(searchParams.toString());

        // 검색 폼 값들을 URL 쿼리에 반영
        Object.entries(values).forEach(([key, val]) => {
            const v = (val ?? '').trim();
            if (v) {
                sp.set(key, v);
            } else {
                sp.delete(key);
            }
        });

        // 검색하면 항상 1페이지로 초기화
        sp.delete('page');

        // TODO : companyId 는 추후 받는 방식 확정 필요
        if (!sp.get('companyId')) {
            sp.set('companyId', '1');
        }

        router.push(`${pathname}?${sp.toString()}`, { scroll: false });
    };

    // --------------------------------------------------
    // 티켓 목록 조회 useEffect
    //    - 의존성: searchParams
    //    - URL 쿼리 /api/common/tickets 호출
    // --------------------------------------------------
    useEffect(() => {
        const abortController = new AbortController();

        const fetchTickets = async () => {
            try {
                setLoading(true);
                setError(null);

                const sp = new URLSearchParams(searchParams.toString());

                // TODO : companyId 는 추후 받는 방식 확정 필요
                if (!sp.get('companyId')) {
                    sp.set('companyId', '1');
                }

                // 정렬(at) ! > 기본값으로 채움
                if (!sp.get('at')) {
                    sp.set('at', DEFAULT_SEARCH_VALUES.at);
                }

                // page 기본값 처리 (숫자만)
                const pageParam = Number(sp.get('page') ?? '1') || 1;
                sp.set('page', String(pageParam));

                // pageSize (all 문자 처리 가능)
                const pageSizeParam =
                    sp.get('pageSize') ?? DEFAULT_SEARCH_VALUES.pageSize;
                sp.set('pageSize', pageSizeParam);

                const res = await fetch(
                    `/api/common/tickets?${sp.toString()}`,
                    { signal: abortController.signal },
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data: TicketListApiResponse = await res.json();

                const mapped: Row[] = data.rows.map((r) => ({
                    id: r.id,
                    title: r.title,
                    description: r.description,
                    assignee: r.assignee_id
                        ? `담당자 ${r.assignee_id}`
                        : '미배정',
                    status: r.status,
                }));

                setRows(mapped);
                setPage(data.page);
                setPageSize(data.pageSize);
                setTotal(data.total);

                // 첫 로딩 시 아무것도 선택되어 있지 않으면 첫 번째 티켓 자동 선택
                if (!selectedId && mapped.length > 0) {
                    setSelectedId(mapped[0].id);
                }
            } catch (err: any) {
                if (err?.name === 'AbortError') return;
                console.error(
                    '[DefaultContent] /api/common/tickets error:',
                    err,
                );
                setError('티켓 목록을 불러오지 못했습니다.');
                setRows([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();

        return () => {
            abortController.abort();
        };
    }, [searchParams, selectedId]);

    // --------------------------------------------------
    // 페이지 이동 헬퍼
    //    - ListSection 하단 페이징에서 호출
    // --------------------------------------------------
    const goToPage = (nextPage: number) => {
        const safeTotalPages = Math.max(
            1,
            Math.ceil(total / (pageSize || 1)),
        );
        const safePage = Math.min(Math.max(nextPage, 1), safeTotalPages);

        const sp = new URLSearchParams(searchParams.toString());

        // TODO : companyId 는 추후 받는 방식 확정 필요
        if (!sp.get('companyId')) {
            sp.set('companyId', '1');
        }

        if (safePage === 1) {
            sp.delete('page');
        } else {
            sp.set('page', String(safePage));
        }

        router.push(`${pathname}?${sp.toString()}`, { scroll: false });
    };

    // --------------------------------------------------
    // 티켓 상세 영역 상태
    //    - detail: 선택된 티켓의 상세 정보 (/api/common/tickets/[id])
    //    - events: 선택된 티켓의 하위 이벤트 (/api/common/tickets/[id]/events)
    // --------------------------------------------------
    const [detail, setDetail] =
        useState<TicketDetailApiResponse | null>(null);

    const [events, setEvents] =
        useState<TicketEventListApiResponse | null>(null);

    useEffect(() => {
        if (!selectedId) {
            setDetail(null);
            setEvents(null);
            return;
        }

        let aborted = false;

        (async () => {
            try {
                const [detailRes, eventRes] = await Promise.all([
                    fetch(`/api/common/tickets/${encodeURIComponent(selectedId)}`),
                    fetch(
                        `/api/common/tickets/${encodeURIComponent(
                            selectedId,
                        )}/events`,
                    ),
                ]);

                if (!detailRes.ok) throw new Error(`detail HTTP ${detailRes.status}`);
                if (!eventRes.ok) throw new Error(`events HTTP ${eventRes.status}`);

                const detailData: TicketDetailApiResponse = await detailRes.json();
                const eventData: TicketEventListApiResponse = await eventRes.json();

                if (!aborted) {
                    setDetail(detailData);
                    setEvents(eventData);
                }
            } catch (err) {
                console.error('[Detail] ticket or events fetch error', err);
                if (!aborted) {
                    setDetail(null);
                    setEvents(null);
                }
            }
        })();

        return () => {
            aborted = true;
        };
    }, [selectedId]);

    // --------------------------------------------------
    // 레이아웃 렌더링
    //    - 좌측: ListSection (검색 + 목록 + 페이징)
    //    - 가운데: DetailSection (상세/탭)
    //    - 우측: NoteSection, InquirySection (노트/문의 이력)
    // --------------------------------------------------
    return (
        <div className={styles.ticketLayout}>
            <ListSection
                rows={rows}
                selectedId={selectedId}
                onSelect={setSelectedId}
                statusClassOf={statusClassOf}
                onSearch={handleSearch}
                loading={loading}
                error={error}
                page={page}
                total={total}
                totalPages={totalPages}
                onPageChange={goToPage}
                initialSearchValues={DEFAULT_SEARCH_VALUES}
            />

            <DetailSection ticket={detail} statusClassOf={statusClassOf} />

            <NoteSection ticket={detail} />
            <InquirySection
                ticket={detail}
                events={events?.events ?? []}
            />
        </div>
    );
}