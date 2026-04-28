CREATE DATABASE IF NOT EXISTS rental_room_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE rental_room_db;

CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(255),
    address VARCHAR(255),
    host_bio VARCHAR(500),
    status ENUM('ACTIVE', 'INACTIVE', 'LOCKED') NOT NULL DEFAULT 'ACTIVE',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role
        FOREIGN KEY (role_id) REFERENCES roles(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refresh_tokens_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    INDEX idx_refresh_tokens_user_active (user_id, revoked_at, expires_at),
    INDEX idx_refresh_tokens_expires (expires_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS districts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    city_name VARCHAR(100) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS amenities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    category ENUM('ROOM', 'BUILDING', 'SERVICE') NOT NULL DEFAULT 'ROOM',
    icon_key VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    listing_code VARCHAR(5) UNIQUE,
    title VARCHAR(180) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    address VARCHAR(255) NOT NULL,
    district_id BIGINT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    area DECIMAL(6, 2) NOT NULL,
    contact_name VARCHAR(120) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    status ENUM('AVAILABLE', 'FULL', 'HIDDEN') NOT NULL DEFAULT 'AVAILABLE',
    thumbnail VARCHAR(255),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_by BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_rooms_district
        FOREIGN KEY (district_id) REFERENCES districts(id),
    CONSTRAINT fk_rooms_created_by
        FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_rooms_listing (status, district_id, price),
    INDEX idx_rooms_owner_status_created (created_by, status, created_at),
    INDEX idx_rooms_area (area),
    INDEX idx_rooms_featured (is_featured),
    INDEX idx_rooms_created_at (created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS room_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(150),
    sort_order INT NOT NULL DEFAULT 0,
    is_thumbnail BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_room_images_room
        FOREIGN KEY (room_id) REFERENCES rooms(id)
        ON DELETE CASCADE,
    INDEX idx_room_images_room (room_id, sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS room_amenities (
    room_id BIGINT NOT NULL,
    amenity_id BIGINT NOT NULL,
    PRIMARY KEY (room_id, amenity_id),
    CONSTRAINT fk_room_amenities_room
        FOREIGN KEY (room_id) REFERENCES rooms(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_room_amenities_amenity
        FOREIGN KEY (amenity_id) REFERENCES amenities(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contact_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    user_id BIGINT NULL,
    request_type ENUM('CONTACT', 'VIEWING') NOT NULL DEFAULT 'VIEWING',
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(120),
    phone VARCHAR(20) NOT NULL,
    message VARCHAR(1000),
    preferred_viewing_time VARCHAR(120),
    status ENUM('PENDING', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    admin_note VARCHAR(500),
    handled_by BIGINT NULL,
    handled_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_contact_requests_room
        FOREIGN KEY (room_id) REFERENCES rooms(id),
    CONSTRAINT fk_contact_requests_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_contact_requests_handler
        FOREIGN KEY (handled_by) REFERENCES users(id),
    INDEX idx_contact_requests_user_status (user_id, status),
    INDEX idx_contact_requests_room_created (room_id, created_at),
    INDEX idx_contact_requests_room_status_created (room_id, status, created_at),
    INDEX idx_contact_requests_status (status)
) ENGINE=InnoDB;

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
    type ENUM('NEW_CONTACT_REQUEST') NOT NULL,
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
