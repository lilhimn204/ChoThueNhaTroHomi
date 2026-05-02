-- Correct the admin Gmail typo from admin.thuenhahom@gmail.com to admin.thuenhahomi@gmail.com.

SET @admin_role_id := (SELECT id FROM roles WHERE name = 'ADMIN' LIMIT 1);

UPDATE users
SET email = 'admin.thuenhahomi@gmail.com',
    full_name = CASE
        WHEN full_name IN ('Admin', 'Admin He Thong', 'Admin Hệ Thống') THEN 'Admin Homi'
        ELSE full_name
    END,
    status = 'ACTIVE',
    enabled = TRUE,
    email_verified = TRUE,
    auth_provider = 'LOCAL',
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'admin.thuenhahom@gmail.com'
  AND NOT EXISTS (
      SELECT 1
      FROM (SELECT id FROM users WHERE email = 'admin.thuenhahomi@gmail.com') existing_admin
  );

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, @admin_role_id
FROM users u
WHERE u.email = 'admin.thuenhahomi@gmail.com'
  AND @admin_role_id IS NOT NULL;

UPDATE users
SET status = 'ACTIVE',
    enabled = TRUE,
    email_verified = TRUE,
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'admin.thuenhahomi@gmail.com';
