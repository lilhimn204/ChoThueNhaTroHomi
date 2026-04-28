# Buoc 5 - Ket noi Frontend voi Backend

## Muc tieu hien tai

- Thay mock data bang API that tu Spring Boot.
- Dung Next.js API route lam BFF cho cac endpoint can dang nhap.
- Luu access token trong HttpOnly cookie `homi_token` va refresh token trong HttpOnly cookie `homi_refresh_token`, khong luu token trong localStorage.
- Chi cache thong tin user hien tai trong localStorage de hien thi UI nhanh hon khi reload.
- Bao ve cac route `profile`, `contact-history`, `saved-rooms`, khu `host` va khu `admin`.
- Bo sung loading, empty, error state cho cac man hinh chinh.

## Kien truc frontend sau khi noi API

- `services/api-client.ts`
  - `apiRequest`: goi truc tiep Spring Boot cho public endpoint.
  - `proxyRequest`: goi `/api/proxy/*` cho authenticated endpoint.
- `app/api/auth/login/route.ts`: goi backend login, dat access/refresh token vao HttpOnly cookie va tra ve user.
- `app/api/auth/register/route.ts`: goi backend register, dat access/refresh token vao HttpOnly cookie va tra ve user.
- `app/api/auth/me/route.ts`: doc cookie, tu refresh access token khi can, goi backend `/users/me` de verify phien dang nhap.
- `app/api/auth/logout/route.ts`: revoke refresh token o backend va xoa cookie dang nhap.
- `app/api/proxy/[...path]/route.ts`: doc JWT tu cookie, tu refresh khi backend tra 401, va forward sang backend voi `Authorization: Bearer <token>`.
- `lib/server-auth.ts`: tap trung logic set/clear cookie, refresh access token va revoke refresh token.
- `components/providers/auth-provider.tsx`: quan ly `user`, `status`, khoi tao tu cached user va verify lai bang `/api/auth/me`.
- `lib/auth-storage.ts`: chi luu/xoa/cap nhat cached user profile.
- `services/*`: tach API theo domain: auth, rooms, contact requests, saved rooms, notifications, host, admin, users, uploads.

## Cac luong da noi that

Public:

- Trang chu lay `featured rooms`.
- Trang danh sach phong goi API tim kiem/filter/sort/pagination.
- Trang chi tiet phong goi API theo `slug`.
- Districts va amenities lay tu backend.

User:

- Dang nhap / dang ky that.
- Ho so ca nhan doc / cap nhat that.
- Gui yeu cau lien he / xem phong that.
- Lich su yeu cau lien he that.
- Luu / bo luu phong.
- Xem danh sach phong da luu.
- So sanh nhanh toi da 3 phong da luu theo gia, dien tich, khu vuc, dia chi va trang thai.
- Nhan thong bao trong notification bell.

Host:

- Dashboard chu tro.
- Tao, sua, cap nhat trang thai va xoa bai dang cua chinh minh.
- Xem va xu ly yeu cau lien he theo phong minh dang.
- Cap nhat ho so chu tro.

Admin:

- Dashboard doc so lieu thong ke that.
- Quan ly phong: loc danh sach, tao bai dang, cap nhat trang thai, xoa.
- Quan ly users: tim kiem, loc, khoa/mo khoa tai khoan.
- Quan ly yeu cau lien he: loc danh sach, chon yeu cau, cap nhat trang thai va ghi chu admin.

## Route protection

- `GuestOnly`: chan vao `/login` va `/register` khi da dang nhap.
- `RequireAuth`: bao ve cac trang can user dang nhap.
- `RequireAuth roles=["ADMIN"]`: bao ve layout admin.
- Khu `host` hien cho user da dang nhap su dung; backend van rang buoc thao tac phong theo `createdById`.

## Bien moi truong dang dung

Frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
BACKEND_URL=http://localhost:8080
```

Ghi chu:

- `NEXT_PUBLIC_API_URL` duoc client dung cho public endpoint.
- `BACKEND_URL` duoc Next.js server route dung cho auth/proxy endpoint.
- Khi deploy, `BACKEND_URL` phai tro den backend public URL, khong dung `localhost`.

## Kiem tra da thuc hien gan nhat

Tai frontend:

```powershell
npm run lint
npm test
npm run build
```

Ket qua sau Giai doan 1:

- `npm run lint`: pass.
- `npm test`: pass, 2 test files / 12 tests.
- `npm run build`: pass.

Tai backend:

```powershell
.\mvnw.cmd test
```

Ket qua gan nhat trong bao cao review: pass, 29 tests.

## Ghi chu thuc te

- Cach luu JWT trong HttpOnly cookie tot hon cach luu access token trong localStorage vi JavaScript khong doc duoc token.
- Vi dang dung cookie, cac mutation quan trong nen can nhac bo sung CSRF token hoac Origin check neu deploy thuc te.
- `localStorage` hien chi duoc dung lam cache user profile; neu cache hong, frontend se xoa cache va verify lai qua `/api/auth/me`.
