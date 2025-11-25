import styles from '@components/profile/ProfileActivityCard.module.scss';

export function ProfileActivityCard() {
    return (
        <div className={styles.activityCard}>
            <div className={styles.activityHeader}>
                <h2>내 활동 현황</h2>
                <span className={styles.activitySub}>
                    최근 사용 내역과 간단한 통계를 표시할 예정입니다.
                </span>
            </div>
            <div className={styles.activityBody}>
                {/* TODO: 여기에 실제 활동 데이터 표/리스트 표기 영역 */}
                <div className={styles.activityRow}>
                    <span className={styles.activityLabel}>최근 로그인</span>
                    <span className={styles.activityValue}>2025-03-10 21:03</span>
                </div>
                <div className={styles.activityRow}>
                    <span className={styles.activityLabel}>최근 접속 기기</span>
                    <span className={styles.activityValue}>Chrome · Windows</span>
                </div>
                <div className={styles.activityRow}>
                    <span className={styles.activityLabel}>총 접속 횟수</span>
                    <span className={styles.activityValue}>128회</span>
                </div>
            </div>
        </div>
    );
}