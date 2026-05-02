SET NAMES utf8mb4;
USE rental_room_db;

-- Add separate OTP fields for password reset so registration OTP state is not reused.

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

DELIMITER ;

CALL add_column_if_missing('users', 'password_reset_otp_hash', 'VARCHAR(255) NULL AFTER otp_last_sent_at');
CALL add_column_if_missing('users', 'password_reset_otp_expires_at', 'TIMESTAMP NULL AFTER password_reset_otp_hash');
CALL add_column_if_missing('users', 'password_reset_otp_attempts', 'INT NOT NULL DEFAULT 0 AFTER password_reset_otp_expires_at');
CALL add_column_if_missing('users', 'password_reset_otp_resend_count', 'INT NOT NULL DEFAULT 0 AFTER password_reset_otp_attempts');
CALL add_column_if_missing('users', 'password_reset_otp_last_sent_at', 'TIMESTAMP NULL AFTER password_reset_otp_resend_count');

DROP PROCEDURE IF EXISTS add_column_if_missing;
