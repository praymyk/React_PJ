-- DB 생성
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS reactpj
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE reactpj;

-- 회사(업체) 테이블
CREATE TABLE IF NOT EXISTS companies (
                                         id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                         name        VARCHAR(120) NOT NULL,
    status      ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_companies_name (name)
    ) ENGINE=InnoDB
    DEFAULT CHARSET = utf8mb4
    COLLATE = utf8mb4_unicode_ci;

-- 더미 회사 (companyId=1)
INSERT INTO companies (name, status)
VALUES ('Nyam_Company', 'active')
    ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);

-- 시스템 사용자(상담사/관리자 등) 테이블
CREATE TABLE IF NOT EXISTS users (
                                     id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,  -- 내부 PK (숫자)
                                     account        VARCHAR(50)    NOT NULL,                  -- 로그인용 계정 ID (예: 'admin')
    public_id VARCHAR(100) NOT NULL,                         -- 외부 표기용 ID  //TODO: INSERT시 표기용 아이디 등록
    name           VARCHAR(100)   NOT NULL,                  -- 사용자 이름
    profile_name   VARCHAR(100)       NULL,                  -- 프로필 표기명 (닉네임)
    email          VARCHAR(255)   NOT NULL,                  -- 로그인/알림용 이메일
    extension      VARCHAR(20)        NULL,                  -- 내선번호 (예: '6001')
    password_hash  VARCHAR(255)   NOT NULL,                  -- 비밀번호 해시
    status         ENUM('active','inactive','hidden')
    NOT NULL DEFAULT 'active',                -- 계정 상태

    created_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deactivated_at DATETIME            NULL,
    updated_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    -- 로그인 ID 유니크
    UNIQUE KEY uq_users_account (account),

    -- 이메일 유니크
    UNIQUE KEY uq_users_email (email),

    -- 내선 인덱스 추가
    INDEX idx_users_extension (extension)
    ) ENGINE=InnoDB
    DEFAULT CHARSET = utf8mb4
    COLLATE = utf8mb4_unicode_ci;

-- 테스트용 시스템 사용자
INSERT INTO users (account, public_id, name, profile_name, email, extension, password_hash, status)
VALUES (
           'admin',           -- account (로그인 ID)
           'u-0001',
           '정윤석',
           '냠냠',
           'admin@example.com',
           '6001',
           '$2b$10$qykjsIxU9K6Wbp9t5RNoz.IBpbcy2vi7GifaDqgX0Cs1wzLyvxybC',
           'active'
       );

-- 고객 정보 테이블
CREATE TABLE IF NOT EXISTS customers (
                                         id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,  -- 숫자 PK
                                         name       VARCHAR(100)    NOT NULL,
    email      VARCHAR(255)    NOT NULL,
    status     ENUM('active', 'inactive') NOT NULL,
    created_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_customers_email (email)
    ) ENGINE=InnoDB
    DEFAULT CHARSET = utf8mb4
    COLLATE = utf8mb4_unicode_ci;

-- 기본 목업 데이터
INSERT INTO customers (name, email, status) VALUES
                                                ('홍냐냐', 'hong@example.com', 'active'),
                                                ('김냐냐', 'kim@example.com',  'inactive'),
                                                ('이냐냐', 'lee@example.com',  'active');

-- 티켓 테이블 (이슈/문의 단위)
-- 티켓 테이블 (이슈/문의 단위)
CREATE TABLE IF NOT EXISTS tickets (
                                       id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,  -- 내부 PK (숫자 자동 채번)
                                       company_id            BIGINT UNSIGNED NOT NULL,                 -- 업체 ID
                                       customer_id           BIGINT UNSIGNED NOT NULL,                 -- 문의한 고객 (customers.id)
                                       assignee_id           BIGINT UNSIGNED     NULL,                 -- 담당자 (users.id 등으로 매핑 예정)
                                       status                ENUM('접수','진행중','종료','취소')
    NOT NULL DEFAULT '접수',                  -- 처리 상태

-- 티켓 병합용: 이 티켓이 다른 티켓에 병합된 상태면, "마스터 티켓 ID" 입력
--    - NULL : 자신이 마스터이거나, 아직 병합 안 됨
    merged_into_ticket_id BIGINT UNSIGNED     NULL,

    title                 VARCHAR(255)   NOT NULL,                  -- 티켓 제목
    description           TEXT          NOT NULL,                   -- 상세 내용 (초기 문의 내용)
    channel               ENUM('전화','채팅','이메일','기타')
    NOT NULL DEFAULT '기타',                  -- 주 유입 채널

    submitted_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 최초 접수 일시
    closed_at             DATETIME               NULL,              -- 실제 종료 시각
    created_at            TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_tickets_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id)
    ON DELETE RESTRICT,

    -- 필요 시 상담사(내부 사용자) FK 연결: users.id 기준
    -- CONSTRAINT fk_tickets_assignee_user
    --   FOREIGN KEY (assignee_id) REFERENCES users(id)
    --     ON DELETE SET NULL,

    -- 병합 관계 self FK (원하면 쓰고, 아니면 주석 유지)
    -- CONSTRAINT fk_tickets_merged_ticket
    --   FOREIGN KEY (merged_into_ticket_id) REFERENCES tickets(id)
    --     ON DELETE SET NULL,

    INDEX idx_tickets_company      (company_id),
    INDEX idx_tickets_customer     (customer_id),
    INDEX idx_tickets_assignee     (assignee_id),
    INDEX idx_tickets_status       (status),
    INDEX idx_tickets_merged_into  (merged_into_ticket_id)
    ) ENGINE=InnoDB
    DEFAULT CHARSET=utf8mb4
    COLLATE=utf8mb4_unicode_ci;


-- 티켓 이벤트 테이블
-- 티켓 이벤트 테이블
CREATE TABLE IF NOT EXISTS ticket_events (
                                             id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,

                                             ticket_id      BIGINT UNSIGNED NOT NULL,     -- 어느 티켓에 속한 이벤트인지 (tickets.id)
                                             company_id     BIGINT UNSIGNED NOT NULL,      -- 편의를 위해 함께 저장 (조인 줄이기)
                                             event_type     ENUM(          -- 어떤 종류의 이벤트인가
                                             '문의접수',      -- 첫 문의 접수
                                             '상담기록',      -- 상담 내용 기록
                                             '상담사메모',    -- 상담사 노트
                                             '고객메모',      -- 고객 관련 내부 메모
                                             '상태변경',      -- 티켓 상태 변경 로그
                                             '티켓병합',      -- 티켓 병합 액션 로그
                                             '티켓분리',      -- 언머지/분리 로그
                                             '시스템'         -- 기타 시스템 이벤트
) NOT NULL,

    -- 이 이벤트가 발생한 상세 채널 (선택)
    channel        ENUM('전화','채팅','이메일','기타') NULL,

    -- 작성자 (내부 사용자)
    author_user_id BIGINT UNSIGNED NULL,   -- 상담사/관리자 users.id
-- 관련 고객 (필요시)
    customer_id    BIGINT UNSIGNED NULL,   -- customers.id

-- 사람 눈으로 보는 내용
    content        TEXT         NULL,

    -- 통화ID, 녹취URL, 이전 상태/변경 후 상태 등 구조화 정보는 JSON에
    meta           JSON         NULL,

    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ticket_events_ticket
    FOREIGN KEY (ticket_id) REFERENCES tickets(id)
    ON DELETE CASCADE,

    -- 필요 시 FK를 실제로 묶고 싶으면 아래 주석 해제
    -- CONSTRAINT fk_ticket_events_author_user
    --   FOREIGN KEY (author_user_id) REFERENCES users(id)
    --     ON DELETE SET NULL,
    -- CONSTRAINT fk_ticket_events_customer
    --   FOREIGN KEY (customer_id) REFERENCES customers(id)
    --     ON DELETE SET NULL,

    INDEX idx_ticket_events_ticket      (ticket_id),
    INDEX idx_ticket_events_created_at  (created_at)
    ) ENGINE=InnoDB
    DEFAULT CHARSET=utf8mb4
    COLLATE=utf8mb4_unicode_ci;

-- 티켓 더미 데이터 5건 (id 자동 채번 사용)
-- 각 INSERT 후 LAST_INSERT_ID() 로 PK를 변수에 저장해둠
INSERT INTO tickets (
    company_id,
    customer_id,
    assignee_id,
    status,
    merged_into_ticket_id,
    title,
    description,
    channel,
    submitted_at,
    closed_at
) VALUES
      (
          1,
          1,
          NULL,
          '접수',
          NULL,
          '상담 이력 내보내기 오류',
          '상담 이력 엑셀 다운로드 시 알 수 없는 오류가 발생합니다.',
          '전화',
          '2025-03-01 10:15:00',
          NULL
      ),
      (
          1,
          2,
          NULL,
          '진행중',
          NULL,
          '내선 사용량 통계 데이터 불일치',
          '관리자 페이지와 상담원 페이지의 통계 수치가 서로 다르게 표시됩니다.',
          '이메일',
          '2025-03-02 09:30:00',
          NULL
      ),
      (
          1,
          3,
          NULL,
          '종료',
          NULL,
          '다크 모드 전환 시 화면 깜빡임',
          '다크 모드 전환 시 화면이 짧게 흰색으로 깜빡입니다.',
          '채팅',
          '2025-03-03 14:05:00',
          '2025-03-04 11:20:00'
      ),
      (
          1,
          1,
          NULL,
          '접수',
          2,
          '통계 화면 필터 미동작',
          '특정 기간 필터 선택 시 통계 값이 갱신되지 않습니다.',
          '전화',
          '2025-03-04 16:40:00',
          NULL
      ),
      (
          1,
          2,
          NULL,
          '취소',
          NULL,
          '중복 문의 취소 요청',
          '동일 내용으로 잘못 접수된 문의로 취소 요청되었습니다.',
          '기타',
          '2025-03-05 09:10:00',
          '2025-03-05 09:30:00'
      );

-- 티켓 이벤트 더미 데이터 5건
INSERT INTO ticket_events (
    ticket_id,
    company_id,
    event_type,
    channel,
    author_user_id,
    customer_id,
    content,
    meta
) VALUES
      (
          1,
          1,
          '문의접수',
          '전화',
          NULL,
          1,
          '고객이 상담 이력 엑셀 다운로드 중 오류 발생을 최초로 신고했습니다.',
          NULL
      ),
      (
          1,
          1,
          '상담기록',
          '전화',
          1,
          1,
          '재현 절차 확인 및 브라우저 종류, OS 정보 안내받음.',
          NULL
      ),
      (
          2,
          1,
          '문의접수',
          '이메일',
          NULL,
          2,
          '내선 사용량 통계가 실제 통화 수와 다르다는 문의가 접수되었습니다.',
          NULL
      ),
      (
          2,
          1,
          '티켓병합',
          NULL,
          1,
          1,
          '유사 이슈로 등록된 서브 티켓을 본 티켓으로 병합했습니다.',
          JSON_OBJECT(
                  'from_ticket_id', 4,
                  'action', 'merge'
          )
      ),
      (
          3,
          1,
          '상태변경',
          '채팅',
          1,
          3,
          '패치 적용 후 고객 확인 완료되어 티켓 상태를 종료로 변경했습니다.',
          JSON_OBJECT(
                  'from_status', '진행중',
                  'to_status',   '종료'
          )
      );

-- 사용자 환경설정 테이블
CREATE TABLE IF NOT EXISTS user_preferences (
                                                id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,   -- preference PK
                                                user_id          BIGINT UNSIGNED NOT NULL,                  -- users.id FK (숫자형)
                                                dark_mode        TINYINT(1)  NOT NULL DEFAULT 0,            -- 0: 라이트, 1: 다크
    default_page_size INT        NOT NULL DEFAULT 20,           -- 기본 목록 페이지 사이즈

    created_at       TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    -- 유저당 1행만 허용
    UNIQUE KEY uq_user_preferences_user (user_id),

    CONSTRAINT fk_user_preferences_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ) ENGINE=InnoDB
    DEFAULT CHARSET = utf8mb4
    COLLATE = utf8mb4_unicode_ci;

-- 카테고리 종류 테이블
CREATE TABLE category_kind (
                               id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                               code        VARCHAR(50)     NOT NULL,      -- 'consult', 'reserve', 'etc'
                               name        VARCHAR(100)    NOT NULL,      -- '상담 카테고리', '예약 카테고리' ...
                               description VARCHAR(255)        NULL,

                               is_active   TINYINT(1)      NOT NULL DEFAULT 1,

                               created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
                                   ON UPDATE CURRENT_TIMESTAMP,

                               PRIMARY KEY (id),
                               UNIQUE KEY uq_category_kind_code (code)
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

INSERT INTO category_kind (code, name) VALUES
                                           ('consult', '상담 카테고리'),
                                           ('reserve', '예약 카테고리'),
                                           ('etc',     '기타 카테고리');


-- 카테고리 트리구조 테이블
CREATE TABLE category (
                          id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

                          kind_id       BIGINT UNSIGNED NOT NULL,         -- category_kind.id
                          company_id    BIGINT UNSIGNED NOT NULL,         -- 업체 ID

                          parent_id     BIGINT UNSIGNED     NULL,         -- 상위 카테고리 (1차는 NULL)
                          level         TINYINT UNSIGNED NOT NULL,        -- 1~4 (1차/2차/3차/4차)
                          name          VARCHAR(100)      NOT NULL,

                          sort_order    INT UNSIGNED      NOT NULL DEFAULT 1,    -- 같은 parent 내 순번
                          is_active     TINYINT(1)        NOT NULL DEFAULT 1,    -- 1:사용, 0:미사용

                            -- 필요시 path 캐싱용 컬럼도 가능: '1>3>10'
                            -- full_path     VARCHAR(255) NULL,

                          created_at    TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at    TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,

                          PRIMARY KEY (id),

                          CONSTRAINT fk_category_kind
                              FOREIGN KEY (kind_id) REFERENCES category_kind(id)
                                  ON DELETE RESTRICT,

                          CONSTRAINT fk_category_parent
                              FOREIGN KEY (parent_id) REFERENCES category(id)
                                  ON DELETE CASCADE,

                            -- 같은 company + kind + 같은 부모 안에서 이름 중복 방지 가능
                          UNIQUE KEY uq_category_name_per_parent (company_id, kind_id, parent_id, name),

                            -- 정렬/조회용 인덱스 (company_id 포함)
                          INDEX idx_category_company_kind_level   (company_id, kind_id, level),
                          INDEX idx_category_company_parent_order (company_id, kind_id, parent_id, sort_order)
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;


-- kind_id 찾기
SELECT id INTO @K_CONSULT FROM category_kind WHERE code = 'consult';
SELECT id INTO @K_RESERVE FROM category_kind WHERE code = 'reserve';

-- 1차 (대분류)
INSERT INTO category (company_id, kind_id, parent_id, level, name, sort_order)
VALUES
    (1, @K_CONSULT, NULL, 1, '상담유형', 1),
    (1, @K_RESERVE, NULL, 1, '예약유형', 1);

-- 방금 들어간 PK 저장
SELECT id INTO @C1 FROM category
WHERE company_id = 1 AND kind_id = @K_CONSULT AND parent_id IS NULL AND name = '상담유형';

-- 2차 (중분류)
INSERT INTO category (company_id, kind_id, parent_id, level, name, sort_order)
VALUES
    (1, @K_CONSULT, @C1, 2, '일반문의', 1),
    (1, @K_CONSULT, @C1, 2, '장애/오류', 2);


-- 응대 템플릿(상담이력/1:1/문자) 저장 테이블
CREATE TABLE IF NOT EXISTS response_templates (
                                                  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                                  company_id  BIGINT UNSIGNED NOT NULL,

    -- 템플릿 종류: UI 탭과 동일하게 유지
                                                  kind        ENUM('case_note','inquiry_reply','sms_reply') NOT NULL,

    title       VARCHAR(200) NOT NULL,   -- 템플릿 이름(저장 시 입력)
    prompt      TEXT NULL,               -- 생성에 사용한 프롬프트(선택)
    content     MEDIUMTEXT NOT NULL,     -- 실제 템플릿 본문(상담원이 복붙할 텍스트)

    created_by  BIGINT UNSIGNED NULL,    -- 작성자(users.id) - optional
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  DATETIME NULL,

    PRIMARY KEY (id),

    -- 종류/목록 조회용 인덱스
    INDEX idx_rt_company_kind_created (company_id, kind, created_at),
    INDEX idx_rt_company_kind_title   (company_id, kind, title),

    CONSTRAINT fk_rt_company
    FOREIGN KEY (company_id) REFERENCES companies (id)
                                                             ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_rt_created_by
    FOREIGN KEY (created_by) REFERENCES users (id)
                                                             ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB
    DEFAULT CHARSET = utf8mb4
    COLLATE = utf8mb4_unicode_ci;

-- 더미 템플릿 데이터
INSERT INTO response_templates
(company_id, kind, title, prompt, content, created_by)
VALUES
    (
        1,
        'case_note',
        '상담이력_표준',
        '상담이력 작성 시 기본정보/요약/조치/후속조치 포함해서 템플릿 만들어줘',
        '### 상담이력 작성 템플릿\n\n**1) 상담 요약**\n- 고객명/연락처:\n- 문의 채널/인입경로:\n- 핵심 이슈(1줄):\n\n**2) 상세 내용**\n- 상황:\n- 고객 요구:\n- 특이사항/제약:\n\n**3) 조치/안내**\n- 안내 내용:\n- 처리 결과:\n- 근거/정책:\n\n**4) 후속 조치**\n- 담당/기한:\n- 다음 액션:\n\n**5) 태그**\n- #태그1 #태그2\n',
        (SELECT id FROM users WHERE account='admin' LIMIT 1)
    ),
(
  1,
  'inquiry_reply',
  '1:1문의_기본응대',
  '1:1 문의 답변을 공손한 톤으로 작성할 수 있는 기본 템플릿 만들어줘',
  '안녕하세요. [고객명]님,\n\n문의 주신 내용 확인했습니다.\n\n- 문의 요약:\n- 확인 결과:\n\n아래와 같이 안내드립니다.\n1) \n2) \n\n추가로 궁금하신 점이 있으시면 편하게 회신 부탁드립니다.\n감사합니다.\n',
  (SELECT id FROM users WHERE account='admin' LIMIT 1)
),
(
  1,
  'sms_reply',
  '문자_간단안내',
  '문자 답변 템플릿을 짧고 명확하게 만들어줘',
  '[업체명]입니다.\n문의하신 내용 안내드립니다.\n- \n추가 문의는 답장 부탁드립니다. 감사합니다.\n',
  (SELECT id FROM users WHERE account='admin' LIMIT 1)
);
