# React Project Context

이 문서는 이후 Codex가 이 개인 React 프로젝트 관련 질문에 빠르게 참조할 수 있도록 정리한 작업 메모입니다.
프로젝트 저장소 안에서 함께 이동할 수 있도록, 파일/디렉토리 참조는 프로젝트 루트 기준 상대 경로를 사용합니다.
백엔드 저장소는 프론트 저장소와 같은 상위 디렉토리 아래의 형제 디렉토리 `../myksBK`로 두는 것을 기본 전제로 합니다.

## 문서 운영 규칙

- 이 문서는 Codex 작업 기준의 단일 진입점으로 사용한다.
- 규칙이나 기준 추가 전에는 반영 후 모습을 `미리보기`로 먼저 보여주고 `Y/N` 확인을 받는다.
- 파일/디렉토리 참조는 프로젝트 루트 기준 상대 경로를 사용한다.
- 오래된 절대 경로, 임시 메모, 이미 해결된 주의사항은 정리 후보로 표시하거나 최신 상태로 갱신한다.
- 화면, API, 인증, DB, 아키텍처 동작을 변경할 때는 관련 보조 컨텍스트 문서를 함께 갱신하거나 갱신이 필요 없는 이유를 최종 응답에 남긴다.

## 문서 역할표

- `./AGENTS.md`
  - Codex 앱/CLI가 우선 참조할 최소 필수 규칙
  - 작업 루프, 변경 유형별 규칙, 문서 동기화 규칙, 검증 게이트

- `./CODEX.md`
  - 프로젝트 상세 컨텍스트의 단일 진입점
  - 경로, DB 구조, 프론트 구조, 인증 흐름, 코딩 규칙, 보조 문서 목록

- `./docs/codex/screen-map.md`
  - 화면 route, component, data loader, API, DB 매핑
  - 화면 구조나 주요 화면 흐름 변경 시 갱신 대상

- `./docs/codex/api-map.md`
  - 프론트 API 바인딩, 백엔드 endpoint/controller/service, 관련 DB 매핑
  - API 호출 구조나 endpoint 변경 시 갱신 대상

- `./docs/codex/decisions.md`
  - 반복 참조할 기술 결정과 그 이유, 영향 범위 기록
  - 인증, 경로, API 바인딩 원칙, 공통 설계 판단 변경 시 갱신 대상

## Codex 읽기 이벤트 순서

Codex 앱이나 CLI에서 이 프로젝트를 다룰 때의 참조 흐름은 아래 순서를 기본으로 본다.

1. 프로젝트 루트 진입
- 작업 기준 위치는 프론트 저장소 루트 `.`이다.
- 백엔드는 형제 디렉토리 `../myksBK`에 있다고 본다.

2. `./AGENTS.md` 확인
- Codex가 프로젝트 루트의 진입 안내를 먼저 읽는 용도다.
- 여기서 `./CODEX.md`를 본문 컨텍스트로 읽으라는 지시를 확인한다.

3. `./CODEX.md` 확인
- 프로젝트 경로, DB 구조, 프론트 구조, API 규칙, 인증 규칙, 코딩 규칙을 확인한다.
- 작업 중 새 규칙이 필요하면 바로 반영하지 않고 미리보기와 `Y/N` 확인을 먼저 진행한다.

4. 작업 대상 파일 탐색
- 관련 화면, API 파일, 타입, 스타일 파일을 기존 패턴 기준으로 읽는다.
- 프론트 변경이면 `./src`, 백엔드 변경이면 `../myksBK/src`를 기준으로 탐색한다.

5. 구현 및 검증
- 기존 규칙에 맞게 변경하고, 가능한 범위에서 lint/build/test를 실행한다.
- 화면/API/아키텍처 동작 변경 시 관련 보조 문서를 갱신한다.
- 결과 보고 시 변경 파일, 검증 결과, 문서 갱신 여부를 함께 요약한다.

## 작업 전 체크리스트

1. `./CODEX.md`를 먼저 확인한다.
2. 관련 파일을 읽고 기존 구조와 네이밍 패턴을 확인한다.
3. 컴포넌트에서 직접 API를 호출하는 변경은 피하고, 도메인 API 파일을 우선 사용한다.
4. 함수 생성/개선 시 기능 설명 주석을 남긴다.
5. 인증/토큰 관련 변경은 `accessToken = sessionStorage`, `refreshToken = HttpOnly Cookie` 원칙과 맞는지 확인한다.
6. 화면/API/인증/DB/아키텍처 동작 변경이면 관련 보조 문서 갱신 여부를 확인한다.
7. 변경 후 가능한 범위에서 lint/build/test를 실행한다.

## 사용자 확인 필요 변경

아래 변경은 구현 전 사용자 확인을 먼저 받는다.

- DB schema 변경
- 인증/토큰 전략 변경
- 라우트 구조 변경
- 공용 스타일 토큰 대규모 변경
- API 응답 shape 변경
- 패키지 추가/삭제/업데이트
- 배포/환경 설정 변경

## 정리 후보

- 컴포넌트 직접 axios 호출을 도메인 API 파일로 이전
- snake_case 프론트 타입을 camelCase로 정규화
- `companyId: 1`, `authorUserId: 1` 같은 하드코딩 제거
- 고객/티켓/user preferences API 바인딩 파일 분리

## 문서 동기화 기준

- 화면 route, component 구조, 주요 화면 흐름을 추가/변경하면 `./docs/codex/screen-map.md` 갱신 여부를 확인한다.
- API endpoint, 프론트 API 바인딩, 백엔드 controller/service 흐름을 추가/변경하면 `./docs/codex/api-map.md` 갱신 여부를 확인한다.
- 인증, 토큰, 경로, API 바인딩 원칙, 공통 설계 판단이 바뀌면 `./docs/codex/decisions.md` 갱신 여부를 확인한다.
- 문서 갱신이 필요 없다고 판단한 경우, 최종 응답에 `문서 갱신 불필요`와 이유를 짧게 남긴다.

## 검증 기준

- 프론트 변경:
  - `npm run lint`
  - 필요 시 `npm run build`

- 백엔드 변경:
  - `./gradlew compileJava`
  - 필요 시 `./gradlew test`

## 보조 컨텍스트 문서

- 화면-API-DB 매핑: `./docs/codex/screen-map.md`
- 프론트 API 바인딩/백엔드 엔드포인트 맵: `./docs/codex/api-map.md`
- 반복 참조할 기술 결정 기록: `./docs/codex/decisions.md`

## 프로젝트 경로

- 프론트엔드: `.`
- 백엔드 API: `../myksBK`
- DB 초기화 SQL: `./db/init.sql`

## 현재 파악한 기술 단위

- 프론트엔드는 React 기반 프로젝트
- 백엔드는 별도 프로젝트에서 API 제공
- 프론트 프로젝트 내부 `db/init.sql`에 테이블 생성 및 더미 데이터가 정리되어 있음

## `init.sql` 기준 DB 개요

### 데이터베이스

- DB명: `reactpj`
- 문자셋/정렬: `utf8mb4`, `utf8mb4_unicode_ci`

### 주요 테이블

1. `companies`
- 회사(업체) 정보
- 기본 더미 데이터:
  - `Nyam_Company`

2. `users`
- 시스템 사용자(상담사/관리자)
- 주요 컬럼:
  - `company_id`
  - `account`
  - `public_id`
  - `name`
  - `profile_name`
  - `email`
  - `extension`
  - `password_hash`
  - `status`
  - `token_version`
  - `last_logout_at`
- 기본 더미 데이터:
  - `admin`

3. `customers`
- 고객 정보
- 기본 더미 데이터:
  - `홍냐냐`
  - `김냐냐`
  - `이냐냐`

4. `tickets`
- 고객 문의/상담 티켓
- 주요 컬럼:
  - `customer_id`
  - `assignee_id`
  - `status`
  - `merged_into_ticket_id`
  - `title`
  - `description`
  - `channel`
  - `submitted_at`
  - `closed_at`
- 기본 더미 데이터 5건 존재

5. `ticket_events`
- 티켓 이력/댓글/로그
- 주요 컬럼:
  - `ticket_id`
  - `event_type`
  - `channel`
  - `author_user_id`
  - `customer_id`
  - `content`
  - `meta` (JSON)
- 기본 더미 데이터 5건 존재

6. `user_preferences`
- 사용자 환경설정
- 주요 컬럼:
  - `user_id`
  - `dark_mode`
  - `default_page_size`

7. `category_kind`
- 카테고리 종류 마스터
- 기본 데이터:
  - `consult` / 상담 카테고리
  - `reserve` / 예약 카테고리
  - `etc` / 기타 카테고리

8. `category`
- 트리 구조 카테고리
- 주요 컬럼:
  - `kind_id`
  - `company_id`
  - `parent_id`
  - `level`
  - `name`
  - `sort_order`
- 기본 샘플:
  - `상담유형`
  - `예약유형`
  - `일반문의`
  - `장애/오류`

9. `response_templates`
- 응대 템플릿
- 기본 템플릿:
  - `상담이력_표준`
  - `1:1문의_기본응대`
  - `문자_간단안내`

## 소설 커뮤니티 관련 테이블

10. `works`
- 작품 정보
- 주요 컬럼:
  - `author_user_id`
  - `title`
  - `description`
  - `thumbnail_url`
  - `thumbnail_key`
  - `mode`
  - `ai_image_enabled`
  - `status`
  - `tags_json` (JSON)
- 기본 더미 데이터:
  - `13번 방의 진실`

11. `work_episodes`
- 작품 에피소드
- 주요 컬럼:
  - `work_id`
  - `episode_no`
  - `title`
  - `raw_text`
  - `paragraphs_json` (JSON)
  - `anchors_json` (JSON)
  - `status`
- 기본 더미 데이터:
  - `Episode 1`

## 관계 요약

- `users.company_id` -> `companies.id`
- `customers.company_id`는 회사 소속 고객 구분용
- `tickets.customer_id` -> `customers.id`
- `ticket_events.ticket_id` -> `tickets.id`
- `user_preferences.user_id` -> `users.id`
- `category.kind_id` -> `category_kind.id`
- `category.parent_id` -> `category.id`
- `response_templates.company_id` -> `companies.id`
- `response_templates.created_by` -> `users.id`
- `works.company_id` -> `companies.id`
- `works.author_user_id` -> `users.id`
- `work_episodes.work_id` -> `works.id`

## 참고 메모

- 여러 상태값이 `ENUM` 대신 `VARCHAR`로 설계되어 확장성을 고려한 형태로 보임
- 일부 JSON 컬럼 사용:
  - `ticket_events.meta`
  - `works.tags_json`
  - `work_episodes.paragraphs_json`
  - `work_episodes.anchors_json`
- 현재 구조상 일반 상담/티켓 시스템과 소설 커뮤니티 관련 기능이 한 DB 초기화 스크립트에 함께 정리되어 있음

## `react-pj` 구조 분석

### 핵심 스택

- Next.js App Router 기반 구조
- React + TypeScript + SCSS Module 사용
- API 통신은 `axios` 기반
- 전역 경로 별칭 사용:
  - `@/`
  - `@components/`
  - `@hooks/`
  - `@styles/`
  - `@types/`
  - `@utils/`

### 디렉토리 역할 정의

- `src/app`
  - 라우트 엔트리
  - 공개/보호 페이지 구분
  - 페이지 전용 SSR 데이터 로더(`data.ts`)와 검색 정의(`searchFields.ts`)가 함께 위치함

- `src/components`
  - 화면 구성 컴포넌트
  - 공용 컴포넌트와 도메인별 컴포넌트가 분리되어 있음
  - 예:
    - `common`
    - `layout`
    - `palace`
    - `palace2`

- `src/api`
  - 백엔드 API 호출용 함수 모음
  - 현재는 일부 도메인만 정리되어 있음
  - 확인된 파일:
    - `auth.ts`
    - `category.ts`
    - `works.ts`
    - `episode.ts`

- `src/hooks`
  - 재사용 가능한 클라이언트 훅 위치
  - 현재는 `useLogin` 중심으로 사용 중

- `src/types`
  - API 응답/도메인 타입 정의

- `src/utils`
  - 공통 유틸
  - 예:
    - `axios.ts`
    - `ssrCookie.ts`

- `src/styles`
  - 전역 스타일 자원
  - 토큰, 믹스인, 공용 폼 스타일 관리

### 공용 스타일 위치 정의

공용 스타일은 아래 위치를 우선 기준으로 사용한다.

1. 전역 테마 토큰
- `./src/styles/theme/tokens.scss`
- 색상, 상태색, 그림자, 입력창 색, 테마 전환 변수 관리

2. 전역 스타일 및 리셋
- `./src/styles/theme/globals.scss`
- `body`, `html`, 스크롤바, 공용 유틸 클래스(`uSpinner`) 정의
- `src/app/layout.tsx`에서 전역 import

3. 공용 SCSS 믹스인/플레이스홀더
- `./src/styles/base/_mixins.scss`
- 공통 전환 효과 `%themeTransition`
- 공통 버튼 베이스 `%buttonBase`

4. 공용 폼 스타일
- `./src/styles/base/form.scss`
- `.form`, `.form-group`, `.form-input`, `.form-select` 등 공용 폼 클래스 제공

5. 화면/컴포넌트 전용 스타일
- 각 컴포넌트 옆 `*.module.scss`
- 패턴:
  - 컴포넌트별 레이아웃/세부 UI는 로컬 `module.scss`
  - 공통 버튼/전환은 `@styles/base/mixins.scss`를 가져와 재사용

### 스타일 작업 기준

- 전역 색상, 다크모드, 상태색, 그림자 변경:
  - `tokens.scss`
- 전체 앱 공통 리셋/스크롤/UI 유틸:
  - `globals.scss`
- 버튼/전환/반복 패턴:
  - `_mixins.scss`
- 여러 화면에서 반복되는 입력 폼 클래스:
  - `form.scss`
- 특정 화면 한정 배치/디자인:
  - 해당 컴포넌트의 `module.scss`

### 함수 생성 위치 기준

현재 구조를 기준으로 함수는 아래 원칙으로 배치하는 것이 가장 자연스럽다.

1. 백엔드 API 호출 함수
- 위치: `src/api/<domain>.ts`
- 역할:
  - 엔드포인트 호출
  - 요청/응답 타입 연결
  - 필요한 데이터 정규화
- 예:
  - 인증: `src/api/auth.ts`
  - 카테고리: `src/api/category.ts`
  - 작품: `src/api/works.ts`

2. SSR 페이지 데이터 조합 함수
- 위치: 각 페이지 경로의 `data.ts`
- 역할:
  - 쿠키 읽기
  - SSR 클라이언트 생성
  - URL 쿼리 파라미터 정리
  - 여러 API 결과를 페이지 props 형태로 조합
- 예:
  - 고객 목록: `src/app/(protected)/palace/test/customers/data.ts`
  - 고객 상세: `src/app/(protected)/palace/test/customers/[id]/data.ts`
  - 카테고리: `src/app/(protected)/palace/test/category/data.ts`

3. 검색 파라미터/필드 정의
- 위치: 페이지 근처 `searchFields.ts`
- 역할:
  - 검색 UI 정의
  - 정렬/필터 옵션 정의

4. 재사용 가능한 클라이언트 상태 로직
- 위치: `src/hooks`
- 역할:
  - 여러 화면에서 재사용 가능한 상태/이벤트 처리
- 현재 예:
  - `src/hooks/useLogin/useLogin.ts`

5. 화면 내부 전용 이벤트 핸들러/가벼운 보조 함수
- 위치: 해당 컴포넌트 내부
- 기준:
  - 재사용하지 않고
  - UI 상태와 강하게 결합된 경우

6. 범용 유틸 함수
- 위치: `src/utils`
- 역할:
  - 인증/쿠키/axios/포맷 등 공통 처리

### 함수 생성 시 권장 기준

- 화면 렌더링과 무관한 API 호출 로직은 컴포넌트 밖으로 분리한다.
- 동일 도메인에서 2곳 이상 쓰일 가능성이 있으면 `src/api`, `src/hooks`, `src/utils` 중 한 곳으로 올린다.
- SSR 전용 조합 로직은 페이지 경로의 `data.ts`에 둔다.
- 검색 조건 파싱은 페이지 `data.ts`에 두고, API 함수는 가능한 한 정제된 파라미터만 받게 한다.

### API 바인딩 정규화 포인트

현재 프로젝트는 `src/api` 레이어가 이미 존재하지만, 일부 화면은 컴포넌트에서 직접 `api.get/post/patch`를 호출하고 있다.
앞으로는 아래 기준으로 정규화하는 것이 좋다.

1. 컴포넌트 직접 API 호출 최소화
- 현재 직접 호출이 있는 대표 위치:
  - 회원가입 페이지
  - 헤더
  - 환경설정
  - 프로필
  - 고객 등록 모달
  - 티켓 메모 저장
  - 티켓 화면 일부
- 방향:
  - `src/api/auth.ts`
  - `src/api/user.ts`
  - `src/api/customer.ts`
  - `src/api/ticket.ts`
  - `src/api/template.ts`
  형태로 도메인별 API 파일로 모은다.

2. 프론트 모델은 camelCase로 정규화
- 현재 일부 타입/필드에서 snake_case가 그대로 노출됨
- 예:
  - `profile_name`
- 방향:
  - 백엔드 응답이 snake_case라도 `src/api`에서 camelCase DTO로 변환 후 컴포넌트에 전달

3. 요청 payload 가공도 API 레이어에서 처리
- 현재 컴포넌트에서 직접 `JSON.stringify(meta)` 같은 가공이 있음
- 방향:
  - 컴포넌트는 의미 중심 데이터만 넘기고
  - 직렬화/포맷 변환은 API 함수 내부에서 처리

4. 쿼리 파라미터 정규화 함수 재사용
- 현재 고객 목록은 `parseSearchParams` 패턴이 있음
- 방향:
  - 티켓/카테고리/템플릿 목록도 같은 방식으로
    - raw query
    - normalized params
    - API call
  흐름을 통일

5. SSR/CSR 호출 패턴 통일
- 이미 `createServerApi(cookieHeader)` 패턴이 존재함
- 방향:
  - 동일 엔드포인트는
    - CSR 함수
    - SSR 함수 또는 client 주입 방식
  중 하나의 일관된 패턴으로 유지

6. 하드코딩 값 제거
- 현재 일부 코드에 `companyId: 1`, `authorUserId: 1` 같은 값이 존재
- 방향:
  - 로그인 사용자 정보 기반으로 주입하거나
  - SSR에서 companyId를 먼저 조회한 뒤 전달

### 앞으로 권장하는 API 레이어 분리안

- `src/api/auth.ts`
  - login
  - logout
  - signup
  - checkAccount
  - checkEmail
  - getMe
  - getMeSSR

- `src/api/user.ts`
  - getMyProfile
  - updateMyProfile
  - getMyPreferences
  - saveMyPreferences

- `src/api/customer.ts`
  - listCustomers
  - getCustomer
  - createCustomer
  - listCustomerTickets
  - listCompaniesForSelect

- `src/api/ticket.ts`
  - listTickets
  - getTicket
  - listTicketEvents
  - createTicketEvent

- `src/api/template.ts`
  - listTemplates
  - createTemplate
  - deleteTemplate
  - generateCaseNote

### 현재 기준 작업 우선 원칙

- 새 기능 추가 시 먼저 기존 도메인 폴더와 API 파일이 있는지 확인한다.
- 새 함수가 API 호출 함수라면 `src/api`에 우선 배치 가능성을 본다.
- 새 함수가 SSR 페이지 초기 데이터 구성이라면 해당 페이지 `data.ts`에 둔다.
- 스타일은 전역 토큰 수정이 필요한지 먼저 판단한 뒤, 아니면 로컬 `module.scss`에서 처리한다.
- 컴포넌트는 UI 상태와 렌더링 중심으로 유지하고, 네트워크 호출/정규화는 바깥으로 분리하는 방향을 우선 고려한다.

## 인증 / 토큰 처리 교차 검증

`react-pj` 프론트와 `myksBK` 백엔드의 로그인/토큰 처리 흐름을 교차 확인한 결과, 현재 구조는 전반적으로 일관된다.

### 현재 인증 전략

- access token:
  - 백엔드가 로그인 응답 바디로 반환
  - 프론트가 `sessionStorage`에 저장
  - 이후 API 요청 시 `Authorization: Bearer <token>` 헤더로 전송

- refresh token:
  - 백엔드가 `HttpOnly` 쿠키로 저장
  - 프론트는 JS에서 직접 읽지 않음
  - access token 만료 시 `/api/auth/refresh` 호출에 자동 포함

### 로그인 처리 흐름

1. 백엔드 `/api/auth/login`
- `accessToken` 반환
- `refreshToken` 쿠키 발급

2. 프론트 로그인 성공 처리
- `sessionStorage`에 `accessToken` 저장
- 이후 보호 페이지 이동

3. 일반 API 호출
- 프론트 axios 인터셉터가 `sessionStorage`의 토큰을 읽어 `Authorization` 헤더에 주입

4. access token 만료 시
- 401/403 응답이면 프론트가 `/api/auth/refresh` 호출
- 백엔드는 `refreshToken` 쿠키 검증 후 새 `accessToken` 반환
- 프론트는 새 토큰으로 원 요청 재시도

5. 로그아웃 시
- 백엔드는 refresh cookie 삭제
- access token 인증 정보가 있거나 refresh token으로 사용자를 식별할 수 있으면 `tokenVersion` 증가로 기존 토큰 무효화
- 프론트는 `sessionStorage` 정리 후 로그인 페이지 이동

### 확인된 구현 파일

- 백엔드
  - `../myksBK/src/main/java/com/myks/myksbk/domain/auth/controller/AuthController.java`
  - `../myksBK/src/main/java/com/myks/myksbk/domain/auth/service/AuthService.java`
  - `../myksBK/src/main/java/com/myks/myksbk/global/jwt/JwtAuthenticationFilter.java`
  - `../myksBK/src/main/java/com/myks/myksbk/global/jwt/JwtTokenProvider.java`

- 프론트
  - `./src/utils/axios.ts`
  - `./src/api/auth.ts`
  - `./src/hooks/useLogin/useLogin.ts`
  - `./src/components/auth/AuthGuard.tsx`

### 현재 구조에서 맞물리는 점

- 로그인 시 access token과 refresh token의 역할 분리가 명확함
- 프론트 axios 인터셉터와 백엔드 refresh API가 서로 맞게 설계되어 있음
- `tokenVersion` 검증이 있어 로그아웃 후 토큰 무효화 구조가 존재함
- SSR에서 쿠키 기반 인증 연동을 고려한 `createServerApi(cookieHeader)` 패턴이 있음

### 주의 메모

1. 백엔드 인증 필터에는 `accessToken` 쿠키 fallback이 있으나, 현재 로그인 시 access token 쿠키를 실제로 발급하지는 않음
- 현재 실질적인 인증 방식은 Bearer 헤더 기반으로 보는 것이 맞음

2. 로그아웃은 access token이 없더라도 refresh token 쿠키로 사용자를 식별할 수 있으면 서버 측 토큰 무효화를 시도하도록 개선함
- 즉, access token 만료 직후 로그아웃해도 refresh cookie가 유효하면 `tokenVersion` 증가가 가능함
- refresh token 자체가 이미 만료/손상된 경우에는 쿠키 삭제만 수행하고 성공으로 종료함

3. 운영 환경에서는 refresh cookie 설정이 다음 기준으로 동작함
- domain: `.qqup.ai.kr`
- secure: `true`
- sameSite: `None`
- CORS `allowCredentials = true`

### 현재 기준 인증 원칙

- 인증 전략은 다음을 기본값으로 유지한다.
  - accessToken = `sessionStorage`
  - refreshToken = `HttpOnly Cookie`
- 인증 API는 해당 전략을 기준으로 구현/수정한다.
- 특별한 이유가 없으면 access token을 쿠키에 중복 저장하는 방식은 사용하지 않는다.
- 로그아웃 API는 가능하면 refresh cookie 삭제와 서버 측 토큰 무효화를 함께 보장하도록 구현한다.

## 코딩 규칙

1. 함수를 생성하거나 기존 함수를 개선할 때는 해당 함수의 기능 설명을 주석으로 작성한다.
2. 작업 중 기본 원칙이나 코딩 규칙에 추가가 필요해 보이면, 규칙 추가 여부를 먼저 제안한다.
3. 컴포넌트에서 직접 axios 호출하지 않고, 도메인 API 파일을 통해서만 호출한다.
4. 백엔드 응답 필드명이 snake_case여도 프론트 타입과 컴포넌트에서는 camelCase만 사용한다.
5. 인증 관련 토큰 전략은 `accessToken = sessionStorage`, `refreshToken = HttpOnly Cookie`를 기본 원칙으로 유지한다.
6. 로그아웃은 refresh cookie 삭제와 서버 측 토큰 무효화를 함께 보장하는 방향으로 구현한다.
7. 새로운 규칙이나 기준을 문서에 반영할 때는 먼저 사용자에게 `Y/N`으로 반영 여부를 확인받는다.
8. 규칙이나 기준을 문서에 반영하기 전에는, 반영 후 모습을 `미리보기` 형태로 먼저 보여주고 `Y/N` 확인 후 적용한다.
9. Codex 참조 문서는 프로젝트 저장소 안에 두고, 파일/디렉토리 참조는 절대 경로 대신 프로젝트 루트 기준 상대 경로를 사용한다.
10. 프론트와 백엔드처럼 여러 저장소를 함께 참조할 때는 같은 상위 디렉토리 아래에 배치된 형제 디렉토리 구조를 기본 전제로 한다.

## 이후 활용 방식

앞으로 이 프로젝트 관련 질문이 들어오면 우선 이 문서를 기준으로 경로, DB 구조, 기본 데이터, 도메인 범위를 빠르게 참조한다.
