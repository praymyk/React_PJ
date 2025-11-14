'use client';

import styles from '@styles/layout/PalaceLayout.module.scss';

export default function PalaceDefaultContent() {
    return (
        <div className={styles.contentGrid}>
            <div className={styles.contentBox}>컨텐츠1</div>
            <div className={styles.contentBox}>컨텐츠2</div>
            <div className={styles.contentBox}>컨텐츠3</div>
        </div>
    );
}