'use client';

import { useState, ReactNode } from 'react';
import styles from './MasterDetailTable.module.scss';

export type Column<T> = {
    header: string;
    // row 하나를 받아서 셀에 렌더링할 내용
    render: (row: T) => ReactNode;
    width?: string;
};

type MasterDetailTableProps<T> = {
    rows: T[];
    columns: Column<T>[];

    /** 각 row의 고유 key (React key로 사용) */
    getRowKey: (row: T, index: number) => string;

    /** 상단 상세 영역 렌더링 */
    renderDetail: (row: T | null) => ReactNode;

    /** 초기 선택 row (없으면 null) */
    initialSelectedIndex?: number;
};

export function MasterDetailTable<T>({
                                         rows,
                                         columns,
                                         getRowKey,
                                         renderDetail,
                                         initialSelectedIndex = 0,
                                     }: MasterDetailTableProps<T>) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(
        rows.length > 0 ? initialSelectedIndex : null,
    );

    const selectedRow = selectedIndex != null ? rows[selectedIndex] : null;

    return (
        <div className={styles.root}>
            {/* 상단: 상세 정보 영역 */}
            <div className={styles.detailArea}>
                {renderDetail(selectedRow)}
            </div>

            {/* 하단: 리스트 테이블 영역 */}
            <div className={styles.tableArea}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                style={
                                    col.width
                                        ? { width: col.width }
                                        : undefined
                                }
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((row, rowIndex) => {
                        const isActive = selectedIndex === rowIndex;
                        return (
                            <tr
                                key={getRowKey(row, rowIndex)}
                                className={
                                    isActive ? styles.rowActive : ''
                                }
                                onClick={() => setSelectedIndex(rowIndex)}
                            >
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex}>
                                        {col.render(row)}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}

                    {rows.length === 0 && (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className={styles.emptyCell}
                            >
                                표시할 데이터가 없습니다.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}