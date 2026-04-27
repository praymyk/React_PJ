# Decisions

이 문서는 프로젝트에서 반복적으로 참조해야 하는 기술적 결정을 기록한다.

## 작성 규칙

- 결정은 날짜, 결정, 이유, 영향 범위로 남긴다.
- 결정을 바꿀 때는 기존 항목을 지우기보다 새 항목을 추가하고 이전 결정의 상태를 갱신한다.
- 경로는 프로젝트 루트 기준 상대 경로를 사용한다.

## 2026-04-27 Codex Context Location

- status: active
- decision:
  - Codex 참조 문서는 프로젝트 저장소 안에 둔다.
  - 핵심 규칙은 `./AGENTS.md`에 직접 선언한다.
  - 상세 프로젝트 맥락은 `./CODEX.md`에 둔다.
- reason:
  - 다른 PC, Codex 앱, Codex CLI 환경에서 machine-specific absolute path에 의존하지 않기 위해.
  - `AGENTS.md`만 읽혀도 최소 규칙이 적용되게 하기 위해.
- impact:
  - 문서와 메모의 경로는 프로젝트 루트 기준 상대 경로를 사용한다.
  - 백엔드는 형제 디렉토리 `../myksBK`를 기본 전제로 한다.

## 2026-04-27 Auth Token Strategy

- status: active
- decision:
  - `accessToken`은 `sessionStorage`에 저장한다.
  - `refreshToken`은 HttpOnly cookie로만 다룬다.
  - logout은 refresh cookie 삭제와 서버 측 token invalidation을 함께 고려한다.
- reason:
  - 프론트에서 refresh token을 직접 다루지 않게 하기 위해.
  - CSR/SSR refresh 흐름을 한 방향으로 유지하기 위해.
- impact:
  - 인증 변경은 `./src/api/auth.ts`, `./src/utils/axios.ts`, `../myksBK`의 auth/jwt 구현을 함께 확인한다.

## 2026-04-27 Frontend API Binding Rule

- status: active
- decision:
  - 컴포넌트에서 직접 axios를 호출하지 않고 `./src/api/<domain>.ts`를 통해 API를 호출한다.
  - 백엔드 응답이 snake_case여도 프론트 타입과 컴포넌트는 camelCase를 사용한다.
- reason:
  - 화면 컴포넌트를 UI 상태와 렌더링 중심으로 유지하기 위해.
  - API 응답 정규화 위치를 일관되게 하기 위해.
- impact:
  - 기존 직접 axios 호출은 점진적 정리 후보로 본다.

## 2026-04-27 Confirmation and Cleanup Operating Rules

- status: active
- decision:
  - DB schema, auth/token strategy, route structure, shared style token, API response shape, package, deployment/environment changes require user confirmation before implementation.
  - Known refactor candidates are tracked in `./CODEX.md` under `정리 후보`.
- reason:
  - High-impact changes should not happen silently during vibe coding.
  - Cleanup candidates need a visible home so they do not get lost across sessions.
- impact:
  - Before high-impact work, ask for confirmation.
  - When cleanup candidates are resolved or newly found, update `./CODEX.md`.
