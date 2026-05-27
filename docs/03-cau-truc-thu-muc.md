# 03. Cấu Trúc Thư Mục

## 1. Cấu trúc gốc

```text
ChoThuePhongTroHomi/
├── backend/
├── database/
│   └── mysql/
├── docs/
├── frontend/
├── docker-compose.yml
├── .env
└── README / cấu hình khác
```

## 2. Mã nguồn backend

```text
backend/
├── src/main/java/com/trotot/backend/
│   ├── config/
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── exception/
│   ├── repository/
│   ├── security/
│   ├── service/
│   ├── util/
│   └── BackendApplication.java
├── src/main/resources/
├── src/test/
├── pom.xml
└── mvnw.cmd
```

### Controller chính

- `AuthController`: đăng ký, OTP, Google login, login, refresh, logout, quên mật khẩu.
- `UserController`: hồ sơ, đổi mật khẩu, tạo mật khẩu cho user Google.
- `RoomController`: public room listing/detail/featured/stats.
- `HostController`: khu chủ trọ.
- `AdminRoomController`, `AdminUserController`, `AdminNewsArticleController`, `AdminNewsCategoryController`: admin.
- `NewsArticleController`, `NewsCategoryController`: tin tức public.
- `SupportTicketController`, `RoomReportController`, `ContactRequestController`: form hỗ trợ, báo cáo, liên hệ.
- `UploadController`: upload ảnh phòng, avatar, news.

### Entity chính

- Auth/user: `User`, `Role`, `RefreshToken`, `AuthProvider`, `UserStatus`.
- Room: `Room`, `RoomImage`, `Amenity`, `District`, `RoomType`, `RoomStatus`.
- Interaction: `SavedRoom`, `ContactRequest`, `RoomReport`, `Notification`.
- Support/news: `SupportTicket`, `NewsArticle`, `NewsCategory`.

### Service chính

- `AuthService`, `GoogleIdentityService`, `EmailNotificationService`.
- `UserService`, `RefreshTokenService`.
- `RoomService`, `HostService`, `SavedRoomService`, `ContactRequestService`, `RoomReportService`.
- `NewsArticleService`, `NewsCategoryService`.
- `SupportTicketService`, `NotificationService`, `FileStorageService`, `ImageProcessingService`.

## 3. Mã nguồn frontend

```text
frontend/
├── app/
│   ├── api/
│   ├── admin/
│   ├── cms/
│   ├── explore/
│   ├── host/
│   ├── news/
│   ├── rooms/
│   ├── support/
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   ├── profile/
│   ├── saved-rooms/
│   └── contact-history/
├── components/
├── constants/
├── hooks/
├── lib/
├── public/
├── scripts/
├── types/
├── package.json
└── next.config.*
```

### Nhóm tuyến trang frontend

Công khai:

- `/`, `/rooms`, `/rooms/[slug]`, `/news`, `/news/[slug]`.
- `/support/*`, `/explore/*`.
- `/login`, `/register`, `/forgot-password`.

User:

- `/profile`, `/saved-rooms`, `/contact-history`.

Khu chủ trọ:

- `/host/dashboard`, `/host/posts`, `/host/posts/create`, `/host/posts/[id]/edit`, `/host/customers`, `/host/profile`.

Quản trị:

- `/admin`, `/admin/rooms`, `/admin/news`, `/admin/users`, `/admin/contact-requests`, `/admin/room-reports`, `/admin/support-tickets`.

CMS:

- `/cms`, `/cms/articles`, `/cms/articles/create`, `/cms/articles/[id]/edit`, `/cms/articles/[id]/preview`, `/cms/categories`, `/cms/media`, `/cms/settings`.

## 4. API route phía frontend

```text
frontend/app/api/
├── auth/
│   ├── login/
│   ├── register/
│   ├── google/
│   ├── verify-otp/
│   ├── resend-otp/
│   ├── forgot-password/
│   ├── reset-password/
│   ├── resend-password-reset-otp/
│   ├── me/
│   └── logout/
├── proxy/[...path]/
└── public/[...path]/
```

Các route này giúp frontend quản lý cookie bảo mật và tránh lộ token ở client.

## 5. Cơ sở dữ liệu

```text
database/mysql/
├── 01_schema.sql
├── 02_seed.sql
├── 03_vietnamese_accents.sql
├── 04_host_upgrade.sql
├── ...
└── 20_user_password_configured.sql
```

Khi thêm field mới, nên tạo migration mới thay vì sửa dữ liệu thủ công, trừ khi đang cập nhật lại schema tổng hợp có chủ đích.

## 6. Tài liệu

```text
docs/
├── README.md
├── 00-ai-context-homi.md
├── 01-tong-quan-du-an.md
├── ...
└── huong-dan-don-file-nang-va-cai-lai.md
```

`00-ai-context-homi.md` là file nên đưa cho AI đọc trước khi yêu cầu sửa tính năng.
