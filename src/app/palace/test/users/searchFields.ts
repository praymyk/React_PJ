import type { SearchField } from '@components/common/SearchForm/searchTypes';

export const searchRegistry = {
    searchItems: [
        {
            name: 'keyword',
            label: '검색어',
            type: 'text',
            placeholder: '이름/이메일을 입력하세요',
            width: '240px',
        },
        {
            name: 'status',
            label: '상태',
            type: 'select',
            width: '140px',
            options: [
                { label: '전체', value: '' },
                { label: '활성', value: 'active' },
                { label: '비활성', value: 'inactive' },
            ],
        },
    ] as SearchField[],
};