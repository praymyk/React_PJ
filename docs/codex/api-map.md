# API Map

이 문서는 프론트 API 바인딩과 백엔드 엔드포인트를 함께 찾기 위한 맵이다.

## 작성 규칙

- 프론트 API 함수는 가능한 한 `./src/api/<domain>.ts`에 둔다.
- 컴포넌트에서 직접 axios를 호출하는 기존 코드는 정리 후보로 본다.
- 백엔드 위치는 형제 저장소 `../myksBK` 기준으로 기록한다.

## Auth

- frontend binding: `./src/api/auth.ts`
- backend controller: `../myksBK/src/main/java/com/myks/myksbk/domain/auth/controller/AuthController.java`
- endpoints:
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `POST /api/auth/refresh`
  - `GET /api/auth/me`
  - `POST /api/auth/signup`
  - `GET /api/auth/check-account`
  - `GET /api/auth/check-email`
- notes:
  - `accessToken`은 응답 body로 받고 `sessionStorage`에 저장한다.
  - `refreshToken`은 HttpOnly cookie로만 다룬다.

## Category

- frontend binding: `./src/api/category.ts`
- related frontend loader: `./src/app/(protected)/palace/test/category/data.ts`
- endpoints:
  - `GET /api/categories/page-data`
  - `POST /api/categories/tree`
- DB:
  - `category_kind`
  - `category`

## Works

- frontend binding: `./src/api/works.ts`
- endpoints:
  - `POST /api/works`
  - `GET /api/works/{workId}`
  - `GET /api/works/my`
  - `POST /api/works/{workId}/thumbnail`
- DB:
  - `works`

## Episodes

- frontend binding: `./src/api/episode.ts`
- endpoints:
  - `GET /api/works/{workId}/episodes`
  - `GET /api/works/{workId}/episodes/{episodeId}`
  - `POST /api/works/{workId}/episodes`
  - `PUT /api/works/{workId}/episodes/{episodeId}`
- DB:
  - `work_episodes`

## Customers

- current binding status: `정리 필요`
- current SSR loaders:
  - `./src/app/(protected)/palace/test/customers/data.ts`
  - `./src/app/(protected)/palace/test/customers/[id]/data.ts`
- recommended binding: `./src/api/customer.ts`
- endpoints:
  - `GET /api/customers`
  - `GET /api/customers/{id}`
  - `POST /api/customers`
  - `GET /api/common/customers/{id}/tickets`
- DB:
  - `customers`
  - `tickets`

## Tickets

- current binding status: `정리 필요`
- recommended binding: `./src/api/ticket.ts`
- endpoints:
  - `GET /api/common/tickets`
  - `GET /api/common/tickets/{id}`
  - `GET /api/common/tickets/{id}/events`
  - `POST /api/common/tickets/{id}/events`
- DB:
  - `tickets`
  - `ticket_events`

## User Preferences / Profile

- current binding status: `정리 필요`
- recommended binding: `./src/api/user.ts`
- endpoints:
  - `GET /api/common/users/me`
  - `PATCH /api/common/users/me`
  - `GET /api/common/users/me/preferences`
  - `POST /api/common/users/me/preferences`
- DB:
  - `users`
  - `user_preferences`
