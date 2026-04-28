-- Seed roles required for auth integration tests (H2 compatible)
MERGE INTO roles (id, name, description, created_at, updated_at)
KEY (id)
VALUES (1, 'USER', 'Regular user', NOW(), NOW());

MERGE INTO roles (id, name, description, created_at, updated_at)
KEY (id)
VALUES (2, 'ADMIN', 'Admin user', NOW(), NOW());
