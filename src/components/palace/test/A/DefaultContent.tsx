'use client';

import { useState } from 'react';

import SearchForm from '@components/common/SearchForm/SearchForm';
import TableSection from '@components/palace/test/A/TableSection/TableSection';
import { searchRegistry } from '@/app/palace/test/a/searchFields';
import { tableColumns } from '@/app/palace/test/a/tableColumns';
import type { UserRow } from '@/lib/db/reactpj';
import styles from '@components/palace/test/A/DefaultContent.module.scss';

type Props = {
    initialRows: UserRow[];
};

export default function DefaultContent({ initialRows }: Props) {
    const fields = searchRegistry.searchItems;

    // 필요하다면 상태로 관리 (클라이언트 필터링용)
    const [rows, setRows] = useState<UserRow[]>(initialRows);

    const handleSearch = (values: Record<string, string>) => {
        console.log('검색 값:', values);
        // TODO:
        //  - values를 이용해 rows를 클라이언트에서 필터링하거나
        //  - 나중에 /api/... 호출해서 서버 필터링하는 식으로 확장
    };

    return (
        <div className={styles.root}>
            테스트 / a 목록

            <SearchForm fields={fields} onSearch={handleSearch} />

            <TableSection
                rows={rows}
                columns={tableColumns}
                mode="list"
            />
        </div>
    );
}