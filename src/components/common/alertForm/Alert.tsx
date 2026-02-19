import Link from 'next/link';
import styles from './Alert.module.scss';

type ComingSoonProps = {
    title: string;
    description?: string;
    /** 선택: “예정 기능” 리스트 */
    features?: string[];
    /** 선택: 예상 오픈/배포 시점 텍스트 */
    etaText?: string;

    /** 이동 버튼 */
    primaryHref?: string;   // 기본: /palace
    primaryLabel?: string;  // 기본: 대시보드로
    secondaryHref?: string; // 기본: /palace
    secondaryLabel?: string; // 기본: 돌아가기(대체로 목록/상위)
};

export default function Alert({
                                       title,
                                       description = '현재 페이지는 준비 중입니다. 빠르게 제공할 수 있도록 개발 중입니다.',
                                       features,
                                       etaText,
                                       primaryHref = '/palace',
                                       primaryLabel = '대시보드로',
                                       secondaryHref,
                                       secondaryLabel = '돌아가기',
                                   }: ComingSoonProps) {
    return (
        <div className={styles.root}>
            <div className={styles.card}>
                <div className={styles.topRow}>
                    <span className={styles.badge}>준비중</span>
                    {etaText && <span className={styles.eta}>{etaText}</span>}
                </div>

                <div className={styles.iconWrap} aria-hidden="true">
                    <div className={styles.icon}>⋯</div>
                </div>

                <h1 className={styles.title}>{title}</h1>
                <p className={styles.desc}>{description}</p>

                {features && features.length > 0 && (
                    <div className={styles.featureBox}>
                        <div className={styles.featureTitle}>예정 기능</div>
                        <ul className={styles.featureList}>
                            {features.map((x, i) => (
                                <li key={`${x}-${i}`}>{x}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className={styles.actions}>
                    {secondaryHref ? (
                        <Link className={styles.btnOutline} href={secondaryHref}>
                            {secondaryLabel}
                        </Link>
                    ) : (
                        <span className={styles.btnGhost} aria-hidden="true">
              {secondaryLabel}
            </span>
                    )}

                    <Link className={styles.btnPrimary} href={primaryHref}>
                        {primaryLabel}
                    </Link>
                </div>

                <div className={styles.footerHint}>
                    필요하면 우측 상단 메뉴에서 다른 기능을 이용해 주세요.
                </div>
            </div>
        </div>
    );
}