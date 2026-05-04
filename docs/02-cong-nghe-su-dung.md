# 02. Công Nghệ Sử Dụng

## 1. Tổng quan stack

Homi dùng kiến trúc frontend/backend/database tách biệt:

- Frontend: Next.js, React, TypeScript, Tailwind CSS.
- Backend: Spring Boot, Spring Security, Spring Data JPA.
- Database: MySQL.
- DevOps local: Docker Compose, Maven Wrapper, npm.

## 2. Frontend

Các package chính trong `frontend/package.json`:

| Công nghệ | Phiên bản/ghi chú |
|---|---|
| Next.js | `16.2.4`, App Router |
| React | `19.2.4` |
| TypeScript | `^5` |
| Tailwind CSS | `^4` |
| lucide-react | Icon UI |
| maplibre-gl | Bản đồ/khu vực nếu cần |
| recharts | Biểu đồ dashboard |
| vitest | Test frontend |

Frontend dùng:

- `frontend/app` cho route App Router.
- `frontend/app/api/auth/*` cho auth BFF.
- `frontend/app/api/proxy/[...path]` cho proxy API cần đăng nhập.
- `frontend/app/api/public/[...path]` cho proxy API public.
- `frontend/components` cho UI theo module.
- `frontend/constants/site.ts` cho navigation, room type, news category và các option chung.
- `frontend/lib` cho API client, auth helpers, formatting.
- `frontend/types` cho type dùng chung.

## 3. Backend

Các dependency chính trong `backend/pom.xml`:

| Công nghệ | Vai trò |
|---|---|
| Spring Boot `3.5.7` | Nền tảng backend |
| Java 21 | Runtime |
| Spring Web | REST API |
| Spring Data JPA | ORM với MySQL |
| Spring Security | Xác thực, phân quyền |
| Spring Validation | Validate DTO |
| Spring Mail | Gửi OTP qua SMTP |
| Spring Cache | Cache nếu cần |
| JJWT `0.12.7` | Sinh và xác minh JWT |
| MySQL Connector/J | Kết nối MySQL |
| Lombok | Giảm boilerplate |
| springdoc-openapi | Swagger/OpenAPI |
| TwelveMonkeys WebP | Hỗ trợ xử lý ảnh |
| H2 | Database test |

Backend chia theo tầng:

- `controller`: REST endpoints.
- `service`: nghiệp vụ.
- `repository`: Spring Data JPA repositories.
- `entity`: mapping bảng database.
- `dto`: request/response.
- `security`: JWT, filter, user details, security config.
- `config`: cấu hình app, CORS, mail, upload.
- `exception`: xử lý lỗi tập trung.
- `util`: helper.

## 4. Database

Database chính là MySQL `rental_room_db`.

Schema và migration nằm trong `database/mysql`:

- `01_schema.sql`: schema tổng hợp hiện tại.
- `02_seed.sql`: dữ liệu mẫu.
- Các file `03_*.sql` đến `20_*.sql`: migration bổ sung như auth Google/OTP, room type, support, news, admin user, reset password, password configured.

## 5. Docker Compose

`docker-compose.yml` có các service:

- `frontend`: Next.js ở port `3000`.
- `backend`: Spring Boot ở port `8080`.
- `mysql`: MySQL Docker, chỉ chạy khi bật profile `docker-db`.
- `mysql-migrate`: chạy migration cho MySQL Docker, cũng thuộc profile `docker-db`.

Mặc định backend Docker trỏ tới MySQL local:

```env
DB_URL=jdbc:mysql://host.docker.internal:3306/rental_room_db?...
```

Điều này giúp MySQL Workbench ở `localhost:3306` và website cùng dùng một database.

## 6. Biến môi trường quan trọng

Backend:

- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`
- `JWT_SECRET`, `JWT_EXPIRATION_MINUTES`, `JWT_REFRESH_EXPIRATION_MINUTES`
- `GOOGLE_CLIENT_ID`
- `APP_MAIL_ENABLED`, `APP_MAIL_FROM`
- `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`
- `OTP_EXPIRATION_MINUTES`, `OTP_MAX_ATTEMPTS`, `OTP_MAX_RESEND_COUNT`, `OTP_RESEND_COOLDOWN_SECONDS`
- `UPLOAD_DIRECTORY`
- `CORS_ALLOWED_ORIGINS`

Frontend:

- `BACKEND_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

Không commit secret thật. Gmail SMTP phải dùng Google App Password.

## 7. Lệnh thường dùng

Chạy Docker frontend/backend:

```powershell
docker compose up -d --build backend frontend
```

Chạy Docker kèm MySQL container:

```powershell
docker compose --profile docker-db up -d --build
```

Backend test:

```powershell
cd backend
.\mvnw.cmd test
```

Frontend dev/build:

```powershell
cd frontend
npm install
npm run dev
npm run lint
npm run build
```
