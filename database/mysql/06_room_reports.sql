SET NAMES utf8mb4;
USE rental_room_db;

CREATE TABLE IF NOT EXISTS room_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    reporter_id BIGINT NOT NULL,
    reason ENUM('WRONG_INFO', 'DUPLICATE', 'SCAM', 'UNAVAILABLE', 'INAPPROPRIATE', 'OTHER') NOT NULL,
    details VARCHAR(1000),
    status ENUM('NEW', 'REVIEWING', 'RESOLVED', 'DISMISSED') NOT NULL DEFAULT 'NEW',
    admin_note VARCHAR(500),
    handled_by BIGINT NULL,
    handled_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_room_reports_room
        FOREIGN KEY (room_id) REFERENCES rooms(id),
    CONSTRAINT fk_room_reports_reporter
        FOREIGN KEY (reporter_id) REFERENCES users(id),
    CONSTRAINT fk_room_reports_handler
        FOREIGN KEY (handled_by) REFERENCES users(id),
    INDEX idx_room_reports_status_created (status, created_at),
    INDEX idx_room_reports_reason (reason),
    INDEX idx_room_reports_room_created (room_id, created_at),
    INDEX idx_room_reports_reporter_created (reporter_id, created_at)
) ENGINE=InnoDB;
