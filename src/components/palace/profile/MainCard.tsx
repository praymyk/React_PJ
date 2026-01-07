import { useState, ChangeEvent } from 'react';
import styles from '@components/palace/profile/MainCard.module.scss';
import type { Profile } from '@components/palace/profile/DefaultContent';

type Props = {
    profile: Profile;
    onProfileChange?: (next: Profile) => void; // API 저장 후 상위 상태 업데이트용
};

export function MainCard({ profile, onProfileChange }: Props) {
    const [draft, setDraft] = useState<Profile>(profile);
    const [isEditing, setIsEditing] = useState(false);

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const startEdit = () => {
        setDraft(profile);
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setDraft(profile);
        setIsEditing(false);
    };

    const saveEdit = async () => {
        try {
            setSaving(true);
            setSaveError(null);

            const res = await fetch('/api/common/users/me', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    account: draft.account,
                    name: draft.name,
                    profile_name: draft.profile_name,
                    email: draft.email,
                    status: draft.status,
                }),
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const updated: Profile = await res.json();

            // 상위(DefaultContent)의 profile 상태 갱신
            onProfileChange?.(updated);

            setIsEditing(false);
        } catch (e) {
            console.error('[MainCard] saveEdit error', e);
            setSaveError('프로필 저장에 실패했습니다.');
        } finally {
            setSaving(false);
        }
    };

    const handleChange =
        (field: keyof Profile) =>
            (e: ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value as Profile[typeof field];
                setDraft(prev => ({ ...prev, [field]: value }));
            };

    return (
        <div className={styles.profileRoot}>
            {/* 상단 프로필 헤더 */}
            <div className={styles.profileHeader}>
                <div className={styles.avatar}>
                    <span>{profile.name?.[0] ?? 'N'}</span>
                </div>

                <div className={styles.headerText}>
                    <span className={styles.profileName}>
                        {profile.profile_name ?? profile.name}
                    </span>
                    <span className={styles.tag}>
                        #{profile.id}
                    </span>
                    <div className={styles.subText}>
                        내 프로필 정보를 확인하고 편집할 수 있습니다.
                    </div>
                </div>

                <div className={styles.headerActions}>
                    {!isEditing ? (
                        <button
                            type="button"
                            className={styles.primaryButton}
                            onClick={startEdit}
                        >
                            프로필 편집
                        </button>
                    ) : (
                        <div className={styles.editButtons}>
                            <div className={styles.editButtonsRow}>
                                <button
                                    type="button"
                                    className={styles.secondaryButton}
                                    onClick={cancelEdit}
                                    disabled={saving}
                                >
                                    취소
                                </button>
                                <button
                                    type="button"
                                    className={styles.primaryButton}
                                    onClick={saveEdit}
                                    disabled={saving}
                                >
                                    {saving ? '저장 중...' : '저장'}
                                </button>
                            </div>
                            <div className={styles.saveErrorArea}>
                                {saveError && (
                                    <span className={styles.saveError}>{saveError}</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 하단 상세 정보 영역 */}
            <div className={styles.profileBody}>
                {/* ID(로그인 ID/account) */}
                <div className={styles.fieldRow}>
                    <div className={styles.fieldLabel}>ID</div>
                    <div className={styles.fieldValue}>
                        {isEditing ? (
                            <input
                                type="text"
                                className={styles.fieldInput}
                                value={draft.account}
                                onChange={handleChange('account')}
                            />
                        ) : (
                            <span className={styles.mono}>{profile.account}</span>
                        )}
                    </div>
                </div>

                {/* 프로필명 */}
                <div className={styles.fieldRow}>
                    <div className={styles.fieldLabel}>프로필명</div>
                    <div className={styles.fieldValue}>
                        {isEditing ? (
                            <input
                                type="text"
                                className={styles.fieldInput}
                                value={draft.profile_name ?? ''}
                                onChange={handleChange('profile_name')}
                            />
                        ) : (
                            <span>{profile.profile_name ?? profile.name}</span>
                        )}
                    </div>
                </div>

                {/* 이메일 */}
                <div className={styles.fieldRow}>
                    <div className={styles.fieldLabel}>이메일</div>
                    <div className={styles.fieldValue}>
                        {isEditing ? (
                            <input
                                type="email"
                                className={styles.fieldInput}
                                value={draft.email}
                                onChange={handleChange('email')}
                            />
                        ) : (
                            <span>{profile.email}</span>
                        )}
                    </div>
                </div>

                {/* 이름 */}
                <div className={styles.fieldRow}>
                    <div className={styles.fieldLabel}>이름</div>
                    <div className={styles.fieldValue}>
                        {isEditing ? (
                            <input
                                type="text"
                                className={styles.fieldInput}
                                value={draft.name}
                                onChange={handleChange('name')}
                            />
                        ) : (
                            <span>{profile.name}</span>
                        )}
                    </div>
                </div>

                {/* 가입시기 */}
                <div className={styles.fieldRow}>
                    <div className={styles.fieldLabel}>가입시기</div>
                    <div className={styles.fieldValue}>
                        {isEditing ? (
                            <input
                                type="date"
                                className={styles.fieldInput}
                                value={draft.created_at.slice(0, 10)}
                                onChange={handleChange('created_at')}
                            />
                        ) : (
                            <span>{profile.created_at}</span>
                        )}
                    </div>
                </div>

                {/* 노출(공개/비공개) */}
                <div className={styles.fieldRow}>
                    <div className={styles.fieldLabel}>노출</div>
                    <div className={styles.fieldValue}>
                        {isEditing ? (
                            <label className={styles.toggleWrapper}>
                                <input
                                    type="checkbox"
                                    checked={draft.status === 'hidden'}
                                    onChange={(e) => {
                                        const nextStatus = e.target.checked ? 'hidden' : 'active';
                                        setDraft(prev => ({
                                            ...prev,
                                            status: nextStatus,
                                        }));
                                    }}
                                />
                                <span className={styles.toggleVisual} />
                                <span className={styles.toggleText}>
                                    {draft.status === 'hidden' ? '비공개' : '공개'}
                                </span>
                            </label>
                        ) : (
                            <span
                                className={
                                    profile.status === 'hidden'
                                        ? styles.badgePrivate
                                        : styles.badgePublic
                                }
                            >
                                {profile.status === 'hidden' ? '비공개' : '공개'}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}