SET NAMES utf8mb4;
USE rental_room_db;

DELIMITER //

CREATE PROCEDURE add_user_password_configured_if_missing()
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'users'
          AND COLUMN_NAME = 'password_configured'
    ) THEN
        ALTER TABLE users
            ADD COLUMN password_configured BOOLEAN NOT NULL DEFAULT TRUE AFTER password_hash;
    END IF;
END //

DELIMITER ;

CALL add_user_password_configured_if_missing();
DROP PROCEDURE add_user_password_configured_if_missing;

UPDATE users
SET password_configured = CASE
    WHEN auth_provider = 'GOOGLE' THEN FALSE
    ELSE TRUE
END;
