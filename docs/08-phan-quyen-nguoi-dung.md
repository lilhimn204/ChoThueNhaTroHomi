# 08. Phân quyền người dùng

## 1. Tổng quan phân quyền

Homi sử dụng cơ chế xác thực bằng JWT và phân quyền dựa trên role trong Spring Security. Role được lưu trong bảng `roles`, liên kết với người dùng qua bảng `user_roles`.

Trong code hiện tại, hệ thống có hai role kỹ thuật:

- `USER`: người dùng thông thường.
- `ADMIN`: quản trị viên hệ thống.

Actor “Chủ trọ/người đăng tin” hiện chưa có role backend riêng. Đây là một actor nghiệp vụ được hiểu là người dùng đã đăng nhập và có thể tạo/quản lý các bài đăng do mình sở hữu. Quyền quản lý bài đăng của actor này được kiểm soát bằng trường `rooms.created_by`.

## 2. Vai trò người dùng

### 2.1. Khách chưa đăng nhập

Khách chưa đăng nhập có thể truy cập các chức năng công khai:

- Xem trang chủ.
- Xem danh sách phòng.
- Tìm kiếm/lọc phòng.
- Xem chi tiết phòng.
- Xem tiện ích và quận/huyện.
- Đăng ký.
- Đăng nhập.

Không được thực hiện:

- Lưu phòng.
- Gửi yêu cầu liên hệ.
- Báo cáo tin đăng.
- Xem lịch sử liên hệ.
- Truy cập khu host.
- Truy cập khu admin.

### 2.2. Người thuê phòng (`USER`)

Người thuê phòng là user đã đăng nhập, thường có role `USER`.

Được phép:

- Xem các chức năng public.
- Lưu/bỏ lưu phòng.
- Xem danh sách phòng đã lưu.
- Gửi yêu cầu liên hệ/xem phòng.
- Xem lịch sử yêu cầu của mình.
- Báo cáo tin đăng.
- Cập nhật hồ sơ cá nhân.
- Đổi mật khẩu.
- Xem thông báo của mình.

Không được phép:

- Truy cập API admin.
- Quản lý dữ liệu toàn hệ thống.
- Sửa/xóa bài đăng không thuộc sở hữu của mình.

### 2.3. Chủ trọ/người đăng tin

Trong hiện trạng code, chủ trọ/người đăng tin không phải role riêng. Một user đã đăng nhập có thể truy cập khu host và đăng bài.

Được phép:

- Tạo bài đăng.
- Xem danh sách bài đăng của mình.
- Sửa bài đăng của mình.
- Cập nhật trạng thái bài đăng của mình.
- Xóa bài đăng của mình.
- Xem yêu cầu liên hệ gửi tới bài đăng của mình.
- Cập nhật trạng thái xử lý khách liên hệ của mình.
- Cập nhật hồ sơ người cho thuê.

Cơ chế kiểm soát:

- Khi tạo phòng, backend set `created_by` bằng user hiện tại.
- Khi xem/sửa/xóa/cập nhật, backend kiểm tra `room.created_by.id == principal.id`.
- Nếu không phải chủ sở hữu, backend trả lỗi không tìm thấy hoặc không cho thao tác.

Điểm cần ghi trong báo cáo:

> Chủ trọ/người đăng tin là actor nghiệp vụ. Hệ thống hiện chưa tách role `HOST`; quyền host được kiểm soát bằng đăng nhập và quyền sở hữu dữ liệu.

### 2.4. Admin (`ADMIN`)

Admin là user có role `ADMIN`.

Được phép:

- Truy cập khu `/admin`.
- Xem dashboard hệ thống.
- Quản lý toàn bộ bài đăng.
- Tạo bài đăng dưới quyền admin.
- Cập nhật trạng thái bài đăng.
- Xóa bài đăng.
- Quản lý yêu cầu liên hệ.
- Quản lý báo cáo tin đăng.
- Quản lý người dùng.
- Khóa/mở khóa tài khoản user.
- Xuất dữ liệu CSV từ các màn hình quản lý.

Backend yêu cầu `ROLE_ADMIN` cho toàn bộ endpoint `/api/v1/admin/**`.

## 3. Phân quyền ở backend

Phân quyền backend được cấu hình trong `SecurityConfig.java`.

### 3.1. Endpoint public

Các endpoint sau được cho phép không cần đăng nhập:

- Swagger/OpenAPI:
  - `/v3/api-docs/**`
  - `/v3/api-docs.yaml`
  - `/swagger-ui/**`
  - `/swagger-ui.html`
- Auth:
  - `POST /api/v1/auth/**`
- Phòng/lookup public:
  - `GET /api/v1/rooms/**`
  - `GET /api/v1/amenities`
  - `GET /api/v1/districts`
- File upload public path:
  - `GET /uploads/**`

### 3.2. Endpoint admin

Tất cả endpoint:

```text
/api/v1/admin/**
```

yêu cầu:

```text
hasRole("ADMIN")
```

Điều này có nghĩa JWT phải ánh xạ thành authority `ROLE_ADMIN`.

### 3.3. Endpoint yêu cầu đăng nhập

Các endpoint còn lại mặc định yêu cầu xác thực:

- `/api/v1/users/**`
- `/api/v1/saved-rooms/**`
- `/api/v1/contact-requests/**`
- `/api/v1/host/**`
- `/api/v1/notifications/**`
- `/api/v1/room-reports/**`
- `/api/v1/uploads/**`

### 3.4. Filter xác thực JWT

`JwtAuthenticationFilter` đọc token theo thứ tự:

1. Header `Authorization: Bearer <token>`.
2. Cookie `homi_token`.

Nếu token hợp lệ, filter tạo `UsernamePasswordAuthenticationToken` và đưa vào `SecurityContextHolder`.

### 3.5. UserPrincipal

`UserPrincipal` ánh xạ user thành đối tượng Spring Security:

- `id`
- `fullName`
- `email`
- `passwordHash`
- `enabled`
- `status`
- `authorities`

Tài khoản chỉ hợp lệ nếu:

- `enabled == true`
- `status == ACTIVE`
- `status != LOCKED`

## 4. Phân quyền ở frontend

Frontend dùng component `RequireAuth`.

### 4.1. Route yêu cầu đăng nhập

Các trang như:

- `/profile`
- `/saved-rooms`
- `/contact-history`
- `/host/*`

dùng `RequireAuth` để kiểm tra trạng thái đăng nhập. Nếu user chưa đăng nhập, frontend redirect về `/login?redirect=...`.

### 4.2. Route admin

Layout admin dùng:

```tsx
<RequireAuth roles={["ADMIN"]}>
```

Nếu user không có role `ADMIN`, frontend redirect về trang chủ.

### 4.3. Khu host

Layout host dùng:

```tsx
<RequireAuth>
```

Không truyền `roles`, nghĩa là chỉ yêu cầu đăng nhập. Đây là điểm phản ánh đúng hiện trạng backend: host chưa có role riêng.

## 5. Phân quyền thông qua quyền sở hữu dữ liệu

Ngoài role-based access control, Homi sử dụng ownership-based access control cho khu host.

### 5.1. Bài đăng

Khi host tạo phòng:

- Backend gọi `RoomService.createRoom`.
- Gán `createdBy` bằng user hiện tại.

Khi host xem/sửa/xóa phòng:

- Backend gọi `ensureOwnedRoom(ownerId, roomId)`.
- Repository tìm phòng theo `id` và `createdById`.
- Nếu không có kết quả, coi như không tìm thấy tài nguyên.

### 5.2. Yêu cầu liên hệ của host

Host chỉ xem được contact request thuộc bài đăng của mình:

- Truy vấn theo `room.createdBy.id`.
- Khi cập nhật request, backend tìm theo `requestId` và `roomCreatedById`.

### 5.3. Thông báo

Khi đánh dấu thông báo đã đọc, backend kiểm tra:

- Notification tồn tại.
- `notification.recipient.id == userId`.

Nếu không khớp, backend trả lỗi không tìm thấy.

## 6. Bảng phân quyền tổng hợp

| Chức năng | Khách | USER | Chủ trọ/người đăng tin | ADMIN |
|---|---:|---:|---:|---:|
| Xem trang chủ | Có | Có | Có | Có |
| Tìm kiếm/lọc phòng | Có | Có | Có | Có |
| Xem chi tiết phòng | Có | Có | Có | Có |
| Đăng ký/đăng nhập | Có | Không cần | Không cần | Không cần |
| Lưu phòng | Không | Có | Có | Có |
| Xem phòng đã lưu | Không | Có | Có | Có |
| Gửi yêu cầu xem phòng | Không | Có | Có, trừ bài của chính mình | Có, trừ bài của chính mình nếu là owner |
| Xem lịch sử liên hệ của mình | Không | Có | Có | Có |
| Báo cáo tin đăng | Không | Có | Có | Có |
| Đăng bài | Không | Có, theo hiện trạng | Có | Có qua admin/host |
| Sửa bài của mình | Không | Nếu là owner | Có | Có toàn hệ thống |
| Xóa bài của mình | Không | Nếu là owner | Có | Có toàn hệ thống |
| Quản lý khách liên hệ bài của mình | Không | Nếu là owner | Có | Có qua admin contact requests |
| Dashboard admin | Không | Không | Không | Có |
| Quản lý người dùng | Không | Không | Không | Có |
| Quản lý báo cáo tin | Không | Không | Không | Có |

## 7. Đánh giá phân quyền hiện tại

### Ưu điểm

- Backend có phân quyền admin rõ ràng.
- Endpoint public và authenticated được tách ở `SecurityConfig`.
- JWT chứa role và được ánh xạ sang authority.
- Frontend có route guard cho user và admin.
- Host tuy chưa có role riêng nhưng có kiểm soát ownership ở backend.
- Refresh token được lưu hash và có revoke/rotate.

### Hạn chế

- Chưa có role `HOST`, nên bất kỳ user đăng nhập nào cũng có thể vào khu đăng tin.
- Chưa có luồng admin duyệt tài khoản chủ trọ.
- Chưa thấy cơ chế duyệt bài trước khi công khai.
- Chưa thấy phân quyền chi tiết theo action như `ROOM_CREATE`, `ROOM_APPROVE`, `USER_LOCK`.

### Hướng phát triển đề xuất

Nếu có thời gian nâng cấp sau đồ án, có thể bổ sung:

- Role `HOST`.
- API yêu cầu nâng cấp tài khoản thành host.
- Admin duyệt host.
- Security rule `/api/v1/host/**` yêu cầu `ROLE_HOST` hoặc `ROLE_ADMIN`.
- Frontend `RequireAuth roles={["HOST", "ADMIN"]}` cho khu host.
- Bảng audit log ghi nhận admin/host đã thao tác gì, khi nào.

## 8. Kết luận

Phân quyền hiện tại đủ để vận hành các chức năng chính của đồ án. Role `ADMIN` được triển khai rõ ràng. Actor chủ trọ được kiểm soát thông qua quyền sở hữu dữ liệu thay vì role riêng. Khi viết báo cáo, nên trình bày trung thực điểm này như một giới hạn thiết kế và đề xuất bổ sung role `HOST` trong hướng phát triển.

