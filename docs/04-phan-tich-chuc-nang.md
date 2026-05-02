# 04. Phân tích chức năng

## 1. Tổng quan chức năng

Homi được chia thành bốn nhóm chức năng tương ứng với bốn nhóm actor chính:

- Khách chưa đăng nhập.
- Người thuê phòng.
- Chủ trọ/người đăng tin.
- Admin.

Các chức năng được triển khai theo hướng website tìm và cho thuê phòng trọ: người dùng có thể tìm kiếm, xem chi tiết, lưu phòng, gửi yêu cầu xem phòng; người đăng tin có thể quản lý bài đăng và khách liên hệ; admin có thể quản lý toàn hệ thống.

## 2. Chức năng khách chưa đăng nhập

### 2.1. Xem trang chủ

Trang chủ giới thiệu Homi, hiển thị khu tìm kiếm nhanh, phòng nổi bật và các lợi ích khi sử dụng hệ thống. Người dùng có thể chuyển sang trang danh sách phòng hoặc đăng nhập/đăng ký.

File liên quan:

- `frontend/app/page.tsx`
- `frontend/components/rooms/hero-search-section.tsx`
- `frontend/components/rooms/featured-rooms-section.tsx`

API liên quan:

- `GET /api/v1/rooms/featured`
- `GET /api/v1/rooms/stats`

### 2.2. Tìm kiếm và lọc phòng

Người dùng truy cập trang danh sách phòng và có thể lọc theo:

- Từ khóa.
- Quận/huyện.
- Giá tối thiểu/tối đa.
- Diện tích tối thiểu/tối đa.
- Trạng thái phòng.
- Danh sách tiện ích.
- Kiểu sắp xếp: mới đăng, giá tăng/giảm, diện tích tăng/giảm.

Frontend quản lý trạng thái lọc bằng hook `useRoomSearch`, đồng bộ các tiêu chí lọc lên URL query string để người dùng có thể chia sẻ hoặc reload trang.

File liên quan:

- `frontend/app/rooms/page.tsx`
- `frontend/hooks/use-room-search.ts`
- `frontend/components/rooms/rooms-page-client.tsx`
- `frontend/components/rooms/filter-sidebar.tsx`
- `frontend/components/rooms/mobile-filter-drawer.tsx`
- `frontend/components/rooms/search-bar.tsx`

Backend liên quan:

- `RoomController.getRooms`
- `RoomService.searchPublicRooms`
- `RoomSpecifications.publicSearch`

API liên quan:

- `GET /api/v1/rooms`
- `GET /api/v1/districts`
- `GET /api/v1/amenities`

### 2.3. Xem chi tiết phòng

Người dùng xem thông tin đầy đủ của một phòng theo `slug`, gồm:

- Tiêu đề, mã tin, trạng thái.
- Địa chỉ, khu vực, giá, diện tích.
- Mô tả.
- Danh sách ảnh.
- Tiện ích.
- Người liên hệ và số điện thoại.
- Liên kết bản đồ.
- Form gửi yêu cầu xem phòng nếu đã đăng nhập.
- Form báo cáo tin nếu đã đăng nhập.
- Phòng gợi ý liên quan.

File liên quan:

- `frontend/app/rooms/[slug]/page.tsx`
- `frontend/components/rooms/room-detail-client.tsx`
- `frontend/components/forms/contact-form-card.tsx`
- `frontend/components/rooms/room-report-card.tsx`

API liên quan:

- `GET /api/v1/rooms/{slug}`
- `GET /api/v1/rooms` cho phòng gợi ý.

## 3. Chức năng xác thực tài khoản

### 3.1. Đăng ký bằng email và OTP

Người dùng nhập họ tên, email, số điện thoại và mật khẩu. Backend kiểm tra email chưa tồn tại, tạo user trạng thái `INACTIVE`, `enabled=false`, `emailVerified=false`, sinh OTP 6 chữ số, lưu hash OTP và gửi email nếu hệ thống mail được bật.

Sau khi người dùng nhập OTP hợp lệ:

- Backend đánh dấu `emailVerified=true`.
- Chuyển trạng thái user thành `ACTIVE`.
- Bật `enabled=true`.
- Xóa thông tin OTP.
- Cấp access token và refresh token.

File liên quan:

- `frontend/components/forms/auth-panel.tsx`
- `frontend/services/auth-service.ts`
- `frontend/app/api/auth/register/route.ts`
- `frontend/app/api/auth/verify-otp/route.ts`
- `backend/controller/AuthController.java`
- `backend/service/AuthService.java`
- `backend/service/EmailNotificationService.java`

API liên quan:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/verify-otp`
- `POST /api/v1/auth/resend-otp`

### 3.2. Đăng nhập bằng email/mật khẩu

Người dùng nhập email và mật khẩu. Backend xác thực bằng Spring Security, kiểm tra user đã kích hoạt và không bị khóa. Khi thành công, backend cấp token.

Frontend route handler nhận response từ backend, lưu access token và refresh token vào HttpOnly cookie, sau đó chỉ trả thông tin user về client.

API liên quan:

- `POST /api/v1/auth/login`
- Next.js BFF: `POST /api/auth/login`

### 3.3. Đăng nhập Google

Nếu có `GOOGLE_CLIENT_ID`, frontend hiển thị nút Google Identity Services. Sau khi Google trả về ID token, backend xác minh token qua Google tokeninfo API, kiểm tra audience, email verified và hạn token.

Nếu tài khoản chưa tồn tại, backend tạo user mới với provider `GOOGLE`. Nếu email đã tồn tại, backend liên kết tài khoản với Google ID nếu hợp lệ.

API liên quan:

- `POST /api/v1/auth/google`
- Next.js BFF: `POST /api/auth/google`

### 3.4. Refresh token và logout

Khi access token hết hạn, Next.js proxy tự gọi backend refresh token. Backend rotate refresh token: token cũ bị revoke và token mới được phát hành.

Khi logout, frontend gọi BFF logout. BFF gọi backend revoke refresh token rồi xóa cookie.

API liên quan:

- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- Next.js BFF: `POST /api/auth/logout`

## 4. Chức năng người thuê phòng

### 4.1. Cập nhật hồ sơ cá nhân

Người dùng đã đăng nhập có thể xem và cập nhật họ tên, số điện thoại, avatar. Có chức năng đổi mật khẩu cho tài khoản local.

File liên quan:

- `frontend/components/profile/profile-page-client.tsx`
- `frontend/components/forms/profile-form.tsx`
- `frontend/components/forms/password-change-form.tsx`
- `frontend/services/user-service.ts`
- `backend/controller/UserController.java`
- `backend/service/UserService.java`

API liên quan:

- `GET /api/v1/users/me`
- `PUT /api/v1/users/me`
- `PUT /api/v1/users/me/password`

### 4.2. Lưu phòng

Người dùng đã đăng nhập có thể lưu hoặc bỏ lưu phòng. Backend dùng cơ chế toggle:

- Nếu bản ghi `saved_rooms(user_id, room_id)` đã tồn tại thì xóa.
- Nếu chưa tồn tại thì tạo mới.

Frontend dùng `SaveRoomButton`, chỉ hiển thị khi người dùng đã đăng nhập.

File liên quan:

- `frontend/components/rooms/save-room-button.tsx`
- `frontend/components/rooms/saved-rooms-page-client.tsx`
- `frontend/services/saved-room-service.ts`
- `backend/controller/SavedRoomController.java`
- `backend/service/SavedRoomService.java`

API liên quan:

- `POST /api/v1/saved-rooms/{roomId}`
- `GET /api/v1/saved-rooms`
- `GET /api/v1/saved-rooms/{roomId}/status`
- `GET /api/v1/saved-rooms/batch`

### 4.3. Gửi yêu cầu liên hệ/xem phòng

Người dùng đã đăng nhập có thể gửi yêu cầu ở trang chi tiết phòng. Form gồm loại yêu cầu, họ tên, email, số điện thoại, thời gian muốn xem phòng và lời nhắn.

Backend xử lý:

- Kiểm tra user hợp lệ.
- Kiểm tra phòng tồn tại.
- Không cho gửi yêu cầu nếu phòng bị ẩn.
- Không cho chủ bài đăng gửi yêu cầu cho chính bài của mình.
- Lưu bản ghi `contact_requests`.
- Tạo thông báo cho chủ bài đăng và admin.
- Gửi email nếu cấu hình mail được bật.

API liên quan:

- `POST /api/v1/contact-requests`

### 4.4. Xem lịch sử liên hệ

Người dùng có thể xem các yêu cầu đã gửi, trạng thái xử lý và ghi chú admin nếu có.

File liên quan:

- `frontend/app/contact-history/page.tsx`
- `frontend/components/contact/contact-history-page-client.tsx`
- `frontend/services/contact-request-service.ts`

API liên quan:

- `GET /api/v1/contact-requests/me`

### 4.5. Báo cáo tin đăng

Người dùng đã đăng nhập có thể báo cáo bài đăng sai thông tin, trùng lặp, nghi ngờ lừa đảo, phòng không còn trống, nội dung không phù hợp hoặc lý do khác.

Backend không cho gửi báo cáo nếu phòng bị ẩn. Backend cũng không cho cùng một user gửi nhiều báo cáo đang mở cho cùng một phòng.

API liên quan:

- `POST /api/v1/room-reports`

## 5. Chức năng chủ trọ/người đăng tin

### 5.1. Ghi chú về phân quyền host

Hiện tại backend chưa có role `HOST`. Khu host chỉ yêu cầu đăng nhập. Quyền thao tác bài đăng được kiểm soát bằng quan hệ sở hữu:

- Bài đăng có trường `created_by`.
- Host chỉ lấy được bài đăng có `created_by` bằng user id hiện tại.
- Khi sửa/xóa/cập nhật trạng thái, backend gọi `ensureOwnedRoom`.

Do đó, trong báo cáo nên mô tả actor này là “Chủ trọ/người đăng tin”, không nhất thiết là một role kỹ thuật riêng trong database.

### 5.2. Dashboard host

Dashboard host hiển thị:

- Tổng bài đăng.
- Bài đang hiển thị.
- Bài đã ẩn/hết phòng.
- Tổng khách quan tâm.
- Danh sách yêu cầu liên hệ mới nhất.

API liên quan:

- `GET /api/v1/host/dashboard`

### 5.3. Quản lý bài đăng của tôi

Người đăng tin có thể:

- Tìm kiếm bài đăng theo từ khóa/mã tin.
- Lọc theo trạng thái.
- Tạo bài đăng mới.
- Sửa bài đăng.
- Ẩn/hiện bài đăng.
- Đánh dấu còn phòng/hết phòng.
- Xóa bài đăng.
- Xuất CSV.

File liên quan:

- `frontend/components/host/host-posts-client.tsx`
- `frontend/components/host/host-room-form.tsx`
- `frontend/services/host-service.ts`
- `backend/controller/HostController.java`
- `backend/service/HostService.java`

API liên quan:

- `GET /api/v1/host/rooms`
- `GET /api/v1/host/rooms/{roomId}`
- `POST /api/v1/host/rooms`
- `PUT /api/v1/host/rooms/{roomId}`
- `PATCH /api/v1/host/rooms/{roomId}/status`
- `DELETE /api/v1/host/rooms/{roomId}`

### 5.4. Quản lý khách liên hệ

Host xem danh sách yêu cầu liên hệ gắn với các bài đăng của mình và cập nhật trạng thái:

- `PENDING`: chưa xử lý.
- `IN_PROGRESS`: đã liên hệ/đang xử lý.
- `RESOLVED`: đã xử lý.
- `CANCELLED`: đã hủy/từ chối.

API liên quan:

- `GET /api/v1/host/contact-requests`
- `PATCH /api/v1/host/contact-requests/{requestId}/status`

### 5.5. Cập nhật hồ sơ host

Host có thể cập nhật họ tên, số điện thoại, avatar, địa chỉ và mô tả ngắn về người cho thuê.

API liên quan:

- `GET /api/v1/host/profile`
- `PUT /api/v1/host/profile`

## 6. Chức năng admin

### 6.1. Dashboard admin

Dashboard admin hiển thị:

- Tổng số bài đăng.
- Số phòng còn trống.
- Tổng số người dùng.
- Số yêu cầu đang chờ xử lý.
- Tổng số yêu cầu liên hệ.
- Bài đăng gần đây.
- Yêu cầu liên hệ gần đây.
- Biểu đồ phòng theo quận, yêu cầu theo trạng thái, phòng theo trạng thái.

API liên quan:

- `GET /api/v1/admin/dashboard`
- `GET /api/v1/admin/dashboard/charts`

### 6.2. Quản lý phòng

Admin có quyền toàn hệ thống:

- Tìm/lọc bài đăng.
- Tạo bài đăng.
- Cập nhật trạng thái bài đăng.
- Ẩn/hiện bài đăng.
- Đánh dấu còn phòng/hết phòng.
- Xóa bài đăng.
- Xuất CSV.

API liên quan:

- `GET /api/v1/admin/rooms`
- `GET /api/v1/admin/rooms/{roomId}`
- `POST /api/v1/admin/rooms`
- `PUT /api/v1/admin/rooms/{roomId}`
- `PATCH /api/v1/admin/rooms/{roomId}/status`
- `DELETE /api/v1/admin/rooms/{roomId}`

### 6.3. Quản lý yêu cầu liên hệ

Admin xem tất cả yêu cầu liên hệ, lọc theo trạng thái/từ khóa, cập nhật trạng thái và ghi chú xử lý.

API liên quan:

- `GET /api/v1/admin/contact-requests`
- `PATCH /api/v1/admin/contact-requests/{requestId}/status`

### 6.4. Quản lý báo cáo tin đăng

Admin xem báo cáo do người dùng gửi, lọc theo trạng thái/lý do/từ khóa, cập nhật trạng thái và ghi chú.

API liên quan:

- `GET /api/v1/admin/room-reports`
- `PATCH /api/v1/admin/room-reports/{reportId}/status`

### 6.5. Quản lý người dùng

Admin tìm kiếm người dùng, xem vai trò và trạng thái, khóa/mở khóa tài khoản. Frontend không cho khóa tài khoản admin qua nút thao tác.

API liên quan:

- `GET /api/v1/admin/users`
- `PATCH /api/v1/admin/users/{userId}/status`

## 7. Chức năng thông báo

Khi có yêu cầu liên hệ mới, backend tạo thông báo cho:

- Chủ bài đăng nếu bài có `created_by`.
- Các admin, trừ trường hợp admin chính là chủ bài đăng.

Frontend hiển thị chuông thông báo, poll unread count mỗi 30 giây, cho phép xem danh sách thông báo và đánh dấu đã đọc.

API liên quan:

- `GET /api/v1/notifications`
- `GET /api/v1/notifications/unread-count`
- `PATCH /api/v1/notifications/{id}/read`
- `PATCH /api/v1/notifications/read-all`

## 8. Chức năng upload ảnh

Host/admin có thể upload ảnh phòng thông qua form quản lý ảnh. Backend kiểm tra loại file, kích thước, nén ảnh và tạo thumbnail.

API liên quan:

- `POST /api/v1/uploads/rooms`
- `POST /api/v1/uploads/avatars`

## 9. Đánh giá chức năng

Hệ thống đã bao phủ phần lớn chức năng cần có cho website tìm và cho thuê phòng trọ. Những chức năng phù hợp để trình bày trong báo cáo gồm: tìm kiếm/lọc phòng, quản lý bài đăng, yêu cầu xem phòng, phân quyền admin, lưu phòng, báo cáo tin đăng, thông báo và xác thực OTP/Google.

Một số điểm chưa đủ thông tin để đánh giá hoặc nên xem là hướng phát triển:

- Chưa có role `HOST` riêng trong backend.
- Chưa thấy cơ chế duyệt bài trước khi hiển thị.
- Chưa thấy tính năng thanh toán/gói tin nổi bật.
- Chưa thấy chức năng chat realtime.
- Chưa đủ thông tin về giám sát vận hành production.

