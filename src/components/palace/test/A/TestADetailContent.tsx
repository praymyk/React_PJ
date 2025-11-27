// src/app/palace/test/a/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { tableColumns } from '@/app/palace/test/a/tableColumns';
import { mockRows, type Row} from '@/app/palace/test/a/data';
import styles from '@components/palace/test/A/TestA.module.scss';
import TableSection from '@components/palace/test/A/TableSection';
import SearchForm from "@components/common/SearchForm/SearchForm";
import {searchRegistry} from "@/app/palace/test/a/searchFields";

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
            테스트/a 경로 페이지 전용 내용

            <div className={styles.detailRoot}>
                <h2>{row.name} 상세 정보</h2>
                <p><strong>ID:</strong> {row.id}</p>
                <p><strong>이메일:</strong> {row.email}</p>
                <p>
                    <strong>상태:</strong>{' '}
                    {row.status === 'active' ? '활성' : '비활성'}
                </p>
            </div>

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