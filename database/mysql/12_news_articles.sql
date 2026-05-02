SET NAMES utf8mb4;
USE rental_room_db;

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

CREATE TABLE IF NOT EXISTS news_articles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    seo_title VARCHAR(180),
    seo_description VARCHAR(320),
    og_image_url VARCHAR(255),
    canonical_url VARCHAR(255),
    summary VARCHAR(360) NOT NULL,
    content TEXT NOT NULL,
    thumbnail_url VARCHAR(255),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    category VARCHAR(80) NOT NULL,
    status ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    published_at TIMESTAMP NULL,
    author_name VARCHAR(120) NOT NULL,
    created_by BIGINT NULL,
    updated_by BIGINT NULL,
    last_edited_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_news_articles_creator
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_news_articles_editor
        FOREIGN KEY (updated_by) REFERENCES users(id)
        ON DELETE SET NULL,
    INDEX idx_news_articles_featured_status_published (is_featured, status, published_at),
    INDEX idx_news_articles_status_published (status, published_at),
    INDEX idx_news_articles_category_status (category, status),
    INDEX idx_news_articles_updated (updated_at)
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
