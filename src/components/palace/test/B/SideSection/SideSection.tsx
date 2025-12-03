'use client';

import common from '@components/palace/test/B/DefaultContent.module.scss';
import styles from '@components/palace/test/B/SideSection/SideSection.module.scss';
import type { Row } from '@/app/palace/test/b/data';

type Props = {
    ticket: Row | null;
};

export default function SideSection({ ticket }: Props) {
    return (
        <aside className={common.sidePane}>
            <header className={common.paneHeader}>
                <div className={common.paneTitleRow}>
                    <h2 className={common.paneTitle}>문의 내역</h2>
                </div>
            </header>
            <div className={styles.sideBody}>
                <p className={styles.sidePlaceholder}>
                    {ticket ? (
                        <>
                            티켓 <strong>{ticket.id}</strong> (
                            {ticket.title})과 연결된 문의 목록을
                            <br />
                            나중에 이 영역에 표시할 예정입니다.
                        </>
                    ) : (
                        <>
                            왼쪽에서 티켓을 선택하면
                            <br />
                            해당 티켓의 문의 내역을 여기에서 볼 수 있어요.
                        </>
                    )}
                </p>
            </div>
        </aside>
    );
}