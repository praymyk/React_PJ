-- DB 생성
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS reactpj
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE reactpj;

-- 1. 회사(업체) 테이블
CREATE TABLE IF NOT EXISTS companies (
                                         id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                         name        VARCHAR(120) NOT NULL,
    -- [변경] ENUM -> VARCHAR
    status      VARCHAR(20)  NOT NULL DEFAULT 'active',
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_companies_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 더미 회사
INSERT INTO companies (name, status)
VALUES ('Nyam_Company', 'active')
    ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);


-- 2. 시스템 사용자(상담사/관리자 등) 테이블
CREATE TABLE IF NOT EXISTS users (
                                     id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                     account        VARCHAR(50)    NOT NULL,
    public_id      VARCHAR(100)   NOT NULL,
    name           VARCHAR(100)   NOT NULL,
    profile_name   VARCHAR(100)       NULL,
    email          VARCHAR(255)   NOT NULL,
    extension      VARCHAR(20)        NULL,
    password_hash  VARCHAR(255)   NOT NULL,

    -- [변경] ENUM -> VARCHAR (JPA와 충돌 해결)
    status         VARCHAR(20)    NOT NULL DEFAULT 'active',

    created_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deactivated_at DATETIME            NULL,
    updated_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_users_account (account),
    UNIQUE KEY uq_users_email (email),
    INDEX idx_users_extension (extension)
    ) ENGINE=InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 테스트용 시스템 사용자
INSERT INTO users (account, public_id, name, profile_name, email, extension, password_hash, status)
VALUES (
           'admin', 'u-0001', '정윤석', '냠냠', 'admin@example.com', '6001',
           '$2b$10$qykjsIxU9K6Wbp9t5RNoz.IBpbcy2vi7GifaDqgX0Cs1wzLyvxybC',
           'active' -- 문자열로 잘 들어감
       );


-- 3. 고객 정보 테이블
CREATE TABLE IF NOT EXISTS customers (
                                         id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                         name       VARCHAR(100)    NOT NULL,
    email      VARCHAR(255)    NOT NULL,
    -- [변경] ENUM -> VARCHAR
    status     VARCHAR(20)     NOT NULL DEFAULT 'active',
    created_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_customers_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO customers (name, email, status) VALUES
                                                ('홍냐냐', 'hong@example.com', 'active'),
                                                ('김냐냐', 'kim@example.com',  'inactive'),
                                                ('이냐냐', 'lee@example.com',  'active');


-- 4. 티켓 테이블
CREATE TABLE IF NOT EXISTS tickets (
                                       id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                       company_id            BIGINT UNSIGNED NOT NULL,
                                       customer_id           BIGINT UNSIGNED NOT NULL,
                                       assignee_id           BIGINT UNSIGNED     NULL,

    -- [변경] ENUM -> VARCHAR (확장성 확보)
                                       status                VARCHAR(20)     NOT NULL DEFAULT '접수',
    merged_into_ticket_id BIGINT UNSIGNED     NULL,

    title                 VARCHAR(255)   NOT NULL,
    description           TEXT           NOT NULL,

    -- [변경] ENUM -> VARCHAR
    channel               VARCHAR(20)    NOT NULL DEFAULT '기타',

    submitted_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed_at             DATETIME               NULL,
    created_at            TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT fk_tickets_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    INDEX idx_tickets_company (company_id),
    INDEX idx_tickets_customer (customer_id),
    INDEX idx_tickets_assignee (assignee_id),
    INDEX idx_tickets_status (status),
    INDEX idx_tickets_merged_into (merged_into_ticket_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 5. 티켓 이벤트 테이블
CREATE TABLE IF NOT EXISTS ticket_events (
                                             id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                             ticket_id      BIGINT UNSIGNED NOT NULL,
                                             company_id     BIGINT UNSIGNED NOT NULL,

    -- [변경] ENUM -> VARCHAR (이벤트 종류는 나중에 늘어날 가능성 매우 높음)
                                             event_type     VARCHAR(50)     NOT NULL,

    -- [변경] ENUM -> VARCHAR
    channel        VARCHAR(20)     NULL,

    author_user_id BIGINT UNSIGNED NULL,
    customer_id    BIGINT UNSIGNED NULL,
    content        TEXT            NULL,
    meta           JSON            NULL,
    created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ticket_events_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    INDEX idx_ticket_events_ticket (ticket_id),
    INDEX idx_ticket_events_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 티켓 더미 데이터
INSERT INTO tickets (company_id, customer_id, assignee_id, status, merged_into_ticket_id, title, description, channel, submitted_at, closed_at)
VALUES
    (1, 1, NULL, '접수', NULL, '상담 이력 내보내기 오류', '오류발생', '전화', '2025-03-01 10:15:00', NULL),
    (1, 2, NULL, '진행중', NULL, '내선 사용량 불일치', '통계 다름', '이메일', '2025-03-02 09:30:00', NULL),
    (1, 3, NULL, '종료', NULL, '화면 깜빡임', '흰색 깜빡임', '채팅', '2025-03-03 14:05:00', '2025-03-04 11:20:00'),
    (1, 1, NULL, '접수', 2, '필터 미동작', '갱신 안됨', '전화', '2025-03-04 16:40:00', NULL),
    (1, 2, NULL, '취소', NULL, '중복 문의', '취소 요청', '기타', '2025-03-05 09:10:00', '2025-03-05 09:30:00');

-- 티켓 이벤트 더미 데이터
INSERT INTO ticket_events (ticket_id, company_id, event_type, channel, author_user_id, customer_id, content, meta)
VALUES
    (1, 1, '문의접수', '전화', NULL, 1, '최초 신고', NULL),
    (1, 1, '상담기록', '전화', 1, 1, '재현 절차 확인', NULL),
    (2, 1, '문의접수', '이메일', NULL, 2, '통계 문의 접수', NULL),
    (2, 1, '티켓병합', NULL, 1, 1, '서브 티켓 병합', JSON_OBJECT('from_ticket_id', 4, 'action', 'merge')),
    (3, 1, '상태변경', '채팅', 1, 3, '종료 처리', JSON_OBJECT('from_status', '진행중', 'to_status', '종료'));


-- 6. 사용자 환경설정 테이블
CREATE TABLE IF NOT EXISTS user_preferences (
                                                id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                                user_id          BIGINT UNSIGNED NOT NULL,
                                                dark_mode        TINYINT(1)  NOT NULL DEFAULT 0,
    default_page_size INT        NOT NULL DEFAULT 20,
    created_at       TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_user_preferences_user (user_id),
    CONSTRAINT fk_user_preferences_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


-- 7. 카테고리 종류 테이블
CREATE TABLE category_kind (
                               id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                               code        VARCHAR(50)     NOT NULL,
                               name        VARCHAR(100)    NOT NULL,
                               description VARCHAR(255)        NULL,
                               is_active   TINYINT(1)      NOT NULL DEFAULT 1,
                               created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                               PRIMARY KEY (id),
                               UNIQUE KEY uq_category_kind_code (code)
) ENGINE=InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO category_kind (code, name) VALUES ('consult', '상담 카테고리'), ('reserve', '예약 카테고리'), ('etc', '기타 카테고리');


-- 8. 카테고리 트리구조 테이블
CREATE TABLE category (
                          id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                          kind_id       BIGINT UNSIGNED NOT NULL,
                          company_id    BIGINT UNSIGNED NOT NULL,
                          parent_id     BIGINT UNSIGNED     NULL,
                          level         TINYINT UNSIGNED NOT NULL,
                          name          VARCHAR(100)      NOT NULL,
                          sort_order    INT UNSIGNED      NOT NULL DEFAULT 1,
                          is_active     TINYINT(1)        NOT NULL DEFAULT 1,
                          created_at    TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at    TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          PRIMARY KEY (id),
                          CONSTRAINT fk_category_kind FOREIGN KEY (kind_id) REFERENCES category_kind(id) ON DELETE RESTRICT,
                          CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) REFERENCES category(id) ON DELETE CASCADE,
                          UNIQUE KEY uq_category_name_per_parent (company_id, kind_id, parent_id, name),
                          INDEX idx_category_company_kind_level (company_id, kind_id, level),
                          INDEX idx_category_company_parent_order (company_id, kind_id, parent_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

SELECT id INTO @K_CONSULT FROM category_kind WHERE code = 'consult';
SELECT id INTO @K_RESERVE FROM category_kind WHERE code = 'reserve';
INSERT INTO category (company_id, kind_id, parent_id, level, name, sort_order) VALUES (1, @K_CONSULT, NULL, 1, '상담유형', 1), (1, @K_RESERVE, NULL, 1, '예약유형', 1);
SELECT id INTO @C1 FROM category WHERE company_id = 1 AND kind_id = @K_CONSULT AND parent_id IS NULL AND name = '상담유형';
INSERT INTO category (company_id, kind_id, parent_id, level, name, sort_order) VALUES (1, @K_CONSULT, @C1, 2, '일반문의', 1), (1, @K_CONSULT, @C1, 2, '장애/오류', 2);


-- 9. 응대 템플릿 테이블
CREATE TABLE IF NOT EXISTS response_templates (
                                                  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                                  company_id  BIGINT UNSIGNED NOT NULL,

    -- [변경] ENUM -> VARCHAR
                                                  kind        VARCHAR(20)     NOT NULL,

    title       VARCHAR(200) NOT NULL,
    prompt      TEXT NULL,
    content     MEDIUMTEXT NOT NULL,
    created_by  BIGINT UNSIGNED NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  DATETIME NULL,

    PRIMARY KEY (id),
    INDEX idx_rt_company_kind_created (company_id, kind, created_at),
    INDEX idx_rt_company_kind_title   (company_id, kind, title),
    CONSTRAINT fk_rt_company FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_rt_created_by FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO response_templates (company_id, kind, title, prompt, content, created_by) VALUES
    (1, 'case_note', '상담이력_표준', '...', '내용...', (SELECT id FROM users WHERE account='admin' LIMIT 1)),
    (1, 'inquiry_reply', '1:1문의_기본응대', '...', '내용...', (SELECT id FROM users WHERE account='admin' LIMIT 1)),
    (1, 'sms_reply', '문자_간단안내', '...', '내용...', (SELECT id FROM users WHERE account='admin' LIMIT 1));