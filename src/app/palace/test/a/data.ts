/** 고객 이력 목업 ***/
export type HistoryItem = {
    id: number;
    user_id: string;
    event_date: Date;
    title: string;
    content: string;
    status: string;
    created_at: Date;
};


// export const mockHistoryById: Record<string, HistoryItem[]> = {
//     'u-001': [
//         { date: '2025-03-01', title: '문의 접수',     status: '진행중', content: '웹 문의 폼을 통해 접수된 상담입니다.' },
//         { date: '2025-03-03', title: '추가 자료 요청', status: '완료',   content: '필요 서류 안내 후 고객이 자료를 업로드했습니다.' },
//     ],
//     'u-002': [
//         { date: '2025-02-11', title: '회원 정보 수정', status: '완료',   content: '연락처 및 주소 정보가 최신 정보로 수정되었습니다.' },
//     ],
//     // 나머지 ID는 데이터가 없으면 빈 배열로 처리
// };
