# Buoc 6 - Huong dan chay local, cau hinh va deploy

## 1. Yeu cau moi truong
- Java JDK 21.
- MySQL Server 8.x.
- Node.js 20+.
- Backend dung Maven Wrapper nen khong bat buoc cai Maven global.
- MySQL root local trong may hien tai: `123456`.

## 2. Chuan bi database local
Mo terminal tai thu muc goc project:

```powershell
cd "C:\Users\Minh\Documents\ChoThuePhongTroHomi"
```

Tao database va import du lieu mau:

```powershell
Get-Content -Raw database\mysql\01_schema.sql | mysql -uroot -p123456
Get-Content -Raw database\mysql\02_seed.sql | mysql -uroot -p123456
```

Neu database da duoc tao truoc khi co khu host, phong da luu hoac thong bao, chay them cac file nang cap mot lan:

```powershell
Get-Content -Raw database\mysql\04_host_upgrade.sql | mysql -uroot -p123456
Get-Content -Raw database\mysql\05_saved_rooms_notifications.sql | mysql -uroot -p123456
Get-Content -Raw database\mysql\06_room_reports.sql | mysql -uroot -p123456
Get-Content -Raw database\mysql\07_refresh_tokens.sql | mysql -uroot -p123456
```

Kiem tra nhanh:

```powershell
mysql -uroot -p123456 -e "USE rental_room_db; SHOW TABLES; SELECT COUNT(*) AS rooms FROM rooms; SELECT COUNT(*) AS users FROM users; SELECT COUNT(*) AS saved_rooms FROM saved_rooms; SELECT COUNT(*) AS notifications FROM notifications; SELECT COUNT(*) AS room_reports FROM room_reports; SELECT COUNT(*) AS refresh_tokens FROM refresh_tokens;"
```

Tai khoan demo:
- Admin: `admin@homi.vn` / `admin123`
- User: `an.nguyen@example.com` / `123456`
- User: `binh.tran@example.com` / `123456`

## 3. Chay backend Spring Boot
Backend da co cau hinh mac dinh dung MySQL local:

```powershell
cd "C:\Users\Minh\Documents\ChoThuePhongTroHomi\backend"
.\mvnw.cmd spring-boot:run
```

Backend mac dinh chay tai:

```text
http://localhost:8080
```

API base URL:

```text
http://localhost:8080/api/v1
```

Kiem tra backend:

```powershell
Invoke-RestMethod http://localhost:8080/api/v1/rooms/featured
Invoke-RestMethod http://localhost:8080/api/v1/districts
```

Tai lieu API tu dong:

```text
http://localhost:8080/swagger-ui.html
http://localhost:8080/v3/api-docs
```

Khi demo Swagger UI, co the goi `POST /api/v1/auth/login` truoc de backend set HttpOnly cookie `homi_token`, sau do thu cac API can dang nhap tren cung backend origin.

Neu muon override cau hinh trong PowerShell:

```powershell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="123456"
$env:CORS_ALLOWED_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"
.\mvnw.cmd spring-boot:run
```

File tham khao bien moi truong backend:

```text
backend/.env.example
```

Luu y: Spring Boot khong tu doc `.env` nhu Next.js. File nay dung de tham khao khi cau hinh trong terminal, IDE hoac nen tang deploy.

## 4. Chay frontend Next.js
Tao file env local:

```powershell
cd "C:\Users\Minh\Documents\ChoThuePhongTroHomi\frontend"
Copy-Item .env.example .env.local
```

Noi dung can co:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
BACKEND_URL=http://localhost:8080
```

Ghi chu:
- `NEXT_PUBLIC_API_URL` duoc browser dung cho public endpoint.
- `BACKEND_URL` duoc Next.js API route dung cho login/register/me/proxy. Khi deploy, bien nay phai la URL backend public.

Chay frontend:

```powershell
npm install
npm run dev
```

Frontend mac dinh chay tai:

```text
http://localhost:3000
```

## 5. Thu tu chay dung khi demo
1. Bat MySQL Server.
2. Import database neu chua co du lieu.
3. Chay backend tai `http://localhost:8080`.
4. Chay frontend tai `http://localhost:3000`.
5. Mo browser vao `http://localhost:3000`.

## 6. CORS local va khi deploy
Backend hien doc CORS tu:

```text
CORS_ALLOWED_ORIGINS
```

Local:

```text
http://localhost:3000,http://127.0.0.1:3000
```

Khi frontend deploy len Vercel, them domain Vercel vao bien nay, vi du:

```text
http://localhost:3000,http://127.0.0.1:3000,https://your-project.vercel.app
```

Neu backend deploy sang domain rieng, frontend can doi:

```text
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api/v1
BACKEND_URL=https://your-backend-domain.com
```

## 7. Deploy frontend len Vercel
Cach de de bao ve do an:

1. Push source frontend len GitHub.
2. Vao Vercel va import repository.
3. Chon root directory la `frontend`.
4. Build command: `npm run build`.
5. Output/framework: Vercel tu nhan Next.js.
6. Them Environment Variable:

```text
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api/v1
BACKEND_URL=https://your-backend-domain.com
```

Neu backend van chay local thi Vercel khong goi duoc `localhost` tren may cua ban. De frontend Vercel dung duoc API that, backend phai deploy ra internet hoac dung mot tunnel tam thoi khi demo.

## 8. Backend deploy sau nay
Hien tai backend uu tien chay local. Khi can deploy, can cau hinh:

```text
DB_URL=jdbc:mysql://<host>:<port>/<database>?useSSL=false&serverTimezone=Asia/Bangkok&allowPublicKeyRetrieval=true
DB_USERNAME=<username>
DB_PASSWORD=<password>
JWT_SECRET=<secret-dai-va-kho-doan>
JWT_REFRESH_EXPIRATION_MINUTES=10080
CORS_ALLOWED_ORIGINS=https://your-project.vercel.app
SPRING_PROFILES_ACTIVE=prod
COOKIE_SECURE=true
APP_MAIL_ENABLED=false
APP_MAIL_FROM=no-reply@your-domain.com
MAIL_HOST=<smtp-host-neu-bat-email>
MAIL_PORT=587
MAIL_USERNAME=<smtp-user>
MAIL_PASSWORD=<smtp-password>
PORT=<port-do-platform-cap>
SERVER_PORT=8080
```

Khong dung JWT secret demo khi deploy that. Profile `prod` se dung `ddl-auto=validate`, vi vay database phai duoc tao/cap nhat bang cac file SQL trong `database/mysql/` truoc khi chay backend. `COOKIE_SECURE=true` chi phu hop khi backend chay qua HTTPS; neu demo local HTTP thi de `false`.

## 9. Checklist test cac luong chinh
Public:
- Mo trang chu va xem phong noi bat.
- Vao `Tim phong`.
- Tim theo keyword.
- Loc theo khu vuc, gia, dien tich, trang thai, tien ich.
- Mo chi tiet phong.
- Mo ban do tu card phong hoac trang chi tiet phong.

User:
- Dang nhap bang `an.nguyen@example.com` / `123456`.
- Vao profile va cap nhat ho ten / so dien thoai.
- Vao profile va doi mat khau bang mat khau hien tai.
- Vao chi tiet phong va gui yeu cau xem phong.
- Vao chi tiet phong va gui bao cao tin dang.
- Vao phong da luu, chon 2-3 phong va kiem tra bang so sanh.
- Vao lich su lien he de kiem tra yeu cau vua gui.
- Dang xuat.

Admin:
- Dang nhap bang `admin@homi.vn` / `admin123`.
- Vao dashboard admin.
- Xem thong ke tong quan.
- Vao quan ly phong.
- Tao bai dang moi va them nhieu anh phong.
- Cap nhat trang thai phong.
- Vao quan ly yeu cau lien he.
- Chon yeu cau va cap nhat trang thai / ghi chu admin.
- Vao bao cao tin dang.
- Chon bao cao va cap nhat trang thai / ghi chu admin.

Host:
- Vao khu chu tro.
- Tao bai dang moi va upload nhieu anh phong.
- Chon anh dai dien cho bai dang.
- Sua bai dang va kiem tra anh da duoc giu lai.
- Thu upload anh JPG, PNG co nen trong suot va WEBP; backend se toi uu thanh JPEG truoc khi luu.

Kiem tra chat luong truoc khi nop:

```powershell
cd "C:\Users\Minh\Documents\ChoThuePhongTroHomi\backend"
.\mvnw.cmd test

cd "C:\Users\Minh\Documents\ChoThuePhongTroHomi\frontend"
npm run lint
npm test
npm run build
```

## 11. Chay bang Docker Compose

Tu thu muc goc project:

```powershell
docker compose up --build
```

Sau khi container san sang:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080/api/v1`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- MySQL: `localhost:3306`, user `root`, password `123456`

Docker Compose se import cac file SQL trong `database/mysql` vao MySQL container lan dau khoi tao volume.

## 10. Loi thuong gap
- Frontend bao loi ket noi API: kiem tra backend da chay chua va `NEXT_PUBLIC_API_URL`.
- Login bi 401: kiem tra da import seed data va dung dung tai khoan demo.
- Admin bi day ve trang chu: tai khoan dang nhap khong co role `ADMIN`.
- Vercel goi API loi CORS: them domain Vercel vao `CORS_ALLOWED_ORIGINS` cua backend.
- Vercel dung `localhost`: day la sai vi `localhost` tren Vercel khong phai may cua ban.
- Login deploy bi loi: kiem tra `BACKEND_URL` trong frontend va `CORS_ALLOWED_ORIGINS` trong backend.
