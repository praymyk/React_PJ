'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createWork, uploadWorkThumbnail, listMyWorks, type WorkSummary, type WorkMode } from '@/api/works';

import styles from './StudioWorkCreateContent.module.scss';

import { getMe } from '@/api/auth';
import type { MeResponse } from '@/types/user';

export default function StudioWorkCreateContent() {
    const router = useRouter();

    const [me, setMe] = useState<MeResponse | null>(null);
    const [meLoading, setMeLoading] = useState(true);
    const [meError, setMeError] = useState<string>('');

    const [myWorks, setMyWorks] = useState<WorkSummary[]>([]);
    const [worksLoading, setWorksLoading] = useState(false);
    const [worksError, setWorksError] = useState('');

    const [title, setTitle] = useState('작품이름');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [mode, setMode] = useState<WorkMode>('NORMAL');
    const [aiImageEnabled, setAiImageEnabled] = useState(true);

    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string>('');

    const fileRef = useRef<HTMLInputElement>(null);

    const tags = useMemo(
        () => tagsInput.split(',').map(t => t.trim()).filter(Boolean),
        [tagsInput]
    );

    const authorDisplay = useMemo(() => {
        const u = me?.user;
        if (!u) return '';
        return (u.profileName && u.profileName.trim()) ? u.profileName : u.name;
    }, [me]);

    // 1) me 조회
    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setMeLoading(true);
                const res = await getMe();
                if (!mounted) return;
                setMe(res);
                setMeError('');
            } catch (e) {
                if (!mounted) return;
                setMeError('사용자 정보를 불러오지 못했습니다. 다시 로그인 해주세요.');
            } finally {
                if (mounted) setMeLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, []);

    // 2) me가 준비되면 내 작품 목록 조회
    useEffect(() => {
        if (!me?.user?.id) return;

        let mounted = true;
        (async () => {
            try {
                setWorksLoading(true);
                const list = await listMyWorks(me.user.id);
                if (!mounted) return;
                setMyWorks(list ?? []);
                setWorksError('');
            } catch (e: any) {
                if (!mounted) return;
                setWorksError(e?.message ?? '내 작품 목록을 불러오지 못했습니다.');
            } finally {
                if (mounted) setWorksLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, [me?.user?.id]);

    // 썸네일 선택
    const openPicker = () => fileRef.current?.click();

    const onPickThumbnail = (file: File | null) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) return;

        if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);

        const url = URL.createObjectURL(file);
        setThumbnailFile(file);
        setThumbnailPreviewUrl(url);

        if (fileRef.current) fileRef.current.value = '';
    };

    useEffect(() => {
        return () => {
            if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
        };
    }, [thumbnailPreviewUrl]);

    // 작품 선택 → 에피소드 작성 이동
    const goToEpisodeCreate = (workId: number) => {
        router.push(`/palace2/studio/${workId}/episodes/new?ep=1`);
    };

    const onCreate = async () => {
        if (!me) return;

        const payload = {
            companyId: me.user.companyId,
            authorUserId: me.user.id,
            title,
            description,
            tags,
            mode: mode as WorkMode,
            aiImageEnabled,
        };

        try {
            const created = await createWork(payload);

            if (thumbnailFile) {
                const url = await uploadWorkThumbnail(created.id, thumbnailFile);
                setThumbnailPreviewUrl(url);
            }

            router.push(`/palace2/studio/${created.id}/episodes/new?ep=1`);
        } catch (e: any) {
            console.error(e);
            alert(e?.message ?? '작품 생성에 실패했습니다.');
        }
    };

    return (
        <div className={styles.contentGrid}>

            {/* ===== 좌측: 내 작품 ===== */}
            <aside className={styles.leftColumn}>
                <section className={styles.myWorksPanel}>
                    <div className={styles.panelHeader}>
                        <div className={styles.panelTitle}>내 작품</div>
                        <div className={styles.panelMeta}>
                            {worksLoading ? '불러오는 중…' : `${myWorks.length}개`}
                        </div>
                    </div>

                    <div className={styles.panelTools}>
                        <input
                            className={styles.searchInput}
                            placeholder="작품 검색..."
                            // TODO : value, onChange 구현 필요
                        />
                    </div>
                    {worksError && <div className={styles.errorBox}>{worksError}</div>}

                    {!worksLoading && myWorks.length === 0 ? (
                        <div className={styles.emptyHint}>아직 등록한 작품이 없습니다. 가운데에서 새 작품을 만들어보세요.</div>
                    ) : (
                        <div className={styles.myWorksList}>
                            {myWorks.map(w => (
                                <button
                                    key={w.id}
                                    type="button"
                                    className={styles.myWorkItem}
                                    onClick={() => goToEpisodeCreate(w.id)}
                                >
                                    <div className={styles.myWorkThumb} aria-hidden>
                                        {w.thumbnailUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img className={styles.myWorkThumbImg} src={w.thumbnailUrl} alt="" />
                                        ) : null}
                                    </div>

                                    <div className={styles.myWorkBody}>
                                        <div className={styles.myWorkName}>{w.title}</div>
                                        <div className={styles.myWorkSub}>{w.mode} · {w.status}</div>
                                    </div>

                                    <div className={styles.myWorkCta}>작성 →</div>
                                </button>
                            ))}
                        </div>
                    )}
                </section>
            </aside>

            {/* ===== 중앙: 작품 생성 ===== */}
            <div className={styles.mainColumn}>
                <section className={styles.createPanel}>
                    <div className={styles.sectionHeader}>
                        <h1 className={styles.sectionTitle}>Studio · 작품 생성</h1>
                        <div className={styles.sectionTools}>
                            <button className={styles.primaryBtn} type="button" onClick={onCreate}>
                                작품 만들고 1화 작성
                            </button>
                        </div>
                    </div>

                    {meError && <div className={styles.errorBox}>{meError}</div>}

                    <div className={styles.formGrid}>
                        <label className={styles.field}>
                            <span className={styles.label}>작품 제목</span>
                            <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />
                        </label>

                        <div className={styles.fieldFull}>
                            <span className={styles.label}>썸네일</span>

                            <div
                                className={styles.dropZone}
                                role="button"
                                tabIndex={0}
                                onClick={openPicker}
                                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openPicker()}
                            >
                                <input
                                    ref={fileRef}
                                    className={styles.hiddenFile}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => onPickThumbnail(e.target.files?.[0] ?? null)}
                                />

                                {thumbnailPreviewUrl ? (
                                    <div className={styles.thumbPreview}>
                                        <img className={styles.thumbImg} src={thumbnailPreviewUrl} alt="thumbnail preview" />

                                        <button
                                            type="button"
                                            className={styles.smallBtn}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
                                                setThumbnailPreviewUrl('');
                                                setThumbnailFile(null);

                                                if (fileRef.current) fileRef.current.value = '';
                                            }}
                                        >
                                            제거
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.thumbEmpty}>
                                        <div className={styles.thumbHint}>썸네일 업로드</div>
                                        <div className={styles.thumbSub}>클릭해서 선택 (권장: 3:4 또는 1:1, 1MB 이하)</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <label className={styles.field}>
                            <span className={styles.label}>작가</span>
                            <input
                                className={styles.input}
                                value={meLoading ? '불러오는 중…' : authorDisplay}
                                readOnly
                                aria-readonly="true"
                            />
                            {/* 필요하면 id도 숨겨두기 */}
                            {/* <input type="hidden" value={me?.user.id ?? ''} /> */}
                        </label>

                        <label className={styles.fieldFull}>
                            <span className={styles.label}>작품 소개</span>
                            <textarea
                                className={styles.textarea}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="작품 소개를 입력하세요"
                            />
                        </label>

                        <label className={styles.field}>
                            <span className={styles.label}>태그(콤마)</span>
                            <input className={styles.input} value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
                        </label>

                        <label className={styles.field}>
                            <span className={styles.label}>모드</span>
                            <select className={styles.select} value={mode} onChange={(e) => setMode(e.target.value as WorkMode)}>
                                <option value="NORMAL">Normal</option>
                                <option value="INTERACTIVE">Interactive</option>
                                <option value="MYSTERY">Mystery</option>
                                <option value="VISUAL">Visual</option>
                            </select>
                        </label>

                        <label className={styles.toggleRow}>
                            <span className={styles.label}>AI 이미지 생성 허용(작가)</span>
                            <input type="checkbox" checked={aiImageEnabled} onChange={(e) => setAiImageEnabled(e.target.checked)} />
                        </label>
                    </div>
                </section>
            </div>

            {/* ===== 우측: 미리보기 ===== */}
            <aside className={styles.sideColumn}>
                <section className={styles.sidePanel}>
                    <div className={styles.sideTitle}>미리보기</div>
                    <div className={styles.previewTitle}>{title}</div>
                    <div className={styles.previewThumb}>
                        {thumbnailPreviewUrl ? (
                            <img className={styles.previewThumbImg} src={thumbnailPreviewUrl} alt="" />
                        ) : (
                            <div className={styles.previewThumbPlaceholder} aria-hidden />
                        )}
                    </div>
                    <div className={styles.previewSub}>by {author} · {mode}</div>
                    <div className={styles.previewDesc}>{description}</div>
                    <div className={styles.tagRow}>
                        {tags.map(t => <span key={t} className={styles.tag}>#{t}</span>)}
                    </div>
                </section>
            </aside>
        </div>
    );
}