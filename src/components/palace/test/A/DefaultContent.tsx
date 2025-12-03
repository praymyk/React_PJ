'use client';

import SearchForm from '@components/common/SearchForm/SearchForm';
import TableSection from '@components/palace/test/A/TableSection/TableSection';
import { searchRegistry } from '@/app/palace/test/a/searchFields';
import { tableColumns } from '@/app/palace/test/a/tableColumns';
import { mockRows } from '@/app/palace/test/a/data';
import styles from '@components/palace/test/A/DefaultContent.module.scss';

export default function DefaultContent() {
    const fields = searchRegistry.searchItems;

    const handleSearch = (values: Record<string, string>) => {
        console.log('검색 값:', values);
        // TODO: 여기서 values를 이용해서 API 호출하거나
        //       mockRows를 클라이언트에서 필터링하는 로직 추가
    };

    return (
        <div className={styles.root}>
            테스트 / a 목록

            <SearchForm fields={fields} onSearch={handleSearch} />

            <TableSection
                rows={mockRows}
                columns={tableColumns}
                mode="list"
            />
        </div>
    );
}