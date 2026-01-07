'use client';

import { useState } from 'react';
import common from '@components/palace/ticket/DefaultContent.module.scss';
import styles from '@components/palace/ticket/NoteSection/NoteSection.module.scss';
import type { TicketDetailApiResponse } from '@/app/(protected)/palace/ticket/data';
import TicketNoteEditor from '@components/palace/ticket/NoteSection/TicketNoteEditor';

type Props = {
    ticket: TicketDetailApiResponse | null;
    onEventsReload?: () => void;
};

export default function NoteSection({ ticket, onEventsReload }: Props) {
    // 상단 입력 필드 상태
    const [inquiryNo, setInquiryNo] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const hasTicket = !!ticket;

    // 담당자 라벨
    const assigneeLabel = ticket?.assignee_id
        ? `담당 ${ticket.assignee_id}`
        : '미배정';

    // TicketNoteEditor 전달 (티켓 편집)
    const noteMeta = {
        inquiryNo,
        customerName,
        phoneNumber,
    };

    return (
        <section className={common.notePane}>
            <header className={common.paneHeader}>
                <div className={common.paneTitleRow}>
                    <h2 className={common.paneTitle}>티켓 편집</h2>
                </div>
                <span className={common.paneMeta}>
                    {hasTicket
                        ? `티켓 ${ticket!.id} 내용 편집`
                        : '티켓을 선택하세요'}
                </span>
            </header>

            <div className={styles.noteBody}>
                {/* 위쪽: 티켓 관련 문의 요약 카드 (항상 카드 유지) */}
                <div className={styles.noteCard}>
                    <div className={styles.noteHeader}>
                        <div className={styles.noteTitleRow}>
                            <span className={styles.noteTitle}>티켓 상세</span>
                            {hasTicket && (
                                <span className={styles.noteTicketId}>
                                    {ticket!.id}
                                </span>
                            )}
                        </div>
                        <p className={styles.noteSubtitle}>
                            {hasTicket ? (
                                <>
                                    {ticket!.title} · <strong>{assigneeLabel}</strong>
                                </>
                            ) : (
                                '왼쪽에서 티켓을 선택하면, 해당 티켓과 연결된 문의 번호와 고객 정보를 이 영역에서 확인할 수 있어요.'
                            )}
                        </p>
                    </div>

                    <div className={styles.noteFields}>
                        <div className={styles.fieldRow}>
                            <label className={styles.fieldLabel}>문의 번호</label>
                            <input
                                className={styles.fieldInput}
                                type="text"
                                placeholder={
                                    hasTicket
                                        ? '문의 선택 시 자동으로 채워집니다.'
                                        : '티켓 선택 후 사용할 수 있습니다.'
                                }
                                value={inquiryNo}
                                onChange={(e) => setInquiryNo(e.target.value)}
                                disabled={!hasTicket}
                            />
                        </div>

                        <div className={styles.fieldRow}>
                            <label className={styles.fieldLabel}>이름</label>
                            <input
                                className={styles.fieldInput}
                                type="text"
                                placeholder={
                                    hasTicket
                                        ? '예) 홍길동'
                                        : '티켓 선택 후 입력 가능합니다.'
                                }
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                disabled={!hasTicket}
                            />
                        </div>

                        <div className={styles.fieldRow}>
                            <label className={styles.fieldLabel}>
                                전화 / 회원번호
                            </label>
                            <input
                                className={styles.fieldInput}
                                type="text"
                                placeholder={
                                    hasTicket
                                        ? '예) 010-0000-0000 / MEM-0001'
                                        : '티켓 선택 후 입력 가능합니다.'
                                }
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                disabled={!hasTicket}
                            />
                        </div>
                    </div>
                </div>

                {/* 아래: 댓글/메모 작성 에디터 – 틀은 항상 유지 */}
                <div className={styles.noteEditorArea}>
                    <TicketNoteEditor
                        ticketId={hasTicket ? ticket!.id : null}
                        onSaved={onEventsReload} // 저장 후 콜백 호출
                        meta={noteMeta}
                    />
                </div>
            </div>
        </section>
    );
}