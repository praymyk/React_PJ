'use client';

import { useMemo, useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import SearchForm from '@components/common/SearchForm/SearchForm';
import TableSection from '@components/palace/test/A/TableSection/TableSection';
import { searchRegistry } from '@/app/palace/test/a/searchFields';
import { tableColumns } from '@/app/palace/test/a/tableColumns';
import type { UserRow } from '@/lib/db/reactpj/users';
import styles from '@components/palace/test/A/DefaultContent.module.scss';

type Props = {
    initialRows: UserRow[];
    page: number;
    total: number;
    pageSize: number;
};

export default function DefaultContent({
                                           initialRows,
                                           page,
                                           total,
                                           pageSize,
                                       }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const fields = searchRegistry.searchItems;

    // 검색/필터를 위해 rows를 state로 들고 있지만,
    // 페이지가 바뀌어 initialRows가 바뀌면 rows도 같이 덮어씌워줘야 함
    const [rows, setRows] = useState<UserRow[]>(initialRows);

    useEffect(() => {
        setRows(initialRows);
    }, [initialRows]);

    // URL 기준 현재 페이지 (props.page와 동일하게 맞춰줌)
    const currentPage = useMemo(() => {
        const fromUrl = Number(searchParams.get('page') ?? page) || page || 1;
        return fromUrl;
    }, [searchParams, page]);

    // 전체 페이지 수는 total / pageSize 로 계산
    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(total / pageSize)),
        [total, pageSize],
    );

    const handleSearch = (values: Record<string, string>) => {
        console.log('검색 값:', values);
        // TODO: 검색값으로 /api 호출해서 새 데이터 받아오거나
        // rows 필터링 로직 추가 예정
    };

    /** page 쿼리만 바꿔서 서버에 새 페이지 요청 */
    const goToPage = (nextPage: number) => {
        const safePage = Math.min(Math.max(nextPage, 1), totalPages);

        const sp = new URLSearchParams(searchParams.toString());
        if (safePage === 1) {
            // 1페이지는 ?page 제거해서 URL 깔끔하게
            sp.delete('page');
        } else {
            sp.set('page', String(safePage));
        }

        router.push(`${pathname}?${sp.toString()}`, { scroll: false });
    };

    const handlePrevPage = () => {
        goToPage(currentPage - 1);
    };

    const handleNextPage = () => {
        goToPage(currentPage + 1);
    };

    return (
        <div className={styles.root}>
            테스트 / a 목록

            <SearchForm fields={fields} onSearch={handleSearch} />

            {/* 조회 rows TableSection 전달  */}
            <TableSection
                rows={rows}
                columns={tableColumns}
                mode="list"
                currentPage={currentPage}
                pageSize={pageSize}
            />
            {/* 페이징 UI */}
            <div className={styles.paginationBar}>
                <button
                    type="button"
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1}
                >
                    이전
                </button>

                <span className={styles.paginationInfo}>
                    {currentPage} / {totalPages} 페이지
                    <span> (총 {total}건)</span>
                </span>

                <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                >
                    다음
                </button>
            </div>
        </div>
    );
}