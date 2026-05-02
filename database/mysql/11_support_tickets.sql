SET NAMES utf8mb4;
USE rental_room_db;

-- Support center tickets for generic listing reports and Homi contact messages.

CREATE TABLE IF NOT EXISTS support_tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('ROOM_REPORT', 'CONTACT') NOT NULL,
    listing_reference VARCHAR(255),
    reason VARCHAR(120),
    full_name VARCHAR(120),
    email VARCHAR(120),
    phone VARCHAR(20),
    subject VARCHAR(180) NOT NULL,
    message VARCHAR(1500) NOT NULL,
    status ENUM('NEW', 'REVIEWING', 'RESOLVED', 'DISMISSED') NOT NULL DEFAULT 'NEW',
    admin_note VARCHAR(600),
    handled_by BIGINT NULL,
    handled_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_support_tickets_handler
        FOREIGN KEY (handled_by) REFERENCES users(id),
    INDEX idx_support_tickets_type_status_created (type, status, created_at),
    INDEX idx_support_tickets_status_created (status, created_at)
) ENGINE=InnoDB;
