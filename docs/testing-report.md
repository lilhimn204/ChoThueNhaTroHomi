# Homi Pre-deploy Testing Report

Ngay cap nhat: 2026-05-10

## 1. Tong quan he thong da test

Homi la he thong cho thue phong tro gom:

- Frontend: Next.js App Router, React, TypeScript, Tailwind CSS.
- Backend: Spring Boot, Spring Security JWT, Spring Data JPA.
- Database: MySQL, migration trong `database/mysql`.
- Auth: Next.js BFF route dat HttpOnly cookie, proxy request co token sang backend.
- Module chinh: auth, user profile, tim phong, luu phong, lien he, host dashboard/post CRUD, admin/CMS, news/support, upload anh, notification.

Trang thai QA:

- Giai doan 1 - Static audit source: DONE.
- Giai doan 2 - Build/unit/smoke checks: DONE.
- Giai doan 3 - Functional E2E local: DONE.
- Giai doan 4 - UI/UX, security, performance review: DONE o muc static/runtime khong can browser visual automation.

Ket luan sau ban fix 2026-05-10: cac bug High `H-01`, `H-02`, `H-03` da duoc sua trong code va co test bo sung. Truoc khi deploy production van can chot production environment, test Google/SMTP that, UI visual pass va xu ly/chap nhan cac bug Medium con lai.

Moi truong test:

- Backend local dev: `http://127.0.0.1:8080`.
- Frontend local dev: `http://127.0.0.1:3000`.
- Database local: MySQL `rental_room_db`.
- E2E ban dau khong dung Docker production runner vi luc do bug `H-02` lam Secure cookie khong hoat dong tren HTTP local; sau fix, Docker local da co `AUTH_COOKIE_SECURE=false`.
- Google login va OTP email that khong chay E2E vi local khong co OAuth/SMTP credentials; da kiem static va test cac flow auth core co the chay bang seed user.

Du lieu QA da don:

- Tao room QA id 8 va da xoa.
- Tao contact request id 6, support ticket id 5 va notification id 10-13 trong qua trinh E2E; da xoa lai.
- Khoi phuc seed `saved_rooms` id 1 cho user 2 / room 1.

## 2. Danh sach chuc nang da kiem tra

### Giai doan 1 - Static audit source

- Authentication: register, OTP verify/resend, login/logout, Google login, refresh token, forgot/reset password, setup/change password.
- Authorization: backend security config, frontend `RequireAuth`, admin/CMS role guard, host auth guard.
- User flow: profile, avatar upload service, saved rooms, contact request, contact history.
- Rooms: public search/filter/sort, room detail slug, featured/stats, save room, report room.
- Host: dashboard, room CRUD/status, image upload, contact request handling, host profile.
- Admin/CMS: dashboard, rooms, users, contact requests, room reports, support tickets, news/articles/categories.
- Database: user-role, room-image-amenity, contact request, report, notification, saved room, refresh token relations.
- SEO: root metadata, room/news dynamic metadata, sitemap, robots.
- Basic security: token storage, route protection, input sanitizer, upload validation, rate limiting.

### Giai doan 2 - Build/unit/smoke

- PASS `cd backend && .\mvnw.cmd test`: 74 tests pass, 0 failures, 0 errors.
- PASS `cd frontend && npm run lint`: ESLint pass.
- PASS `cd frontend && npm run test`: 4 test files, 20 tests pass.
- PASS `cd frontend && npm run build`: Next.js production build pass, 56 static pages generated.
- PASS `cd frontend && npm run test:smoke`: 38 routes tra HTTP 200.

Ghi chu: smoke route chi kiem HTTP status/render shell; cac trang protected nhu `/admin`, `/host`, `/profile` van can E2E auth/API rieng vi guard hien tai la client-side.

Cap nhat sau fix 2026-05-10:

- PASS `cd backend && .\mvnw.cmd test`: 78 tests pass, 0 failures, 0 errors.
- PASS `cd frontend && npm run test`: 6 test files, 27 tests pass.
- PASS `cd frontend && npm run lint`: ESLint pass.
- PASS `cd frontend && npm run build`: Next.js production build pass.

### Giai doan 3 - Functional E2E local

Da chay E2E qua Next BFF va Spring API voi cookie jar local. Tong ket: PASS 17/17.

- PASS Public rooms search/filter API: co items va total.
- PASS Public lookup APIs: districts, amenities.
- PASS Unauthenticated `/api/proxy/users/me`: 401.
- PASS Normal user login qua BFF: set session cookies va doc duoc `/api/auth/me`.
- PASS Normal user khong vao duoc admin API: 403.
- PASS Saved room toggle qua BFF va da restore seed state.
- PASS Contact request den room cua nguoi khac: tao thanh cong.
- PASS Host create room bang authenticated user.
- PASS Self-contact toi bai cua chinh minh: backend chan 400.
- PASS Host update status/edit own room.
- PASS Host dashboard/customers APIs respond.
- PASS Public support ticket form submit thanh cong.
- PASS Admin login va admin dashboard/users/support tickets APIs respond.
- PASS Admin/CMS news category API respond.
- PASS Host delete QA room cleanup; public detail tra not found sau delete.
- PASS Logout clear session; `/api/auth/me` tra 401 sau logout.

Chua chay E2E:

- Google login: thieu `GOOGLE_CLIENT_ID` / `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.
- OTP email that: local dang `APP_MAIL_ENABLED=false`, khong co SMTP credentials.

### Giai doan 4 - UI/UX, security, performance, SEO

Runtime/API checks:

- PASS Direct backend unauth admin `/api/v1/admin/users`: 401.
- PASS Direct backend unauth host `/api/v1/host/posts`: 401.
- PASS Next BFF unauth admin `/api/proxy/admin/users`: 401.
- PASS Next BFF unauth host `/api/proxy/host/posts`: 401.
- FAIL/RISK `/v3/api-docs`: 200 va `/swagger-ui.html`: 200, da ghi bug `M-05`.
- PASS `/sitemap.xml`: 200, co dynamic room/news URLs trong local runtime.
- PASS `/robots.txt`: 200.
- PASS room detail existing slug: 200 va khong hien title "Phong khong ton tai".
- RISK missing room slug: tra HTTP 200 voi not-found content, da ghi bug `L-02` soft 404.

Static UI/UX checks:

- Dark mode dung CSS variables voi `[data-theme="dark"]`, co override cho cac class white-based.
- Components chinh co loading/error/empty state: rooms, saved rooms, contact history, admin, host, CMS, news.
- Responsive layout co `sm/md/lg/xl`, `min-w-0`, `overflow-x-auto` cho bang admin va mobile drawer/header.
- Hover/focus/active state duoc dung rong rai qua `motion-*`, `focus-visible`, `disabled`.
- Khong co Playwright/browser visual automation trong repo (`npm ls playwright` empty), nen chua co pixel-level screenshot desktop/tablet/mobile va chua do contrast bang tool tu dong.

Security/static checks:

- Khong thay JWT luu trong localStorage; frontend chi cache user profile va theme.
- `dangerouslySetInnerHTML` chi dung cho JSON-LD room/news voi `JSON.stringify`, rui ro XSS thap.
- Backend co DTO validation va `InputSanitizer` cho cac input luu DB.
- Upload co validate empty file, size MB va content-type JPG/PNG/WEBP.
- Spring Security co route protection cho admin/host/user APIs.

Performance/static checks:

- Build production pass.
- API public search co paging size clamp.
- Lookup districts/amenities co cache names.
- Notification/sidebar polling co interval 30s/60s; chua thay loop fetch bat thuong trong static audit.
- Chua chay Lighthouse/Web Vitals vi repo khong co browser automation/perf script.

## 3. Danh sach bug tim thay

### Critical

Khong phat hien bug Critical trong pham vi da test.

### High

#### H-01: Redirect sau login/register nhan thang query `redirect`, co rui ro open redirect/XSS navigation

Trang thai: Fixed 2026-05-10.

- Bang chung truoc fix: `frontend/app/login/page.tsx`, `frontend/app/register/page.tsx` truyen `searchParams.redirect` vao `GuestOnly` va `AuthPanel`; `frontend/components/forms/auth-panel.tsx` dung `router.replace(getRedirectTarget(user, redirectTo))`; `frontend/components/auth/guest-only.tsx` dung `router.replace(redirectTarget)`.
- Cach reproduce:
  1. Mo `/login?redirect=https://example.com` hoac mot URL khong thuoc noi bo.
  2. Dang nhap thanh cong.
  3. Trinh duyet co the dieu huong theo redirect khong duoc validate.
- Anh huong: nguoi dung co the bi day sang domain la hoac URL nguy hiem sau dang nhap.
- Fix da ap dung: them `frontend/lib/safe-redirect.ts`, dung trong `AuthPanel` va `GuestOnly`, them unit test `safe-redirect.test.ts`.

#### H-02: Cookie auth frontend luon `secure=true` khi `NODE_ENV=production`, lam Docker local HTTP khong giu duoc phien dang nhap

Trang thai: Fixed 2026-05-10.

- Bang chung truoc fix: `frontend/lib/server-auth.ts` dat `const secure = process.env.NODE_ENV === "production"`; `frontend/Dockerfile` runner dat `NODE_ENV=production`; `docker-compose.yml` expose frontend qua `http://localhost:3000`.
- Cach reproduce:
  1. Chay frontend bang Docker Compose production runner tren `http://localhost:3000`.
  2. Dang nhap bang tai khoan seed.
  3. Cookie co thuoc tinh `Secure` tren HTTP nen browser khong luu/gui lai, `/api/auth/me` tra unauthenticated.
- Anh huong: khong test duoc auth E2E bang local Docker HTTP; neu deploy production khong HTTPS cung mat session.
- Fix da ap dung: them `AUTH_COOKIE_SECURE`, helper `auth-cookie-config.ts`, Docker local default `AUTH_COOKIE_SECURE=false`, va unit test.

#### H-03: JWT secret co fallback/hardcode placeholder, production co the chay voi secret biet truoc neu env sai

Trang thai: Fixed 2026-05-10.

- Bang chung truoc fix: `backend/src/main/resources/application.yml` fallback `JWT_SECRET:rental-room-demo-secret-key-please-change-before-production-2026`; `docker-compose.yml` hardcode `JWT_SECRET: change-this-secret-before-deploying-homi-with-at-least-32-characters`; `JwtService` chi warn neu secret bat dau bang `change-this`.
- Cach reproduce:
  1. Chay backend production ma khong set `JWT_SECRET` that, hoac deploy theo compose placeholder.
  2. Backend van boot vi secret dai hon 32 ky tu.
  3. Access token co the bi ky bang secret public/placeholder.
- Anh huong: neu bi deploy nham, ke tan cong co the ky JWT hop le.
- Fix da ap dung: `JwtService` fail-fast khi active profile `prod`/`production` dung placeholder, Docker Compose bat buoc `JWT_SECRET`, them `JwtServiceTest`.

### Medium

#### M-01: Public room card/detail co the loi khi bai dang khong co anh/thumbnail

- Bang chung source: backend `CreateOrUpdateRoomRequest.images` va `thumbnail` khong bat buoc; `HostRoomForm` cho phep submit khi `galleryImages` rong va gui `thumbnail: ""`; `RoomCard` fallback `return [{ src: room.thumbnail, alt: room.title }]`; `normalizeUploadImageSrc(src: string)` goi `src.trim()`.
- Cach reproduce:
  1. Dang nhap host.
  2. Tao bai dang khong upload anh.
  3. Mo `/rooms` hoac `/rooms/[slug]`.
- Anh huong: Next Image co the render loi voi `src=""`/`null`, lam hong card/detail.
- Goi y fix: bat buoc toi thieu 1 anh trong host/admin form hoac them placeholder anh hop le va type frontend `thumbnail?: string | null`.

#### M-02: Sitemap runtime dung `NEXT_PUBLIC_API_URL`, sai trong Docker container

- Bang chung source: `frontend/app/sitemap.ts` goi `${apiConfig.baseUrl}/rooms...` va `${apiConfig.baseUrl}/news...`; Docker set `NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1` cho browser, nhung trong frontend container `localhost:8080` khong phai backend container.
- Cach reproduce:
  1. Chay frontend bang Docker Compose.
  2. Mo `/sitemap.xml`.
  3. Kiem tra dynamic room/news URLs co the bi thieu neu server-side fetch khong toi duoc backend.
- Anh huong: SEO sitemap thieu trang phong/tin tuc.
- Goi y fix: trong sitemap dung server base URL tu `BACKEND_URL` nhu room/news metadata dang lam.

#### M-03: Script `mysql-migrate` trong Docker Compose bo sot migration 21

- Bang chung source: `docker-compose.yml` chi loop `/migrations/04_*.sql` den `/migrations/20_*.sql`; co file `database/mysql/21_support_ticket_notifications.sql`.
- Cach reproduce:
  1. Dung database da ton tai truoc migration 21.
  2. Chay `docker compose --profile docker-db up mysql-migrate`.
  3. Migration 21 khong duoc apply.
- Anh huong: DB cu co the khong chap nhan `NEW_SUPPORT_TICKET`, gay loi khi tao support ticket notification.
- Goi y fix: cho migrate chay tat ca file theo thu tu hoac them `21_*.sql`.

#### M-04: URL upload co the luu host noi bo backend vao DB neu chua cau hinh `UPLOAD_PUBLIC_BASE_URL`

- Bang chung source: `FileStorageService.buildPublicUrl()` fallback ve request base URL; `UploadController` lay request base tu context; `docker-compose.yml` chua set `UPLOAD_PUBLIC_BASE_URL`.
- Cach reproduce:
  1. Upload anh phong/news/avatar qua frontend Docker.
  2. Kiem tra response/DB image URL.
  3. URL co the la internal backend origin thay vi domain public.
- Anh huong: rendering client co normalize duoc `/uploads`, nhung Open Graph/SEO JSON-LD va du lieu chia se co the leak URL noi bo hoac anh social khong load.
- Goi y fix: set `UPLOAD_PUBLIC_BASE_URL=https://thuenhahomi.id.vn` trong production hoac tra ve path `/uploads/...` thay vi absolute backend URL.

#### M-05: OpenAPI/Swagger dang public va chua tat trong profile production

- Bang chung source/runtime: `SecurityConfig` permit `/v3/api-docs/**`, `/swagger-ui/**`, `/swagger-ui.html`; local runtime `/v3/api-docs` tra 200 va `/swagger-ui.html` tra 200; `application-prod.yml` chua set `springdoc.api-docs.enabled=false` hoac `springdoc.swagger-ui.enabled=false`.
- Cach reproduce:
  1. Chay backend.
  2. Mo `/v3/api-docs` hoac `/swagger-ui.html`.
  3. API schema public.
- Anh huong: tang kha nang reconnaissance API tren production.
- Goi y fix: tat SpringDoc trong production hoac gioi han bang admin/VPN.

### Low

#### L-01: Save room fail im lang khi session het han hoac API loi

- Bang chung source: `frontend/components/rooms/save-room-button.tsx` catch loi va comment silently fail.
- Cach reproduce:
  1. Dang nhap, de cookie het han hoac revoke token.
  2. Bam luu phong.
  3. UI khong hien loi/khong redirect login.
- Anh huong: UX kem, user khong biet thao tac that bai.
- Goi y fix: hien toast/error nho, neu 401 thi refresh profile hoac redirect login.

#### L-02: Dynamic room slug khong ton tai tra HTTP 200 thay vi 404

- Bang chung source/runtime: `frontend/app/rooms/[slug]/page.tsx` khong goi `notFound()` khi `fetchRoom()` tra null; local request `/rooms/slug-khong-ton-tai-qa` tra HTTP 200 voi not-found content.
- Cach reproduce:
  1. Mo `/rooms/slug-khong-ton-tai-qa`.
  2. Response status la 200 nhung noi dung la phong khong ton tai.
- Anh huong: SEO co the bi soft 404; crawler co the index trang khong co noi dung.
- Goi y fix: trong server page, neu room khong ton tai thi goi `notFound()` va tao `not-found.tsx` tuong ung; neu muon client fetch lai thi can phan biet loi network voi not found.

## 4. Chuc nang hoat dong on dinh

- Backend chan `/api/v1/admin/**` bang `hasRole("ADMIN")`; E2E user thuong bi 403.
- Direct backend/BFF unauth request toi admin/host deu tra 401.
- Frontend guard `/admin` va `/cms` bang `RequireAuth roles={["ADMIN"]}`.
- Host area yeu cau authenticated user; backend gioi han CRUD host theo `createdBy`.
- Contact request chan bai dang `HIDDEN` va chan user gui request toi bai cua chinh minh.
- Room report chan bai `HIDDEN` va chan duplicate active report theo user/room.
- Input sanitizer duoc dung cho text luu DB; DTO co validation cho cac form chinh.
- Upload gioi han content-type JPG/PNG/WEBP va kich thuoc theo config.
- Refresh token co rotation/revoke service; frontend khong luu JWT trong localStorage.
- Room detail existing slug khong con hien sai "Phong khong ton tai" trong runtime local.
- Host create/edit/status/delete room core flow pass.
- Admin dashboard/users/support/news category API core flow pass.
- Public rooms/news/sitemap/robots route shell pass.

## 5. Checklist truoc deploy production

- [x] Backend tests pass.
- [x] Frontend lint pass.
- [x] Frontend unit tests pass.
- [x] Frontend production build pass.
- [x] Smoke routes pass.
- [x] Core auth E2E pass: login/logout/session/me/role denial.
- [x] Core user/host/admin API E2E pass.
- [x] Fix `H-01` redirect validation.
- [x] Fix `H-02` auth cookie secure config.
- [x] Fix `H-03` JWT secret fail-fast/secret management.
- [ ] Review/fix Medium bugs `M-01` den `M-05`.
- [ ] Google login tested voi production OAuth credentials.
- [ ] OTP email tested voi SMTP production/staging credentials.
- [ ] UI visual pass tren mobile/tablet/desktop bang browser automation hoac manual checklist.
- [ ] Dark mode manual pass: contrast, button, card, form, modal/dropdown.
- [ ] Validate `NEXT_PUBLIC_SITE_URL`, `BACKEND_URL`, `NEXT_PUBLIC_API_URL`.
- [ ] Set `JWT_SECRET` manh va khong dung placeholder.
- [ ] HTTPS enabled; cookie secure true trong production HTTPS.
- [ ] Set `CORS_ALLOWED_ORIGINS` chi gom domain tin cay.
- [ ] Set `UPLOAD_PUBLIC_BASE_URL` dung domain public.
- [ ] Kiem tra `/sitemap.xml`, dynamic title/meta/Open Graph image tren production URL.
- [ ] Backup database truoc deploy va dam bao migration moi nhat da apply.
- [ ] Tat hoac protect Swagger/OpenAPI trong production.
