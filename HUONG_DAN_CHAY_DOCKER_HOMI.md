# HƯỚNG DẪN CHẠY WEBSITE HOMI BẰNG DOCKER COMPOSE

Tài liệu này hướng dẫn chạy toàn bộ hệ thống Homi gồm:

- Frontend Next.js
- Backend Spring Boot
- MySQL database

Chỉ cần một lệnh Docker Compose sau khi cài Docker Desktop.

---

## 1. Cài Docker Desktop

Nếu máy chưa có Docker Desktop, tải và cài tại:

```text
https://www.docker.com/products/docker-desktop/
```

Trong quá trình cài đặt trên Windows, nếu Docker hỏi dùng WSL 2 thì chọn bật WSL 2.

Sau khi cài xong:

1. Mở Docker Desktop từ Start Menu.
2. Chờ Docker Desktop khởi động xong.
3. Đóng PowerShell cũ.
4. Mở PowerShell mới.

Kiểm tra Docker đã nhận lệnh chưa:

```powershell
docker --version
docker compose version
```

Nếu 2 lệnh trên hiển thị version thì có thể chạy dự án.

---

## 2. Vào thư mục dự án

Mở PowerShell và chạy:

```powershell
cd C:\Users\Minh\Documents\ChoThuePhongTroHomi
```

Kiểm tra trong thư mục có file `docker-compose.yml`:

```powershell
dir docker-compose.yml
```

---

## 3. Dừng server chạy riêng trước khi dùng Docker

Docker Compose của dự án dùng các port:

- Frontend: `3000`
- Backend: `8080`
- MySQL trong container: `3306`
- MySQL truy cập từ máy host: `3307`

Nếu bạn đang chạy riêng backend bằng:

```powershell
.\mvnw.cmd spring-boot:run
```

hoặc frontend bằng:

```powershell
npm run dev
```

hãy dừng bằng `Ctrl + C` trước.

Kiểm tra port có đang bị chiếm không:

```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 3307 -ErrorAction SilentlyContinue
```

Nếu có tiến trình đang chiếm port, hãy dừng terminal đang chạy tiến trình đó.

---

## 4. Chạy toàn bộ hệ thống bằng một lệnh

Tại thư mục gốc dự án, chạy:

```powershell
docker compose up --build
```

Lệnh này sẽ:

1. Tạo container MySQL.
2. Tự chạy các file SQL trong `database/mysql`.
3. Build backend Spring Boot.
4. Build frontend Next.js.
5. Chạy cả frontend, backend và database cùng lúc.

Lần đầu chạy sẽ hơi lâu vì Docker phải tải image MySQL, Maven dependencies và Node dependencies.

Khi chạy thành công, truy cập:

```text
Frontend: http://localhost:3000
Backend API: http://localhost:8080
Swagger API Docs: http://localhost:8080/swagger-ui.html
```

---

## 5. Chạy Docker Compose ở chế độ nền

Nếu không muốn giữ terminal mở log liên tục, dùng:

```powershell
docker compose up -d --build
```

Xem trạng thái container:

```powershell
docker compose ps
```

Xem log toàn bộ hệ thống:

```powershell
docker compose logs -f
```

Xem log từng service:

```powershell
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f mysql
```

---

## 6. Dừng hệ thống

Dừng toàn bộ container:

```powershell
docker compose down
```

Dừng và xóa luôn database volume:

```powershell
docker compose down -v
```

Lưu ý: `docker compose down -v` sẽ xóa dữ liệu MySQL đã tạo trong Docker. Chỉ dùng khi muốn reset database từ đầu.

---

## 7. Chạy lại sau khi đã build một lần

Nếu không sửa Dockerfile hoặc dependency, có thể chạy nhanh hơn bằng:

```powershell
docker compose up
```

Nếu đã sửa code, dependency, Dockerfile hoặc muốn build lại chắc chắn:

```powershell
docker compose up --build
```

---

## 8. Các lỗi thường gặp

### Lỗi 1: `docker is not recognized`

Nghĩa là Windows chưa nhận lệnh Docker.

Cách xử lý:

1. Cài Docker Desktop.
2. Mở Docker Desktop.
3. Đóng PowerShell cũ.
4. Mở PowerShell mới.
5. Chạy lại:

```powershell
docker --version
```

Nếu vẫn lỗi, kiểm tra Docker CLI:

```powershell
Test-Path "C:\Program Files\Docker\Docker\resources\bin\docker.exe"
```

Nếu trả về `True`, thêm Docker vào PATH tạm thời:

```powershell
$env:Path += ";C:\Program Files\Docker\Docker\resources\bin"
docker --version
```

### Lỗi 2: Port `3000` hoặc `8080` bị chiếm

Nguyên nhân thường là bạn đang chạy frontend/backend riêng.

Kiểm tra:

```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
```

Dừng terminal đang chạy frontend/backend bằng `Ctrl + C`, sau đó chạy lại:

```powershell
docker compose up --build
```

### Lỗi 3: Port MySQL `3306` bị chiếm

Nếu máy bạn đang chạy MySQL local ở port `3306`, Docker Compose có thể báo lỗi kiểu:

```text
ports are not available: exposing port TCP 0.0.0.0:3306
```

Dự án đã cấu hình MySQL Docker dùng port ngoài `3307` để tránh xung đột:

```yml
ports:
  - "3307:3306"
```

Backend trong Docker vẫn kết nối nội bộ tới `mysql:3306`, nên thay đổi này không làm hỏng backend.

Nếu cần kết nối MySQL Docker từ MySQL Workbench hoặc DBeaver, dùng:

```text
Host: localhost
Port: 3307
User: root
Password: 123456
Database: rental_room_db
```

### Lỗi 4: MySQL không khởi động hoặc dữ liệu bị sai

Nếu muốn reset database Docker từ đầu:

```powershell
docker compose down -v
docker compose up --build
```

Lưu ý: lệnh này xóa dữ liệu cũ trong MySQL Docker.

### Lỗi 5: Docker Desktop báo WSL lỗi

Mở PowerShell bằng quyền Administrator và chạy:

```powershell
wsl --update
wsl --shutdown
```

Sau đó mở lại Docker Desktop.

---

## 9. Lệnh khuyến nghị khi demo đồ án

Trước khi demo:

```powershell
cd C:\Users\Minh\Documents\ChoThuePhongTroHomi
docker compose down
docker compose up --build
```

Sau khi hệ thống chạy xong, mở:

```text
http://localhost:3000
```

Nếu cần xem API:

```text
http://localhost:8080/swagger-ui.html
```

---

## 10. Ghi chú về cấu hình hiện tại

Trong `docker-compose.yml`, hệ thống đang dùng:

- MySQL image: `mysql:8.4`
- Database name: `rental_room_db`
- MySQL root password: `123456`
- MySQL host port: `3307`
- Backend port: `8080`
- Frontend port: `3000`
- Backend profile: `prod`
- Frontend API public URL: `http://localhost:8080/api/v1`

Khi deploy thật, cần đổi các giá trị nhạy cảm như:

- `MYSQL_ROOT_PASSWORD`
- `JWT_SECRET`
- cấu hình `COOKIE_SECURE`
- cấu hình domain/CORS

Với mục đích chạy local/demo đồ án, cấu hình hiện tại có thể dùng được.
