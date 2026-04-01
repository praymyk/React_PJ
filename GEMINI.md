# GEMINI Context: react-pj

This project is a sophisticated **IP Contact Center (IPCC) / Multi-channel Communication Dashboard** built with Next.js. It features a robust real-time communication stack, multi-tenant database support, and a carefully architected front-end for complex dashboard layouts.

## 🛠 Tech Stack
-   **Framework:** Next.js 15 (App Router), React 19, TypeScript
-   **Communication:** WebRTC (JsSIP), WebSockets (Socket.io, STOMP/SockJS)
-   **Data Management:** MySQL (mysql2), Axios (with custom JWT rotation)
-   **UI/UX:** SASS Modules, Chart.js, Lucide Icons, React Quill (Rich Text)
-   **State Management:** React Context API (Layout, Sidebar, Auth)

## 🤖 운영 규칙 (Operational Rules)

**이 규칙은 제미나이 CLI의 모든 작업에 최우선적으로 적용됩니다.**

1.  **선 보고 후 조치 (Preview First):** 코드를 직접 수정(replace, write_file 등)하기 전에, 반드시 변경될 내용의 **미리보기(Diff 또는 전체 코드)**를 사용자에게 먼저 제시합니다.
2.  **사용자 승인 필수 (Explicit Confirmation):** 미리보기를 제시한 후, 사용자가 **'Y' 또는 'Yes'**라고 명확히 답변한 경우에만 실제 파일 수정을 진행합니다. 'N' 또는 다른 의견을 주면 수정을 중단하고 대기합니다.
3.  **임의 수정 금지:** 사용자가 명시적으로 "수정해줘"라고 하기 전까지는 분석과 제안 단계까지만 수행합니다.

## 🎨 코딩 컨벤션 및 개발 가이드 (Coding Standards)

제미나이 CLI를 통한 개발 시 다음의 규칙을 엄격히 준수합니다.

### 1. 컴포넌트 작성 (Components)
-   **선언 방식:** `export default function Name() { ... }` 형식을 우선적으로 사용합니다.
-   **컴포넌트 분리:** 복잡한 UI는 `src/components` 하위의 도메인별 폴더(e.g., `palace`, `auth`)로 분리합니다.
-   **Props 정의:** 모든 컴포넌트의 Props는 TypeScript `interface`로 정의합니다.

### 2. 커스텀 훅 및 로직 (Hooks & Logic)
-   **작성 방식:** `export function useName() { ... }` 형식을 사용합니다.
-   **폴더 구조:** 훅은 `src/hooks/[hookName]/[hookName].ts` 구조로 관리합니다.
-   **상태 관리:** 컴포넌트 로직은 가급적 커스텀 훅으로 분리하여 관심사를 분리합니다.

### 3. 스타일링 (Styling)
-   **SASS Modules:** 스타일은 반드시 `.module.scss` 파일을 생성하여 컴포넌트별로 스코프를 제한합니다.
-   **Import:** `import styles from './Name.module.scss';` 형식을 사용합니다.
-   **전역 스타일:** 공통 변수나 테마는 `src/styles` 하위의 설정을 참조합니다.
    -   `src/styles/base/_mixins.scss`: 공통 믹스인 및 플레이스홀더(%themeTransition 등).
    -   `src/styles/theme/tokens.scss`: 색상, 크기 등 전역 CSS 변수 정의.
    -   `src/styles/base/fonts.scss`: 폰트 및 텍스트 스타일 정의.
-   **다크모드 대응:** `tokens.scss`에 정의된 CSS 변수(예: `--color-bg-surface`, `--color-text-main`)를 사용합니다. 다크모드는 `html.dark` 클래스에 따라 변수 값이 변경되도록 설계되어 있습니다.

### 4. API 및 비동기 처리 (API & Async)
-   **에러 핸들링:** 모든 비동기 호출은 `try...catch` 블록을 사용하여 사용자에게 적절한 에러 메시지를 제공합니다.
-   **로딩 상태:** 비동기 작업 시 `loading` 상태를 두어 UI 피드백을 제공합니다.
-   **API 호출:** `@/api` 하위에 정의된 함수들을 사용하며, 직접적인 Axios 호출보다는 정의된 인터페이스를 활용합니다.

### 6. 데이터 패칭 컨벤션 (Data Fetching Patterns)
-   **CSR 패칭:** 클라이언트 사이드에서 데이터를 가져올 때는 `useEffect` 내에서 비동기 함수를 호출하거나, 로직이 복잡할 경우 전용 커스텀 훅(e.g., `useEpisodes`)으로 분리합니다.
-   **상태 정의:** 데이터를 담는 상태 외에 최소한 `isLoading`, `error` 상태를 함께 관리하여 예외 상황에 대비합니다.
-   **낙관적 업데이트:** 가능한 경우 UI 반응성을 위해 낙관적 업데이트(Optimistic UI)를 고려하되, 실패 시 롤백 로직을 반드시 포함합니다.

### 5. 경로 및 네이밍 (Naming & Path)
-   **Alias:** 경로 임포트 시 `@/` (src 폴더) 별칭을 적극 활용합니다.
-   **파일명:** 컴포넌트는 `PascalCase`, 훅이나 유틸리티는 `camelCase`를 사용합니다.

## 🔑 Environment Variables (.env.local)
... (생략된 기존 내용) ...
The following environment variables are required for the application to function correctly. Copy `.env.example` to `.env.local` and fill in the values.

```env
# API & Backend
NEXT_PUBLIC_API_URL=http://localhost:8080  # WAS server address for API processing
NEXT_PUBLIC_WS_URL=ws://localhost:8080   # WebSocket server address

# Database (for SSR/Server-side logic)
DB_HOST=127.0.0.1                        # DB host address
DB_PORT=3307                             # DB connection port (3307 if using Docker)
DB_USER=appuser                          # DB username
DB_PASSWORD=apppass                      # DB password
DB_NAME=reactpj                          # Target database name
```

## 🔐 Authentication Flow (JWT Rotation)
The project uses a secure JWT-based authentication system with automatic token rotation implemented in `src/utils/axios.ts`.

1.  **Storage:** 
    -   `accessToken` is stored in `sessionStorage` (CSR).
    -   `refreshToken` is stored in an **HttpOnly cookie** (handled by the backend).
2.  **Request Interceptor:** Automatically attaches the `Authorization: Bearer <token>` header to all outgoing requests if a token exists in `sessionStorage`.
3.  **Response Interceptor (Rotation):**
    -   If a request fails with a **401 or 403** status code, the interceptor attempts a transparent token refresh.
    -   It calls `/api/auth/refresh` using a dedicated `refreshClient` (which includes credentials/cookies).
    -   Upon successful refresh, the new `accessToken` is stored in `sessionStorage`, and the original failed request is retried with the new token.
    -   If refresh fails, the user is cleared from session and redirected to `/login`.

## 🗄️ Database Development
The project includes a Docker-based MySQL setup for local development.

-   **MySQL Version:** 8.0
-   **Initialization:** `db/init.sql` is automatically executed when the container starts.
-   **Control via Makefile:**
    -   `make db-up`: Start the MySQL container (`localhost:3307`).
    -   `make db-down`: Stop the container (persists data).
    -   `make db-reset`: Wipe the database and re-initialize from `init.sql`.
    -   `make db-shell`: Enter the MySQL CLI inside the container.

## 🚀 Deployment & Commands
-   **Development:** `npm run dev` (Runs on **port 8080**).
-   **Build:** `npm run build` (Uses **Turbopack** for optimized production builds).
-   **Production:** `npm run start`.
-   **Docker:** `Dockerfile` and `docker-compose.yml` are provided for containerized deployment.

## 📁 Key Directories
-   `src/app/(protected)`: Core dashboard features (`palace`, `palace2`).
-   `src/app/(public)`: Authentication flows (`login`, `signup`).
-   `src/components`: Reusable UI components and layout wrappers.
-   `src/contexts`: Global state providers (Auth, Layout).
-   `src/hooks`: Custom hooks like `useLogin`.
-   `src/utils/axios.ts`: Centralized API client with interceptors.
-   `src/types`: Centralized TypeScript interfaces (especially `user.ts`).
