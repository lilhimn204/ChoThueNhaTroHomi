SET NAMES utf8mb4;
USE rental_room_db;

-- SEO fields for CMS-managed news articles. Idempotent for existing Docker volumes.

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

CALL add_column_if_missing('news_articles', 'seo_title', 'VARCHAR(180) NULL AFTER slug');
CALL add_column_if_missing('news_articles', 'seo_description', 'VARCHAR(320) NULL AFTER seo_title');
CALL add_column_if_missing('news_articles', 'og_image_url', 'VARCHAR(255) NULL AFTER seo_description');
CALL add_column_if_missing('news_articles', 'canonical_url', 'VARCHAR(255) NULL AFTER og_image_url');

DROP PROCEDURE IF EXISTS add_column_if_missing;
