# 09. Đánh giá hệ thống

## 1. Mục tiêu đánh giá

Tài liệu này đánh giá hệ thống Homi dựa trên mã nguồn hiện có, tập trung vào các tiêu chí:

- Mức độ đáp ứng chức năng nghiệp vụ.
- Kiến trúc hệ thống.
- Thiết kế dữ liệu.
- Bảo mật và phân quyền.
- Trải nghiệm người dùng.
- Khả năng mở rộng và bảo trì.
- Hạn chế hiện tại và hướng phát triển.

Các phần không đủ dữ liệu trong source hoặc cấu hình hiện tại sẽ được ghi rõ là “chưa đủ thông tin để đánh giá”.

## 2. Điểm mạnh

### 2.1. Kiến trúc full-stack rõ ràng

Dự án được tách thành frontend, backend và database. Backend không phụ thuộc trực tiếp vào frontend, cung cấp REST API theo prefix `/api/v1`. Frontend gọi API thông qua service layer, giúp giao diện không phụ thuộc trực tiếp vào chi tiết endpoint.

Ưu điểm:

- Dễ bảo trì.
- Dễ mở rộng thêm mobile app hoặc client khác nếu cần.
- Phù hợp với mô hình báo cáo đồ án phân tầng.

### 2.2. Backend theo mô hình controller-service-repository

Backend tổ chức theo các tầng:

- Controller nhận HTTP request.
- DTO validate dữ liệu đầu vào/đầu ra.
- Service xử lý nghiệp vụ.
- Repository truy cập database.
- Entity ánh xạ bảng dữ liệu.

Mô hình này giúp phân tách trách nhiệm rõ ràng, thuận lợi khi trình bày kiến trúc trong báo cáo.

### 2.3. Chức năng nghiệp vụ tương đối đầy đủ

Hệ thống đã có các chức năng chính của website cho thuê phòng:

- Tìm kiếm/lọc phòng.
- Xem chi tiết phòng.
- Đăng ký, đăng nhập, OTP, Google login.
- Lưu phòng.
- Gửi yêu cầu xem phòng/liên hệ.
- Lịch sử liên hệ.
- Đăng và quản lý bài đăng.
- Quản lý khách liên hệ.
- Dashboard host.
- Dashboard admin.
- Quản lý phòng, user, yêu cầu, báo cáo.
- Báo cáo tin đăng.
- Thông báo trong hệ thống.

Đây là phạm vi đủ tốt cho một đồ án tốt nghiệp về website tìm và cho thuê phòng trọ.

### 2.4. Tìm kiếm phòng có nhiều tiêu chí

Backend dùng `RoomSpecifications.publicSearch` để hỗ trợ tìm kiếm động theo:

- Từ khóa.
- Quận/huyện.
- Giá.
- Diện tích.
- Trạng thái.
- Tiện ích.

Frontend đồng bộ bộ lọc với URL query, giúp trải nghiệm tốt hơn và dễ chia sẻ kết quả tìm kiếm.

### 2.5. Xác thực tương đối an toàn

Hệ thống sử dụng:

- BCrypt để mã hóa mật khẩu.
- JWT access token.
- Refresh token dạng opaque và chỉ lưu hash trong database.
- Refresh token rotation.
- Revoke refresh token khi logout.
- Cookie HttpOnly ở frontend BFF.
- Rate limit cho các endpoint auth.

Đây là điểm mạnh so với các đồ án chỉ lưu token trong localStorage hoặc không có refresh token.

### 2.6. Có kiểm soát quyền sở hữu bài đăng

Mặc dù chưa có role `HOST`, backend vẫn kiểm soát host bằng ownership:

- Bài đăng có `created_by`.
- Host chỉ sửa/xóa/cập nhật bài của mình.
- Host chỉ xem khách liên hệ của bài do mình tạo.

Cơ chế này giúp hạn chế user thao tác lên dữ liệu của user khác.

### 2.7. Có dashboard và thống kê

Hệ thống có dashboard cho cả host và admin:

- Host xem tổng bài đăng, bài còn phòng, bài ẩn/hết phòng, tổng khách quan tâm.
- Admin xem tổng phòng, phòng còn trống, tổng user, yêu cầu đang chờ, biểu đồ.

Phần này giúp báo cáo có nội dung trình bày về thống kê và quản trị.

### 2.8. Có xử lý upload ảnh

Backend kiểm tra MIME type, dung lượng file, nén ảnh về JPEG và tạo thumbnail. Đây là điểm thực tế, giúp hệ thống không chỉ lưu URL ảnh bên ngoài mà có khả năng xử lý upload.

## 3. Hạn chế hiện tại

### 3.1. Chưa có role `HOST`

Hiện hệ thống chỉ có role `USER` và `ADMIN`. Khu `/host` chỉ yêu cầu đăng nhập, không yêu cầu role riêng.

Tác động:

- Bất kỳ user đã đăng nhập nào cũng có thể vào khu đăng tin.
- Phần phân quyền nghiệp vụ chưa thể hiện rõ ba vai trò `USER - HOST - ADMIN`.
- Nếu triển khai thực tế, khó kiểm soát ai được phép đăng tin.

Đánh giá:

- Với đồ án hiện tại: chấp nhận được nếu mô tả “mọi user đã đăng nhập đều có thể đăng tin”.
- Với sản phẩm thực tế: nên bổ sung role `HOST` hoặc cơ chế duyệt tài khoản chủ trọ.

### 3.2. Chưa có duyệt bài trước khi công khai

Bài đăng có thể được tạo với trạng thái `AVAILABLE` và hiển thị công khai. Chưa thấy trạng thái như `PENDING_APPROVAL` hoặc workflow admin duyệt bài.

Tác động:

- Dữ liệu có thể kém kiểm soát nếu người dùng tự đăng tin.
- Admin chỉ xử lý sau khi bài đã xuất hiện hoặc khi có báo cáo.

Hướng cải thiện:

- Thêm trạng thái `PENDING`, `REJECTED`.
- Chỉ hiển thị bài `APPROVED/AVAILABLE`.
- Admin duyệt bài trong khu quản trị.

### 3.3. Chưa có phân quyền chi tiết theo hành động

Hiện phân quyền chủ yếu theo role admin và authenticated user. Chưa có permission chi tiết như:

- `ROOM_CREATE`
- `ROOM_APPROVE`
- `USER_LOCK`
- `REPORT_HANDLE`

Với quy mô đồ án, phân quyền hiện tại đủ dùng. Với hệ thống lớn hơn, nên tách permission để linh hoạt hơn.

### 3.4. Một số nội dung giao diện còn chưa thống nhất tiếng Việt

Trong một số component, một phần label/thông báo đang viết không dấu hoặc có dấu hiệu encoding không nhất quán. Điều này không ảnh hưởng trực tiếp đến nghiệp vụ backend, nhưng có thể ảnh hưởng chất lượng trình bày giao diện.

Hướng cải thiện:

- Rà soát toàn bộ text UI.
- Chuẩn hóa encoding UTF-8.
- Tách text vào file constants nếu cần.

### 3.5. Chưa thấy tính năng chat realtime

Hệ thống hiện dùng yêu cầu liên hệ và số điện thoại, chưa có chat trực tiếp giữa người thuê và chủ trọ.

Đánh giá:

- Không bắt buộc cho đồ án hiện tại.
- Có thể đưa vào hướng phát triển.

### 3.6. Chưa có thanh toán/gói tin nổi bật

Trường `is_featured` đã có, admin có thể đánh dấu phòng nổi bật, nhưng chưa có module thanh toán hoặc gói dịch vụ cho chủ trọ.

Đánh giá:

- Phù hợp nếu đồ án tập trung vào tìm kiếm và quản lý phòng.
- Nếu phát triển thương mại, nên bổ sung gói đăng tin, thanh toán và hóa đơn.

### 3.7. Chưa đủ thông tin để đánh giá vận hành production

Chưa đủ thông tin để đánh giá các nội dung sau:

- CI/CD.
- Monitoring.
- Logging tập trung.
- Backup database.
- Chính sách bảo mật production.
- Quản lý secret thực tế.
- Khả năng scale nhiều instance.

## 4. Đánh giá theo tiêu chí

### 4.1. Mức độ đáp ứng nghiệp vụ

Mức độ: Tốt.

Lý do:

- Có đủ luồng tìm phòng, xem chi tiết, lưu phòng, liên hệ.
- Có khu chủ trọ/người đăng tin.
- Có khu admin.
- Có báo cáo tin đăng và thông báo.

Thiếu:

- Role host riêng.
- Duyệt bài trước khi hiển thị.
- Chat/thanh toán nếu yêu cầu sản phẩm lớn hơn.

### 4.2. Thiết kế database

Mức độ: Khá tốt.

Ưu điểm:

- Các bảng chính được chuẩn hóa hợp lý.
- Quan hệ nhiều-nhiều giữa phòng và tiện ích rõ ràng.
- Có bảng lưu refresh token, saved room, notification, report.
- Có index cho các truy vấn thường dùng.

Hạn chế:

- Chưa có bảng audit log.
- Chưa có bảng duyệt host/bài đăng.
- Chưa có bảng lịch sử thay đổi trạng thái.

### 4.3. API backend

Mức độ: Tốt.

Ưu điểm:

- REST API chia nhóm rõ.
- Dùng DTO và validation.
- Có PageResponse cho danh sách.
- Có GlobalExceptionHandler trả lỗi thống nhất.
- Có OpenAPI/Swagger.

Hạn chế:

- Host API chưa ràng role riêng.
- Một số message trong source có dấu hiệu encoding không thống nhất.

### 4.4. Bảo mật

Mức độ: Khá tốt với phạm vi đồ án.

Ưu điểm:

- BCrypt.
- JWT.
- Refresh token hash + rotation.
- HttpOnly cookie ở BFF.
- Rate limit auth endpoint.
- CORS cấu hình qua property.
- Admin endpoint được bảo vệ bằng role.
- Host ownership được kiểm tra ở service.

Hạn chế:

- Chưa có CSRF token riêng. Hệ thống dùng JWT/cookie HttpOnly và SameSite=Lax; cần đánh giá kỹ hơn nếu triển khai production.
- Chưa có role `HOST`.
- Chưa đủ thông tin về HTTPS, secret production và hardening server.

### 4.5. Frontend UX

Mức độ: Tốt.

Ưu điểm:

- Có layout rõ cho public, host, admin.
- Có loading skeleton, empty state, pagination.
- Có mobile filter drawer.
- Có URL sync cho tìm kiếm.
- Có notification bell.
- Có CSV export ở các màn hình quản lý.
- Có form validate lỗi field từ backend.

Hạn chế:

- Một số text UI cần chuẩn hóa tiếng Việt/encoding.
- Chưa thấy test UI/e2e đầy đủ.

### 4.6. Khả năng mở rộng

Mức độ: Khá.

Ưu điểm:

- Kiến trúc tách tầng.
- Có service layer.
- Có specification cho tìm kiếm động.
- Có Docker Compose.

Hạn chế:

- Chưa có module permission chi tiết.
- Upload file lưu local volume; nếu scale nhiều instance nên chuyển sang object storage.
- Chưa đủ thông tin về cache production, queue email hoặc background job.

## 5. Rủi ro và đề xuất xử lý

| Rủi ro | Mức độ | Đề xuất |
|---|---|---|
| User thường có thể đăng tin vì chưa có role `HOST` | Trung bình | Ghi rõ trong báo cáo; hướng phát triển thêm role `HOST`. |
| Bài đăng chưa qua duyệt | Trung bình | Thêm trạng thái chờ duyệt và màn hình admin duyệt bài. |
| Upload lưu local | Trung bình nếu production | Dùng S3/Cloudinary/object storage khi triển khai thật. |
| Chưa có audit log | Thấp-Trung bình | Thêm bảng ghi lịch sử thao tác admin/host. |
| Chưa đủ thông tin backup/monitoring | Trung bình | Bổ sung quy trình backup, logging và monitoring trong triển khai. |
| Một số text encoding chưa nhất quán | Thấp | Chuẩn hóa UTF-8 và rà soát UI text. |

## 6. Hướng phát triển

Các hướng phát triển phù hợp để đưa vào báo cáo:

- Bổ sung role `HOST` và quy trình duyệt tài khoản chủ trọ.
- Thêm trạng thái duyệt bài đăng trước khi công khai.
- Thêm chat realtime giữa người thuê và chủ trọ.
- Thêm gói tin nổi bật, thanh toán và hóa đơn.
- Thêm bản đồ trực tiếp trên trang chi tiết thay vì chỉ mở liên kết bản đồ.
- Thêm đánh giá/nhận xét phòng hoặc chủ trọ.
- Thêm audit log cho thao tác admin/host.
- Thêm email template HTML thay vì SimpleMailMessage.
- Chuyển upload ảnh sang object storage.
- Bổ sung test e2e và CI/CD.
- Bổ sung monitoring, backup database và quản lý secret production.

## 7. Kết luận đánh giá

Homi là một hệ thống full-stack có cấu trúc tốt và phạm vi chức năng phù hợp với đồ án tốt nghiệp. Các chức năng cốt lõi của website tìm và cho thuê phòng trọ đã được triển khai rõ ràng. Backend có thiết kế REST API, bảo mật JWT/refresh token, validate dữ liệu và kiểm soát quyền admin/ownership. Frontend có trải nghiệm người dùng tương đối đầy đủ với các khu public, user, host và admin.

Hạn chế quan trọng nhất là chưa có role `HOST` riêng và chưa có quy trình duyệt bài. Tuy nhiên, nếu phạm vi đồ án định nghĩa rằng mọi user đã đăng nhập đều có thể đăng tin, thiết kế hiện tại vẫn hợp lý. Khi viết báo cáo, nên trình bày trung thực hạn chế này và đưa vào phần hướng phát triển.

