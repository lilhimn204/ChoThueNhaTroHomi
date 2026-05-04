# 08. Phân Quyền Người Dùng

## 1. Cơ chế xác thực

Homi dùng JWT access token và refresh token. Backend Spring Security xác minh token và gắn thông tin user vào security context. Frontend Next.js lưu token trong HttpOnly cookie thông qua API route BFF.

Luồng chính:

```text
Frontend form
  -> Next.js API route /api/auth/*
  -> Backend /api/v1/auth/*
  -> Backend trả token
  -> Next.js set HttpOnly cookie
  -> Frontend gọi API cần auth qua /api/proxy/*
```

## 2. Role hiện tại

| Role | Mô tả |
|---|---|
| `USER` | Người dùng thường, có thể tìm phòng, lưu phòng, gửi liên hệ, dùng khu host hiện tại |
| `ADMIN` | Quản trị toàn hệ thống, truy cập admin và CMS |

Lưu ý: chưa có role `HOST`. Nếu cần phân biệt chủ trọ với người thuê, nên thêm trong một giai đoạn riêng vì sẽ ảnh hưởng route host, đăng tin, quyền xem khách liên hệ và dữ liệu phòng.

## 3. Trạng thái user

User có các yếu tố kiểm soát truy cập:

- `status`: hoạt động/khóa tùy enum backend.
- `emailVerified`: tài khoản local phải xác minh email trước khi đăng nhập.
- `authProvider`: `LOCAL` hoặc `GOOGLE`.
- `passwordConfigured`: cho biết user đã có password local hay chưa.
- `roles`: danh sách quyền.

## 4. Quy tắc đăng nhập

### Local

- Email phải tồn tại.
- Password đúng.
- User không bị khóa.
- `emailVerified=true`.
- `passwordConfigured=true`.

### Google

- Google ID token hợp lệ.
- Email Google hợp lệ.
- Nếu email chưa tồn tại thì tạo user mới.
- Nếu email đã tồn tại thì đăng nhập/liên kết theo email.
- Google user được xem là đã xác minh email.

### User Google chưa có password

- Không hiển thị đổi mật khẩu truyền thống.
- Hiển thị “Tạo mật khẩu cho tài khoản”.
- Sau khi tạo password, `passwordConfigured=true`.

## 5. Quyền theo nhóm route

| Route | Quyền |
|---|---|
| `/`, `/rooms`, `/rooms/[slug]`, `/news`, `/support/*`, `/explore/*` | Public |
| `/login`, `/register`, `/forgot-password` | Public, nên redirect nếu đã đăng nhập |
| `/profile`, `/saved-rooms`, `/contact-history` | User đã đăng nhập |
| `/host/*` | User đã đăng nhập |
| `/admin/*` | `ADMIN` |
| `/cms/*` | `ADMIN` |

## 6. Quyền theo API

Public:

- `GET /api/v1/rooms`
- `GET /api/v1/rooms/{slug}`
- `GET /api/v1/news`
- `GET /api/v1/news/{slug}`
- `GET /api/v1/districts`
- `GET /api/v1/amenities`
- Các endpoint auth public như login/register/forgot-password.

Authenticated:

- `/api/v1/users/me`
- `/api/v1/saved-rooms`
- `/api/v1/contact-requests/me`
- `/api/v1/host/*`
- Notifications.

Admin:

- `/api/v1/admin/*`

## 7. Admin quản lý người dùng

Admin có thể:

- Xem danh sách user.
- Tìm kiếm user.
- Lọc trạng thái.
- Khóa/mở khóa user.
- Xem chi tiết user.
- Cập nhật role.
- Xác minh email thủ công.

Các thao tác nên có bảo vệ:

- Không để admin tự khóa chính mình.
- Không xóa/giảm quyền admin cuối cùng nếu chưa có cơ chế khôi phục.
- Log rõ lỗi nghiệp vụ cho frontend hiển thị.

## 8. Bảo mật OTP và email

- OTP phải được hash trước khi lưu.
- OTP có thời hạn.
- Có giới hạn số lần nhập sai.
- Có giới hạn số lần gửi lại và cooldown.
- Không log OTP, app password, JWT secret.
- Gmail SMTP dùng Google App Password.

## 9. Bảo mật frontend

- Không lưu token trong localStorage.
- Không hiển thị thông tin nhạy cảm ở console.
- Các form phải có loading, success, error state.
- Google Client ID public được phép nằm ở frontend, nhưng server vẫn phải xác minh token bằng backend.

## 10. Gợi ý nâng cấp phân quyền sau này

Nếu muốn hệ thống chặt hơn, có thể thêm:

- Role `HOST` cho chủ trọ.
- Bảng request nâng cấp tài khoản lên host.
- Audit log cho thao tác admin.
- Permission chi tiết thay vì chỉ role.
- Rate limit cho login, OTP, support form.
