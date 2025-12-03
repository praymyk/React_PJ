import styles from '@components/palace/profile/DetailPanel.module.scss';

export function DetailPanel() {
    return (
        <aside className={styles.detailPanel}>
            <div className={styles.detailHeader}>
                <h2>상세 정보</h2>
                <span className={styles.detailSub}>
                    앞으로 이 영역에 추가 정보나 설정 상세를 표시 예정.
                </span>
            </div>
            <div className={styles.detailBody}>
                {/* TODO: 나중에 선택한 항목 상세, 알림 설정 등 붙일 영역 */}
                <p>아직 선택된 항목이 없습니다.</p>
                <p>내 활동 내역이나 추가 설정을 여기에 표시 예정.</p>
            </div>
        </aside>
    );
}