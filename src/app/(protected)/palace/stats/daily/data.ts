/*** 내선별 사용량 Row 타입 ***/
export type Row = {
    id: string;                           // ID
    name: string;                         // 이름
    ext: string | null;                  // 내선번호
    status: 'active' | 'inactive';        // 상태
    startDate: string;                    // 사용 시작일자 (YYYY-MM-DD)
    endDate: string;                      // 사용 종료일자 (YYYY-MM-DD)
    useCount: number;                     // 사용 일수 (count)
    useDays: string[];                    // 사용 일자 정보 (YYYY-MM-DD 리스트)
};

/*** companyId 별 name ***/
export type Name = {
    id: string;
    name: string;
}