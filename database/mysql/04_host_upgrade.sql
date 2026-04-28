SET NAMES utf8mb4;
USE rental_room_db;

-- Bước 2: nâng cấp database cho khu "Đăng tin" của người dùng.
-- Chạy file này một lần trên database hiện tại.
-- Nếu tạo database mới từ đầu, 01_schema.sql đã có sẵn các cột/index này.

DELIMITER //

DROP PROCEDURE IF EXISTS add_column_if_missing//
CREATE PROCEDURE add_column_if_missing(
    IN p_table_name VARCHAR(64),
    IN p_column_name VARCHAR(64),
    IN p_column_definition TEXT
)
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = p_table_name
          AND COLUMN_NAME = p_column_name
    ) THEN
        SET @sql = CONCAT('ALTER TABLE ', p_table_name, ' ADD COLUMN ', p_column_name, ' ', p_column_definition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END//

DROP PROCEDURE IF EXISTS add_index_if_missing//
CREATE PROCEDURE add_index_if_missing(
    IN p_table_name VARCHAR(64),
    IN p_index_name VARCHAR(64),
    IN p_index_definition TEXT
)
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM INFORMATION_SCHEMA.STATISTICS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = p_table_name
          AND INDEX_NAME = p_index_name
    ) THEN
        SET @sql = CONCAT('ALTER TABLE ', p_table_name, ' ADD INDEX ', p_index_name, ' ', p_index_definition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END//

DELIMITER ;

CALL add_column_if_missing('users', 'address', 'VARCHAR(255) NULL AFTER avatar_url');
CALL add_column_if_missing('users', 'host_bio', 'VARCHAR(500) NULL AFTER address');

CALL add_index_if_missing(
    'rooms',
    'idx_rooms_owner_status_created',
    '(created_by, status, created_at)'
);

CALL add_index_if_missing(
    'contact_requests',
    'idx_contact_requests_room_status_created',
    '(room_id, status, created_at)'
);

UPDATE users
SET address = COALESCE(address, 'Cầu Giấy, Hà Nội'),
    host_bio = COALESCE(host_bio, 'Quản lý các bài đăng phòng trọ mẫu của hệ thống Homi.')
WHERE id = 1;

UPDATE users
SET address = COALESCE(address, 'Đống Đa, Hà Nội'),
    host_bio = COALESCE(host_bio, 'Có phòng trọ nhỏ gần các trường đại học, ưu tiên sinh viên thuê dài hạn.')
WHERE id = 2;

UPDATE users
SET address = COALESCE(address, 'Hai Bà Trưng, Hà Nội'),
    host_bio = COALESCE(host_bio, 'Người đăng tin cá nhân, phản hồi nhanh các yêu cầu xem phòng.')
WHERE id = 3;

DROP PROCEDURE IF EXISTS add_column_if_missing;
DROP PROCEDURE IF EXISTS add_index_if_missing;
