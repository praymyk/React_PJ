# Screen Map

이 문서는 주요 화면이 어떤 route, component, data loader, API, DB 테이블과 연결되는지 빠르게 찾기 위한 맵이다.

## 작성 규칙

- 경로는 프로젝트 루트 기준 상대 경로를 사용한다.
- 화면 단위 변경을 할 때 관련 항목이 없으면 추가 후보로 제안한다.
- API나 DB 연결이 불확실하면 `확인 필요`로 남긴다.

## 고객 목록 화면

- route: `./src/app/(protected)/palace/test/customers/page.tsx`
- component: `./src/components/palace/test/customers/DefaultContent.tsx`
- data loader: `./src/app/(protected)/palace/test/customers/data.ts`
- API:
  - `GET /api/customers`
- DB:
  - `customers`

## 고객 상세 화면

- route: `./src/app/(protected)/palace/test/customers/[id]/page.tsx`
- data loader: `./src/app/(protected)/palace/test/customers/[id]/data.ts`
- component:
  - `./src/components/palace/test/customers/DetailContent.tsx`
  - `./src/components/palace/test/customers/detailSection/DetailSection.tsx`
- API:
  - `GET /api/customers/{id}`
  - `GET /api/common/customers/{id}/tickets`
- DB:
  - `customers`
  - `tickets`

## 티켓 화면

- route: `./src/app/(protected)/palace/ticket/page.tsx`
- component: `./src/components/palace/ticket/DefaultContent.tsx`
- API:
  - `GET /api/common/tickets`
  - `GET /api/common/tickets/{id}`
  - `GET /api/common/tickets/{id}/events`
  - `POST /api/common/tickets/{id}/events`
- DB:
  - `tickets`
  - `ticket_events`

## 카테고리 테스트 화면

- route: `./src/app/(protected)/palace/test/category/page.tsx`
- component: `./src/components/palace/test/category/DefaultContent.tsx`
- data loader: `./src/app/(protected)/palace/test/category/data.ts`
- API:
  - `GET /api/categories/page-data`
  - `POST /api/categories/tree`
- DB:
  - `category_kind`
  - `category`

## Palace2 작품 생성 화면

- route: `./src/app/(protected)/palace2/studio/new/page.tsx`
- component: `./src/components/palace2/studio/StudioWorkCreateContent.tsx`
- API:
  - `POST /api/works`
  - `GET /api/works/my`
  - `POST /api/works/{id}/thumbnail`
- DB:
  - `works`

## Palace2 에피소드 편집 화면

- route: `./src/app/(protected)/palace2/studio/[workId]/episodes/[episodeId]/page.tsx`
- component: `./src/components/palace2/studio/StudioEpisodeEditorContent.tsx`
- API:
  - `GET /api/works/{workId}/episodes`
  - `GET /api/works/{workId}/episodes/{episodeId}`
  - `POST /api/works/{workId}/episodes`
  - `PUT /api/works/{workId}/episodes/{episodeId}`
- DB:
  - `works`
  - `work_episodes`
