'use client';

import { useEffect, useState } from 'react';
import api from '@utils/axios'
import styles from '@components/palace/profile/DefaultContent.module.scss';

import { MainCard } from '@components/palace/profile/MainCard';
import { ActivityCard } from '@components/palace/profile/ActivityCard';
import { DetailPanel } from '@components/palace/profile/DetailPanel';
import HeaderSection from "@components/common/SubContentForm/headerSection/HeaderSection";

import type { Profile } from '@/types/user'

export default function DefaultContent() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await api.get<Profile>('/api/common/users/me');

                if (!cancelled) setProfile(res.data);
            } catch (e) {
                console.error('[Profile] /api/common/users/me error', e);
                setError('프로필 정보를 불러오지 못했습니다.');
                setProfile(null);
            } finally {
                if (!cancelled) setLoading(false);
            }

            return () => {
                cancelled = true;
            };
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
        <div>
            <HeaderSection
                title="내 정보 관리"
                description="내 프로필 정보를 확인하고 관리합니다."
            />

            <div className={styles.profileLayout}>
                <div className={styles.mainColumn}>
                    <MainCard profile={profile} onProfileChange={setProfile} />
                    <ActivityCard userId={profile.id} />
                </div>

                <div className={styles.detailColumn}>
                    <DetailPanel userId={profile.id} />
                </div>
            </div>
        </div>
    );
}