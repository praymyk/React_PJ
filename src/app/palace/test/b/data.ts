/** 퀘스트(티켓) 정보 목업 ***/
export type Row = {
    id: string;
    title: string;
    description: string;
    assignee: string; // 담당자
    status: '접수' | '진행중' | '종료' | '취소';
};

export const mockRows: Row[] = [
    {
        id: 'Q-0001',
        title: '상담 이력 내보내기 오류',
        description:
            '상담 이력 엑셀 다운로드 시 “알 수 없는 오류가 발생했습니다” 메시지가 뜹니다.',
        assignee: '김나나',
        status: '접수',
    },
    {
        id: 'Q-0002',
        title: '내선 사용량 통계 데이터 불일치',
        description:
            '통화 수치가 관리자 페이지와 상담원 페이지에서 서로 다르게 표시됩니다.',
        assignee: '이나나',
        status: '진행중',
    },
    {
        id: 'Q-0003',
        title: '다크 모드 전환 시 화면 깜빡임',
        description:
            '다크 모드 전환 버튼 클릭 시 짧게 흰 화면이 깜빡이는 현상이 있습니다.',
        assignee: '박나나',
        status: '종료',
    },
    {
        id: 'Q-0004',
        title: '프로필 이미지 업로드 실패',
        description:
            '5MB 이하 PNG 파일 업로드 시에도 “파일 용량 초과” 경고가 나옵니다.',
        assignee: '정나나',
        status: '취소',
    },
    {
        id: 'Q-0005',
        title: '실시간 모니터링 지연',
        description:
            '실시간 대시보드의 통화 건수 업데이트가 1분 이상 지연되는 것 같습니다.',
        assignee: '오나나',
        status: '진행중',
    },
];