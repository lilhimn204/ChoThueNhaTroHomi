# 02. Công nghệ sử dụng

## 1. Tổng quan stack công nghệ

Dự án Homi sử dụng kiến trúc full-stack tách frontend, backend và database. Frontend được xây dựng bằng Next.js và React. Backend được xây dựng bằng Spring Boot. Dữ liệu được lưu trong MySQL. Môi trường chạy có thể được dựng bằng Docker Compose.

## 2. Frontend

Frontend nằm trong thư mục `frontend`.

| Công nghệ | Phiên bản/Thư viện | Vai trò |
|---|---|---|
| Next.js | 16.2.4 | Framework React, App Router, route handler, metadata, sitemap, proxy API |
| React | 19.2.4 | Xây dựng giao diện người dùng theo component |
| TypeScript | ^5 | Kiểm tra kiểu dữ liệu, định nghĩa interface cho API response |
| Tailwind CSS | ^4 | Xây dựng giao diện và hệ thống style utility |
| lucide-react | ^1.8.0 | Icon cho giao diện |
| maplibre-gl | ^5.24.0 | Thư viện bản đồ, hỗ trợ liên kết/xử lý vị trí |
| recharts | ^3.8.1 | Biểu đồ trong dashboard admin |
| clsx, tailwind-merge | clsx ^2.1.1, tailwind-merge ^3.5.0 | Hỗ trợ ghép class CSS |
| Vitest | ^4.1.5 | Unit test cho một số hàm frontend |
| ESLint | ^9 | Kiểm tra chất lượng code frontend |

### 2.1. Vai trò frontend

Frontend đảm nhiệm:

- Hiển thị trang chủ, danh sách phòng, chi tiết phòng.
- Cung cấp form đăng ký, đăng nhập, xác minh OTP, đăng nhập Google.
- Quản lý trạng thái phiên đăng nhập phía client thông qua `AuthProvider`.
- Gọi API backend thông qua service layer.
- Bảo vệ route ở frontend bằng `RequireAuth`.
- Cung cấp khu host và admin với các màn hình dashboard, bảng dữ liệu, form xử lý.
- Tạo proxy BFF cho request cần xác thực.

### 2.2. Next.js route handler

Frontend có các route handler trong `frontend/app/api`:

- `api/auth/*`: gọi backend auth, nhận token và lưu vào HttpOnly cookie.
- `api/proxy/[...path]`: proxy request cần xác thực sang backend, tự gắn `Authorization`.
- `api/public/[...path]`: proxy request công khai sang backend.

Cách tổ chức này giúp token không cần lưu trực tiếp trong JavaScript client, giảm rủi ro bị đọc token qua XSS.

## 3. Backend

Backend nằm trong thư mục `backend`.

| Công nghệ | Phiên bản/Thư viện | Vai trò |
|---|---|---|
| Java | 21 | Ngôn ngữ lập trình backend |
| Spring Boot | 3.5.7 | Framework xây dựng REST API |
| Spring Web | starter-web | Controller REST, request/response HTTP |
| Spring Data JPA | starter-data-jpa | ORM, repository, specification |
| Spring Security | starter-security | Xác thực, phân quyền, security filter |
| Spring Validation | starter-validation | Validate DTO request |
| Spring Cache | starter-cache | Cache dữ liệu lookup như quận, tiện ích |
| Spring Mail | starter-mail | Gửi OTP và thông báo email nếu cấu hình |
| SpringDoc OpenAPI | 2.8.17 | Sinh tài liệu Swagger/OpenAPI |
| MySQL Connector/J | runtime | Kết nối MySQL |
| Lombok | optional | Giảm boilerplate getter/setter |
| JJWT | 0.12.7 | Sinh và kiểm tra JWT |
| TwelveMonkeys ImageIO WebP | 3.13.1 | Hỗ trợ xử lý ảnh WebP |
| H2 | test scope | Database cho test |

### 3.1. Vai trò backend

Backend đảm nhiệm:

- Cung cấp REST API `/api/v1`.
- Xử lý đăng ký, OTP, đăng nhập, Google login, refresh token và logout.
- Xử lý tìm kiếm, lọc, chi tiết phòng.
- Xử lý bài đăng của host/admin.
- Xử lý yêu cầu liên hệ, phòng đã lưu, báo cáo tin đăng, thông báo.
- Kiểm soát phân quyền admin và kiểm soát quyền sở hữu bài đăng của host.
- Validate dữ liệu đầu vào và chuẩn hóa dữ liệu trước khi lưu.
- Lưu file ảnh upload, nén ảnh và tạo thumbnail.

## 4. Database

Database chính là MySQL 8.4, tên database mặc định `rental_room_db`.

Các nhóm bảng chính:

- Người dùng và phân quyền: `users`, `roles`, `user_roles`.
- Phòng trọ: `rooms`, `room_images`, `room_amenities`, `districts`, `amenities`.
- Tương tác người thuê: `saved_rooms`, `contact_requests`.
- Quản trị và kiểm duyệt: `room_reports`, `notifications`.
- Phiên đăng nhập: `refresh_tokens`.

Thư mục SQL:

- `database/mysql/01_schema.sql`: schema chính.
- `database/mysql/02_seed.sql`: dữ liệu mẫu.
- `database/mysql/03_vietnamese_accents.sql`: cập nhật dữ liệu tiếng Việt.
- `database/mysql/04_host_upgrade.sql`: nâng cấp dữ liệu hỗ trợ khu host.
- `database/mysql/05_saved_rooms_notifications.sql`: thêm phòng đã lưu và thông báo.
- `database/mysql/06_room_reports.sql`: thêm báo cáo tin đăng.
- `database/mysql/07_refresh_tokens.sql`: thêm refresh token.
- `database/mysql/08_room_listing_metadata.sql`: thêm mã tin.
- `database/mysql/09_auth_identity_verification.sql`: thêm OTP, Google identity.

## 5. Xác thực và bảo mật

### 5.1. JWT và refresh token

Backend dùng JWT access token và refresh token:

- Access token chứa email, user id, tên và danh sách role.
- Refresh token là token opaque, backend chỉ lưu hash SHA-256 trong bảng `refresh_tokens`.
- Khi refresh, backend rotate refresh token cũ và phát token mới.
- Khi logout, refresh token bị revoke.

### 5.2. Cookie HttpOnly

Frontend BFF lưu token trong cookie:

- `homi_token`: access token.
- `homi_refresh_token`: refresh token.

Cookie được đặt `HttpOnly`, `SameSite=Lax`, `path=/`. Ở production, cookie được đặt `secure` theo cấu hình.

### 5.3. Phân quyền

Backend cấu hình:

- Public: `GET /api/v1/rooms/**`, `GET /api/v1/amenities`, `GET /api/v1/districts`, Swagger, uploads.
- Auth public: `POST /api/v1/auth/**`.
- Admin: `/api/v1/admin/**` yêu cầu `ROLE_ADMIN`.
- Các endpoint còn lại yêu cầu đăng nhập.

Khu host hiện chưa có role `HOST` riêng. Quyền host dựa trên đăng nhập và kiểm tra quyền sở hữu bài đăng bằng `created_by`.

### 5.4. Bảo vệ endpoint đăng nhập

Backend có `RateLimitFilter` áp dụng cho `POST /api/v1/auth/**`, giới hạn 10 request trong 60 giây theo IP. Đây là cơ chế giảm rủi ro brute force cho đăng nhập/đăng ký/OTP.

## 6. Upload và xử lý ảnh

Backend hỗ trợ upload:

- `POST /api/v1/uploads/rooms`
- `POST /api/v1/uploads/avatars`

File ảnh được validate loại MIME (`image/jpeg`, `image/png`, `image/webp`) và dung lượng tối đa mặc định 5MB. Service xử lý ảnh nén về JPEG, giới hạn kích thước tối đa, đồng thời tạo thumbnail cho ảnh phòng.

## 7. Docker và triển khai

File `docker-compose.yml` định nghĩa:

- `mysql`: MySQL 8.4.
- `mysql-migrate`: chạy migration SQL bổ sung.
- `backend`: build từ `backend/Dockerfile`.
- `frontend`: build từ `frontend/Dockerfile`.

Các biến môi trường quan trọng:

- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`.
- `JWT_SECRET`, `JWT_EXPIRATION_MINUTES`, `JWT_REFRESH_EXPIRATION_MINUTES`.
- `CORS_ALLOWED_ORIGINS`.
- `GOOGLE_CLIENT_ID`.
- `APP_MAIL_ENABLED`, `MAIL_HOST`, `MAIL_USERNAME`, `MAIL_PASSWORD`.
- `BACKEND_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`.

## 8. Kiểm thử

Backend có test trong `backend/src/test`, gồm:

- Test controller auth và OpenAPI.
- Test service auth, room, contact request, refresh token, user.
- Test util cookie, sanitizer, slug.

Frontend có test trong:

- `frontend/lib/__tests__`
- `frontend/services/__tests__`

Ngoài ra có script smoke route `frontend/scripts/smoke-routes.mjs`.

## 9. Nhận xét

Stack công nghệ phù hợp với đồ án tốt nghiệp ngành CNTT vì thể hiện đủ các thành phần: frontend hiện đại, backend REST API, cơ sở dữ liệu quan hệ, xác thực bảo mật, upload file, Docker, test và tài liệu API.

Một số phần triển khai vận hành thực tế như CI/CD, logging tập trung, monitoring production và backup database chưa đủ thông tin để đánh giá.

