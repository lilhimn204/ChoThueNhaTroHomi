-- Add listing metadata for room posts.
-- Fresh databases may already have listing_code from 01_schema.sql.
-- Existing databases get deterministic 5-digit codes so old rows keep rendering safely.

SET @rooms_listing_code_column_exists = (
    SELECT COUNT(*)
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'rooms'
      AND column_name = 'listing_code'
);

SET @rooms_listing_code_column_sql = IF(
    @rooms_listing_code_column_exists = 0,
    'ALTER TABLE rooms ADD COLUMN listing_code VARCHAR(5) NULL AFTER id',
    'SELECT 1'
);

PREPARE rooms_listing_code_column_stmt FROM @rooms_listing_code_column_sql;
EXECUTE rooms_listing_code_column_stmt;
DEALLOCATE PREPARE rooms_listing_code_column_stmt;

UPDATE rooms
SET listing_code = CAST(10000 + MOD(id * 7919, 90000) AS CHAR)
WHERE listing_code IS NULL OR listing_code = '';

SET @rooms_listing_code_unique_exists = (
    SELECT COUNT(*)
    FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = 'rooms'
      AND column_name = 'listing_code'
      AND non_unique = 0
);

SET @rooms_listing_code_unique_sql = IF(
    @rooms_listing_code_unique_exists = 0,
    'ALTER TABLE rooms ADD UNIQUE INDEX uk_rooms_listing_code (listing_code)',
    'SELECT 1'
);

PREPARE rooms_listing_code_unique_stmt FROM @rooms_listing_code_unique_sql;
EXECUTE rooms_listing_code_unique_stmt;
DEALLOCATE PREPARE rooms_listing_code_unique_stmt;
