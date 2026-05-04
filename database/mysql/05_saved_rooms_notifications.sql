SET NAMES utf8mb4;
USE rental_room_db;

-- Upgrade existing databases created before saved rooms and notifications were added.
-- Fresh databases already get these tables from 01_schema.sql.

CREATE TABLE IF NOT EXISTS saved_rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_saved_rooms_user_room
        UNIQUE (user_id, room_id),
    CONSTRAINT fk_saved_rooms_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_saved_rooms_room
        FOREIGN KEY (room_id) REFERENCES rooms(id)
        ON DELETE CASCADE,
    INDEX idx_saved_rooms_user_created (user_id, created_at),
    INDEX idx_saved_rooms_room (room_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipient_id BIGINT NOT NULL,
    type ENUM('NEW_CONTACT_REQUEST', 'NEW_SUPPORT_TICKET') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message VARCHAR(500) NOT NULL,
    target_url VARCHAR(255),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_recipient
        FOREIGN KEY (recipient_id) REFERENCES users(id)
        ON DELETE CASCADE,
    INDEX idx_notifications_recipient_read_created (recipient_id, is_read, created_at),
    INDEX idx_notifications_recipient_created (recipient_id, created_at)
) ENGINE=InnoDB;
