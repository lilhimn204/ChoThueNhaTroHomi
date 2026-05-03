# 🧹 Hướng Dẫn Xoá File Nặng & Cài Lại Dự Án Homi

> Tài liệu này hướng dẫn cách xoá các file/folder tạm chiếm nhiều dung lượng trong dự án,
> và cách cài đặt lại để chạy website bình thường.

---

## 📊 Các Folder Nặng Trong Dự Án

| Folder | Dung lượng ước tính | Mô tả | Xoá được không? |
|--------|---------------------|--------|-----------------|
| `frontend/node_modules/` | ~500 MB | Thư viện JavaScript (tải từ npm) | ✅ An toàn |
| `frontend/.next/` | ~50 MB | Build cache của Next.js | ✅ An toàn |
| `backend/target/` | ~60 MB | Build output của Java/Maven | ✅ An toàn |

> ⚠️ **Lưu ý**: Các folder này **KHÔNG chứa code của bạn**. Chúng là file tạm được tạo tự động
> và đã được liệt kê trong `.gitignore`. Xoá hoàn toàn an toàn.

---

## 🗑️ Phần 1: Xoá Các Folder Nặng

### Cách 1: Dùng PowerShell (Windows)

Mở **Terminal** trong VS Code (nhấn `` Ctrl+` ``) hoặc mở **PowerShell**, rồi chạy:

```powershell
# ====================================
# XOÁ NODE_MODULES (Frontend - ~500MB)
# ====================================
Remove-Item -Recurse -Force "C:\Users\Minh\Documents\ChoThuePhongTroHomi\frontend\node_modules"

# ====================================
# XOÁ .NEXT BUILD CACHE (Frontend - ~50MB)
# ====================================
Remove-Item -Recurse -Force "C:\Users\Minh\Documents\ChoThuePhongTroHomi\frontend\.next"

# ====================================
# XOÁ TARGET (Backend - ~60MB)
# ====================================
Remove-Item -Recurse -Force "C:\Users\Minh\Documents\ChoThuePhongTroHomi\backend\target"
```

### Cách 2: Xoá thủ công

1. Mở **File Explorer**
2. Vào `C:\Users\Minh\Documents\ChoThuePhongTroHomi\`
3. Xoá các folder sau:
   - `frontend\node_modules`
   - `frontend\.next`
   - `backend\target`
4. Nhấn **Shift + Delete** để xoá vĩnh viễn (không vào Recycle Bin)

### Kiểm tra sau khi xoá

Chạy lệnh sau để xác nhận dung lượng đã giảm:

```powershell
cd C:\Users\Minh\Documents\ChoThuePhongTroHomi
Get-ChildItem -Directory | ForEach-Object {
    $size = (Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue |
             Measure-Object -Property Length -Sum).Sum
    [PSCustomObject]@{
        Name   = $_.Name
        SizeMB = [math]::Round($size/1MB, 1)
    }
} | Sort-Object SizeMB -Descending | Format-Table -AutoSize
```

> ✅ Sau khi xoá, tổng dung lượng dự án sẽ giảm từ **~620MB** xuống còn **~10MB**.

---

## 🔄 Phần 2: Cài Đặt Lại Khi Cần Chạy Website

### Bước 1: Cài lại Frontend (Next.js)

```powershell
# Di chuyển vào folder frontend
cd C:\Users\Minh\Documents\ChoThuePhongTroHomi\frontend

# Cài lại node_modules (mất khoảng 1-3 phút tuỳ mạng)
npm install

# Chạy website frontend (tự tạo lại .next)
npm run dev
```

> 🌐 Frontend sẽ chạy tại: **http://localhost:3000**

### Bước 2: Build lại Backend (Java/Spring Boot)

```powershell
# Di chuyển vào folder backend
cd C:\Users\Minh\Documents\ChoThuePhongTroHomi\backend

# Build lại project (tự tạo lại target/)
./mvnw clean package -DskipTests

# Hoặc chạy trực tiếp
./mvnw spring-boot:run
```

> 🌐 Backend sẽ chạy tại: **http://localhost:8080**

### Bước 3: Chạy bằng Docker Compose (Tuỳ chọn)

Nếu bạn dùng Docker:

```powershell
cd C:\Users\Minh\Documents\ChoThuePhongTroHomi
docker-compose up --build
```

---

## 💡 Mẹo Hữu Ích

### Khi nào nên xoá?
- Khi cần dùng **Antigravity/AI assistant** để chỉnh sửa code (workspace nhẹ hơn = phản hồi nhanh hơn)
- Khi ổ đĩa sắp đầy
- Khi muốn "clean build" lại từ đầu

### Khi nào KHÔNG nên xoá?
- Khi đang chạy website và cần dùng ngay
- Khi không có kết nối internet (vì `npm install` cần tải từ mạng)

### Script xoá nhanh (1 lệnh duy nhất)

Tạo file `clean.ps1` trong thư mục gốc dự án và paste nội dung sau:

```powershell
# clean.ps1 - Xoá tất cả file tạm
Write-Host "🧹 Đang xoá file tạm..." -ForegroundColor Yellow

$folders = @(
    "frontend\node_modules",
    "frontend\.next",
    "backend\target"
)

foreach ($folder in $folders) {
    $path = Join-Path $PSScriptRoot $folder
    if (Test-Path $path) {
        Remove-Item -Recurse -Force $path
        Write-Host "  ✅ Đã xoá: $folder" -ForegroundColor Green
    } else {
        Write-Host "  ⏭️  Không tồn tại: $folder" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "🎉 Hoàn tất! Dung lượng đã được giải phóng." -ForegroundColor Cyan
Write-Host "💡 Chạy 'npm install' trong frontend khi cần chạy lại website." -ForegroundColor Cyan
```

Chạy bằng lệnh:
```powershell
cd C:\Users\Minh\Documents\ChoThuePhongTroHomi
powershell -ExecutionPolicy Bypass -File clean.ps1
```

---

## 📁 Cấu Trúc Dự Án (Sau Khi Xoá)

```
ChoThuePhongTroHomi/
├── frontend/           # Code giao diện (Next.js)
│   ├── app/            # Các trang
│   ├── components/     # Components UI
│   ├── services/       # API calls
│   ├── package.json    # Danh sách thư viện
│   └── ...
├── backend/            # Code server (Spring Boot)
│   ├── src/            # Source code Java
│   ├── pom.xml         # Danh sách dependencies
│   └── ...
├── database/           # Scripts database
├── docs/               # Tài liệu
├── docker-compose.yml  # Cấu hình Docker
└── .gitignore          # File ignore
```

> 📝 Tổng dung lượng code thực tế chỉ khoảng **~10MB** — rất nhẹ!
