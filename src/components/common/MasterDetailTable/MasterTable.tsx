'use client';

import {useState, ReactNode, useEffect} from 'react';
import styles from './MasterTable.module.scss';

export type Column<T> = {
    header: string;
    render: (row: T) => ReactNode;
    width?: string;
};

type MasterTableProps<T> = {
    rows: T[];
    columns: Column<T>[];
    /** 각 row의 고유 key (React key로 사용) */
    getRowKey: (row: T, index: number) => string;

    /** row 클릭 시 추가 동작 */
    onRowClick?: (row: T, index: number) => void;

    /** row 클릭 indec */
    initialSelectedIndex?: number | null;
};

export function MasterTable<T>({
                                   rows,
                                   columns,
                                   getRowKey,
                                   onRowClick,
                                   initialSelectedIndex = null,
                               }: MasterTableProps<T>) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(initialSelectedIndex);

    useEffect(() => {
        setSelectedIndex(initialSelectedIndex ?? null);
    }, [initialSelectedIndex]);

    return (
        <div className={styles.root}>
            {/* 리스트 테이블 영역 */}
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
                                className={isActive ? styles.rowActive : ''}
                                onClick={() => {
                                    setSelectedIndex(rowIndex); // 목록 안에서만 하이라이트
                                    if (onRowClick) {
                                        onRowClick(row, rowIndex); // 상세 페이지 이동 등
                                    }
                                }}
                            >
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex}>{col.render(row)}</td>
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