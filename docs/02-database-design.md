# Database Design Notes

File này là ghi chú thiết kế database ở dạng ngắn. Tài liệu chi tiết và mới nhất nằm ở `07-database-va-api.md`.

## 1. Mục tiêu thiết kế

Database Homi cần hỗ trợ:

- Tài khoản local/Google, OTP đăng ký, OTP quên mật khẩu.
- Phân quyền `USER` và `ADMIN`.
- Danh sách phòng, ảnh phòng, tiện ích, khu vực.
- Lưu phòng, yêu cầu liên hệ, báo cáo tin sai, thông báo.
- Ticket hỗ trợ/liên hệ Homi.
- Tin tức, danh mục, CMS.

## 2. Nhóm bảng

Auth:

- `users`
- `roles`
- `user_roles`
- `refresh_tokens`

Rooms:

- `rooms`
- `room_images`
- `room_amenities`
- `districts`
- `amenities`

Interactions:

- `saved_rooms`
- `contact_requests`
- `room_reports`
- `notifications`
- `support_tickets`

CMS/news:

- `news_categories`
- `news_articles`

## 3. Field cần nhớ

`users`:

- `email_verified`
- `auth_provider`
- `google_id`
- `password_configured`
- OTP đăng ký và OTP reset password.

`rooms`:

- `room_type`
- `status`
- `listing_code`
- `owner_id`

`news_articles`:

- `slug`
- `status`
- `thumbnail_url`
- `is_featured`
- `published_at`

## 4. Migration

Schema tổng hợp hiện tại ở `database/mysql/01_schema.sql`. Khi nâng cấp nên thêm file migration mới theo số thứ tự tiếp theo, đồng thời bảo đảm dữ liệu cũ có default hợp lý.
