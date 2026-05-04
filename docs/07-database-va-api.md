# 07. Database Và API

## 1. Tổng quan database

Database chính: `rental_room_db`.

Homi dùng MySQL và Spring Data JPA. Schema chính nằm ở `database/mysql/01_schema.sql`, các migration bổ sung nằm từ `03_*.sql` đến `20_*.sql`.

## 2. Nhóm bảng chính

### Auth và người dùng

| Bảng | Vai trò |
|---|---|
| `users` | Thông tin tài khoản, trạng thái, OTP, provider, avatar |
| `roles` | Danh sách role kỹ thuật |
| `user_roles` | Quan hệ user-role |
| `refresh_tokens` | Refresh token phục vụ gia hạn phiên |

Field đáng chú ý trong `users`:

- `email`
- `password_hash`
- `password_configured`
- `phone`
- `avatar_url`
- `status`
- `email_verified`
- `auth_provider`
- `google_id`
- `otp_hash`
- `otp_expires_at`
- `otp_attempts`
- `otp_resend_count`
- `password_reset_otp_hash`
- `password_reset_otp_expires_at`

### Phòng

| Bảng | Vai trò |
|---|---|
| `rooms` | Bài đăng phòng |
| `room_images` | Ảnh phòng |
| `room_amenities` | Quan hệ phòng-tiện ích |
| `districts` | Khu vực/quận |
| `amenities` | Tiện ích |

Field đáng chú ý trong `rooms`:

- `title`, `slug`, `description`
- `price`, `area`
- `address`, `district_id`
- `owner_id`
- `status`
- `room_type`
- `listing_code`

`room_type` hỗ trợ:

- `APARTMENT`
- `MINI_APARTMENT`
- `PRIVATE_HOUSE`
- `BOARDING_ROOM`

### Tương tác

| Bảng | Vai trò |
|---|---|
| `saved_rooms` | Phòng người dùng đã lưu |
| `contact_requests` | Yêu cầu liên hệ/xem phòng |
| `room_reports` | Báo cáo tin sai |
| `notifications` | Thông báo |
| `support_tickets` | Liên hệ Homi/hỗ trợ |

### Tin tức/CMS

| Bảng | Vai trò |
|---|---|
| `news_categories` | Danh mục tin tức |
| `news_articles` | Bài viết/tin tức |

Field đáng chú ý trong `news_articles`:

- `title`, `slug`, `summary`, `content`
- `thumbnail_url`
- `category`
- `status`
- `published_at`
- `author_name`
- `created_by`, `updated_by`
- `is_featured`
- SEO fields nếu migration đã thêm.

## 3. Migration hiện tại

| File | Nội dung chính |
|---|---|
| `01_schema.sql` | Schema tổng hợp mới nhất |
| `02_seed.sql` | Dữ liệu mẫu |
| `03_vietnamese_accents.sql` | Dữ liệu tiếng Việt |
| `04_host_upgrade.sql` | Nâng cấp host |
| `05_saved_rooms_notifications.sql` | Saved rooms và notifications |
| `06_room_reports.sql` | Báo cáo tin đăng |
| `07_refresh_tokens.sql` | Refresh token |
| `08_room_listing_metadata.sql` | Metadata phòng |
| `09_auth_identity_verification.sql` | Google auth, OTP, email verify |
| `10_room_type.sql` | Loại phòng |
| `11_support_tickets.sql` | Ticket hỗ trợ |
| `12_news_articles.sql` | Tin tức |
| `13_news_article_upgrades.sql` | Nâng cấp bài viết |
| `14_news_utf8_fix_and_seed_articles.sql` | Sửa seed tiếng Việt/tin tức |
| `15_news_article_seo.sql` | SEO tin tức |
| `16_user_admin_management.sql` | Quản lý user admin |
| `17_admin_account_email.sql` | Cập nhật email admin |
| `18_fix_admin_gmail_typo.sql` | Sửa typo email admin |
| `19_password_reset_otp.sql` | OTP quên mật khẩu |
| `20_user_password_configured.sql` | Trạng thái user đã có password |

## 4. API auth

Base path: `/api/v1/auth`.

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/register` | Đăng ký local và gửi OTP |
| POST | `/verify-otp` | Xác minh OTP đăng ký |
| POST | `/resend-otp` | Gửi lại OTP đăng ký |
| POST | `/login` | Đăng nhập email/password |
| POST | `/google` | Đăng nhập Google |
| POST | `/refresh` | Gia hạn access token |
| POST | `/logout` | Đăng xuất |
| POST | `/forgot-password` | Gửi OTP quên mật khẩu |
| POST | `/resend-password-reset-otp` | Gửi lại OTP reset password |
| POST | `/reset-password` | Đặt lại mật khẩu |

## 5. API user/profile

Base path: `/api/v1/users`.

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/me` | Lấy user hiện tại |
| PUT | `/me` | Cập nhật hồ sơ |
| PUT | `/me/password` | Đổi mật khẩu |
| PUT | `/me/password/setup` | Tạo mật khẩu cho user Google chưa có password |

## 6. API phòng public

Base path: `/api/v1/rooms`.

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/` | Danh sách phòng, có filter |
| GET | `/featured` | Phòng nổi bật |
| GET | `/stats` | Thống kê phòng |
| GET | `/{slug}` | Chi tiết phòng |

Lookup:

- `GET /api/v1/districts`
- `GET /api/v1/amenities`

## 7. API host

Base path: `/api/v1/host`.

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/dashboard` | Số liệu host |
| GET | `/rooms` | Danh sách phòng của host |
| GET | `/rooms/{roomId}` | Chi tiết phòng host |
| POST | `/rooms` | Tạo phòng |
| PUT | `/rooms/{roomId}` | Sửa phòng |
| PATCH | `/rooms/{roomId}/status` | Đổi trạng thái |
| DELETE | `/rooms/{roomId}` | Xóa phòng |
| GET | `/contact-requests` | Khách liên hệ |
| PATCH | `/contact-requests/{requestId}/status` | Cập nhật trạng thái liên hệ |
| GET | `/profile` | Hồ sơ cho thuê |
| PUT | `/profile` | Cập nhật hồ sơ cho thuê |

## 8. API admin

| Base path | Chức năng |
|---|---|
| `/api/v1/admin/dashboard` | Tổng quan và biểu đồ |
| `/api/v1/admin/rooms` | CRUD/trạng thái phòng |
| `/api/v1/admin/news` | CRUD/trạng thái tin tức |
| `/api/v1/admin/news-categories` | CRUD danh mục tin |
| `/api/v1/admin/users` | Quản lý user, status, role, verify email |
| `/api/v1/admin/contact-requests` | Quản lý yêu cầu liên hệ |
| `/api/v1/admin/room-reports` | Quản lý báo cáo tin sai |
| `/api/v1/admin/support-tickets` | Quản lý hỗ trợ/liên hệ Homi |

## 9. API news/support

Tin tức public:

- `GET /api/v1/news`
- `GET /api/v1/news/{slug}`
- `GET /api/v1/news-categories`

Tương tác:

- `POST /api/v1/contact-requests`
- `GET /api/v1/contact-requests/me`
- `POST /api/v1/room-reports`
- `POST /api/v1/support-tickets`

Saved rooms:

- `POST /api/v1/saved-rooms/{roomId}`
- `GET /api/v1/saved-rooms/{roomId}/status`
- `GET /api/v1/saved-rooms/batch`
- `GET /api/v1/saved-rooms`

Notifications:

- `GET /api/v1/notifications`
- `GET /api/v1/notifications/unread-count`
- `PATCH /api/v1/notifications/{id}/read`
- `PATCH /api/v1/notifications/read-all`

## 10. API upload

Base path: `/api/v1/uploads`.

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/rooms` | Upload ảnh phòng |
| POST | `/avatars` | Upload avatar |
| POST | `/news` | Upload ảnh tin tức |

## 11. Frontend proxy

Next.js API route:

- `/api/auth/*`: gọi backend auth và set cookie.
- `/api/proxy/[...path]`: gọi backend endpoint cần auth.
- `/api/public/[...path]`: gọi backend endpoint public.

Quy tắc bảo mật: access token và refresh token nằm trong HttpOnly cookie, không đưa vào localStorage.
