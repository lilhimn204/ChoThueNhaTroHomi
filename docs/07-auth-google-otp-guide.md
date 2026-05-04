# Auth Google, OTP Và Reset Password Guide

## 1. Biến môi trường

Backend:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
APP_MAIL_ENABLED=true
APP_MAIL_FROM=Homi <your-email@gmail.com>
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-google-app-password
MAIL_SMTP_AUTH=true
MAIL_SMTP_STARTTLS=true
OTP_EXPIRATION_MINUTES=10
OTP_MAX_ATTEMPTS=5
OTP_MAX_RESEND_COUNT=3
OTP_RESEND_COOLDOWN_SECONDS=60
```

Frontend:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

Không commit giá trị secret thật.

## 2. Đăng ký local bằng OTP

Endpoint:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/verify-otp`
- `POST /api/v1/auth/resend-otp`

Luồng:

1. User đăng ký bằng email/password.
2. Backend tạo OTP và lưu hash.
3. Backend gửi OTP qua Gmail SMTP.
4. User nhập OTP.
5. Backend xác minh và kích hoạt tài khoản.

## 3. Đăng nhập Google

Endpoint:

- `POST /api/v1/auth/google`

Luồng:

1. Frontend hiển thị nút Google.
2. Google trả ID token.
3. Frontend gửi ID token cho backend.
4. Backend xác minh token với `GOOGLE_CLIENT_ID`.
5. Backend tạo hoặc liên kết user.
6. Backend cấp JWT.

Google login không cần OTP vì email đã được Google xác minh.

## 4. Quên mật khẩu

Endpoint:

- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/resend-password-reset-otp`
- `POST /api/v1/auth/reset-password`

Luồng:

1. User nhập email.
2. Backend gửi OTP reset password.
3. User nhập OTP và mật khẩu mới.
4. Backend đổi password hash và đặt `passwordConfigured=true`.

## 5. User Google tạo password local

Endpoint:

- `PUT /api/v1/users/me/password/setup`

Điều kiện:

- User đã đăng nhập.
- `authProvider=GOOGLE`.
- `passwordConfigured=false`.

Sau khi setup thành công, user có thể đăng nhập bằng Google hoặc email/password.

## 6. Lỗi thường gặp

### Không gửi được OTP

Kiểm tra:

- `APP_MAIL_ENABLED=true`.
- `MAIL_USERNAME` đúng email gửi.
- `MAIL_PASSWORD` là Google App Password.
- Gmail đã bật 2-Step Verification để tạo App Password.
- Backend container đã nhận biến môi trường mới, cần recreate nếu đổi `.env`.

### Google login báo chưa cấu hình

Kiểm tra:

- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` ở frontend.
- `GOOGLE_CLIENT_ID` ở backend.
- Rebuild frontend nếu biến môi trường được inject lúc build Docker.

### Invalid Google token

Kiểm tra:

- Client ID frontend và backend phải cùng OAuth client.
- Domain hiện tại phải được thêm vào Google Cloud Console.

## 7. Quy tắc bảo mật

- Không lưu OTP plain text.
- Không log OTP/password/token.
- Không lưu JWT trong localStorage.
- Không dùng mật khẩu Gmail thật cho SMTP.
- Token Google phải được backend xác minh, không tin dữ liệu client tự gửi.
