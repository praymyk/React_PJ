'use client';

import common from '@components/palace/ticket/DefaultContent.module.scss';
import styles from '@components/palace/ticket/InquirySection/InquirySection.module.scss';
import { type TicketDetailApiResponse, TicketEventRow } from '@/app/palace/ticket/data';

type Props = {
    ticket: TicketDetailApiResponse | null;
    events: TicketEventRow[];
};

export default function InquirySection({ ticket, events }: Props) {

    const hasTicket = !!ticket;
    const eventCount = hasTicket ? events.length : 0;

    /* TODO : 추후 티켓 연관 문의 타입별 클래스 부여용 (css) */
    const eventTypeClassOf = (eventType: TicketEventRow['eventType']) => {
        switch (eventType) {
            case '문의접수':
                return styles['ticketId--received'];
            case '상담기록':
                return styles['ticketId--call'];
            case '상담사메모':
            case '고객메모':
                return styles['ticketId--etc'];
            case '상태변경':
                return styles['ticketId--status'];
            case '티켓병합':
            case '티켓분리':
                return styles['ticketId--merge'];
            case '시스템':
            default:
                return styles['ticketId--system'] ?? '';
        }
    };

    return (
        <section className={common.listPane}>
            <header className={common.paneHeader}>
                <div className={common.paneTitleRow}>
                    <h2 className={common.paneTitle}>문의 / 이력 타임라인</h2>
                </div>

                {hasTicket && (
                    <span className={common.paneMeta}>
                        티켓 {ticket!.id} 관련 이벤트 {eventCount}건
                    </span>
                )}
            </header>

            {/* 본문 영역 */}
            <div className={styles.listBody}>
                {!hasTicket ? (
                    <div className={styles.emptyMessage}>
                        왼쪽에서 티켓을 선택하면
                        <br />
                        해당 티켓과 연결된 문의 / 이력 타임라인을 볼 수 있어요.
                    </div>
                ) : eventCount === 0 ? (
                    <div className={styles.emptyMessage}>
                        티켓 <strong>{ticket!.id}</strong> 에 연결된 이벤트가 없습니다.
                    </div>
                ) : (
                    <ul className={styles.ticketList}>
                        {events.map((ev) => (
                            <li
                                key={ev.id}
                                className={styles.ticketItem}
                            >
                                <div className={styles.ticketItemHeader}>
                                    <span
                                        className={`${styles.ticketId} ${eventTypeClassOf(
                                            ev.eventType,
                                        )}`}
                                    >
                                        {ev.eventType}
                                    </span>

                                    <span className={styles.ticketMeta}>
                                        {ev.createdAt}
                                        {ev.channel && (
                                            <> · 채널: {ev.channel}</>
                                        )}
                                    </span>
                                </div>

                                {ev.content && (
                                    <div className={styles.ticketTitle}>
                                        {ev.content}
                                    </div>
                                )}

                                <div className={styles.ticketMeta}>
                                    {ev.authorUserId && (
                                        <span className={styles.ticketAssignee}>
                                            작성자: {ev.authorUserId}
                                        </span>
                                    )}

                                    {/* 둘 다 있을 때만 구분자 출력 */}
                                    {ev.authorUserId && ev.customerId && (
                                        <span className={styles.metaDivider}> · </span>
                                    )}

                                    {ev.customerId && (
                                        <span className={styles.ticketCustomer}>
                                            고객: {ev.customerId}
                                        </span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}