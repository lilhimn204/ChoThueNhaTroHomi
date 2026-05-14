# Homi Project Summary

Ngay cap nhat: 2026-05-10

## 1. Tong quan

Homi la website cho thue phong tro, tap trung vao nguoi tim phong, chu tro va admin van hanh he thong.

Muc tieu chinh:

- Nguoi dung tim, loc, xem chi tiet, luu phong va gui yeu cau xem phong.
- Chu tro dang bai, upload anh, quan ly bai dang va theo doi khach lien he.
- Admin quan ly user, bai dang, yeu cau lien he, bao cao tin sai, support ticket va tin tuc.
- Website co noi dung cong khai nhu tin tuc, FAQ, chinh sach, dieu khoan, khu vuc pho bien va checklist thue phong.

Trang thai hien tai:

- Source da co frontend, backend, database migrations va Docker Compose.
- Build/test core da pass trong lan QA gan nhat.
- 3 bug High ve auth redirect, cookie secure va JWT secret da duoc sua.
- Con mot so bug Medium/Low can xu ly truoc production neu muon dat muc on dinh cao hon.

## 2. Cong nghe su dung

Frontend:

- Next.js App Router.
- React.
- TypeScript.
- Tailwind CSS.
- Vitest cho unit test.
- Next API routes lam BFF cho auth/proxy.

Backend:

- Spring Boot.
- Spring Security JWT.
- Spring Data JPA.
- MySQL.
- Maven.
- JUnit/Mockito/Spring Boot Test.

Database:

- MySQL schema va seed/migrations trong `database/mysql`.
- Cac bang chinh: users, roles, rooms, room_images, room_amenities, contact_requests, room_reports, saved_rooms, notifications, news_categories, news_articles, support_tickets, refresh_tokens.

Dev/Deploy:

- Docker Compose.
- Frontend Dockerfile.
- Backend Dockerfile.
- Root `.env` cho local runtime.
- `.env.example` lam mau cau hinh.

## 3. Cau truc thu muc chinh

```text
ChoThuePhongTroHomi/
|-- backend/                 Spring Boot REST API
|   |-- src/main/java/        Controller, service, repository, entity, security
|   |-- src/main/resources/   application.yml, application-prod.yml
|   `-- src/test/java/        Unit/integration tests
|-- frontend/                Next.js frontend
|   |-- app/                  App Router pages, API routes, metadata
|   |-- components/           UI, auth, rooms, host, admin, CMS
|   |-- hooks/                Client hooks
|   |-- lib/                  Shared helpers
|   |-- services/             API client/auth service
|   `-- types/                TypeScript types
|-- database/mysql/          Schema, seed data, migration SQL
|-- docs/                    Project docs, QA report, checklist
|-- scripts/                 Utility scripts
|-- docker-compose.yml       Local compose stack
`-- .env.example             Local env template
```

## 4. Kien truc he thong

Luon tong quat:

```text
Browser
  -> Next.js frontend
  -> Next.js API route BFF
  -> Spring Boot backend
  -> MySQL database
```

Frontend goi API theo 2 cach:

- Public data: frontend goi public API qua `/api/public/...` hoac server fetch den backend.
- Authenticated data: frontend goi `/api/proxy/...`; Next BFF doc JWT tu HttpOnly cookie va proxy sang backend.

Auth token:

- JWT access token va refresh token duoc luu trong HttpOnly cookie.
- Frontend khong luu JWT trong localStorage.
- Frontend chi cache user profile trong localStorage de hien thi UI nhanh.

## 5. Module chuc nang

### Public website

- Trang chu.
- Tim phong.
- Loc/sort/search phong.
- Xem chi tiet phong theo slug.
- Tin tuc.
- FAQ.
- Lien he ho tro.
- Chinh sach bao mat.
- Dieu khoan su dung.
- Khu vuc pho bien.
- Checklist va meo tranh lua dao.
- Sitemap, robots, metadata, Open Graph.

### Authentication

- Dang ky tai khoan thuong.
- OTP email cho dang ky.
- Dang nhap/logout.
- Google login.
- Refresh token.
- Quen mat khau/reset password.
- Doi mat khau.
- Google user tao mat khau.
- Redirect theo role sau login.
- Route protection cho user/host/admin.

### User

- Ho so ca nhan.
- Avatar.
- Luu phong.
- Xem danh sach phong da luu.
- Gui yeu cau xem phong/lien he.
- Chan user gui yeu cau toi bai cua chinh minh.
- Lich su lien he.
- Notification.

### Host

- Dashboard chu tro.
- Tao bai dang.
- Upload anh.
- Chinh sua bai dang.
- Xoa bai dang.
- Cap nhat trang thai phong: available/full/hidden.
- Quan ly khach lien he.
- Thong ke bai dang/contact.
- Ho so chu tro.

### Admin/CMS

- Dashboard admin.
- Quan ly user.
- Quan ly phong/bai dang.
- Quan ly yeu cau lien he.
- Quan ly bao cao tin sai.
- Quan ly support ticket.
- Quan ly tin tuc.
- Quan ly danh muc tin tuc.
- CMS articles/categories/media/settings.
- Phan quyen admin qua backend security va frontend guard.

## 6. Backend/API

Backend co cac lop chinh:

- Controller: expose REST endpoints.
- Service: xu ly business logic.
- Repository: truy van JPA.
- Entity: mapping database.
- DTO: request/response validation.
- Security: JWT, auth filter, role guard, rate limit, CORS.
- Exception handler: chuan hoa loi API.

Nhung diem dang co:

- DTO validation bang Jakarta Validation.
- Input sanitizer cho text luu DB.
- Upload image validate content-type va size.
- Role-based access control cho admin/host/user APIs.
- Refresh token rotation/revoke.
- Rate limit filter cho mot so auth-sensitive routes.

## 7. Database

Quan he chinh:

- User co roles qua `user_roles`.
- Room thuoc district va user tao bai.
- Room co images va amenities.
- User co saved rooms.
- User co contact requests.
- Room co contact requests va reports.
- Admin/user co notifications.
- News article thuoc news category va co created_by/updated_by.
- Support ticket dung cho contact/report support flow.

Luu y migration:

- Schema ban dau nam trong `01_schema.sql`.
- Seed data nam trong `02_seed.sql`.
- Cac migration sau danh so tu `04_...` den `21_...`.
- Bug `M-03` da ghi nhan: script `mysql-migrate` hien chua auto chay migration 21 trong Docker Compose.

## 8. Bao mat co ban

Da co:

- JWT trong HttpOnly cookie.
- Refresh token backend.
- Admin API guard bang role.
- Host CRUD kiem owner.
- Input validation.
- Basic input sanitizer.
- Upload file type/size validation.
- CORS configurable.
- Cookie secure configurable qua env.
- JWT secret production fail-fast neu la placeholder.
- Redirect sau auth chi chap nhan internal path.

Can tiep tuc kiem soat truoc production:

- Set `JWT_SECRET` rieng, manh va khong commit.
- Set `AUTH_COOKIE_SECURE=true` khi production HTTPS.
- Set `COOKIE_SECURE=true` cho backend cookie neu dung backend cookie.
- Set `CORS_ALLOWED_ORIGINS` dung domain production.
- Tat hoac protect Swagger/OpenAPI trong production.
- Test Google OAuth va SMTP/OTP that tren staging/production.

## 9. Cach chay local

Chay bang Docker Compose:

```powershell
docker compose up --build
```

URL mac dinh:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- Swagger: `http://localhost:8080/swagger-ui.html`

Neu can demo bang domain public, giu cua so Docker Compose dang chay, mo them PowerShell thu hai va chay Cloudflare Tunnel:

```powershell
cloudflared tunnel run homi
```

Sau do truy cap:

- Website public: `https://thuenhahomi.id.vn`

Thu tu demo day du:

```text
1. Mo Docker Desktop.
2. Chay docker compose up --build.
3. Chay cloudflared tunnel run homi.
4. Mo https://thuenhahomi.id.vn.
```

Neu can demo bang domain public, giu cua so Docker Compose dang chay, mo them PowerShell thu hai va chay Cloudflare Tunnel:

```powershell
cloudflared tunnel run homi
```

Sau do truy cap:

- Website public: `https://thuenhahomi.id.vn`

Thu tu demo day du:

```text
1. Mo Docker Desktop.
2. Chay docker compose up --build.
3. Chay cloudflared tunnel run homi.
4. Mo https://thuenhahomi.id.vn.
```

Chay dev rieng:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

```powershell
cd frontend
npm run dev
```

## 10. Cau hinh moi truong

Root `.env` dung cho Docker Compose local va da bi git ignore.

Bien quan trong:

- `JWT_SECRET`: bat buoc cho backend trong Docker Compose.
- `AUTH_COOKIE_SECURE=false`: dung cho local HTTP.
- `GOOGLE_CLIENT_ID`: dung cho Google login.
- `APP_MAIL_ENABLED`: bat/tat gui mail.
- `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`: SMTP.
- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`: database.
- `UPLOAD_PUBLIC_BASE_URL`: public URL cho upload khi deploy.

Production:

- Khong dung lai secret local.
- Production HTTPS nen set `AUTH_COOKIE_SECURE=true`.
- Dung secret manager hoac env tren server.

## 11. Lenh test/build

Backend:

```powershell
cd backend
.\mvnw.cmd test
```

Frontend:

```powershell
cd frontend
npm run lint
npm run test
npm run build
npm run test:smoke
```

Ket qua gan nhat:

- Backend tests pass: 78 tests.
- Frontend unit tests pass: 27 tests.
- Frontend lint pass.
- Frontend build pass.
- Smoke routes pass: 38 routes.

## 12. QA va bug hien tai

Bao cao chi tiet:

- `docs/testing-report.md`
- `docs/bug-list.md`
- `docs/pre-deploy-checklist.md`

Bug High da sua:

- `H-01`: open redirect sau login/register.
- `H-02`: cookie Secure phu thuoc `NODE_ENV` lam Docker local HTTP mat session.
- `H-03`: JWT secret placeholder/fallback co rui ro production.

Bug con lai can xem xet:

- `M-01`: Room khong co anh/thumbnail co the gay loi UI.
- `M-02`: Sitemap server runtime dung `NEXT_PUBLIC_API_URL`, co rui ro sai trong Docker container.
- `M-03`: Docker mysql-migrate bo sot migration 21.
- `M-04`: Upload URL co the luu internal backend origin neu thieu `UPLOAD_PUBLIC_BASE_URL`.
- `M-05`: OpenAPI/Swagger public.
- `L-01`: Save room fail im lang khi API/session loi.
- `L-02`: Missing room slug tra HTTP 200 thay vi 404.

## 13. Checklist deploy rut gon

Truoc deploy production:

- Backend tests pass.
- Frontend lint/test/build/smoke pass.
- Google login test voi OAuth production/staging.
- OTP email test voi SMTP production/staging.
- Set `JWT_SECRET` manh.
- Set HTTPS va secure cookie.
- Set CORS dung domain.
- Set upload public base URL.
- Apply tat ca migrations moi nhat.
- Backup database.
- Review Swagger/OpenAPI exposure.
- Test responsive/dark mode bang browser manual hoac automation.

## 14. Ghi chu phat trien

- Khong nen revert cac thay doi co san neu khong ro nguon goc.
- Cac file build artifact nhu `frontend/.next` va `backend/target` co the xoa an toan, se tu sinh lai khi build/test.
- `frontend/node_modules` nen giu lai de tranh phai cai lai dependency.
- `backend/uploads` nen giu neu dang co anh local can test.
- `.env` khong commit; `.env.example` moi la file mau co the commit.
