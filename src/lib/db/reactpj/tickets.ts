import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { reactpjPool } from './pool';

/** 고객 티켓 리스트 Row */
export type CustomerTicketRow = RowDataPacket & {
    id: number;
    customer_id: number;
    submitted_at: Date;
    title: string;
    description: string;
    status: string;
    created_at: Date;
};

/**
 * 고객별 티켓 Row
 */
export async function getCustomerTicket(customerId: number): Promise<CustomerTicketRow[]> {
    const [rows] = await reactpjPool.query<CustomerTicketRow[]>(
        `
            SELECT
                id,
                assignee_id,
                submitted_at,
                title,
                description,
                status,
                created_at
            FROM tickets
            WHERE customer_id = ?
            ORDER BY submitted_at DESC, id DESC
        `,
        [customerId],
    );

    return rows;
}

/** 티켓 테이블 행 타입 */
export type TicketRow = RowDataPacket & {
    id: number;
    title: string;
    description: string;
    company_id: number;
    customer_id: number;
    assignee_id: number | null;
    status: '접수' | '진행중' | '종료' | '취소';
    channel: '전화' | '채팅' | '이메일' | '기타';
    submitted_at: Date;
    closed_at: Date | null;
    created_at: Date;
    updated_at: Date;
};

// ====== 페이징 + 정렬 옵션 타입 ======
export type TicketSortKey =
    | 'receivedAt:desc'
    | 'receivedAt:asc'
    | 'processedAt:desc'
    | 'processedAt:asc';

export type GetTicketsByCompanyOptions = {
    status?: TicketRow['status']; // 상태 필터 (선택)
    sort?: TicketSortKey;         // 정렬 조건 (선택)
    page?: number;                // 페이지 번호 (1부터 시작)
    pageSize?: number;            // 페이지당 개수
};

// ====== 결과 타입 (rows + total + page 정보) ======
export type TicketListResult = {
    rows: TicketRow[];
    total: number;    // 전체 건수
    page: number;     // 현재 페이지
    pageSize: number; // 현재 페이지 크기
};

/**
 * 업체별 티켓 Row (상태 필터 + 정렬 + 페이징)
 */
export async function getTicketsByCompany(
    companyId: string,
    options?: GetTicketsByCompanyOptions,
): Promise<TicketListResult> {
    const {
        status,
        sort = 'receivedAt:desc',
        page = 1,
        pageSize = 20,
    } = options ?? {};

    // page/pageSize 안전 보정
    const safePage = page > 0 ? page : 1;
    const safePageSize = pageSize > 0 ? pageSize : 20;
    const offset = (safePage - 1) * safePageSize;

    // 기본 WHERE + 파라미터
    let where = 'WHERE company_id = ?';
    const whereParams: any[] = [companyId];

    if (status) {
        where += ' AND status = ?';
        whereParams.push(status);
    }

    // 1) total 카운트
    const [countRows] = await reactpjPool.query<RowDataPacket[]>(
        `
        SELECT COUNT(*) AS cnt
        FROM tickets
        ${where}
        `,
        whereParams,
    );

    const total = Number((countRows[0] as any)?.cnt ?? 0);

    // 2) 정렬 조건 매핑
    const orderBy = (() => {
        switch (sort) {
            case 'receivedAt:asc':
                return 'ORDER BY submitted_at ASC, id ASC';
            case 'processedAt:desc':
                // 종료일자 기준 최신순 (NULL은 뒤로 보내고 싶으면 IS NULL ASC 등 추가 가능)
                return 'ORDER BY closed_at DESC, id DESC';
            case 'processedAt:asc':
                return 'ORDER BY closed_at ASC, id ASC';
            case 'receivedAt:desc':
            default:
                return 'ORDER BY submitted_at DESC, id DESC';
        }
    })();

    // 3) 실제 목록 조회
    const listParams = [...whereParams, safePageSize, offset];

    const [rows] = await reactpjPool.query<TicketRow[]>(
        `
        SELECT
          id,
          title,
          description,
          company_id,
          customer_id,
          assignee_id,
          status,
          channel,
          submitted_at,
          closed_at,
          created_at,
          updated_at
        FROM tickets
        ${where}
        ${orderBy}
        LIMIT ? OFFSET ?
        `,
        listParams,
    );

    return {
        rows,
        total,
        page: safePage,
        pageSize: safePageSize,
    };
}

/**
 * 선택 티켓 조회
 */
export async function getTicketById(id: number): Promise<TicketRow | null> {
    const [rows] = await reactpjPool.query<TicketRow[]>(
        `
        SELECT
          id,
          title,
          description,
          company_id,
          customer_id,
          assignee_id,
          status,
          channel,
          submitted_at,
          closed_at,
          created_at,
          updated_at
        FROM tickets
        WHERE id = ?
        LIMIT 1
        `,
        [id],
    );

    // 없으면 null
    return rows[0] ?? null;
}

/** 티켓 이벤트 DB Row 타입 */
export type TicketEventRow = RowDataPacket & {
    id: string;
    ticket_id: string;
    company_id: string;
    event_type:
        | '문의접수'
        | '상담기록'
        | '상담사메모'
        | '고객메모'
        | '상태변경'
        | '티켓병합'
        | '티켓분리'
        | '시스템';
    channel: '전화' | '채팅' | '이메일' | '기타' | null;
    author_user_id: string | null;
    customer_id: string | null;
    content: string | null;
    meta: any | null;
    created_at: Date;
};

//  티켓 이벤트 페이징 옵션 / 결과 타입
export type GetTicketEventsOptions = {
    page?: number;
    pageSize?: number;
};

export type TicketEventListResult = {
    rows: TicketEventRow[];
    total: number;
    page: number;
    pageSize: number;
};


/**
 * 특정 티켓 + 병합된 서브 티켓들의 이벤트 타임라인 조회
 *  - 기준 티켓 ID = ticketId
 *  - 기준 티켓 자신
 *  - merged_into_ticket_id = ticketId 인 서브 티켓들까지 포함
 */
export async function getTicketEventsForTicketCluster(
    ticketId: number,
    options?: GetTicketEventsOptions,
): Promise<TicketEventListResult> {
    const {
        page = 1,
        pageSize = 20,
    } = options ?? {};

    const safePage = page > 0 ? page : 1;
    const safePageSize = pageSize > 0 ? pageSize : 20;
    const offset = (safePage - 1) * safePageSize;

    // 1) total 카운트
    const [countRows] = await reactpjPool.query<RowDataPacket[]>(
        `
        SELECT COUNT(*) AS cnt
        FROM ticket_events e
        JOIN tickets t ON e.ticket_id = t.id
        WHERE t.id = ? OR t.merged_into_ticket_id = ?
        `,
        [ticketId, ticketId],
    );

    const total = Number((countRows[0] as any)?.cnt ?? 0);

    // 2) 실제 이벤트 목록 조회 (최신순 + 페이징)
    const [rows] = await reactpjPool.query<TicketEventRow[]>(
        `
            SELECT
                e.id,
                e.ticket_id,
                e.company_id,
                e.event_type,
                e.channel,
                e.author_user_id,
                e.customer_id,
                e.content,
                e.meta,
                e.created_at
            FROM ticket_events e
                     JOIN tickets t ON e.ticket_id = t.id
            WHERE t.id = ? OR t.merged_into_ticket_id = ?
            ORDER BY e.created_at DESC, e.id DESC
                LIMIT ? OFFSET ?
        `,
        [ticketId, ticketId, safePageSize, offset],
    );

    return {
        rows,
        total,
        page: safePage,
        pageSize: safePageSize,
    };
}

/** 티켓 이벤트 등록용 DTO **/
export type CreateTicketEventInput = {
    ticketId: number;
    companyId: number;
    eventType:
        | '문의접수'
        | '상담기록'
        | '상담사메모'
        | '고객메모'
        | '상태변경'
        | '티켓병합'
        | '티켓분리'
        | '시스템';
    channel?: '전화' | '채팅' | '이메일' | '기타' | null;
    authorUserId?: number | null;
    customerId?: number | null;
    content: string;
    meta?: any | null;
};

/**
 * 티켓 이벤트 1건 생성
 */
export async function createTicketEvent(
    input: CreateTicketEventInput,
): Promise<number> {
    const {
        ticketId,
        companyId,
        eventType,
        channel = null,
        authorUserId = null,
        customerId = null,
        content,
        meta = null,
    } = input;

    const [result] = await reactpjPool.query<ResultSetHeader>(
        `
        INSERT INTO ticket_events (
            ticket_id,
            company_id,
            event_type,
            channel,
            author_user_id,
            customer_id,
            content,
            meta
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            ticketId,
            companyId,
            eventType,
            channel,
            authorUserId,
            customerId,
            content,
            meta ? JSON.stringify(meta) : null,
        ],
    );

    return result.insertId;
}