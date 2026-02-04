'use client';

import { useMemo, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import styles from './DefaultContent.module.scss';

import DetailSection from '@components/palace/test/customers/detailSection/DetailSection';
import SearchForm from '@components/common/SearchForm/SearchForm';
import TableSection from '@components/palace/test/customers/tableSection/TableSection';
import HeaderSection from "@components/common/SubContentForm/headerSection/HeaderSection";
import CustomerCreateModal from "@components/palace/test/customers/modal/CustomerCreateModal";

import { searchRegistry } from '@/app/(protected)/palace/test/customers/searchFields';
import { tableColumns } from '@/app/(protected)/palace/test/customers/tableColumns';
import type { CustomerRow } from '@/types/customer';

type Props = {
    customer: CustomerRow;
    customerList: CustomerRow[];
    page: number;
    pageSize: number;
    total: number;
};

export default function DetailContent({
                                          customer,
                                          customerList,
                                          page,
                                          pageSize,
                                          total,
                                      }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const selectedId = customer.id;
    const selectedIndex = customerList.findIndex((u) => u.id === selectedId);
    const safeSelectedIndex = selectedIndex >= 0 ? selectedIndex : null;

    const fields = searchRegistry.searchItems;

    const initialSearchValues = useMemo(
        () => ({
            keyword: searchParams.get('keyword') ?? '',
            status: searchParams.get('status') ?? '',
        }),
        [searchParams],
    );

    const currentPage = useMemo(() => {
        return Number(searchParams.get('page') ?? page) || 1;
    }, [searchParams, page]);

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(total / pageSize)),
        [total, pageSize],
    );

    const goToPage = (nextPage: number) => {
        const safePage = Math.min(Math.max(nextPage, 1), totalPages);
        const sp = new URLSearchParams(searchParams.toString());

        sp.set('page', String(safePage));
        sp.set('pageSize', String(pageSize));

        router.push(`${pathname}?${sp.toString()}`, { scroll: false });
    };

    const handleSearch = (values: Record<string, string>) => {
        const sp = new URLSearchParams(searchParams.toString());

        Object.entries(values).forEach(([key, val]) => {
            const v = (val ?? '').trim();
            if (v) sp.set(key, v);
            else sp.delete(key);
        });

        sp.delete('page');
        router.push(`${pathname}?${sp.toString()}`, { scroll: false });
    };

    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const handleCreateSuccess = () => {
        // 1. 모달 닫기
        setIsCreateOpen(false);

        // 2. 서버 데이터 갱신 (SSR 다시 실행 -> initialRows 업데이트됨)
        router.refresh();

        // 3.  등록된 최신 글 확인 > 1페이지 이동
        const sp = new URLSearchParams();
        sp.set('page', '1');
        sp.set('pageSize', String(pageSize));
        router.push(`${pathname}?${sp.toString()}`);
    };

    return (
        <div className={styles.root}>
            <HeaderSection
                title="고객 상세 정보"
                description={`${customer.name} (${customer.email}) 고객님의 상세 정보입니다.`}
                onClickCreate={() => setIsCreateOpen(true)}
            />

            <CustomerCreateModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            <DetailSection row={customer} />

            <div className={styles.divider} style={{ margin: '20px 0' }} />

            <SearchForm
                fields={fields}
                onSearch={handleSearch}
                initialValues={initialSearchValues}
            />

            <TableSection
                rows={customerList}
                columns={tableColumns}
                mode="detail"
                selectedIndex={safeSelectedIndex}
                currentPage={currentPage}
                pageSize={pageSize}
            />

            <div className={styles.paginationBar}>
                <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
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
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    다음
                </button>
            </div>
        </div>
    );
}