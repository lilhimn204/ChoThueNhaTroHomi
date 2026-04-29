SET NAMES utf8mb4;
USE rental_room_db;

-- Add auth provider, Google identity and email OTP verification fields.
-- Fresh databases may already have these columns from 01_schema.sql.

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

CALL add_column_if_missing('users', 'email_verified', 'BOOLEAN NOT NULL DEFAULT TRUE AFTER host_bio');
CALL add_column_if_missing('users', 'auth_provider', 'ENUM(''LOCAL'', ''GOOGLE'') NOT NULL DEFAULT ''LOCAL'' AFTER email_verified');
CALL add_column_if_missing('users', 'google_id', 'VARCHAR(120) NULL AFTER auth_provider');
CALL add_column_if_missing('users', 'otp_hash', 'VARCHAR(255) NULL AFTER google_id');
CALL add_column_if_missing('users', 'otp_expires_at', 'TIMESTAMP NULL AFTER otp_hash');
CALL add_column_if_missing('users', 'otp_attempts', 'INT NOT NULL DEFAULT 0 AFTER otp_expires_at');
CALL add_column_if_missing('users', 'otp_resend_count', 'INT NOT NULL DEFAULT 0 AFTER otp_attempts');
CALL add_column_if_missing('users', 'otp_last_sent_at', 'TIMESTAMP NULL AFTER otp_resend_count');

CALL add_index_if_missing('users', 'uk_users_google_id', 'UNIQUE KEY uk_users_google_id (google_id)');
CALL add_index_if_missing('users', 'idx_users_auth_provider', 'INDEX idx_users_auth_provider (auth_provider)');

UPDATE users
SET email_verified = TRUE
WHERE email_verified IS NULL;

UPDATE users
SET auth_provider = 'LOCAL'
WHERE auth_provider IS NULL;

DROP PROCEDURE IF EXISTS add_column_if_missing;
DROP PROCEDURE IF EXISTS add_index_if_missing;
