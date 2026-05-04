# 09. Đánh Giá Hệ Thống

## 1. Điểm mạnh hiện tại

### Kiến trúc rõ

Homi tách frontend, backend và database. Frontend Next.js chịu trách nhiệm trải nghiệm người dùng và BFF, backend Spring Boot xử lý nghiệp vụ và bảo mật, MySQL lưu dữ liệu quan hệ.

### Chức năng đầy đủ cho đồ án

Hệ thống đã có nhiều nhóm chức năng thực tế:

- Tìm phòng và lọc phòng.
- Chi tiết phòng, lưu phòng, gửi liên hệ.
- Auth local OTP, Google login, quên mật khẩu.
- Hồ sơ cá nhân và cài đặt tài khoản.
- Khu host quản lý bài đăng.
- Khu admin quản lý phòng, user, tin tức, hỗ trợ, báo cáo.
- CMS riêng cho bài viết/tin tức.
- Trang support, explore, news.

### Bảo mật tốt hơn mức cơ bản

- JWT và refresh token.
- Token lưu trong HttpOnly cookie qua BFF.
- OTP hash thay vì plain text.
- Google login xác minh bằng backend.
- User local phải verify email.
- Admin route/API tách riêng.

### Database có quan hệ nghiệp vụ rõ

Các bảng phòng, tiện ích, quận, người dùng, liên hệ, báo cáo, tin tức được tổ chức theo quan hệ phù hợp với bài toán thuê phòng.

## 2. Hạn chế hiện tại

### Chưa tách role host

Khu host hiện dùng user đăng nhập, chưa có role `HOST`. Điều này đơn giản và ít rủi ro cho giai đoạn hiện tại, nhưng nếu triển khai thật nên tách quyền chủ trọ.

### Migration còn nhiều file thủ công

Database đã qua nhiều lần nâng cấp, có nhiều migration SQL. Khi báo cáo đồ án nên mô tả đây là lịch sử nâng cấp, còn schema tổng hợp mới nhất nằm ở `01_schema.sql`.

### CMS còn có thể chuyên nghiệp hơn

CMS đã có route riêng và CRUD bài viết/danh mục/media/settings, nhưng có thể nâng cấp thêm workflow duyệt bài, lịch xuất bản, revision history và audit log.

### Chưa có CI/CD hoàn chỉnh

Dự án có lệnh test/build nhưng chưa thấy pipeline deploy chính thức. Khi deploy thật nên có môi trường staging/production, backup database, HTTPS và secret manager.

## 3. Rủi ro cần chú ý khi sửa code

- Sửa auth dễ ảnh hưởng login local, Google login, OTP và refresh token.
- Sửa database cần migration tương thích dữ liệu cũ.
- Sửa room type phải đồng bộ frontend query, backend enum, form đăng tin và admin/host.
- Sửa admin user phải tránh tự khóa admin hoặc mất quyền admin.
- Sửa upload ảnh cần kiểm tra domain Next Image và đường dẫn file backend.
- Sửa Docker/database cần đảm bảo backend đang trỏ đúng MySQL local hoặc Docker theo nhu cầu.

## 4. Đánh giá theo tiêu chí đồ án

| Tiêu chí | Đánh giá |
|---|---|
| Phân tích nghiệp vụ | Tốt, có nhiều actor và use case thực tế |
| Thiết kế database | Tốt, có quan hệ rõ và nhiều bảng nghiệp vụ |
| Backend API | Tốt, chia controller/service/repository |
| Frontend UI | Khá tốt, có responsive, dark mode, nhiều trang |
| Auth/bảo mật | Tốt cho đồ án, có OTP, Google, JWT, HttpOnly cookie |
| Admin/CMS | Mạnh hơn đồ án CRUD cơ bản |
| Deploy | Cần hoàn thiện nếu muốn chạy production |
| Test | Có nền tảng nhưng nên bổ sung test theo luồng nghiệp vụ |

## 5. Gợi ý nâng cấp tiếp

Nâng cấp ưu tiên cao:

- Tách role `HOST`.
- Thêm audit log admin.
- Thêm rate limit cho auth/OTP/support.
- Thêm test E2E cho auth, room CRUD, admin user.
- Hoàn thiện deploy VPS/Vercel/Render tùy kiến trúc.

Nâng cấp trải nghiệm:

- Bộ lọc phòng lưu trạng thái tốt hơn.
- Gợi ý phòng liên quan theo khu vực/giá/tiện ích.
- CMS có preview giống public page.
- Notification realtime hoặc polling tối ưu.

Nâng cấp dữ liệu:

- Backup/restore database.
- Seed dữ liệu chuẩn cho demo.
- Chuẩn hóa ảnh và xử lý ảnh lỗi.

## 6. Kết luận

Homi hiện đã đủ độ lớn và đủ nhóm chức năng để dùng làm đồ án full-stack. Điểm nổi bật là hệ thống không chỉ CRUD cơ bản mà có auth nâng cao, phân quyền, admin, CMS, support flow và nhiều luồng người dùng thực tế. Khi trình bày đồ án, nên nhấn mạnh kiến trúc tách lớp, cơ chế bảo mật auth và khả năng mở rộng module.
