// src/components/palace/test/B/InquirySection.tsx
'use client';

import common from '@components/palace/test/B/DefaultContent.module.scss';
import styles from '@components/palace/test/B/InquirySection/InquirySection.module.scss';
import { type Row, mockInquiries } from '@/app/palace/test/b/data';

type Props = {
    ticket: Row | null;
};

export default function InquirySection({ ticket }: Props) {
    // 티켓이 선택되지 않았으면 빈 배열
    const inquiries = ticket
        ? mockInquiries.filter(inq => inq.ticketId === ticket.id)
        : [];

    /* TODO : 추후 티켓 연관 문의 타입별 클래스 부여용 (css) */
    const typeClassOf = (type: string) => {
        switch (type) {
            case '통화':
                return styles['ticketId--call'];
            case '접수':
                return styles['ticketId--received'];
            case '기타':
                return styles['ticketId--etc'];
            default:
                return '';
        }
    };

    return (
        <section className={common.listPane}>
            <header className={common.paneHeader}>
                <div className={common.paneTitleRow}>
                    <h2 className={common.paneTitle}>문의 내역</h2>
                </div>
                {ticket && (
                    <span className={common.paneMeta}>
                            티켓 {ticket.id} 관련 문의 {inquiries.length}건
                        </span>
                )}
            </header>

            {/* 본문 영역 */}
            <div className={styles.listBody}>
                {!ticket ? (
                    <div className={styles.emptyMessage}>
                        왼쪽에서 티켓을 선택하면
                        <br />
                        해당 티켓과 연결된 문의 내역을 볼 수 있어요.
                    </div>
                ) : inquiries.length === 0 ? (
                    <div className={styles.emptyMessage}>
                        티켓 <strong>{ticket.id}</strong> 에 연결된 문의가 없습니다.
                    </div>
                ) : (
                    <ul className={styles.ticketList}>
                        {inquiries.map(inq => (
                            <li
                                key={inq.id}
                                className={styles.ticketItem}
                            >
                                <div className={styles.ticketItemHeader}>
                                    <span
                                        className={`${styles.ticketId} ${typeClassOf(inq.type)}`}
                                    >
                                        {inq.type}
                                    </span>
                                                                    <span className={styles.ticketMeta}>
                                        {inq.receivedAt}
                                    </span>
                                </div>

                                <div className={styles.ticketTitle}>
                                    {inq.content}
                                </div>

                                <div className={styles.ticketMeta}>
                                    <span className={styles.ticketAssignee}>
                                        이름: {inq.name}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}