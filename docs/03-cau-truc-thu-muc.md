# 03. Cấu trúc thư mục

## 1. Tổng quan thư mục gốc

```text
ChoThuePhongTroHomi/
├── backend/
├── database/
│   └── mysql/
├── docs/
├── frontend/
├── scripts/
├── docker-compose.yml
├── HUONG_DAN_CHAY_DOCKER_HOMI.md
├── HUONG_DAN_CHAY_WEBSITE_HOMI_DOMAIN.md
└── Bao_cao_review_do_an_Homi.md
```

Vai trò chính:

- `backend`: mã nguồn Spring Boot REST API.
- `frontend`: mã nguồn Next.js giao diện người dùng.
- `database/mysql`: schema, seed và migration SQL cho MySQL.
- `docs`: tài liệu dự án.
- `scripts`: script hỗ trợ vận hành.
- `docker-compose.yml`: cấu hình chạy toàn bộ hệ thống bằng Docker.

## 2. Cấu trúc backend

```text
backend/
├── pom.xml
├── Dockerfile
├── src/
│   ├── main/
│   │   ├── java/com/trotot/backend/
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── entity/
│   │   │   ├── exception/
│   │   │   ├── repository/
│   │   │   ├── security/
│   │   │   ├── service/
│   │   │   └── util/
│   │   └── resources/
│   │       ├── application.yml
│   │       └── application-prod.yml
│   └── test/
└── uploads/
```

### 2.1. `config`

Thư mục cấu hình hệ thống:

- `AppProperties.java`: ánh xạ cấu hình `app.*` như JWT, CORS, cookie, mail, OTP, Google, upload.
- `SecurityConfig.java`: cấu hình Spring Security, CORS, endpoint public/admin/authenticated.
- `WebConfig.java`: cấu hình web, static resource/uploads nếu có.
- `OpenApiConfig.java`: cấu hình Swagger/OpenAPI.
- `DistrictDataInitializer.java`: khởi tạo dữ liệu quận/huyện khi cần.

### 2.2. `controller`

Chứa REST controller, mỗi controller đại diện cho một nhóm API:

- `AuthController.java`: đăng ký, OTP, đăng nhập, Google login, refresh token, logout.
- `RoomController.java`: API công khai tìm kiếm, phòng nổi bật, thống kê, chi tiết phòng.
- `HostController.java`: dashboard host, bài đăng của tôi, khách liên hệ, hồ sơ host.
- `ContactRequestController.java`: tạo yêu cầu liên hệ và xem lịch sử của người dùng.
- `SavedRoomController.java`: lưu/bỏ lưu phòng, kiểm tra trạng thái lưu, danh sách phòng đã lưu.
- `RoomReportController.java`: người dùng gửi báo cáo tin đăng.
- `NotificationController.java`: thông báo cá nhân, unread count, đánh dấu đã đọc.
- `UploadController.java`: upload ảnh phòng và avatar.
- `UserController.java`: hồ sơ cá nhân, đổi mật khẩu.
- `AdminDashboardController.java`: dashboard admin.
- `AdminRoomController.java`: quản lý bài đăng toàn hệ thống.
- `AdminUserController.java`: quản lý người dùng.
- `AdminContactRequestController.java`: quản lý yêu cầu liên hệ.
- `AdminRoomReportController.java`: quản lý báo cáo tin đăng.
- `LookupController.java`: danh sách quận/huyện và tiện ích.

### 2.3. `dto`

Chứa request/response DTO theo từng nhóm nghiệp vụ:

- `dto/auth`: dữ liệu đăng ký, đăng nhập, OTP, Google login, auth response.
- `dto/room`: dữ liệu phòng, tạo/sửa phòng, ảnh phòng, thống kê, phòng đã lưu.
- `dto/contact`: yêu cầu liên hệ và phản hồi cho user/admin.
- `dto/host`: dashboard host, phòng của host, khách liên hệ, hồ sơ host.
- `dto/user`: hồ sơ người dùng, đổi mật khẩu, admin user response.
- `dto/report`: báo cáo tin đăng.
- `dto/notification`: thông báo.
- `dto/dashboard`: thống kê dashboard.
- `dto/lookup`: quận/huyện, tiện ích.
- `dto/upload`: kết quả upload ảnh.
- `dto/common`: error response, page response, message response.

### 2.4. `entity`

Chứa JPA entity ánh xạ database:

- `User`, `Role`, `RefreshToken`.
- `Room`, `RoomImage`, `District`, `Amenity`.
- `SavedRoom`, `ContactRequest`, `Notification`, `RoomReport`.

Các enum quan trọng:

- `RoleName`: `USER`, `ADMIN`.
- `UserStatus`: `ACTIVE`, `INACTIVE`, `LOCKED`.
- `RoomStatus`: `AVAILABLE`, `FULL`, `HIDDEN`.
- `ContactRequestType`: `CONTACT`, `VIEWING`.
- `ContactRequestStatus`: `PENDING`, `IN_PROGRESS`, `RESOLVED`, `CANCELLED`.
- `RoomReportReason`: `WRONG_INFO`, `DUPLICATE`, `SCAM`, `UNAVAILABLE`, `INAPPROPRIATE`, `OTHER`.
- `RoomReportStatus`: `NEW`, `REVIEWING`, `RESOLVED`, `DISMISSED`.
- `AuthProvider`: `LOCAL`, `GOOGLE`.

### 2.5. `repository`

Chứa Spring Data JPA repository:

- `RoomRepository`: truy vấn phòng, phòng nổi bật, thống kê, tìm chi tiết.
- `UserRepository`: tìm người dùng theo email/google id, tìm admin, tìm kiếm user.
- `ContactRequestRepository`: yêu cầu liên hệ của user/host/admin.
- `SavedRoomRepository`: phòng đã lưu.
- `RoomReportRepository`: báo cáo tin đăng.
- `NotificationRepository`: thông báo.
- `RoleRepository`, `RefreshTokenRepository`, `DistrictRepository`, `AmenityRepository`.

Thư mục `repository/specification` chứa các specification phục vụ tìm kiếm động:

- `RoomSpecifications.java`
- `ContactRequestSpecifications.java`
- `RoomReportSpecifications.java`

### 2.6. `security`

Chứa các thành phần bảo mật:

- `JwtAuthenticationFilter.java`: đọc token từ `Authorization` hoặc cookie, xác thực JWT.
- `JwtService.java`: sinh và kiểm tra JWT.
- `CustomUserDetailsService.java`: tải user theo email.
- `UserPrincipal.java`: đối tượng user cho Spring Security.
- `RateLimitFilter.java`: giới hạn request auth theo IP.
- `RestAuthenticationEntryPoint.java`: response khi chưa xác thực.
- `RestAccessDeniedHandler.java`: response khi không đủ quyền.
- `RequestLoggingFilter.java`: log request.

### 2.7. `service`

Chứa nghiệp vụ chính:

- `AuthService`: đăng ký, OTP, đăng nhập, Google login, refresh token, logout.
- `RoomService`: tìm kiếm, tạo/sửa/xóa/cập nhật phòng, mapping response.
- `HostService`: nghiệp vụ khu chủ trọ/người đăng tin.
- `ContactRequestService`: tạo và quản lý yêu cầu liên hệ.
- `SavedRoomService`: lưu/bỏ lưu phòng.
- `RoomReportService`: gửi và xử lý báo cáo tin.
- `NotificationService`: tạo và quản lý thông báo.
- `UserService`: hồ sơ người dùng, đổi mật khẩu, quản lý user.
- `AdminDashboardService`: thống kê dashboard admin.
- `FileStorageService`, `ImageProcessingService`: upload, nén ảnh, thumbnail.
- `EmailNotificationService`: gửi OTP và thông báo email nếu cấu hình.
- `GoogleIdentityService`: xác minh Google ID token.
- `RefreshTokenService`: tạo, rotate, revoke refresh token.
- `LookupService`: lookup quận/huyện và tiện ích.

### 2.8. `util`

Các tiện ích dùng chung:

- `CookieUtils.java`: thêm, xóa, đọc cookie auth/refresh token.
- `InputSanitizer.java`: chuẩn hóa input, bỏ HTML tag, trim dữ liệu.
- `SlugUtils.java`: sinh slug cho bài đăng.

## 3. Cấu trúc frontend

```text
frontend/
├── app/
├── components/
├── constants/
├── hooks/
├── lib/
├── public/
├── scripts/
├── services/
├── types/
├── package.json
├── next.config.ts
└── tsconfig.json
```

### 3.1. `app`

Thư mục route theo Next.js App Router:

- `app/page.tsx`: trang chủ.
- `app/rooms/page.tsx`: danh sách phòng.
- `app/rooms/[slug]/page.tsx`: chi tiết phòng.
- `app/login/page.tsx`: đăng nhập.
- `app/register/page.tsx`: đăng ký.
- `app/profile/page.tsx`: hồ sơ cá nhân.
- `app/saved-rooms/page.tsx`: phòng đã lưu.
- `app/contact-history/page.tsx`: lịch sử liên hệ.
- `app/host/*`: khu chủ trọ/người đăng tin.
- `app/admin/*`: khu admin.
- `app/api/auth/*`: route handler cho auth BFF.
- `app/api/proxy/[...path]/route.ts`: proxy request cần xác thực.
- `app/api/public/[...path]/route.ts`: proxy request public.

### 3.2. `components`

Tổ chức component theo miền chức năng:

- `components/admin`: dashboard admin, bảng admin, quản lý phòng, user, yêu cầu, báo cáo.
- `components/host`: dashboard host, bài đăng của tôi, khách liên hệ, form phòng, hồ sơ host.
- `components/rooms`: danh sách phòng, filter, card phòng, chi tiết phòng, lưu phòng, báo cáo tin.
- `components/forms`: form đăng nhập/đăng ký, contact form, profile, đổi mật khẩu, quản lý ảnh phòng.
- `components/auth`: guard đăng nhập và guest-only.
- `components/layout`: header, footer, notification bell, theme toggle.
- `components/providers`: auth provider, theme provider, app provider.
- `components/shared`: empty state, loading skeleton, pagination, section heading.
- `components/ui`: button, input, select, textarea, alert, badge, toast, confirm dialog.

### 3.3. `services`

Lớp service gọi API:

- `api-client.ts`: `apiRequest` cho public endpoint, `proxyRequest` cho authenticated endpoint.
- `auth-service.ts`: đăng nhập, đăng ký, OTP, Google login, logout, getMe.
- `room-service.ts`: tìm phòng, chi tiết, admin room.
- `host-service.ts`: dashboard host, phòng của host, khách liên hệ, hồ sơ host.
- `contact-request-service.ts`: yêu cầu liên hệ user/admin.
- `saved-room-service.ts`: phòng đã lưu.
- `room-report-service.ts`: báo cáo tin đăng.
- `notification-service.ts`: thông báo.
- `lookup-service.ts`: quận/huyện, tiện ích.
- `upload-service.ts`: upload ảnh.
- `user-service.ts`: hồ sơ, đổi mật khẩu, quản lý user.
- `admin-service.ts`: dashboard admin.

### 3.4. `hooks`

- `use-auth.ts`: wrapper truy cập AuthContext.
- `use-room-search.ts`: quản lý state tìm kiếm phòng, đồng bộ URL query, gọi API phòng.
- `use-delayed-presence.ts`: hỗ trợ animation mount/unmount.

### 3.5. `lib`

Các hàm tiện ích frontend:

- `server-auth.ts`: quản lý cookie auth phía server route handler.
- `backend-fetch.ts`: fetch backend có retry khi lỗi kết nối tạm thời.
- `auth-storage.ts`: cache user profile ở client.
- `format.ts`: format tiền, diện tích, ngày.
- `images.ts`: chuẩn hóa URL ảnh upload.
- `maps.ts`: tạo URL bản đồ.
- `export-csv.ts`: xuất CSV.
- `utils.ts`: tiện ích class name.

### 3.6. `types`

`types/index.ts` định nghĩa type TypeScript cho:

- Room, RoomSummary, RoomImage, Amenity, District.
- UserProfile, AdminUser.
- ContactRequest, HostContactRequest.
- RoomReport, Notification.
- DashboardSummary, DashboardCharts.
- PageResponse, ApiErrorResponse.

## 4. Cấu trúc database

```text
database/mysql/
├── 01_schema.sql
├── 02_seed.sql
├── 03_vietnamese_accents.sql
├── 04_host_upgrade.sql
├── 05_saved_rooms_notifications.sql
├── 06_room_reports.sql
├── 07_refresh_tokens.sql
├── 08_room_listing_metadata.sql
└── 09_auth_identity_verification.sql
```

Thư mục này chứa toàn bộ cấu trúc bảng và dữ liệu mẫu. Khi chạy Docker, MySQL đọc schema/seed từ thư mục này để tạo database ban đầu. Service `mysql-migrate` chạy các file nâng cấp từ `04` đến `09` cho database đã tồn tại.

## 5. Nhận xét cấu trúc

Cấu trúc dự án tương đối rõ ràng, tách theo tầng và theo miền nghiệp vụ. Backend theo mô hình controller-service-repository-entity. Frontend theo mô hình App Router kết hợp service layer và component theo domain. Đây là cách tổ chức phù hợp với báo cáo đồ án vì dễ trình bày kiến trúc, phân rã chức năng và luồng dữ liệu.

