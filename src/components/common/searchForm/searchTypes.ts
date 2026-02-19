// 필드 타입 종류
export type SearchFieldType = 'text' | 'select' | 'date' | 'dateRange';

export type SearchOption = {
    label: string;
    value: string;
};

export interface SearchField {
    /** 검색 파라미터 키 (API 쿼리에서 사용) */
    name: string;
    /** 화면에 보이는 라벨 */
    label: string;
    /** 입력 타입 */
    type: SearchFieldType;
    /** placeholder (text용) */
    placeholder?: string;
    /** select 옵션 */
    options?: SearchOption[];
    /** width 힌트 (선택) */
    width?: string;
}