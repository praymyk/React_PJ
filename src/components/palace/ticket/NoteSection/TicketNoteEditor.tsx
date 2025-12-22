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
    /** 저장 후 후처리(이벤트 리로드) */
    onSaved?: () => void;
    /** 상단 NoteSection에서 받는 티켓 편집 정보 */
    meta?: {
        inquiryNo?: string;
        customerName?: string;
        phoneNumber?: string;
    };
};

export default function TicketNoteEditor({ ticketId, value, onChange, onSaved, meta }: Props) {

    const [innerValue, setInnerValue] = useState('');
    const [saving, setSaving] = useState(false);

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

    const handleSave = async () => {
        if (!ticketId) return;

        const trimmed = currentValue.trim();
        if (!trimmed) {
            alert('메모 내용을 입력해 주세요.');
            return;
        }

        try {
            setSaving(true);

            const res = await fetch(
                `/api/common/tickets/${encodeURIComponent(ticketId)}/events`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: trimmed,
                        eventType: '상담사메모',
                        // TODO: 추후 로그인/세션 연동해서 authorUserId 채우기
                        authorUserId: null,
                        meta: meta ?? null,
                    }),
                },
            );

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            // 성공 시 에디터 비우기
            if (onChange) {
                onChange('');
            } else {
                setInnerValue('');
            }

            onSaved?.();
        } catch (error) {
            console.error('[TicketNoteEditor] save error:', error);
            alert('메모 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        } finally {
            setSaving(false);
        }
    };

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
                    disabled={disabled || saving}
                    onClick={handleSave}
                >
                    {saving ? '저장 중...' : '메모 저장'}
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