'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@components/palace/test/ai-case-notes/DefaultContent.module.scss';

export type TemplateKind = 'case_note' | 'inquiry_reply' | 'sms_reply';

type KindTabProps = {
    companyId: number;
    /** 탭 바꿀 때 같이 초기화하고 싶은 동작이 있으면 */
    onKindChange?: () => void;
};

const KIND_TABS: Array<{ kind: TemplateKind; label: string }> = [
    { kind: 'case_note', label: '상담이력' },
    { kind: 'inquiry_reply', label: '1:1 문의 답변' },
    { kind: 'sms_reply', label: '문자 답변' },
];

export default function KindBarSection({ companyId, onKindChange }: KindTabProps) {
    const router = useRouter();
    const sp = useSearchParams();

    const kind = (sp.get('kind') as TemplateKind) ?? 'case_note';

    const setKindToUrl = (nextKind: TemplateKind) => {
        const params = new URLSearchParams(sp.toString());
        params.set('kind', nextKind);
        router.push(`?${params.toString()}`);
        onKindChange?.();
    };

    return (
        <section className={styles.tabWrap}>
            <div className={styles.kindTabs} role="tablist" aria-label="템플릿 종류">
                {KIND_TABS.map((t) => (
                    <button
                        key={t.kind}
                        type="button"
                        role="tab"
                        aria-selected={kind === t.kind}
                        className={`${styles.kindTab} ${kind === t.kind ? styles.kindTabActive : ''}`}
                        onClick={() => setKindToUrl(t.kind)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className={styles.kindRight}>
                <span className={styles.badgeLabel}>company</span>
                <span className={styles.badgeValue}>{companyId}</span>
            </div>
        </section>
    );
}