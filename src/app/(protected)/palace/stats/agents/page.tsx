import Alert from '@components/common/AlertForm/Alert';

export default function Page() {
    return (
        <Alert
            title="상담원 통계"
            description="통계 집계/차트/필터 기능을 포함해 개발 중입니다."
            features={[
                '기간 선택(일/주/월)',
                '유입/응대/포기/콜백 지표',
                '상담원/큐 필터',
            ]}
            etaText="예상: 통계용 DB 계획 이후"
            primaryHref="/palace"
            primaryLabel="대시보드로"
            secondaryHref="/palace/stats/daily"
            secondaryLabel="통계 홈"
        />
    );
}