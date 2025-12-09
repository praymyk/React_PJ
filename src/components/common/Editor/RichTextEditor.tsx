'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import styles from './RichTextEditor.module.scss';

// ReactQuill를 동적 import + 클라이언트에서만 로드 > SSR(서버랜더링) 방어
const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
});

type Props = {
    value?: string;
    onChange?: (next: string) => void;
    placeholder?: string;
    label?: string;
};

export default function RichTextEditor({
                                           value,
                                           onChange,
                                           placeholder = '내용을 입력하세요.',
                                           label,
                                       }: Props) {
    const [innerValue, setInnerValue] = useState('');

    const currentValue = value ?? innerValue;

    const handleChange = (next: string) => {
        if (onChange) {
            onChange(next);
        } else {
            setInnerValue(next);
        }
    };

    return (
        <div className={styles.editorRoot}>
            {label && <div className={styles.editorLabel}>{label}</div>}

            <ReactQuill
                theme="snow"
                value={currentValue}
                onChange={handleChange}
                placeholder={placeholder}
                className={styles.editor}
            />
        </div>
    );
}