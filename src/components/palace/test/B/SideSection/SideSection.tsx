// src/components/palace/test/B/SideSection/SideSection.tsx
'use client';

import common from '@components/palace/test/B/DefaultContent.module.scss';
import styles from '@components/palace/test/B/SideSection/SideSection.module.scss';
import type { Row } from '@/app/palace/test/b/data';
import TicketNoteEditor from '@components/palace/test/B/SideSection/TicketNoteEditor';

type Props = {
    ticket: Row | null;
};

export default function SideSection({ ticket }: Props) {
    return (
        <section className={common.sidePane}>
            <header className={common.paneHeader}>
                <div className={common.paneTitleRow}>
                    <h2 className={common.paneTitle}>문의 내역</h2>
                </div>
                <span className={common.paneMeta}>
                    {ticket ? `티켓 ${ticket.id} 관련 문의` : '티켓을 선택하세요'}
                </span>
            </header>

            <div className={styles.sideBody}>
                {/* 위쪽: 티켓 관련 문의 요약 카드 */}
                <div className={styles.inquiryCard}>
                    {ticket ? (
                        <>
                            <div className={styles.inquiryHeader}>
                                <div className={styles.inquiryTitleRow}>
                                    <span className={styles.inquiryTitle}>
                                        티켓 상세
                                    </span>
                                    <span className={styles.inquiryId}>
                                        {ticket.id}
                                    </span>
                                </div>
                                <p className={styles.inquirySubtitle}>
                                    {ticket.title} · 담당 {ticket.assignee}
                                </p>
                            </div>

                            <div className={styles.inquiryFields}>
                                <div className={styles.fieldRow}>
                                    <label className={styles.fieldLabel}>
                                        문의 번호
                                    </label>
                                    <input
                                        className={styles.fieldInput}
                                        type="text"
                                        placeholder="문의 선택 시 자동으로 채워집니다."
                                        disabled
                                    />
                                </div>

                                <div className={styles.fieldRow}>
                                    <label className={styles.fieldLabel}>
                                        이름
                                    </label>
                                    <input
                                        className={styles.fieldInput}
                                        type="text"
                                        placeholder="예) 홍길동"
                                        disabled
                                    />
                                </div>

                                <div className={styles.fieldRow}>
                                    <label className={styles.fieldLabel}>
                                        전화 / 회원번호
                                    </label>
                                    <input
                                        className={styles.fieldInput}
                                        type="text"
                                        placeholder="예) 010-0000-0000 / MEM-0001"
                                        disabled
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className={styles.inquiryEmpty}>
                            <p>왼쪽에서 티켓을 선택하면,</p>
                            <p>해당 티켓과 연결된 문의 번호와 고객 정보를</p>
                            <p>이 영역에서 확인할 수 있어요.</p>
                        </div>
                    )}
                </div>

                {/* 아래: 댓글/메모 작성 에디터 */}
                <div className={styles.sideEditorArea}>
                    <TicketNoteEditor
                        ticketId={ticket?.id ?? null}
                    />
                </div>
            </div>
        </section>
    );
}