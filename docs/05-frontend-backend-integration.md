# Frontend Backend Integration

Homi dùng Next.js API route làm BFF để frontend giao tiếp backend an toàn hơn, đặc biệt với auth.

## 1. Mô hình tích hợp

```text
React component
  -> frontend/lib API client
  -> Next.js API route
  -> Spring Boot REST API
  -> MySQL
```

Không phải request nào cũng cần đi qua BFF. Endpoint public có thể đi qua public proxy/API client. Endpoint cần auth nên đi qua `app/api/proxy/[...path]`.

## 2. Auth BFF

Các route:

- `app/api/auth/login`
- `app/api/auth/register`
- `app/api/auth/google`
- `app/api/auth/verify-otp`
- `app/api/auth/resend-otp`
- `app/api/auth/forgot-password`
- `app/api/auth/reset-password`
- `app/api/auth/resend-password-reset-otp`
- `app/api/auth/me`
- `app/api/auth/logout`

Nhiệm vụ:

- Gọi backend auth endpoint.
- Set hoặc clear HttpOnly cookie.
- Trả response sạch cho frontend.

## 3. Proxy cần auth

Route:

- `app/api/proxy/[...path]`

Nhiệm vụ:

- Đọc access token từ cookie.
- Gắn header Authorization khi gọi backend.
- Có thể phối hợp refresh token nếu hết hạn tùy logic hiện tại.

## 4. Public proxy

Route:

- `app/api/public/[...path]`

Dùng cho danh sách phòng, tin tức, lookup hoặc endpoint không cần đăng nhập.

## 5. Lưu ý khi thêm API mới

- Nếu endpoint cần đăng nhập, gọi qua `/api/proxy`.
- Nếu endpoint public, gọi qua `/api/public` hoặc API URL public theo pattern hiện có.
- Không đưa JWT vào localStorage.
- Không log request chứa OTP/password/token.
- Đồng bộ DTO frontend type với backend response.

## 6. Các nhóm tích hợp đã có

- Auth local/Google/OTP/reset password.
- Profile và password setup.
- Rooms listing/detail/filter.
- Saved rooms.
- Contact requests.
- Host room CRUD.
- Admin CRUD.
- News/CMS.
- Support tickets và room reports.
- Upload ảnh.
