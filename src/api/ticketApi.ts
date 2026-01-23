import api from '@utils/axios'
import { PagedResult } from '@/types/common';
import { TicketRow, TicketSearchParams } from '@/types/ticket';

// 페이징 조회 API
export async function getTicketsPaged(params: TicketSearchParams): Promise<PagedResult<TicketRow>> {
    const { data } = await api.get('/api/tickets', {
        params: {
            page: params.page || 1,
            size: params.pageSize || 10,
            keyword: params.keyword,
            status: params.status === 'ALL' ? undefined : params.status,
            // TODO : 기타 필터 .. 추가
        }
    });

    return {
        rows: data.content,
        total: data.totalElements,
        page: data.number + 1, // Spring(0) -> Frontend(1)
        pageSize: data.size
    };
}

