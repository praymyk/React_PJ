'use client';

import styles from '@components/palace/test/A/DefaultContent.module.scss';

import DetailSection from '@components/palace/test/A/DetailSection/DetailSection';
import SearchForm from '@components/common/SearchForm/SearchForm';
import TableSection from '@components/palace/test/A/TableSection/TableSection';

import { searchRegistry } from '@/app/palace/test/a/searchFields';
import { tableColumns } from '@/app/palace/test/a/tableColumns';

import type { UserRow } from '@/lib/db/reactpj';

type Props = {
    user: UserRow;
    userList: UserRow[];
};

export default function DetailContent({ user, userList }: Props) {
    // 선택된 유저 id는 props로 이미 들어옴
    const selectedId = user.id;

    // 리스트에서 몇 번째 행인지 찾아서 하이라이트용 인덱스 계산
    const selectedIndex = userList.findIndex((u) => u.id === selectedId);
    const safeSelectedIndex = selectedIndex >= 0 ? selectedIndex : null;

    const fields = searchRegistry.searchItems;

    const handleSearch = (values: Record<string, string>) => {
        console.log('검색 값:', values);
        // TODO: values 기반으로 userList 필터링 or API 호출
    };

    return (
        <div className={styles.root}>
            {/* 상단: 선택된 유저 상세 */}
            <DetailSection row={user} />

            {/* 중간: 검색 폼 */}
            <SearchForm fields={fields} onSearch={handleSearch} />

            {/* 하단: 유저 리스트 테이블 (선택된 행 하이라이트) */}
            <TableSection
                rows={userList}
                columns={tableColumns}
                mode="detail"
                selectedIndex={safeSelectedIndex}
            />
        </div>
    );
}