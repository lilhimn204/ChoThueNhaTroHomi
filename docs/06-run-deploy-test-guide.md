# Run, Deploy And Test Guide

## 1. Yêu cầu môi trường

- Java JDK 21.
- Node.js 20+.
- MySQL Server 8.x.
- Docker Desktop nếu chạy bằng Docker.
- PowerShell trên Windows.

## 2. Database local

Database mặc định:

- Host: `localhost`
- Port: `3306`
- Database: `rental_room_db`
- User: `root`

Backend Docker hiện mặc định trỏ tới MySQL local bằng:

```env
DB_URL=jdbc:mysql://host.docker.internal:3306/rental_room_db?useSSL=false&serverTimezone=Asia/Bangkok&allowPublicKeyRetrieval=true
```

## 3. Chạy bằng Docker

Chạy frontend/backend, dùng MySQL local:

```powershell
docker compose up -d --build backend frontend
```

Chạy cả MySQL Docker:

```powershell
docker compose --profile docker-db up -d --build
```

Xem log:

```powershell
docker compose logs -f backend
docker compose logs -f frontend
```

## 4. Chạy frontend local

```powershell
cd frontend
npm install
npm run dev
```

URL: `http://localhost:3000`.

## 5. Chạy backend local

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

URL API: `http://localhost:8080`.

## 6. Test và build

Backend:

```powershell
cd backend
.\mvnw.cmd test
```

Frontend:

```powershell
cd frontend
npm run lint
npm run build
npm run test
```

Smoke routes:

```powershell
cd frontend
npm run test:smoke
```

## 7. Cấu hình Google login

Cần có:

- `GOOGLE_CLIENT_ID` cho backend.
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` cho frontend.

Google login local cần domain origin hợp lệ trong Google Cloud Console, ví dụ `http://localhost:3000`.

## 8. Cấu hình Gmail SMTP

Cần bật:

```env
APP_MAIL_ENABLED=true
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=...
MAIL_PASSWORD=...
MAIL_SMTP_AUTH=true
MAIL_SMTP_STARTTLS=true
APP_MAIL_FROM=...
```

`MAIL_PASSWORD` phải là Google App Password, không phải mật khẩu Gmail thường.

## 9. Deploy không dùng tunnel

Hướng production nên dùng:

- VPS chạy Docker Compose + Nginx/Caddy reverse proxy + domain thật.
- Hoặc frontend trên Vercel, backend/database trên VPS/cloud.

Khi deploy cần:

- HTTPS.
- Secret mạnh cho `JWT_SECRET`.
- Database backup.
- CORS đúng domain.
- `COOKIE_SECURE=true`.
- Google OAuth origin/domain production.
- SMTP production.

## 10. Checklist kiểm thử chính

- Đăng ký local và xác minh OTP.
- OTP sai/hết hạn/gửi lại.
- Đăng nhập local.
- Đăng nhập Google email mới.
- Đăng nhập Google email đã tồn tại.
- Quên mật khẩu.
- User Google tạo password.
- Lọc phòng theo loại phòng, giá, diện tích, tiện ích.
- Tạo/sửa/xóa phòng host.
- Lưu phòng và lịch sử liên hệ.
- Admin khóa/mở user, phân quyền, xác minh email.
- Admin/CMS quản lý tin tức.
