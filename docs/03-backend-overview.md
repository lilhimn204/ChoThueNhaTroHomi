# Backend Overview

Backend Homi là Spring Boot REST API dùng Java 21, Spring Security, Spring Data JPA và MySQL.

## 1. Stack

- Spring Boot `3.5.7`
- Java 21
- Spring Web
- Spring Security
- Spring Data JPA
- Spring Validation
- Spring Mail
- JJWT
- MySQL Connector/J
- H2 cho test
- springdoc-openapi cho Swagger/OpenAPI

## 2. Tầng code

```text
controller -> service -> repository -> entity -> database
```

Thư mục chính:

- `controller`: REST API.
- `service`: nghiệp vụ.
- `repository`: query database.
- `entity`: JPA entity.
- `dto`: request/response.
- `security`: JWT, filter, auth user.
- `config`: cấu hình app.
- `exception`: lỗi tập trung.

## 3. Nhóm controller

- `AuthController`: register, login, Google, OTP, forgot/reset password.
- `UserController`: profile, change password, setup password.
- `RoomController`: room public.
- `HostController`: host dashboard và room CRUD.
- `Admin*Controller`: quản trị.
- `News*Controller`: tin tức public và admin.
- `SupportTicketController`, `RoomReportController`, `ContactRequestController`: form nghiệp vụ.
- `UploadController`: upload ảnh.

## 4. Auth backend

Backend xác thực bằng JWT. Local user phải xác minh email. Google user được xác minh qua Google ID token. OTP được hash trước khi lưu. Refresh token nằm trong database.

## 5. Chạy backend

```powershell
cd backend
.\mvnw.cmd test
.\mvnw.cmd spring-boot:run
```

Khi chạy Docker, backend mặc định kết nối MySQL local qua `host.docker.internal:3306`.
