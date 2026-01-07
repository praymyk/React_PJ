import type { SearchField } from '@components/common/SearchForm/searchTypes';

export const searchRegistry = {
    searchItems: [
        {
            name: 'at',
            label: '정렬',
            type: 'select',
            placeholder: '접수일자',
            options: [
                { label: '접수일자 ↓ (최신순)',    value: 'receivedAt:desc' },
                { label: '접수일자 ↑ (오래된순)',  value: 'receivedAt:asc' },
                { label: '처리일자 ↓ (최신순)',    value: 'processedAt:desc' },
                { label: '처리일자 ↑ (오래된순)',  value: 'processedAt:asc' },
            ]
        },
        {
            name: 'number',
            label: '표시',
            type: 'select',
            options: [
                { label: '10개', value: '10' },
                { label: '20개', value: '20' },
                { label: '모두', value: 'all' },
            ],
        },
    ] as SearchField[],
};