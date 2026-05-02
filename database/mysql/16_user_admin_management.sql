SET NAMES utf8mb4;
USE rental_room_db;

DELIMITER //
DROP PROCEDURE IF EXISTS add_column_if_missing//
CREATE PROCEDURE add_column_if_missing(
    IN table_name_param VARCHAR(64),
    IN column_name_param VARCHAR(64),
    IN column_definition_param TEXT
)
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
          AND table_name = table_name_param
          AND column_name = column_name_param
    ) THEN
        SET @sql = CONCAT('ALTER TABLE ', table_name_param, ' ADD COLUMN ', column_name_param, ' ', column_definition_param);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END//
DELIMITER ;

CALL add_column_if_missing('users', 'lock_reason', 'VARCHAR(300) NULL AFTER enabled');
CALL add_column_if_missing('users', 'locked_at', 'TIMESTAMP NULL AFTER lock_reason');

DROP PROCEDURE IF EXISTS add_column_if_missing;
