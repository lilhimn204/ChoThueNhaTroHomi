# 01. Tổng Quan Dự Án Homi

## 1. Giới thiệu

Homi là website hỗ trợ tìm kiếm, đăng tin và quản lý phòng trọ tại Hà Nội. Hệ thống tập trung vào các nhu cầu chính: người thuê tìm phòng nhanh, chủ tin quản lý phòng và yêu cầu liên hệ, admin kiểm duyệt dữ liệu, còn đội vận hành có CMS để quản lý tin tức/bài viết.

Dự án được xây dựng theo kiến trúc full-stack tách riêng frontend, backend và database:

- Frontend Next.js đảm nhiệm giao diện người dùng, routing, trạng thái UI và các API route trung gian.
- Backend Spring Boot đảm nhiệm REST API, xác thực, phân quyền, nghiệp vụ và kết nối MySQL.
- Database MySQL lưu người dùng, phòng, tiện ích, liên hệ, báo cáo, tin tức, hỗ trợ và token.

## 2. Mục tiêu sản phẩm

- Người thuê có thể xem danh sách phòng, lọc theo tiêu chí, xem chi tiết, lưu phòng và gửi yêu cầu liên hệ.
- Người dùng có thể đăng ký bằng email/password kèm OTP hoặc đăng nhập nhanh bằng Google.
- Chủ tin có thể đăng phòng, sửa phòng, đổi trạng thái và theo dõi khách liên hệ.
- Admin có thể quản lý phòng, người dùng, tin tức, báo cáo, hỗ trợ và yêu cầu liên hệ.
- CMS cung cấp khu vực quản lý nội dung riêng, chuyên nghiệp hơn khu admin cơ bản.
- Website hỗ trợ light mode/dark mode, responsive desktop/tablet/mobile.

## 3. Actor chính

| Actor | Vai trò |
|---|---|
| Khách chưa đăng nhập | Xem trang chủ, danh sách phòng, chi tiết phòng, tin tức, hỗ trợ |
| Người dùng | Đăng nhập, lưu phòng, gửi liên hệ, xem lịch sử, chỉnh hồ sơ |
| Người đăng tin | Tạo/sửa/xóa phòng trong khu host, xem khách liên hệ |
| Admin | Quản trị toàn hệ thống, người dùng, phòng, tin tức, hỗ trợ |
| Biên tập nội dung | Dùng CMS để quản lý bài viết, danh mục, media |

Ghi chú: hệ thống hiện chưa tách role `HOST`; khu chủ trọ dùng người dùng đã đăng nhập. Role kỹ thuật chính là `USER` và `ADMIN`.

## 4. Module chức năng

### Tìm phòng

- Danh sách phòng tại `/rooms`.
- Chi tiết phòng tại `/rooms/[slug]`.
- Lọc theo khu vực, loại phòng, giá, diện tích, tiện ích, trạng thái.
- Loại phòng gồm căn hộ chung cư, chung cư mini/căn hộ dịch vụ, nhà riêng, nhà trọ/phòng trọ.

### Tài khoản và xác thực

- Đăng ký local bằng OTP gửi Gmail.
- Đăng nhập email/password.
- Đăng nhập Google bằng Google ID token.
- Quên mật khẩu bằng OTP.
- Hồ sơ cá nhân tách thành tab chỉnh sửa thông tin và cài đặt tài khoản.
- User Google chưa có password có thể tạo password để đăng nhập bằng email/password.

### Người dùng

- Lưu phòng yêu thích.
- Xem lịch sử liên hệ.
- Cập nhật họ tên, email, số điện thoại, avatar.
- Đổi mật khẩu hoặc tạo mật khẩu nếu đăng nhập bằng Google.

### Host

- Dashboard tổng quan.
- Quản lý bài đăng phòng.
- Tạo/sửa/xóa/cập nhật trạng thái phòng.
- Xem và xử lý khách liên hệ.
- Cập nhật hồ sơ cho thuê.

### Admin

- Tổng quan dashboard.
- Quản lý phòng.
- Quản lý tin tức.
- Quản lý người dùng, khóa/mở khóa, xác minh email, phân quyền.
- Quản lý yêu cầu liên hệ.
- Quản lý báo cáo tin đăng.
- Quản lý ticket hỗ trợ.

### CMS

- Dashboard CMS.
- Quản lý bài viết/tin tức.
- Tạo, sửa, xem trước, xóa bài viết.
- Quản lý danh mục.
- Quản lý media và cấu hình xuất bản.

### Tin tức, Khám phá, Hỗ trợ

- Trang tin tức public và chi tiết bài viết.
- Dropdown “Khám phá” gồm kinh nghiệm thuê phòng, mẹo tránh lừa đảo, khu vực phổ biến, cẩm nang sinh viên/người đi làm, checklist.
- Dropdown “Hỗ trợ” gồm hướng dẫn, FAQ, báo cáo tin sai, liên hệ, chính sách bảo mật, điều khoản sử dụng.

## 5. Kiến trúc tổng quan

```text
Người dùng
  -> Next.js App Router
  -> Next.js API route BFF
  -> Spring Boot REST API
  -> MySQL rental_room_db
```

Frontend không gọi trực tiếp tất cả API cần xác thực. Các request đăng nhập, refresh token và proxy auth đi qua `frontend/app/api`. Backend kiểm tra JWT và role bằng Spring Security.

## 6. Trạng thái triển khai hiện tại

- Website đã có đầy đủ nhóm trang public, auth, profile, host, admin, CMS, news, support và explore.
- Auth Google, OTP đăng ký, quên mật khẩu, SMTP Gmail đã được tích hợp ở backend/frontend.
- Database MySQL local `3306` đang là nguồn dữ liệu chính khi chạy Docker backend bằng `host.docker.internal:3306`.
- Docker MySQL vẫn còn nhưng nằm trong profile `docker-db`, dùng khi cần môi trường database riêng.

## 7. Phạm vi nên cẩn thận khi nâng cấp

- Không tự ý đổi role hoặc thêm `HOST` nếu chưa thiết kế lại phân quyền host.
- Không đổi URL public/API cũ nếu không cần thiết.
- Khi thêm field database phải có migration an toàn cho dữ liệu cũ.
- Khi sửa auth phải kiểm tra đủ local login, Google login, OTP, reset password, refresh token và quyền admin.
