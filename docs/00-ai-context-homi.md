# 00. AI Context Homi

Tài liệu này là bản ngữ cảnh nhanh cho AI hoặc lập trình viên mới đọc source Homi. Khi cần nhờ AI sửa code, nên đưa file này cùng yêu cầu để AI hiểu hệ thống hiện tại.

## 1. Mô tả ngắn

Homi là website tìm và quản lý phòng trọ tại Hà Nội. Người thuê có thể xem danh sách phòng, lọc theo loại phòng/khu vực/giá/diện tích/tiện ích, xem chi tiết, lưu phòng, gửi yêu cầu liên hệ và theo dõi lịch sử. Người đăng tin có khu host để quản lý bài đăng và khách liên hệ. Admin có khu quản trị dữ liệu, người dùng, tin tức, hỗ trợ và báo cáo. Ngoài admin cũ, dự án có thêm khu CMS riêng tại `/cms` để quản lý bài viết/tin tức chuyên nghiệp hơn.

## 2. Kiến trúc hiện tại

```text
Browser
  -> Next.js frontend + BFF API routes
  -> Spring Boot REST API
  -> MySQL rental_room_db
```

- Frontend: Next.js App Router, React, TypeScript, Tailwind CSS.
- Backend: Spring Boot, Spring Security JWT, Spring Data JPA, MySQL.
- Database: MySQL 8.x, schema trong `database/mysql`.
- Auth: access token và refresh token được frontend lưu bằng HttpOnly cookie qua Next API route.
- Upload: backend lưu file upload trong thư mục cấu hình bởi `UPLOAD_DIRECTORY`.

## 3. Stack và phiên bản chính

- Frontend: Next.js `16.2.4`, React `19.2.4`, Tailwind CSS 4, TypeScript 5.
- Backend: Spring Boot `3.5.7`, Java 21, JJWT `0.12.7`.
- Database: MySQL 8.4 trong Docker hoặc MySQL local 8.x.
- Test: backend dùng Spring Boot Test/H2; frontend có Vitest và smoke route script.

## 4. Routes frontend quan trọng

Public:

- `/` trang chủ.
- `/rooms`, `/rooms/[slug]` danh sách và chi tiết phòng.
- `/news`, `/news/[slug]` danh sách và chi tiết tin tức.
- `/support/huong-dan-tim-phong`, `/support/faq`, `/support/bao-cao-tin-sai`, `/support/lien-he`, `/support/chinh-sach-bao-mat`, `/support/dieu-khoan-su-dung`.
- `/explore/kinh-nghiem-thue-phong`, `/explore/meo-tranh-lua-dao`, `/explore/khu-vuc-pho-bien`, `/explore/cam-nang-sinh-vien-nguoi-di-lam`, `/explore/checklist-truoc-khi-thue`.
- `/login`, `/register`, `/forgot-password`.

Authenticated:

- `/profile` hồ sơ cá nhân, tách tab chỉnh sửa thông tin và cài đặt tài khoản.
- `/saved-rooms` phòng đã lưu.
- `/contact-history` lịch sử liên hệ.
- `/dang-tin` điều hướng/entry đăng tin.
- `/host/dashboard`, `/host/posts`, `/host/posts/create`, `/host/posts/[id]/edit`, `/host/customers`, `/host/profile`.

Admin:

- `/admin` tổng quan.
- `/admin/rooms`, `/admin/news`, `/admin/users`, `/admin/contact-requests`, `/admin/room-reports`, `/admin/support-tickets`.

CMS:

- `/cms`, `/cms/articles`, `/cms/articles/create`, `/cms/articles/[id]/edit`, `/cms/articles/[id]/preview`, `/cms/categories`, `/cms/media`, `/cms/settings`.

## 5. API backend quan trọng

Auth:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/verify-otp`
- `POST /api/v1/auth/resend-otp`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/google`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/resend-password-reset-otp`
- `POST /api/v1/auth/reset-password`

User/profile:

- `GET /api/v1/users/me`
- `PUT /api/v1/users/me`
- `PUT /api/v1/users/me/password`
- `PUT /api/v1/users/me/password/setup`

Rooms:

- `GET /api/v1/rooms`
- `GET /api/v1/rooms/featured`
- `GET /api/v1/rooms/stats`
- `GET /api/v1/rooms/{slug}`
- `GET /api/v1/districts`
- `GET /api/v1/amenities`

Host:

- `GET /api/v1/host/dashboard`
- CRUD `/api/v1/host/rooms`
- `GET /api/v1/host/contact-requests`
- `PATCH /api/v1/host/contact-requests/{requestId}/status`
- `GET/PUT /api/v1/host/profile`

Admin:

- `/api/v1/admin/dashboard`
- CRUD/status `/api/v1/admin/rooms`
- CRUD/status `/api/v1/admin/news`
- CRUD `/api/v1/admin/news-categories`
- `/api/v1/admin/users`
- `/api/v1/admin/contact-requests`
- `/api/v1/admin/room-reports`
- `/api/v1/admin/support-tickets`

News/support:

- `GET /api/v1/news`
- `GET /api/v1/news/{slug}`
- `GET /api/v1/news-categories`
- `POST /api/v1/support-tickets`
- `POST /api/v1/room-reports`
- `POST /api/v1/contact-requests`

Uploads:

- `POST /api/v1/uploads/rooms`
- `POST /api/v1/uploads/avatars`
- `POST /api/v1/uploads/news`

## 6. Auth hiện tại

Homi có 4 luồng auth chính:

1. Đăng ký email/password: backend tạo user local chưa xác minh, sinh OTP, hash OTP, gửi qua Gmail SMTP, user nhập OTP để kích hoạt.
2. Đăng nhập email/password: tài khoản local phải `emailVerified=true` và không bị khóa.
3. Đăng nhập Google: frontend lấy Google ID token, backend xác minh bằng `GOOGLE_CLIENT_ID`, tự tạo hoặc liên kết user theo email, `emailVerified=true`, `authProvider=GOOGLE`, role mặc định `USER`.
4. Quên mật khẩu: backend sinh OTP reset, gửi email, user xác minh và đặt lại mật khẩu.

Thông tin cần chú ý:

- Google login không cần OTP vì Google đã xác minh email ở phía Google.
- User Google mới tạo có thể chưa có password local. Khi vào hồ sơ sẽ thấy chức năng “Tạo mật khẩu cho tài khoản”.
- Sau khi tạo password, user Google có thể đăng nhập bằng cả Google và email/password.
- Không lưu OTP plain text; backend dùng hash OTP.

## 7. Role và quyền

Role chính:

- `USER`: người dùng thường, có thể tìm phòng, lưu phòng, gửi liên hệ và dùng khu host hiện tại.
- `ADMIN`: có quyền vào `/admin` và `/cms`, quản lý phòng, tin tức, người dùng, báo cáo, hỗ trợ.

Lưu ý quan trọng: hệ thống chưa tách role `HOST`. Khu chủ trọ hiện được dùng bởi user đã đăng nhập. Nếu muốn thêm role `HOST`, nên làm riêng một giai đoạn vì có thể ảnh hưởng đăng tin và quản lý host.

## 8. Database chính

Database mặc định: `rental_room_db`.

Bảng chính:

- `users`, `roles`, `user_roles`, `refresh_tokens`.
- `districts`, `amenities`.
- `rooms`, `room_images`, `room_amenities`.
- `saved_rooms`, `contact_requests`, `room_reports`, `notifications`.
- `support_tickets`.
- `news_categories`, `news_articles`.

Field quan trọng:

- `users.email_verified`, `users.auth_provider`, `users.google_id`, `users.password_configured`.
- `users.otp_hash`, `users.otp_expires_at`, `users.otp_attempts`, `users.otp_resend_count`.
- `users.password_reset_otp_hash`, `users.password_reset_otp_expires_at`.
- `rooms.room_type` với enum `APARTMENT`, `MINI_APARTMENT`, `PRIVATE_HOUSE`, `BOARDING_ROOM`.
- `news_articles.status` với trạng thái draft/published tùy enum backend.

## 9. Loại phòng

Frontend query:

- `/rooms`
- `/rooms?type=apartment`
- `/rooms?type=mini-apartment`
- `/rooms?type=private-house`
- `/rooms?type=boarding-room`

Backend enum:

- `APARTMENT`
- `MINI_APARTMENT`
- `PRIVATE_HOUSE`
- `BOARDING_ROOM`

Dữ liệu cũ không có loại phòng được mặc định là `BOARDING_ROOM`.

## 10. Frontend BFF

Next.js có các API route:

- `app/api/auth/*`: gọi backend auth và set/clear HttpOnly cookies.
- `app/api/proxy/[...path]`: proxy request cần auth từ frontend sang backend.
- `app/api/public/[...path]`: proxy request public sang backend.

Quy tắc: không lưu access token trong `localStorage`. Chỉ cache thông tin user để render nhanh nếu cần.

## 11. Cấu hình môi trường

Không hard-code secret trong code/docs. Dùng biến môi trường:

- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `APP_MAIL_ENABLED`, `APP_MAIL_FROM`
- `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`
- `OTP_EXPIRATION_MINUTES`, `OTP_MAX_ATTEMPTS`, `OTP_MAX_RESEND_COUNT`, `OTP_RESEND_COOLDOWN_SECONDS`
- `UPLOAD_DIRECTORY`

Gmail SMTP cần Google App Password, không phải mật khẩu Gmail thường.

## 12. Cách chạy thường dùng

Chạy bằng Docker với MySQL local 3306:

```powershell
docker compose up -d --build backend frontend
```

Chạy cả MySQL Docker nếu cần:

```powershell
docker compose --profile docker-db up -d --build
```

Backend test:

```powershell
cd backend
.\mvnw.cmd test
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
npm run lint
npm run build
```

## 13. Quy tắc khi sửa code

- Không đổi route/API/database nếu không cần thiết.
- Ưu tiên dùng constant có sẵn trong `frontend/constants/site.ts`.
- Không filter frontend khác với backend, nhất là `rooms.type`, giá, diện tích, tiện ích.
- Với auth, luôn kiểm tra `authProvider`, `emailVerified`, `passwordConfigured`, `status`.
- Với admin/CMS, chỉ admin được truy cập.
- Với upload ảnh ngoài domain, cần cấu hình `next.config.*` hoặc dùng ảnh local/proxy hợp lệ.
- Khi sửa UI, kiểm tra light mode/dark mode và mobile.
- Khi thêm migration, phải an toàn với dữ liệu cũ và có default hợp lý.
