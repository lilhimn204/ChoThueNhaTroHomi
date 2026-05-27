# 06. Trường Hợp Sử Dụng Hệ Thống Homi

## 1. Tác nhân

| Tác nhân | Mô tả |
|---|---|
| Khách | Chưa đăng nhập, xem nội dung công khai |
| Người dùng | Đã đăng nhập, tìm/lưu phòng, liên hệ, quản lý hồ sơ |
| Người đăng tin | Dùng khu host để quản lý phòng và khách liên hệ |
| Admin | Quản trị toàn bộ hệ thống |
| Biên tập/CMS | Quản lý nội dung tin tức/bài viết trong CMS |

## 2. Trường hợp sử dụng của khách

### UC-01: Xem trang chủ

- Mục tiêu: hiểu website và đi tới các chức năng chính.
- Tiền điều kiện: không cần đăng nhập.
- Kết quả: khách có thể chuyển sang tìm phòng, tin tức, hỗ trợ hoặc đăng nhập/đăng ký.

### UC-02: Tìm phòng

- Mục tiêu: tìm danh sách phòng phù hợp.
- Luồng chính:
  1. Khách mở `/rooms`.
  2. Nhập từ khóa hoặc chọn filter.
  3. Hệ thống gọi API danh sách phòng.
  4. Hệ thống hiển thị kết quả hoặc empty state.
- Query quan trọng: `type`, `district`, `minPrice`, `maxPrice`, `minArea`, `maxArea`, `amenities`, `status`, `sort`.

### UC-03: Xem chi tiết phòng

- Mục tiêu: xem đầy đủ thông tin phòng.
- Luồng chính:
  1. Khách click một phòng.
  2. Hệ thống mở `/rooms/[slug]`.
  3. Hiển thị ảnh, giá, địa chỉ, mô tả, tiện ích, trạng thái và form liên hệ.

### UC-04: Xem tin tức và bài hướng dẫn

- Mục tiêu: đọc thông tin hỗ trợ thuê phòng.
- Route: `/news`, `/news/[slug]`, `/support/*`, `/explore/*`.

## 3. Trường hợp sử dụng của người dùng

### UC-05: Đăng ký bằng email/password

- Mục tiêu: tạo tài khoản local.
- Luồng chính:
  1. User nhập thông tin đăng ký.
  2. Hệ thống gửi OTP qua email.
  3. User nhập OTP.
  4. Hệ thống kích hoạt tài khoản và đăng nhập.
- Ngoại lệ:
  - Email đã tồn tại.
  - OTP sai/hết hạn.
  - Gửi mail thất bại.

### UC-06: Đăng nhập bằng Google

- Mục tiêu: đăng nhập nhanh bằng tài khoản Google.
- Luồng chính:
  1. User bấm “Đăng nhập bằng Google”.
  2. Google trả ID token.
  3. Backend xác minh token.
  4. Hệ thống tạo/liên kết tài khoản và cấp token.
- Kết quả: tài khoản Google có `emailVerified=true`, `authProvider=GOOGLE`.

### UC-07: Đăng nhập bằng email/password

- Mục tiêu: đăng nhập tài khoản local hoặc Google đã tạo password.
- Điều kiện:
  - Tài khoản tồn tại.
  - Không bị khóa.
  - Email đã xác minh nếu là local.
  - Password đúng.

### UC-08: Quên mật khẩu

- Mục tiêu: đặt lại mật khẩu bằng OTP.
- Luồng chính:
  1. User nhập email ở `/forgot-password`.
  2. Hệ thống gửi OTP.
  3. User nhập OTP và mật khẩu mới.
  4. Backend cập nhật password hash.

### UC-09: Lưu phòng

- Mục tiêu: lưu phòng để xem lại.
- Điều kiện: đã đăng nhập.
- Kết quả: phòng xuất hiện tại `/saved-rooms`.

### UC-10: Gửi yêu cầu liên hệ

- Mục tiêu: gửi thông tin liên hệ/xem phòng tới chủ tin.
- Kết quả: yêu cầu xuất hiện ở lịch sử người dùng, khu host và admin.

### UC-11: Cập nhật hồ sơ

- Mục tiêu: cập nhật thông tin cá nhân.
- Dữ liệu: họ tên, email nếu cho phép, số điện thoại, avatar.
- Kết quả: thông tin mới được lưu và hiển thị lại trong profile/header.

### UC-12: Cài đặt tài khoản

- User local: đổi mật khẩu bằng mật khẩu cũ, mật khẩu mới, xác nhận.
- User Google chưa có password: tạo mật khẩu mới.
- User Google đã có password: đổi mật khẩu như user thường.

## 4. Trường hợp sử dụng của người đăng tin

### UC-13: Tạo bài đăng phòng

- Route: `/host/posts/create`.
- Dữ liệu: tiêu đề, mô tả, giá, diện tích, địa chỉ, khu vực, loại phòng, tiện ích, ảnh.
- Kết quả: backend tạo `rooms`, `room_images`, `room_amenities`.

### UC-14: Sửa bài đăng phòng

- Route: `/host/posts/[id]/edit`.
- Kết quả: thông tin phòng được cập nhật, bao gồm loại phòng/tag phân loại.

### UC-15: Quản lý trạng thái phòng

- Mục tiêu: bật/tắt, còn phòng/hết phòng hoặc trạng thái tương đương.
- Kết quả: danh sách public phản ánh trạng thái mới.

### UC-16: Xem khách liên hệ

- Route: `/host/customers`.
- Host xem yêu cầu và cập nhật trạng thái xử lý.

## 5. Trường hợp sử dụng của admin

### UC-17: Quản lý phòng

- Xem danh sách, tìm kiếm/lọc.
- Xem chi tiết.
- Tạo/sửa/xóa phòng.
- Cập nhật trạng thái.

### UC-18: Quản lý người dùng

- Xem danh sách.
- Tìm kiếm theo tên/email/số điện thoại.
- Lọc trạng thái.
- Khóa/mở khóa tài khoản.
- Phân quyền.
- Xác minh email thủ công.

### UC-19: Quản lý tin tức

- Xem danh sách.
- Thêm/sửa/xóa.
- Cập nhật trạng thái nháp/xuất bản.
- Xem trước bài viết.

### UC-20: Xử lý yêu cầu liên hệ, báo cáo, hỗ trợ

- Admin xem danh sách trong các trang tương ứng.
- Cập nhật trạng thái xử lý.
- Dùng dữ liệu để kiểm duyệt phòng và hỗ trợ người dùng.

## 6. Trường hợp sử dụng của CMS

### UC-21: Quản lý bài viết chuyên sâu

- Route: `/cms/articles`.
- Tạo, sửa, xem trước, xóa bài.
- Quản lý ảnh đại diện, danh mục, trạng thái, tác giả, ngày đăng.

### UC-22: Quản lý danh mục và media

- Route: `/cms/categories`, `/cms/media`.
- Tổ chức chủ đề bài viết và tài nguyên ảnh.

## 7. Ràng buộc chung

- Các thao tác admin/CMS yêu cầu role `ADMIN`.
- Các thao tác user yêu cầu đăng nhập.
- Không cho login tài khoản local chưa xác minh email.
- Không để lộ OTP, token hoặc secret trong console.
