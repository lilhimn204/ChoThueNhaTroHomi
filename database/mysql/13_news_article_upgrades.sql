SET NAMES utf8mb4;
USE rental_room_db;

-- News upgrades: editable categories, featured articles, upload-ready thumbnails
-- and last editor tracking. This migration is idempotent for existing Docker volumes.

CREATE TABLE IF NOT EXISTS news_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(300),
    display_order INT NOT NULL DEFAULT 0,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_news_categories_enabled_order (enabled, display_order, name)
) ENGINE=InnoDB;

INSERT INTO news_categories (name, slug, description, display_order, enabled)
VALUES
    ('Hướng dẫn thuê phòng', 'huong-dan-thue-phong', 'Bài viết hướng dẫn quy trình tìm và thuê phòng an toàn.', 10, TRUE),
    ('Kinh nghiệm', 'kinh-nghiem', 'Kinh nghiệm thực tế cho người thuê phòng tại Hà Nội.', 20, TRUE),
    ('Thị trường', 'thi-truong', 'Cập nhật xu hướng giá thuê và khu vực nổi bật.', 30, TRUE),
    ('Thông báo Homi', 'thong-bao-homi', 'Thông báo sản phẩm và chính sách từ Homi.', 40, TRUE)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    description = VALUES(description),
    display_order = VALUES(display_order),
    enabled = VALUES(enabled);

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

DROP PROCEDURE IF EXISTS add_fk_if_missing//
CREATE PROCEDURE add_fk_if_missing(
    IN p_table_name VARCHAR(64),
    IN p_constraint_name VARCHAR(64),
    IN p_constraint_definition TEXT
)
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = p_table_name
          AND CONSTRAINT_NAME = p_constraint_name
    ) THEN
        SET @sql = CONCAT('ALTER TABLE ', p_table_name, ' ADD CONSTRAINT ', p_constraint_name, ' ', p_constraint_definition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END//

DELIMITER ;

CALL add_column_if_missing('news_articles', 'is_featured', 'BOOLEAN NOT NULL DEFAULT FALSE AFTER thumbnail_url');
CALL add_column_if_missing('news_articles', 'updated_by', 'BIGINT NULL AFTER created_by');
CALL add_column_if_missing('news_articles', 'last_edited_at', 'TIMESTAMP NULL AFTER updated_by');

CALL add_index_if_missing('news_categories', 'idx_news_categories_enabled_order', 'INDEX idx_news_categories_enabled_order (enabled, display_order, name)');
CALL add_index_if_missing('news_articles', 'idx_news_articles_featured_status_published', 'INDEX idx_news_articles_featured_status_published (is_featured, status, published_at)');
CALL add_fk_if_missing('news_articles', 'fk_news_articles_editor', 'FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL');

UPDATE news_articles
SET is_featured = FALSE
WHERE is_featured IS NULL;

UPDATE news_articles
SET last_edited_at = updated_at
WHERE last_edited_at IS NULL;

DROP PROCEDURE IF EXISTS add_column_if_missing;
DROP PROCEDURE IF EXISTS add_index_if_missing;
DROP PROCEDURE IF EXISTS add_fk_if_missing;
