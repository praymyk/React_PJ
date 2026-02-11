'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import api from '@utils/axios';
import { ApiResponse } from "@/types/api";

import styles from '@components/palace/ticket/DefaultContent.module.scss';

import ListSection from '@components/palace/ticket/ListSection/ListSection';
import DetailSection from '@components/palace/ticket/DetailSection/DetailSection';
import NoteSection from '@components/palace/ticket/NoteSection/NoteSection';
import InquirySection from '@components/palace/ticket/InquirySection/InquirySection';

import type {
    TicketApiRow,
    TicketListApiResponse,
    TicketDetailApiResponse,
    TicketEventListApiResponse,
} from '@/app/(protected)/palace/ticket/data';

// ======================================================
// 상태별 뱃지 스타일 매핑
// ======================================================
const STATUS_CLASS: Record<TicketApiRow['status'], string> = {
    OPEN: styles.statusOpen,
    IN_PROGRESS: styles.statusInProgress,
    DONE: styles.statusDone,
    CANCELED: styles.statusCanceled,
};
const statusClassOf = (status: TicketApiRow['status']) => STATUS_CLASS[status];

// ======================================================
// 첫 방문 기본 검색값 (MiniSearchForm 과 동기화 필요)
// ======================================================
const DEFAULT_SEARCH_VALUES: Record<string, string> = {
    at: 'receivedAt:desc',
    pageSize: '1',
};
// ======================================================
// 티켓 이벤트 (InquirySection) 페이지 사이즈
// ======================================================
const EVENTS_PAGE_SIZE = 3;

type InnerProps = {
    initialCompanyId: number;
}

function DefaultContentInner({ initialCompanyId }: InnerProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // --------------------------------------------------
    // 티켓 목록(리스트) 영역 상태
    // --------------------------------------------------
    const [rows, setRows] = useState<TicketApiRow[]>([]);
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

    //TODO : 티켓 선택 이벤트 처리 예정
    const selectedTicket = rows.find((row) => String(row.id) === selectedId) ?? null;

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
            sp.set('companyId', String(initialCompanyId));
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

                if (!sp.get('at')) {
                    sp.set('at', DEFAULT_SEARCH_VALUES.at);
                }

                const pageParam = Number(sp.get('page') ?? '1') || 1;
                sp.set('page', String(pageParam));

                const pageSizeParam = sp.get('pageSize') ?? DEFAULT_SEARCH_VALUES.pageSize;
                sp.set('pageSize', pageSizeParam);

                const { data } = await api.get<TicketListApiResponse>('/api/common/tickets', {
                    params: sp,
                    signal: abortController.signal,
                });

                const ticketData = data;

                if (ticketData) {
                    setRows(ticketData.rows || []);
                    setPage(ticketData.page);
                    setPageSize(ticketData.pageSize);
                    setTotal(ticketData.total);

                    if (!selectedId && ticketData.rows.length > 0) {
                        setSelectedId(String(ticketData.rows[0].id));
                    }
                }

            } catch (err: any) {
                if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
                    return;
                }

                console.error('[DefaultContent] /api/common/tickets error:', err);
                setError('티켓 목록을 불러오지 못했습니다.');
                setRows([]);
            } finally {
                if (!abortController.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchTickets();

        return () => {
            abortController.abort();
        };
    }, [searchParams]);

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
            sp.set('companyId', String(initialCompanyId));
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

    const [eventsPage, setEventsPage] = useState(1);

    // 티켓 이벤트 리로드용 키
    const [eventReloadKey, setEventReloadKey] =
        useState(0);

    // NoteSection / TicketNoteEditor에서 호출할 리로드 함수
    const handleEventsReload = () => {
        setEventReloadKey((prev) => prev + 1);
    };

    // 선택 티켓이 바뀔 떄마다 페이징 초기화
    useEffect(() => {
        setEventsPage(1);
    }, [selectedId]);

    useEffect(() => {

        if (!selectedId) {
            setDetail(null);
            setEvents(null);
            return;
        }

        const abortController = new AbortController();

        const fetchDetailAndEvents = async () => {
            try {
                const [detailRes, eventRes] = await Promise.all([
                    api.get<TicketDetailApiResponse>(
                        `/api/common/tickets/${encodeURIComponent(selectedId)}`,
                        { signal: abortController.signal }
                    ),
                    api.get<TicketEventListApiResponse>(
                        `/api/common/tickets/${encodeURIComponent(selectedId)}/events`,
                        {
                            params: {
                                page: eventsPage,
                                pageSize: EVENTS_PAGE_SIZE,
                            },
                            signal: abortController.signal,
                        }
                    ),
                ]);

                if (detailRes.data) {
                    setDetail(detailRes.data);
                }

                if (eventRes.data) {
                    setEvents(eventRes.data);
                }

            } catch (err: any) {
                if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
                    return;
                }

                console.error('[Detail] fetch error:', err);
                setDetail(null);
                setEvents(null);
            }
        };

        fetchDetailAndEvents();

        return () => {
            abortController.abort();
        };
    }, [selectedId, eventsPage, eventReloadKey]);

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

            <NoteSection
                ticket={detail}
                onEventsReload={handleEventsReload}
            />

            <InquirySection
                ticket={detail}
                events={events?.rows ?? []}
                page={events?.page ?? 1}
                totalPages={
                    events
                        ? Math.max(1, Math.ceil(events.total / events.pageSize))
                        : 1
                }
                totalEvents={events?.total ?? 0}
                onPageChange={setEventsPage}
            />
        </div>
    );
}

type Props = {
    initialCompanyId: number;
}

export default function DefaultContent({ initialCompanyId }: Props) {
    return (
        <Suspense fallback={<div>Loading tickets...</div>}>
            <DefaultContentInner initialCompanyId={initialCompanyId} />
        </Suspense>
    );
}