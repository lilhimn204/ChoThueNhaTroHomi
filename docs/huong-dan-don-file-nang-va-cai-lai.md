# Hướng Dẫn Dọn File Nặng Và Cài Lại

Tài liệu này dùng khi thư mục dự án quá nặng, làm IDE như Antigravity quét chậm hoặc không mở được.

## 1. Các thư mục có thể xóa an toàn

Các thư mục/file dưới đây là cache, build output hoặc dependencies có thể tạo lại:

```text
frontend/.next
frontend/node_modules
frontend/tsconfig.tsbuildinfo
backend/target
*.log
```

Không xóa các file này:

```text
frontend/package.json
frontend/package-lock.json
backend/pom.xml
docker-compose.yml
database/mysql
```

## 2. Xóa cache nhẹ trước

Chạy trong PowerShell:

```powershell
cd C:\Users\Minh\Documents\ChoThuePhongTroHomi

Remove-Item -Recurse -Force frontend\.next -ErrorAction SilentlyContinue
Remove-Item -Force frontend\tsconfig.tsbuildinfo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force backend\target -ErrorAction SilentlyContinue
Remove-Item -Force frontend\codex-dev-server.log -ErrorAction SilentlyContinue
Remove-Item -Force frontend\codex-dev-server.err.log -ErrorAction SilentlyContinue
Remove-Item -Force backend\backend-run.log -ErrorAction SilentlyContinue
```

Sau bước này source code, database và Docker không bị ảnh hưởng.

## 3. Nếu vẫn nặng, xóa node_modules

`frontend/node_modules` thường nặng khoảng 500MB trở lên. Có thể xóa:

```powershell
cd C:\Users\Minh\Documents\ChoThuePhongTroHomi

Remove-Item -Recurse -Force frontend\node_modules -ErrorAction SilentlyContinue
```

Sau khi xóa `node_modules`, nếu chạy frontend local thì phải cài lại dependencies.

## 4. Cài lại và chạy frontend local

```powershell
cd C:\Users\Minh\Documents\ChoThuePhongTroHomi\frontend

npm install
npm run dev
```

Frontend local thường chạy ở:

```text
http://localhost:3000
```

## 5. Chạy lại bằng Docker

Nếu chỉ chạy bằng Docker thì không cần `npm install` ngoài máy host. Chạy:

```powershell
cd C:\Users\Minh\Documents\ChoThuePhongTroHomi

docker compose up -d --build backend frontend
```

Sau đó mở:

```text
http://localhost:3000
```

## 6. Cấu hình Antigravity nên bỏ qua

Trong Antigravity, nếu có mục Exclude, Ignore Files hoặc Indexing, thêm:

```text
frontend/.next
frontend/node_modules
backend/target
backups
```

Các thư mục này không cần quét để hiểu source code.
