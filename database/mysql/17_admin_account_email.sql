-- Move the default admin account to the real Homi admin Gmail account.
-- Keeps the original user id when possible so existing foreign keys remain valid.

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
WHERE email = 'admin@homi.vn'
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
SET full_name = CASE
        WHEN full_name IN ('Admin', 'Admin He Thong', 'Admin Hệ Thống') THEN 'Admin Homi'
        ELSE full_name
    END,
    status = 'ACTIVE',
    enabled = TRUE,
    email_verified = TRUE,
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'admin.thuenhahomi@gmail.com';

DELETE ur
FROM user_roles ur
JOIN users u ON u.id = ur.user_id
WHERE u.email = 'admin@homi.vn'
  AND ur.role_id = @admin_role_id
  AND EXISTS (
      SELECT 1
      FROM (SELECT id FROM users WHERE email = 'admin.thuenhahomi@gmail.com') target_admin
  );
