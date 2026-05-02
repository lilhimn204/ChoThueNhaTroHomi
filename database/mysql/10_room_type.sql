SET NAMES utf8mb4;
USE rental_room_db;

-- Add room type classification for dropdown search.
-- Existing rows default to BOARDING_ROOM so old data keeps working safely.

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
        SET @sql = CONCAT('ALTER TABLE ', p_table_name, ' ADD ', p_index_definition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END//

DELIMITER ;

CALL add_column_if_missing(
    'rooms',
    'room_type',
    'ENUM(''APARTMENT'', ''MINI_APARTMENT'', ''PRIVATE_HOUSE'', ''BOARDING_ROOM'') NOT NULL DEFAULT ''BOARDING_ROOM'' AFTER status'
);

CALL add_index_if_missing('rooms', 'idx_rooms_type_status', 'INDEX idx_rooms_type_status (room_type, status)');

UPDATE rooms
SET room_type = 'BOARDING_ROOM'
WHERE room_type IS NULL;

DROP PROCEDURE IF EXISTS add_column_if_missing;
DROP PROCEDURE IF EXISTS add_index_if_missing;
