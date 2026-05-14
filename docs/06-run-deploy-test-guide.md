# Run, Deploy And Test Guide

<<<<<<< ours
<<<<<<< ours
## 1. Yêu cầu môi trường

- Java JDK 21.
- Node.js 20+.
- MySQL Server 8.x.
- Docker Desktop nếu chạy bằng Docker.
- PowerShell trên Windows.

## 2. Database local

Database mặc định:
=======
=======
>>>>>>> theirs
## 1. Yeu cau moi truong

- Java JDK 21.
- Node.js 20+.
- MySQL Server 8.x neu dung MySQL local.
- Docker Desktop neu chay bang Docker.
- Cloudflare Tunnel CLI `cloudflared` neu demo qua domain public.
- PowerShell tren Windows.

## 2. Database local

Database mac dinh:
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs

- Host: `localhost`
- Port: `3306`
- Database: `rental_room_db`
- User: `root`

<<<<<<< ours
<<<<<<< ours
Backend Docker hiện mặc định trỏ tới MySQL local bằng:
=======
Backend Docker mac dinh tro toi MySQL local bang:
>>>>>>> theirs
=======
Backend Docker mac dinh tro toi MySQL local bang:
>>>>>>> theirs

```env
DB_URL=jdbc:mysql://host.docker.internal:3306/rental_room_db?useSSL=false&serverTimezone=Asia/Bangkok&allowPublicKeyRetrieval=true
```

<<<<<<< ours
<<<<<<< ours
## 3. Chạy bằng Docker

Chạy frontend/backend, dùng MySQL local:

```powershell
docker compose up -d --build backend frontend
```

Chạy cả MySQL Docker:

```powershell
docker compose --profile docker-db up -d --build
=======
=======
>>>>>>> theirs
## 3. Chay bang Docker Compose

Mo Docker Desktop, sau do mo PowerShell tai thu muc goc du an va chay:

```powershell
docker compose up --build
```

Giu cua so PowerShell nay mo trong suot qua trinh demo.

Neu muon chay ca MySQL Docker:

```powershell
docker compose --profile docker-db up --build
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
```

Xem log:

```powershell
docker compose logs -f backend
docker compose logs -f frontend
```

<<<<<<< ours
<<<<<<< ours
## 4. Chạy frontend local
=======
=======
>>>>>>> theirs
## 4. Kiem tra website local

Sau khi Docker Compose khoi dong thanh cong:

| Thanh phan | URL mac dinh |
| --- | --- |
| Frontend | `http://localhost:3000` |
| Backend | `http://localhost:8080` |
| Swagger UI | `http://localhost:8080/swagger-ui.html` |

## 5. Chay Cloudflare Tunnel cho domain demo

Sau khi frontend local mo duoc o `http://localhost:3000`, mo them mot cua so PowerShell thu hai va chay:

```powershell
cloudflared tunnel run homi
```

Giu cua so PowerShell nay mo trong suot qua trinh demo. Khi tunnel chay dung, website public truy cap tai:

```text
https://thuenhahomi.id.vn
```

Thu tu demo bat buoc:

```text
1. Mo Docker Desktop.
2. Chay docker compose up --build.
3. Chay cloudflared tunnel run homi.
4. Mo https://thuenhahomi.id.vn.
```

Neu khong chay Cloudflare Tunnel, website chi truy cap duoc qua `http://localhost:3000` tren may local.

## 6. Chay frontend local khong Docker
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs

```powershell
cd frontend
npm install
npm run dev
```

URL: `http://localhost:3000`.

<<<<<<< ours
<<<<<<< ours
## 5. Chạy backend local
=======
## 7. Chay backend local khong Docker
>>>>>>> theirs
=======
## 7. Chay backend local khong Docker
>>>>>>> theirs

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

URL API: `http://localhost:8080`.

<<<<<<< ours
<<<<<<< ours
## 6. Test và build
=======
## 8. Test va build
>>>>>>> theirs
=======
## 8. Test va build
>>>>>>> theirs

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

<<<<<<< ours
<<<<<<< ours
## 7. Cấu hình Google login

Cần có:

- `GOOGLE_CLIENT_ID` cho backend.
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` cho frontend.

Google login local cần domain origin hợp lệ trong Google Cloud Console, ví dụ `http://localhost:3000`.

## 8. Cấu hình Gmail SMTP

Cần bật:
=======
=======
>>>>>>> theirs
## 9. Cau hinh Google login

Can co:

- `GOOGLE_CLIENT_ID` cho backend.
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` cho frontend neu frontend can render Google button theo env rieng.

Google login local can domain origin hop le trong Google Cloud Console, vi du:

- `http://localhost:3000`
- `https://thuenhahomi.id.vn`

## 10. Cau hinh Gmail SMTP

Can bat:
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs

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

<<<<<<< ours
<<<<<<< ours
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
=======
=======
>>>>>>> theirs
`MAIL_PASSWORD` phai la Google App Password, khong phai mat khau Gmail thuong.

## 11. Deploy khong dung tunnel

Huong production nen dung:

- VPS chay Docker Compose + Nginx/Caddy reverse proxy + domain that.
- Hoac frontend tren Vercel, backend/database tren VPS/cloud.

Khi deploy can:

- HTTPS.
- Secret manh cho `JWT_SECRET`.
- Database backup.
- CORS dung domain.
- `COOKIE_SECURE=true`.
- `AUTH_COOKIE_SECURE=true` khi chay HTTPS production.
- Google OAuth origin/domain production.
- SMTP production.

## 12. Checklist kiem thu chinh

- Dang ky local va xac minh OTP.
- OTP sai/het han/gui lai.
- Dang nhap local.
- Dang nhap Google email moi.
- Dang nhap Google email da ton tai.
- Quen mat khau.
- User Google tao password.
- Loc phong theo loai phong, gia, dien tich, tien ich.
- Tao/sua/xoa phong host.
- Luu phong va lich su lien he.
- Admin khoa/mo user, phan quyen, xac minh email.
- Admin/CMS quan ly tin tuc.
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
