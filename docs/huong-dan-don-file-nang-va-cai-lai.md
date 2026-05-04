# Hướng Dẫn Dọn File Nặng Và Cài Lại

Tài liệu này dùng khi thư mục dự án quá nặng, làm IDE như Antigravity quét chậm hoặc không mở được. Các lệnh dưới đây chỉ xóa cache, dependencies hoặc build output có thể tạo lại.

## 1. Những thư mục có thể xóa an toàn

Có thể xóa:

- `frontend/node_modules`
- `frontend/.next`
- `backend/target`
- `.next` nếu có ở thư mục gốc
- log tạm như `*.log`

Không nên xóa:

- `database/mysql`
- `frontend/app`, `frontend/components`, `frontend/lib`, `frontend/types`
- `backend/src`
- `.env` nếu đang chứa cấu hình local
- thư mục upload nếu đang dùng dữ liệu ảnh thật

## 2. Lệnh xóa an toàn trên PowerShell

Chạy ở thư mục gốc dự án:

```powershell
Remove-Item -Recurse -Force .\frontend\node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\frontend\.next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\backend\target -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\.next -ErrorAction SilentlyContinue
Get-ChildItem -Recurse -Filter *.log | Remove-Item -Force -ErrorAction SilentlyContinue
```

Mức này thường giảm dung lượng nhiều nhất mà không ảnh hưởng source code.

## 3. Cài lại sau khi xóa

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

Backend:

```powershell
cd backend
.\mvnw.cmd test
.\mvnw.cmd spring-boot:run
```

Docker:

```powershell
docker compose up -d --build backend frontend
```

Nếu muốn chạy kèm MySQL Docker:

```powershell
docker compose --profile docker-db up -d --build
```

## 4. Exclude trong IDE

Nên exclude các thư mục sau khỏi index của Antigravity/IDE:

- `frontend/node_modules`
- `frontend/.next`
- `backend/target`
- `.git`
- Docker volumes nếu nằm trong workspace

## 5. Kiểm tra dung lượng

PowerShell:

```powershell
Get-ChildItem -Directory | ForEach-Object {
  $size = (Get-ChildItem $_.FullName -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
  [PSCustomObject]@{ Name = $_.Name; SizeMB = [math]::Round($size / 1MB, 2) }
} | Sort-Object SizeMB -Descending
```

## 6. Ghi chú

- Xóa `node_modules` xong bắt buộc chạy lại `npm install`.
- Xóa `.next` xong Next.js sẽ build lại khi `npm run dev` hoặc `npm run build`.
- Xóa `backend/target` xong Maven sẽ compile lại.
- Không xóa database nếu muốn giữ dữ liệu hiện tại.
