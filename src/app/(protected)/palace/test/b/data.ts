/** 퀘스트(티켓) 정보 목업 ***/
export type Row = {
    id: string;
    title: string;
    description: string;
    assignee: string; // 담당자
    status: '접수' | '진행중' | '종료' | '취소';
};
