# 05. Luồng Hoạt Động Hệ Thống

## 1. Luồng đăng ký email bằng OTP

```text
User nhập form đăng ký
  -> Frontend gọi /api/auth/register
  -> Next.js BFF gọi POST /api/v1/auth/register
  -> Backend validate dữ liệu và email trùng
  -> Tạo/cập nhật user local chưa xác minh
  -> Sinh OTP 6 số, hash OTP, lưu hạn dùng
  -> Gửi OTP qua Gmail SMTP
  -> Frontend chuyển sang bước nhập OTP
  -> User nhập OTP
  -> POST /api/v1/auth/verify-otp
  -> Backend kiểm tra hash, hạn dùng, số lần thử
  -> Kích hoạt tài khoản, cấp access/refresh token
```

Điểm cần kiểm tra:

- OTP không lưu plain text.
- OTP có thời hạn, số lần nhập sai và số lần gửi lại.
- Nếu gửi mail thất bại, frontend hiển thị lỗi rõ.
- User local chưa verify không được đăng nhập.

## 2. Luồng gửi lại OTP đăng ký

```text
User bấm gửi lại OTP
  -> Frontend gọi /api/auth/resend-otp
  -> Backend kiểm tra email, trạng thái verify, cooldown, resend count
  -> Sinh OTP mới, hash và gửi mail
```

Nếu quá số lần gửi hoặc đang trong cooldown, backend trả lỗi nghiệp vụ để frontend hiển thị.

## 3. Luồng đăng nhập email/password

```text
User nhập email/password
  -> Frontend gọi /api/auth/login
  -> Backend xác thực password hash
  -> Kiểm tra user không bị khóa
  -> Kiểm tra emailVerified=true
  -> Cấp access token và refresh token
  -> Next.js lưu token vào HttpOnly cookie
  -> Điều hướng về trang phù hợp
```

## 4. Luồng đăng nhập Google

```text
User bấm Đăng nhập bằng Google
  -> Google Identity trả ID token
  -> Frontend gọi /api/auth/google
  -> Backend xác minh ID token với Google client id
  -> Tìm user theo googleId hoặc email
  -> Nếu chưa có, tạo user authProvider=GOOGLE, emailVerified=true, role USER
  -> Nếu đã có, đăng nhập/liên kết theo email
  -> Cấp token
  -> Frontend cập nhật trạng thái đăng nhập
```

Google login không cần OTP vì email đã được Google xác thực. Nếu user Google chưa có mật khẩu local, hồ sơ sẽ hiển thị chức năng tạo mật khẩu.

## 5. Luồng quên mật khẩu

```text
User nhập email
  -> POST /api/v1/auth/forgot-password
  -> Backend kiểm tra user tồn tại
  -> Sinh OTP reset password, hash, lưu hạn dùng
  -> Gửi email
  -> User nhập OTP + mật khẩu mới
  -> POST /api/v1/auth/reset-password
  -> Backend kiểm tra OTP, đổi password hash
  -> Đánh dấu passwordConfigured=true
```

## 6. Luồng tạo mật khẩu cho user Google

```text
User Google vào /profile
  -> Frontend lấy /api/v1/users/me
  -> Nếu authProvider=GOOGLE và passwordConfigured=false
  -> Hiển thị form tạo mật khẩu
  -> PUT /api/v1/users/me/password/setup
  -> Backend validate mật khẩu mới
  -> Lưu password hash, passwordConfigured=true
  -> User có thể đăng nhập bằng Google hoặc email/password
```

Nếu user đã có password, frontend hiển thị form đổi mật khẩu truyền thống.

## 7. Luồng tìm phòng

```text
User mở /rooms hoặc click dropdown Tìm phòng
  -> Frontend đọc query: type, district, price, area, amenities, status, sort
  -> Gọi GET /api/v1/rooms qua public proxy hoặc API client
  -> Backend lọc bằng RoomService/repository
  -> Trả danh sách phòng
  -> Frontend render cards hoặc empty state
```

Query loại phòng:

- `type=apartment`
- `type=mini-apartment`
- `type=private-house`
- `type=boarding-room`

Backend ánh xạ sang enum:

- `APARTMENT`
- `MINI_APARTMENT`
- `PRIVATE_HOUSE`
- `BOARDING_ROOM`

## 8. Luồng lưu phòng

```text
User bấm lưu phòng
  -> Nếu chưa đăng nhập, điều hướng đăng nhập
  -> Nếu đã đăng nhập, gọi POST /api/v1/saved-rooms/{roomId}
  -> Backend toggle hoặc lưu trạng thái
  -> Frontend cập nhật icon/trạng thái
```

Danh sách phòng đã lưu lấy từ `GET /api/v1/saved-rooms`.

## 9. Luồng gửi yêu cầu liên hệ

```text
User gửi form liên hệ/xem phòng
  -> POST /api/v1/contact-requests
  -> Backend lưu request, liên kết user/room nếu có
  -> Host xem trong /host/customers
  -> Admin xem trong /admin/contact-requests
```

## 10. Luồng báo cáo tin sai và liên hệ Homi

Báo cáo tin sai:

```text
/support/bao-cao-tin-sai hoặc chi tiết phòng
  -> POST /api/v1/room-reports
  -> Admin xử lý tại /admin/room-reports
```

Liên hệ Homi:

```text
/support/lien-he
  -> POST /api/v1/support-tickets
  -> Admin xử lý tại /admin/support-tickets
```

## 11. Luồng đăng tin host

```text
Host mở /host/posts/create
  -> Nhập thông tin phòng, loại phòng, giá, diện tích, khu vực, tiện ích
  -> Upload ảnh nếu có
  -> POST /api/v1/host/rooms
  -> Backend validate và lưu rooms, room_images, room_amenities
  -> Phòng xuất hiện ở danh sách nếu trạng thái phù hợp
```

Sửa phòng dùng `PUT /api/v1/host/rooms/{roomId}`. Xóa phòng dùng `DELETE /api/v1/host/rooms/{roomId}`.

## 12. Luồng admin quản lý người dùng

```text
Admin mở /admin/users
  -> GET /api/v1/admin/users
  -> Tìm kiếm/lọc trạng thái
  -> Xem chi tiết user
  -> PATCH status để khóa/mở khóa
  -> PATCH roles để phân quyền
  -> PATCH verify-email để xác minh email thủ công
```

Backend phải chặn thao tác nguy hiểm như tự khóa chính admin hiện tại nếu có logic bảo vệ.

## 13. Luồng tin tức/CMS

Công khai:

```text
User mở /news
  -> GET /api/v1/news
  -> Hiển thị bài đã xuất bản
  -> Click bài -> /news/[slug] -> GET /api/v1/news/{slug}
```

Quản trị/CMS:

```text
Admin mở /cms/articles hoặc /admin/news
  -> GET /api/v1/admin/news
  -> Tạo/sửa/xóa/cập nhật trạng thái bài viết
  -> Upload ảnh bằng /api/v1/uploads/news
  -> Người dùng công khai chỉ thấy bài đã xuất bản
```
