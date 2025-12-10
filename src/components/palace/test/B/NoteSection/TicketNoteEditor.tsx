'use client';

import { useState } from 'react';
import RichTextEditor from '@components/common/Editor/RichTextEditor';
import styles from './TicketNoteEditor.module.scss';

type Props = {
    /** 대상 티켓 ID */
    ticketId?: string | null;
    /** 외부에서 값 관리용 value / onChange 넘기기 (옵션) */
    value?: string;
    onChange?: (next: string) => void;
};

export default function TicketNoteEditor({ ticketId, value, onChange }: Props) {
    // 부모가 안 주면 여기서 로컬 state로 관리
    const [innerValue, setInnerValue] = useState('');

    const currentValue = value ?? innerValue;

    const handleChange = (next: string) => {
        if (onChange) {
            onChange(next);
        } else {
            setInnerValue(next);
        }
    };

    const label = '티켓 메모';
    const placeholder = ticketId
        ? `티켓 메모를 입력하세요.`
        : '티켓을 먼저 선택하세요.';

    const disabled = !ticketId;

    return (
        <div className={styles.editorWrapper}>
            <RichTextEditor

                label={label}
                placeholder={placeholder}
                value={currentValue}
                onChange={handleChange}
            />

            {/* 아래는 티켓 전용 액션들 – 공용 에디터에는 없는 부분 */}
            <div className={styles.actionsRow}>
                <button
                    type="button"
                    className={styles.saveButton}
                    disabled={disabled}
                    onClick={() => {
                        if (!ticketId) return;
                        // TODO: 여기에 API 연동 (티켓 메모 저장)
                        console.log('티켓 메모 저장', { ticketId, currentValue });
                    }}
                >
                    메모 저장
                </button>

                <button
                    type="button"
                    className={styles.resetButton}
                    disabled={disabled}
                    onClick={() => {
                        if (onChange) {
                            onChange('');
                        } else {
                            setInnerValue('');
                        }
                    }}
                >
                    내용 초기화
                </button>
            </div>
        </div>
    );
}