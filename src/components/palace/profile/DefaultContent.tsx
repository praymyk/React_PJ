'use client';

import { useEffect, useState } from 'react';
import styles from '@components/palace/profile/DefaultContent.module.scss';

import { MainCard } from '@components/palace/profile/MainCard';
import { ActivityCard } from '@components/palace/profile/ActivityCard';
import { DetailPanel } from '@components/palace/profile/DetailPanel';

export type Profile = {
    id: number;
    account: string;
    public_id: string;
    name: string;
    profile_name: string | null;
    email: string;
    username: string;
    extension: string | null;
    status: 'active' | 'inactive' | 'hidden';
    created_at: string;
    deactivated_at: string | null;
    updated_at: string;
};

export default function DefaultContent() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch('/api/common/users/me');
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                const profileData: Profile = await res.json();
                setProfile(profileData);
            } catch (e) {
                console.error('[Profile] /api/common/users/me error', e);
                setError('프로필 정보를 불러오지 못했습니다.');
                setProfile(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <div className={styles.profileLayout}>
                <div className={styles.mainColumn}>
                    <div className={styles.loadingBox}>프로필 불러오는 중...</div>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className={styles.profileLayout}>
                <div className={styles.mainColumn}>
                    <div className={styles.errorBox}>{error ?? '프로필 정보가 없습니다.'}</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.profileLayout}>
            {/* 좌측: 프로필 + 활동 현황 */}
            <div className={styles.mainColumn}>
                <MainCard
                    profile={profile}
                    onProfileChange={setProfile}   // 저장 성공 시 상위 상태 업데이트용
                />
                <ActivityCard userId={profile.id} />
            </div>

            {/* 우측: 상세 정보 / 확장 영역 */}
            <div className={styles.detailColumn}>
                <DetailPanel userId={profile.id} />
            </div>
        </div>
    );
}