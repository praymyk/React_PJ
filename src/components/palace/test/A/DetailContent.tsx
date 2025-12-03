// src/app/palace/test/a/[id]/page.tsx
'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { notFound } from 'next/navigation';

import styles from '@components/palace/test/A/DefaultContent.module.scss';

import DetailSection from "@components/palace/test/A/DetailSection/DetailSection";
import SearchForm from "@components/common/SearchForm/SearchForm";
import TableSection from '@components/palace/test/A/TableSection/TableSection';

import {searchRegistry} from "@/app/palace/test/a/searchFields";
import { tableColumns } from '@/app/palace/test/a/tableColumns';
import { mockRows, type Row} from '@/app/palace/test/a/data';


export default function DetailPage() {
    // URL 파라미터 읽기
    const params = useParams<{ id: string }>();

    const id = params.id;

    const row = mockRows.find((r: Row) => r.id === id);

    if (!row) {
        notFound();
    }

    const selectedIndex = mockRows.findIndex((r: Row) => r.id === id);
    const safeSelectedIndex = selectedIndex >= 0 ? selectedIndex : null;

    const fields = searchRegistry.searchItems;
    const handleSearch = (values: Record<string, string>) => {
        console.log('검색 값:', values);
        // TODO: 여기서 values를 이용해서 API 호출하거나
        //       mockRows를 클라이언트에서 필터링하는 로직 추가
    };

    return (
        <div className={styles.root}>
            테스트/a 상세보기

            <DetailSection
                row={row}
            />

            <SearchForm fields={fields} onSearch={handleSearch} />

            <TableSection
                rows={mockRows}
                columns={tableColumns}
                mode="detail"
                selectedIndex={safeSelectedIndex}
            />
        </div>
    );
}