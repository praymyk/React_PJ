-- DB 생성
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS reactpj
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE reactpj;

-- 고객 정보 테이블
CREATE TABLE IF NOT EXISTS customers (
    id        VARCHAR(20)  NOT NULL PRIMARY KEY,   -- 'u-001'
    name      VARCHAR(100) NOT NULL,
    email     VARCHAR(255) NOT NULL,
    status    ENUM('active', 'inactive') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
    DEFAULT CHARSET=utf8mb4
    COLLATE=utf8mb4_unicode_ci;

-- 기본 목업 데이터
INSERT INTO customers (id, name, email, status) VALUES
    ('c-001', '홍냐냐', 'hong@example.com', 'active'),
    ('c-002', '김냐냐', 'kim@example.com',  'inactive'),
    ('c-003', '이냐냐', 'lee@example.com',  'active');

-- 티켓 테이블 (이슈/문의 단위)
CREATE TABLE IF NOT EXISTS tickets (
                                       id           VARCHAR(20)  NOT NULL PRIMARY KEY,  -- 'T-0001'
    company_id   INT          NOT NULL,              -- 업체 ID
    customer_id  VARCHAR(20)  NOT NULL,              -- 문의한 고객 (customers.id)
    assignee_id  VARCHAR(20)      NULL,              -- 담당자
    status       ENUM('접수','진행중','종료','취소') NOT NULL DEFAULT '접수', -- 처리 상태

-- 티켓 병합용: 이 티켓이 다른 티켓에 병합된 상태면, "마스터 티켓 ID" 입력
--    - NULL : 자신이 마스터이거나, 아직 병합 안 됨
--    - 'T-0001' : T-0001 의 서브(중복) 티켓
    merged_into_ticket_id VARCHAR(20) NULL,

    title        VARCHAR(255) NOT NULL,              -- 티켓 제목
    description  TEXT         NOT NULL,              -- 상세 내용 (초기 문의 내용)
    channel      ENUM('전화','채팅','이메일','기타') NOT NULL DEFAULT '기타', -- 주 유입 채널

    submitted_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 최초 접수 일시
    closed_at    DATETIME              NULL,         -- 실제 종료 시각
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_tickets_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id)
                                                                 ON DELETE RESTRICT,

    -- 필요 시 assignee FK 연결
    -- CONSTRAINT fk_tickets_assignee
    --   FOREIGN KEY (assignee_id) REFERENCES customers(id)
    --     ON DELETE SET NULL,

    INDEX idx_tickets_company  (company_id),
    INDEX idx_tickets_customer (customer_id),
    INDEX idx_tickets_assignee (assignee_id),
    INDEX idx_tickets_status   (status),

    -- 병합 관계 조회용 인덱스
    INDEX idx_tickets_merged_into (merged_into_ticket_id)
    ) ENGINE=InnoDB
    DEFAULT CHARSET=utf8mb4
    COLLATE=utf8mb4_unicode_ci;


-- 티켓 이벤트 테이블
CREATE TABLE IF NOT EXISTS ticket_events (
                                             id            BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,

                                             ticket_id     VARCHAR(20)  NOT NULL,   -- 어느 티켓에 속한 이벤트인지
    company_id    INT          NOT NULL,   -- 편의를 위해 함께 저장 (조인 줄이기)
    event_type    ENUM(        -- 어떤 종류의 이벤트인가
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
    channel       ENUM('전화','채팅','이메일','기타') NULL,

    -- 작성자 (내부 사용자)
    author_user_id VARCHAR(20) NULL,   -- 상담사/관리자 ID
    -- 관련 고객 (필요시)
    customer_id    VARCHAR(20) NULL,

    -- 사람 눈으로 보는 내용
    content       TEXT         NULL,

    -- 통화ID, 녹취URL, 이전 상태/변경 후 상태 등 구조화 정보는 JSON에
    meta          JSON         NULL,

    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ticket_events_ticket
    FOREIGN KEY (ticket_id) REFERENCES tickets(id)
    ON DELETE CASCADE,

    INDEX idx_ticket_events_ticket (ticket_id),
    INDEX idx_ticket_events_created_at (created_at)
    ) ENGINE=InnoDB
    DEFAULT CHARSET=utf8mb4
    COLLATE=utf8mb4_unicode_ci;

-- 티켓 더미 데이터 5건
INSERT INTO tickets (
    id,
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
          'T-0001',
          1,
          'c-001',
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
          'T-0002',
          1,
          'c-002',
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
          'T-0003',
          1,
          'c-003',
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
          'T-0004',
          1,
          'c-001',
          NULL,
          '접수',
          'T-0002',  -- T-0002에 병합된 서브 티켓
          '통계 화면 필터 미동작',
          '특정 기간 필터 선택 시 통계 값이 갱신되지 않습니다.',
          '전화',
          '2025-03-04 16:40:00',
          NULL
      ),
      (
          'T-0005',
          1,
          'c-002',
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
          'T-0001',
          1,
          '문의접수',
          '전화',
          NULL,
          'c-001',
          '고객이 상담 이력 엑셀 다운로드 중 오류 발생을 최초로 신고했습니다.',
          NULL
      ),
      (
          'T-0001',
          1,
          '상담기록',
          '전화',
          'agent-001',
          'c-001',
          '재현 절차 확인 및 브라우저 종류, OS 정보 안내받음.',
          NULL
      ),
      (
          'T-0002',
          1,
          '문의접수',
          '이메일',
          NULL,
          'c-002',
          '내선 사용량 통계가 실제 통화 수와 다르다는 문의가 접수되었습니다.',
          NULL
      ),
      (
          'T-0002',
          1,
          '티켓병합',
          NULL,
          'agent-002',
          'c-001',
          '유사 이슈로 등록된 T-0004 티켓을 본 티켓으로 병합했습니다.',
          JSON_OBJECT(
                  'from_ticket', 'T-0004',
                  'action', 'merge'
          )
      ),
      (
          'T-0003',
          1,
          '상태변경',
          '채팅',
          'agent-003',
          'c-003',
          '패치 적용 후 고객 확인 완료되어 티켓 상태를 종료로 변경했습니다.',
          JSON_OBJECT(
                  'from_status', '진행중',
                  'to_status',   '종료'
          )
      );

-- 사용자 환경설정 테이블
CREATE TABLE IF NOT EXISTS user_preferences (
                                                user_id           VARCHAR(20) NOT NULL PRIMARY KEY,            -- users.id
    dark_mode         TINYINT(1)  NOT NULL DEFAULT 0,              -- 0: 라이트, 1: 다크
    default_page_size INT         NOT NULL DEFAULT 20,             -- 기본 목록 페이지 사이즈

    created_at        TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_preferences_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ) ENGINE=InnoDB
    DEFAULT CHARSET = utf8mb4
    COLLATE = utf8mb4_unicode_ci;

-- 테스트용 기본값 (u-001)
INSERT INTO user_preferences (user_id, dark_mode, default_page_size)
VALUES ('u-001', 0, 20)
    ON DUPLICATE KEY UPDATE
                         dark_mode = VALUES(dark_mode),
                         default_page_size = VALUES(default_page_size);