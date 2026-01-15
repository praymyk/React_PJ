'use client';

import styles from './HeaderSection.module.scss';

type HeaderSectionProps = {
    title: string;
    description?: string;
    onClickCreate?: () => void;
};

export default function HeaderSection({
                                          title,
                                          description,
                                          onClickCreate,
                                      }: HeaderSectionProps) {
    return (
        <section className={styles.header}>
            {/* 1줄: 타이틀 + 설명 */}
            <div className={styles.line1}>
                <h1 className={styles.title}>{title}</h1>
                {description && (
                    <p className={styles.description}>{description}</p>
                )}
            </div>

            {/* 2줄: 고객 등록 버튼 */}
            {onClickCreate && (
                <div className={styles.line2}>
                    <button
                        type="button"
                        className={styles.createButton}
                        onClick={onClickCreate}
                    >
                        <span className={styles.createIcon}>＋</span>
                        <span>등록</span>
                    </button>
                </div>
            )}
        </section>
    );
}