# 04. Phân Tích Chức Năng

## 1. Nhóm chức năng public

### Trang chủ

- Giới thiệu Homi.
- Điều hướng nhanh tới tìm phòng, đăng tin, tin tức, hỗ trợ.
- Hiển thị phòng nổi bật/thống kê tùy dữ liệu backend.

### Tìm phòng

- Route: `/rooms`.
- Tìm kiếm theo từ khóa.
- Lọc theo khu vực, giá, diện tích, tiện ích, trạng thái và loại phòng.
- Sắp xếp theo mới đăng, giá, diện tích.
- Empty state rõ ràng khi không có kết quả.

Loại phòng đang hỗ trợ:

- Tất cả phòng: `/rooms`.
- Cho thuê căn hộ chung cư: `/rooms?type=apartment`.
- Cho thuê chung cư mini, căn hộ dịch vụ: `/rooms?type=mini-apartment`.
- Cho thuê nhà riêng: `/rooms?type=private-house`.
- Cho thuê nhà trọ, phòng trọ: `/rooms?type=boarding-room`.

### Chi tiết phòng

- Route: `/rooms/[slug]`.
- Hiển thị ảnh, giá, diện tích, địa chỉ, mô tả, tiện ích, trạng thái.
- Người dùng đăng nhập có thể lưu phòng.
- Có form gửi yêu cầu liên hệ/xem phòng.
- Có thể báo cáo tin sai nếu phát hiện nội dung không chính xác.

### Tin tức

- Route danh sách: `/news`.
- Route chi tiết: `/news/[slug]`.
- Hiển thị ảnh, tiêu đề, mô tả ngắn, ngày đăng, tác giả, danh mục.
- Layout tin tức có bài nổi bật, danh sách bài viết và sidebar bài xem nhiều/nội dung liên quan tùy dữ liệu.

### Khám phá

Dropdown “Khám phá” gồm:

- Kinh nghiệm thuê phòng.
- Mẹo tránh lừa đảo.
- Khu vực thuê phòng phổ biến.
- Cẩm nang cho sinh viên, người đi làm.
- Checklist trước khi thuê phòng.

Mục khu vực phổ biến có nút xem phòng theo query khu vực, ví dụ `/rooms?district=Cầu%20Giấy`.

### Hỗ trợ

Dropdown “Hỗ trợ” gồm:

- Hướng dẫn tìm phòng.
- Câu hỏi thường gặp.
- Báo cáo tin sai.
- Liên hệ Homi.
- Chính sách bảo mật.
- Điều khoản sử dụng.

Form báo cáo và liên hệ gửi dữ liệu về backend để admin xử lý.

## 2. Auth và tài khoản

### Đăng ký email/password

- User nhập họ tên, email, số điện thoại, mật khẩu.
- Backend kiểm tra email trùng.
- Backend tạo OTP 6 số, hash OTP và lưu thời hạn.
- Gửi OTP qua Gmail SMTP nếu mail được bật.
- User nhập OTP để kích hoạt tài khoản.
- Sau xác minh, backend cấp token đăng nhập.

### Đăng nhập Google

- Frontend hiển thị nút “Đăng nhập bằng Google”.
- Google trả về ID token.
- Backend xác minh ID token bằng `GOOGLE_CLIENT_ID`.
- Nếu email chưa tồn tại, backend tạo user mới với `authProvider=GOOGLE`, `emailVerified=true`, role `USER`.
- Nếu email đã tồn tại, backend đăng nhập hoặc liên kết theo email.

### Quên mật khẩu

- User nhập email.
- Backend sinh OTP reset password và gửi mail.
- User nhập OTP, mật khẩu mới và xác nhận.
- Sau reset, tài khoản được đánh dấu đã cấu hình password.

### Hồ sơ cá nhân

Route: `/profile`.

Tab “Chỉnh sửa thông tin”:

- Họ tên.
- Email nếu cho phép.
- Số điện thoại.
- Avatar.

Tab “Cài đặt tài khoản”:

- User local hoặc user đã có password: đổi mật khẩu.
- User Google chưa có password: tạo mật khẩu cho tài khoản.
- Hiển thị trạng thái đăng nhập bằng Google/local.

## 3. Người dùng đăng nhập

- Lưu/bỏ lưu phòng.
- Xem danh sách phòng đã lưu tại `/saved-rooms`.
- Xem lịch sử liên hệ tại `/contact-history`.
- Nhận thông báo chưa đọc qua API notifications.

## 4. Khu host

Route chính:

- `/host/dashboard`.
- `/host/posts`.
- `/host/posts/create`.
- `/host/posts/[id]/edit`.
- `/host/customers`.
- `/host/profile`.

Chức năng:

- Xem số liệu tổng quan.
- Tạo, sửa, xóa bài đăng.
- Chọn loại phòng khi đăng/sửa.
- Upload ảnh phòng.
- Quản lý trạng thái phòng.
- Xem khách liên hệ và cập nhật trạng thái xử lý.
- Cập nhật hồ sơ cho thuê.

## 5. Khu admin

Route chính:

- `/admin`.
- `/admin/rooms`.
- `/admin/news`.
- `/admin/users`.
- `/admin/contact-requests`.
- `/admin/room-reports`.
- `/admin/support-tickets`.

Chức năng:

- Dashboard tổng quan và biểu đồ.
- Quản lý phòng toàn hệ thống.
- Quản lý tin tức cơ bản.
- Quản lý người dùng: tìm kiếm, khóa/mở khóa, phân quyền, xác minh email.
- Xem và xử lý yêu cầu liên hệ.
- Xem và xử lý báo cáo tin đăng.
- Xem và xử lý ticket hỗ trợ.
- Có nút mở CMS cho admin.

## 6. CMS

Route chính:

- `/cms`.
- `/cms/articles`.
- `/cms/articles/create`.
- `/cms/articles/[id]/edit`.
- `/cms/articles/[id]/preview`.
- `/cms/categories`.
- `/cms/media`.
- `/cms/settings`.

Chức năng:

- Quản lý bài viết/tin tức chuyên sâu hơn admin cơ bản.
- Tạo/sửa/xem trước/xóa bài.
- Quản lý danh mục.
- Quản lý ảnh/media.
- Thiết lập nội dung và quy trình xuất bản.

## 7. Upload và ảnh

- Upload phòng: `POST /api/v1/uploads/rooms`.
- Upload avatar: `POST /api/v1/uploads/avatars`.
- Upload tin tức: `POST /api/v1/uploads/news`.
- Backend xử lý lưu file theo `UPLOAD_DIRECTORY`.
- Frontend cần dùng domain ảnh hợp lệ với cấu hình Next Image hoặc dùng ảnh local/proxy.

## 8. Các yêu cầu phi chức năng

- Không để lộ token trong localStorage.
- Không log OTP hoặc secret.
- Validate input ở cả frontend và backend.
- UI phải dùng được ở light/dark mode.
- Mobile menu phải có đủ mục tìm phòng, khám phá, tin tức, hỗ trợ.
- Khi sửa database phải giữ tương thích dữ liệu cũ.
