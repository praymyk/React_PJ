'use client';

import styles from '@components/palace/profile/Profile.module.scss';
import { ProfileMainCard } from '@components/palace/profile/ProfileMainCard';
import { ProfileActivityCard } from '@components/palace/profile/ProfileActivityCard';
import { ProfileDetailPanel } from '@components/palace/profile/ProfileDetailPanel';

export default function ProfileDefaultContent() {
    return (
        <div className={styles.profileLayout}>
            {/* 좌측: 프로필 + 활동 현황 */}
            <div className={styles.mainColumn}>
                <ProfileMainCard />
                <ProfileActivityCard />
            </div>

            {/* 우측: 상세 정보 / 확장 영역 */}
            <div className={styles.detailColumn}>
                <ProfileDetailPanel />
            </div>
        </div>
    );
}