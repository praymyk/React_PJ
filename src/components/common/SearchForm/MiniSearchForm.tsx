'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import styles from './MiniSearchForm.module.scss';
import type { SearchField } from './searchTypes';

export type SearchValues = Record<string, string>;

type SearchFormProps = {
    fields: SearchField[];
    /** 검색 버튼 눌렀을 때 값 전달 */
    onSearch: (values: SearchValues) => void;
    /** 초기값 (없으면 전부 '') */
    initialValues?: SearchValues;
    /** 오른쪽에 추가로 넣고 싶은 버튼들 (예: "추가", "엑셀다운" 등) */
    extraActions?: React.ReactNode;
};

export default function MiniSearchForm({
                                       fields,
                                       onSearch,
                                       initialValues = {},
                                       extraActions,
                                   }: SearchFormProps) {
    // 모든 필드 값을 하나의 객체로 관리
    const [values, setValues] = useState<SearchValues>(() => {
        const base: SearchValues = {};
        for (const f of fields) {
            base[f.name] = initialValues[f.name] ?? '';
        }
        return base;
    });

    const handleChange =
        (name: string) =>
            (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                const value = e.target.value;

                // 1) 현재 values 기준으로 next 만들고
                const next: SearchValues = {
                    ...values,
                    [name]: value,
                };

                // 2) 상태 업데이트
                setValues(next);

                // 3) 그다음 상위 onSearch 호출 (여기서 router.push 실행됨)
                onSearch(next);
            };


    const handleReset = () => {
        const empty: SearchValues = {};
        for (const f of fields) {
            empty[f.name] = '';
        }

        setValues(empty);
        onSearch(empty); // 리셋도 상위 전달 > 다시 검색
    };


    return (
        <form
            className={styles.searchForm}
            onSubmit={e => e.preventDefault()}
        >
            <div className={styles.fieldsRow}>
                {fields.map(field => {
                    const value = values[field.name] ?? '';
                    const commonProps = {
                        id: field.name,
                        name: field.name,
                        value,
                        onChange: handleChange(field.name),
                    };

                    return (
                        <div
                            key={field.name}
                            className={styles.field}
                            style={field.width ? { width: field.width } : undefined}
                        >
                            <label htmlFor={field.name} className={styles.label}>
                                {field.label}
                            </label>

                            {field.type === 'text' && (
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder={field.placeholder}
                                    {...commonProps}
                                />
                            )}

                            {field.type === 'select' && (
                                <select className={styles.select} {...commonProps}>
                                    {(field.options ?? []).map(opt => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {field.type === 'date' && (
                                <input
                                    type="date"
                                    className={styles.input}
                                    {...commonProps}
                                />
                            )}

                            {field.type === 'dateRange' && (
                                <div className={styles.dateRange}>
                                    <input
                                        type="date"
                                        className={styles.input}
                                        value={values[`${field.name}_from`] ?? ''}
                                        onChange={e =>
                                            setValues(prev => ({
                                                ...prev,
                                                [`${field.name}_from`]: e.target.value,
                                            }))
                                        }
                                    />
                                    <span className={styles.rangeSeparator}>~</span>
                                    <input
                                        type="date"
                                        className={styles.input}
                                        value={values[`${field.name}_to`] ?? ''}
                                        onChange={e =>
                                            setValues(prev => ({
                                                ...prev,
                                                [`${field.name}_to`]: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </form>
    );
}