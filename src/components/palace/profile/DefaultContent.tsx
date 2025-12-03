'use client';

import styles from '@components/palace/profile/DefaultContent.module.scss';
import { MainCard } from '@components/palace/profile/MainCard';
import { ActivityCard } from '@components/palace/profile/ActivityCard';
import { DetailPanel } from '@components/palace/profile/DetailPanel';

export default function DefaultContent() {
    return (
        <div className={styles.profileLayout}>
            {/* 좌측: 프로필 + 활동 현황 */}
            <div className={styles.mainColumn}>
                <MainCard />
                <ActivityCard />
            </div>

            {/* 우측: 상세 정보 / 확장 영역 */}
            <div className={styles.detailColumn}>
                <DetailPanel />
            </div>
        </div>
    );
}