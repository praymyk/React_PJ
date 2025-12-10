-- DB 생성
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS reactpj
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE reactpj;

-- 고객 정보 테이블
CREATE TABLE IF NOT EXISTS users (
    id        VARCHAR(20)  NOT NULL PRIMARY KEY,   -- 'u-001'
    name      VARCHAR(100) NOT NULL,
    email     VARCHAR(255) NOT NULL,
    status    ENUM('active', 'inactive') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
    DEFAULT CHARSET=utf8mb4
    COLLATE=utf8mb4_unicode_ci;

-- 기본 목업 데이터
INSERT INTO users (id, name, email, status) VALUES
    ('u-001', '홍냐냐', 'hong@example.com', 'active'),
    ('u-002', '김냐냐', 'kim@example.com',  'inactive'),
    ('u-003', '이냐냐', 'lee@example.com',  'active');


-- 고객 이력 테이블
CREATE TABLE IF NOT EXISTS user_histories (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    VARCHAR(20)  NOT NULL,
    event_date DATE         NOT NULL,
    title      VARCHAR(255) NOT NULL,
    status     VARCHAR(50)  NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_histories_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ) ENGINE=InnoDB
    DEFAULT CHARSET=utf8mb4
    COLLATE=utf8mb4_unicode_ci;

-- 기본 목업 이력 데이터
INSERT INTO user_histories (user_id, event_date, title, status) VALUES
    ('u-001', '2025-03-01', '문의 접수',       '진행중'),
    ('u-001', '2025-03-03', '추가 자료 요청',  '완료'),
    ('u-002', '2025-02-11', '회원 정보 수정',  '완료');