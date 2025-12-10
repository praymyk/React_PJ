'use client';

import { useState } from 'react';
import styles from '@components/palace/test/B/DefaultContent.module.scss';
import { mockRows, type Row } from '@/app/palace/test/b/data';

// === 상태별 뱃지 스타일 매핑 ===
const STATUS_CLASS: Record<Row['status'], string> = {
    접수: styles.statusOpen,
    진행중: styles.statusInProgress,
    종료: styles.statusDone,
    취소: styles.statusCanceled,
};

// 상태 → css 클래스 얻는 헬퍼
const statusClassOf = (status: Row['status']) => STATUS_CLASS[status];

// === 섹션 컴포넌트 import ===
import ListSection from '@components/palace/test/B/ListSection/ListSection';
import DetailSection from '@components/palace/test/B/DetailSection/DetailSection';
import NoteSection from '@components/palace/test/B/NoteSection/NoteSection';
import InquirySection from '@components/palace/test/B/InquirySection/InquirySection';

export default function DefaultContent() {
    // 기본 선택 티켓: 첫 번째 티켓 (없으면 null)
    const [selectedId, setSelectedId] = useState<string | null>(
        mockRows.length ? mockRows[0].id : null,
    );

    const selectedTicket =
        mockRows.find((row) => row.id === selectedId) ?? null;

    return (
        <div className={styles.ticketLayout}>
            {/* 1) 좌측: 티켓 리스트 */}
            <ListSection
                rows={mockRows}
                selectedId={selectedId}
                onSelect={setSelectedId}
                statusClassOf={statusClassOf}
            />

            {/* 2) 중앙: 선택 티켓 상세 */}
            <DetailSection
                ticket={selectedTicket}
                statusClassOf={statusClassOf}
            />

            {/* 3) 우측: 티켓 작성 영역 */}
            <NoteSection ticket={selectedTicket} />

            {/* 4) 우측2: 티켓 내 문의 */}
            <InquirySection ticket={selectedTicket} />

        </div>
    );
}