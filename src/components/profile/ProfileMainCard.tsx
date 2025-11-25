import { useState, ChangeEvent } from 'react';
import styles from '@components/profile/ProfileMainCard.module.scss';

type Profile = {
    id: string;
    username: string;   // 프로필명
    email: string;
    name: string;
    joinedAt: string;   // 가입시기 (문자열로 표시)
    isPublic: boolean;  // 노출 여부
};

const initialProfile: Profile = {
    id: 'nyam-0001',
    username: '냠냠',
    email: 'nyam@example.com',
    name: '정냠냠',
    joinedAt: '1988-03-12',
    isPublic: true
};

export function ProfileMainCard() {
    const [profile, setProfile] = useState<Profile>(initialProfile);
    const [draft, setDraft] = useState<Profile>(initialProfile);
    const [isEditing, setIsEditing] = useState(false);

    const startEdit = () => {
        setDraft(profile); // 현재 값 기준으로 편집 시작
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setDraft(profile); // 되돌리기
    };

    const saveEdit = () => {
        setProfile(draft);
        setIsEditing(false);
        // TODO: 실제 API 저장 로직이 있다면 여기에서 호출
    };

    const handleChange =
        (field: keyof Profile) =>
            (e: ChangeEvent<HTMLInputElement>) => {
                const value =
                    field === 'isPublic' ? e.target.checked : e.target.value;
                setDraft(prev => ({
                    ...prev,
                    [field]: value
                }));
            };

    return (
        <div className={styles.profileRoot}>
            {/* 상단 프로필 헤더 */}
            <div className={styles.profileHeader}>
                <div className={styles.avatar}>
                    {/* 간단한 이니셜 아바타 */}
                    <span>{profile.name?.[0] ?? 'N'}</span>
                </div>

                <div className={styles.headerText}>
                    <div className={styles.usernameRow}>
                        <span className={styles.username}>{profile.username}</span>
                        <span className={styles.tag}>#{profile.id}</span>
                    </div>
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
                            <button
                                type="button"
                                className={styles.secondaryButton}
                                onClick={cancelEdit}
                            >
                                취소
                            </button>
                            <button
                                type="button"
                                className={styles.primaryButton}
                                onClick={saveEdit}
                            >
                                저장
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 하단 상세 정보 영역 */}
            <div className={styles.profileBody}>
                <div className={styles.fieldRow}>
                    <div className={styles.fieldLabel}>ID</div>
                    <div className={styles.fieldValue}>
                        {isEditing ? (
                            <input
                                type="text"
                                className={styles.fieldInput}
                                value={draft.id}
                                onChange={handleChange('id')}
                            />
                        ) : (
                            <span className={styles.mono}>{profile.id}</span>
                        )}
                    </div>
                </div>

                <div className={styles.fieldRow}>
                    <div className={styles.fieldLabel}>프로필명</div>
                    <div className={styles.fieldValue}>
                        {isEditing ? (
                            <input
                                type="text"
                                className={styles.fieldInput}
                                value={draft.username}
                                onChange={handleChange('username')}
                            />
                        ) : (
                            <span>{profile.username}</span>
                        )}
                    </div>
                </div>

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

                <div className={styles.fieldRow}>
                    <div className={styles.fieldLabel}>가입시기</div>
                    <div className={styles.fieldValue}>
                        {isEditing ? (
                            <input
                                type="date"
                                className={styles.fieldInput}
                                value={draft.joinedAt}
                                onChange={handleChange('joinedAt')}
                            />
                        ) : (
                            <span>{profile.joinedAt}</span>
                        )}
                    </div>
                </div>

                <div className={styles.fieldRow}>
                    <div className={styles.fieldLabel}>노출</div>
                    <div className={styles.fieldValue}>
                        {isEditing ? (
                            <label className={styles.toggleWrapper}>
                                <input
                                    type="checkbox"
                                    checked={draft.isPublic}
                                    onChange={handleChange('isPublic')}
                                />
                                <span className={styles.toggleVisual} />
                                <span className={styles.toggleText}>
                                    {draft.isPublic ? '공개' : '비공개'}
                                </span>
                            </label>
                        ) : (
                            <span
                                className={
                                    profile.isPublic
                                        ? styles.badgePublic
                                        : styles.badgePrivate
                                }
                            >
                                {profile.isPublic ? '공개' : '비공개'}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}