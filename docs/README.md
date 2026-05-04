# Homi Docs

Bộ tài liệu này mô tả phiên bản hiện tại của website Homi để phục vụ làm đồ án, bảo trì code và cung cấp ngữ cảnh cho AI khi cần hỗ trợ phát triển tiếp.

## Tài liệu nên đọc trước

1. `00-ai-context-homi.md` - bản tóm tắt kỹ thuật dành cho AI và lập trình viên mới vào dự án.
2. `01-tong-quan-du-an.md` - mục tiêu, phạm vi và kiến trúc tổng quan.
3. `04-phan-tich-chuc-nang.md` - danh sách chức năng theo từng nhóm người dùng.
4. `07-database-va-api.md` - database, model chính và API backend.
5. `06-run-deploy-test-guide.md` - cách chạy, kiểm thử và cấu hình môi trường.

## Danh sách tài liệu

| File | Nội dung |
|---|---|
| `00-ai-context-homi.md` | Ngữ cảnh cô đọng cho AI: stack, routes, API, DB, auth, quy tắc phát triển |
| `01-tong-quan-du-an.md` | Tổng quan sản phẩm, actor, module và kiến trúc |
| `02-cong-nghe-su-dung.md` | Công nghệ frontend, backend, database, Docker |
| `03-cau-truc-thu-muc.md` | Cấu trúc thư mục và file quan trọng |
| `04-phan-tich-chuc-nang.md` | Phân tích chức năng website |
| `05-luong-hoat-dong-he-thong.md` | Luồng đăng ký, đăng nhập, OTP, phòng, tin tức, CMS |
| `06-use-case.md` | Use case chính theo actor |
| `07-database-va-api.md` | Bảng dữ liệu, entity, API public/auth/admin/CMS |
| `08-phan-quyen-nguoi-dung.md` | Xác thực, phân quyền, role và bảo mật |
| `09-danh-gia-he-thong.md` | Đánh giá hiện trạng, ưu điểm, hạn chế, hướng nâng cấp |
| `10-goi-y-viet-bao-cao-do-an.md` | Gợi ý đưa nội dung vào báo cáo đồ án |
| `huong-dan-don-file-nang-va-cai-lai.md` | Cách xóa cache/dependency nặng và cài lại an toàn |

## Ghi chú quan trọng

- Backend hiện ưu tiên dùng MySQL local `localhost:3306` thông qua `host.docker.internal:3306` khi chạy bằng Docker.
- Docker MySQL vẫn còn trong `docker-compose.yml` nhưng được đặt trong profile `docker-db`.
- Không ghi secret thật vào tài liệu hoặc commit. Chỉ mô tả tên biến môi trường cần cấu hình.
- Dự án hiện có role chính là `USER` và `ADMIN`. Khu chủ trọ đang dùng người dùng đã đăng nhập, chưa tách role `HOST`.
