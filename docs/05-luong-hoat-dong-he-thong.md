# 05. Luồng hoạt động hệ thống

## 1. Luồng đăng ký bằng email và OTP

### Mô tả

Người dùng nhập thông tin đăng ký. Backend tạo tài khoản tạm ở trạng thái chưa kích hoạt, sinh OTP và gửi email nếu cấu hình mail được bật. Sau khi người dùng nhập OTP hợp lệ, backend kích hoạt tài khoản và cấp token.

```mermaid
sequenceDiagram
    actor User as Người dùng
    participant FE as Frontend
    participant BFF as Next.js Auth Route
    participant BE as Spring Boot API
    participant DB as MySQL
    participant Mail as Email Service

    User->>FE: Nhập thông tin đăng ký
    FE->>BFF: POST /api/auth/register
    BFF->>BE: POST /api/v1/auth/register
    BE->>DB: Kiểm tra email và tạo user INACTIVE
    BE->>DB: Lưu OTP hash, hạn OTP
    BE->>Mail: Gửi OTP nếu mail enabled
    BE-->>BFF: RegistrationOtpResponse
    BFF-->>FE: Thông tin OTP
    FE-->>User: Hiển thị form nhập OTP

    User->>FE: Nhập OTP
    FE->>BFF: POST /api/auth/verify-otp
    BFF->>BE: POST /api/v1/auth/verify-otp
    BE->>DB: Kiểm tra OTP hash, hạn, số lần nhập
    BE->>DB: Kích hoạt user ACTIVE
    BE->>DB: Tạo refresh token hash
    BE-->>BFF: AuthResponse
    BFF->>BFF: Lưu HttpOnly cookies
    BFF-->>FE: User profile
    FE-->>User: Chuyển đến trang phù hợp
```

### Luồng lỗi

- Email đã tồn tại: backend trả lỗi nghiệp vụ.
- OTP sai: tăng số lần nhập sai.
- OTP hết hạn: yêu cầu gửi lại OTP.
- Vượt số lần gửi lại: backend chặn resend.
- Mail chưa cấu hình: chưa đủ thông tin để đánh giá trong môi trường production; code có xử lý báo lỗi/ghi log tùy cấu hình.

## 2. Luồng đăng nhập

```mermaid
sequenceDiagram
    actor User as Người dùng
    participant FE as Frontend
    participant BFF as Next.js Auth Route
    participant BE as Spring Boot API
    participant DB as MySQL

    User->>FE: Nhập email và mật khẩu
    FE->>BFF: POST /api/auth/login
    BFF->>BE: POST /api/v1/auth/login
    BE->>DB: Tải user theo email
    BE->>BE: Xác thực mật khẩu bằng Spring Security
    BE->>BE: Kiểm tra trạng thái ACTIVE/enabled
    BE->>DB: Tạo refresh token hash
    BE-->>BFF: AuthResponse
    BFF->>BFF: Set cookie homi_token và homi_refresh_token
    BFF-->>FE: User profile
    FE-->>User: Cập nhật trạng thái đăng nhập
```

### Refresh phiên đăng nhập

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant Proxy as Next.js Proxy
    participant BE as Spring Boot API
    participant DB as MySQL

    FE->>Proxy: Gọi API cần xác thực
    Proxy->>Proxy: Đọc homi_token
    alt Không có token hoặc backend trả 401
        Proxy->>BE: POST /api/v1/auth/refresh
        BE->>DB: Kiểm tra refresh token hash
        BE->>DB: Revoke token cũ, tạo token mới
        BE-->>Proxy: AuthResponse mới
        Proxy->>Proxy: Cập nhật cookie
    end
    Proxy->>BE: Forward request với Authorization Bearer
    BE-->>Proxy: Response nghiệp vụ
    Proxy-->>FE: Response
```

## 3. Luồng tìm kiếm và xem chi tiết phòng

### Tìm kiếm/lọc phòng

```mermaid
flowchart TD
    A["Người dùng mở /rooms"] --> B["Frontend tải lookup districts và amenities"]
    B --> C["Người dùng nhập từ khóa hoặc bộ lọc"]
    C --> D["useRoomSearch đồng bộ state vào URL query"]
    D --> E["Frontend gọi GET /api/v1/rooms"]
    E --> F["Backend RoomController nhận query params"]
    F --> G["RoomService gọi RoomSpecifications.publicSearch"]
    G --> H["MySQL lọc phòng không HIDDEN và theo tiêu chí"]
    H --> I["Backend trả PageResponse<RoomSummary>"]
    I --> J["Frontend hiển thị RoomCard và phân trang"]
```

### Xem chi tiết phòng

```mermaid
flowchart TD
    A["Người dùng chọn Xem chi tiết"] --> B["Frontend mở /rooms/[slug]"]
    B --> C["Gọi GET /api/v1/rooms/{slug}"]
    C --> D["Backend tìm phòng theo slug và status != HIDDEN"]
    D --> E{"Tìm thấy phòng?"}
    E -- "Không" --> F["Trả 404"]
    E -- "Có" --> G["Trả RoomDetailResponse"]
    G --> H["Frontend hiển thị ảnh, tiện ích, giá, liên hệ"]
    H --> I["Frontend tải phòng gợi ý liên quan"]
```

## 4. Luồng lưu phòng

```mermaid
sequenceDiagram
    actor User as Người thuê phòng
    participant FE as Frontend
    participant Proxy as Next.js Proxy
    participant BE as Spring Boot API
    participant DB as MySQL

    User->>FE: Bấm nút lưu phòng
    FE->>Proxy: POST /api/proxy/saved-rooms/{roomId}
    Proxy->>BE: POST /api/v1/saved-rooms/{roomId}
    BE->>DB: Tìm saved_rooms theo user_id và room_id
    alt Đã lưu
        BE->>DB: Xóa bản ghi saved_rooms
        BE-->>Proxy: {"saved": false}
    else Chưa lưu
        BE->>DB: Kiểm tra phòng tồn tại
        BE->>DB: Tạo bản ghi saved_rooms
        BE-->>Proxy: {"saved": true}
    end
    Proxy-->>FE: Kết quả toggle
    FE-->>User: Cập nhật trạng thái nút trái tim
```

### Xem danh sách phòng đã lưu

```mermaid
flowchart TD
    A["Người dùng mở /saved-rooms"] --> B["RequireAuth kiểm tra đăng nhập"]
    B --> C["Frontend gọi GET /api/v1/saved-rooms qua proxy"]
    C --> D["Backend lấy saved_rooms theo user hiện tại"]
    D --> E["Join thông tin room và district"]
    E --> F["Trả PageResponse<SavedRoomResponse>"]
    F --> G["Frontend hiển thị danh sách phòng đã lưu"]
```

## 5. Luồng gửi yêu cầu xem phòng/liên hệ

```mermaid
sequenceDiagram
    actor Tenant as Người thuê phòng
    participant FE as Trang chi tiết phòng
    participant Proxy as Next.js Proxy
    participant BE as ContactRequestService
    participant DB as MySQL
    participant Noti as NotificationService
    participant Mail as Email Service

    Tenant->>FE: Nhập form yêu cầu xem phòng
    FE->>Proxy: POST /api/proxy/contact-requests
    Proxy->>BE: POST /api/v1/contact-requests
    BE->>DB: Tải user hiện tại
    BE->>DB: Tải phòng theo roomId
    BE->>BE: Kiểm tra phòng không HIDDEN
    BE->>BE: Kiểm tra user không phải chủ bài đăng
    BE->>DB: Lưu contact_requests
    BE->>Noti: Tạo thông báo cho host/admin
    Noti->>DB: Lưu notifications
    Noti->>Mail: Gửi email nếu app.mail.enabled=true
    BE-->>Proxy: ContactRequestResponse
    Proxy-->>FE: ContactRequestResponse
    FE-->>Tenant: Hiển thị gửi thành công
```

### Luồng thay thế/lỗi

- Chưa đăng nhập: frontend yêu cầu đăng nhập trước khi gửi.
- Phòng không tồn tại hoặc bị ẩn: backend trả lỗi không tìm thấy.
- Người gửi là chủ bài đăng: backend trả lỗi nghiệp vụ.
- Dữ liệu form sai định dạng: backend trả validation error.

## 6. Luồng chủ trọ đăng và quản lý bài viết

### Tạo bài đăng

```mermaid
flowchart TD
    A["Người đăng tin mở /host/posts/create"] --> B["RequireAuth kiểm tra đăng nhập"]
    B --> C["Frontend tải districts và amenities"]
    C --> D["Người dùng nhập thông tin phòng và ảnh"]
    D --> E["Nếu upload ảnh: POST /api/v1/uploads/rooms qua proxy"]
    E --> F["Backend lưu ảnh, nén JPEG, tạo thumbnail"]
    F --> G["Frontend nhận URL ảnh"]
    G --> H["Submit POST /api/v1/host/rooms"]
    H --> I["HostService tạo phòng với created_by=userId"]
    I --> J["RoomService tạo listing_code, slug, lưu amenities/images"]
    J --> K["MySQL lưu rooms, room_images, room_amenities"]
    K --> L["Frontend chuyển về /host/posts"]
```

### Quản lý bài đăng

```mermaid
flowchart TD
    A["Host mở /host/posts"] --> B["GET /api/v1/host/rooms"]
    B --> C["Backend lọc rooms theo created_by=userId"]
    C --> D["Frontend hiển thị danh sách bài đăng"]
    D --> E{"Host chọn thao tác"}
    E -- "Sửa" --> F["GET /host/rooms/{id}, PUT /host/rooms/{id}"]
    E -- "Ẩn/hiện" --> G["PATCH /host/rooms/{id}/status"]
    E -- "Còn/hết phòng" --> G
    E -- "Xóa" --> H["DELETE /host/rooms/{id}"]
    F --> I["Backend ensureOwnedRoom"]
    G --> I
    H --> I
    I --> J["Chỉ thao tác nếu bài thuộc user hiện tại"]
```

### Quản lý khách liên hệ

```mermaid
flowchart TD
    A["Host mở /host/customers"] --> B["GET /api/v1/host/contact-requests"]
    B --> C["Backend lấy contact_requests theo room.created_by=userId"]
    C --> D["Frontend hiển thị khách quan tâm"]
    D --> E["Host cập nhật trạng thái"]
    E --> F["PATCH /api/v1/host/contact-requests/{id}/status"]
    F --> G["Backend kiểm tra request thuộc bài của host"]
    G --> H["Cập nhật status, note, handled_by, handled_at"]
```

## 7. Luồng admin quản lý hệ thống

### Truy cập admin

```mermaid
flowchart TD
    A["Admin mở /admin"] --> B["RequireAuth roles ADMIN"]
    B --> C{"User có ADMIN?"}
    C -- "Không" --> D["Redirect về trang chủ"]
    C -- "Có" --> E["Gọi API /api/v1/admin/** qua proxy"]
    E --> F["Backend SecurityConfig kiểm tra ROLE_ADMIN"]
    F --> G["Trả dữ liệu admin"]
```

### Dashboard admin

```mermaid
flowchart TD
    A["Admin mở dashboard"] --> B["GET /api/v1/admin/dashboard"]
    B --> C["AdminDashboardService đếm rooms/users/contact_requests"]
    C --> D["Trả tổng quan và danh sách gần đây"]
    A --> E["GET /api/v1/admin/dashboard/charts"]
    E --> F["Đếm phòng theo quận, phòng theo trạng thái, yêu cầu theo trạng thái"]
    F --> G["Frontend hiển thị Recharts"]
```

### Quản lý phòng

```mermaid
flowchart TD
    A["Admin mở /admin/rooms"] --> B["GET /api/v1/admin/rooms"]
    B --> C["Lọc theo keyword, status, district"]
    C --> D["Admin xem bảng bài đăng"]
    D --> E{"Thao tác"}
    E -- "Tạo" --> F["POST /api/v1/admin/rooms"]
    E -- "Cập nhật trạng thái" --> G["PATCH /api/v1/admin/rooms/{id}/status"]
    E -- "Xóa" --> H["DELETE /api/v1/admin/rooms/{id}"]
    F --> I["RoomService xử lý toàn hệ thống"]
    G --> I
    H --> I
```

### Quản lý yêu cầu liên hệ

```mermaid
flowchart TD
    A["Admin mở /admin/contact-requests"] --> B["GET /api/v1/admin/contact-requests"]
    B --> C["Lọc theo status và keyword"]
    C --> D["Admin chọn yêu cầu"]
    D --> E["PATCH /api/v1/admin/contact-requests/{id}/status"]
    E --> F["Backend cập nhật status, admin_note, handled_by, handled_at"]
```

### Quản lý người dùng

```mermaid
flowchart TD
    A["Admin mở /admin/users"] --> B["GET /api/v1/admin/users"]
    B --> C["Tìm kiếm người dùng"]
    C --> D["Admin khóa hoặc mở khóa tài khoản"]
    D --> E["PATCH /api/v1/admin/users/{id}/status"]
    E --> F["Backend cập nhật UserStatus và enabled"]
```

### Quản lý báo cáo tin đăng

```mermaid
flowchart TD
    A["Admin mở /admin/room-reports"] --> B["GET /api/v1/admin/room-reports"]
    B --> C["Lọc theo status, reason, keyword"]
    C --> D["Admin chọn báo cáo"]
    D --> E["PATCH /api/v1/admin/room-reports/{id}/status"]
    E --> F["Backend cập nhật trạng thái và ghi chú xử lý"]
```

## 8. Luồng dữ liệu tổng quát

```mermaid
flowchart LR
    UI["React Components"] --> Services["Frontend services"]
    Services --> Public["apiRequest /api/public hoặc backend public"]
    Services --> Proxy["proxyRequest /api/proxy"]
    Public --> Controller["Spring Controller"]
    Proxy --> Controller
    Controller --> Service["Service nghiệp vụ"]
    Service --> Repo["Repository/Specification"]
    Repo --> DB["MySQL"]
    Service --> DTO["DTO Response"]
    DTO --> UI
```

## 9. Ghi chú về giới hạn hiện tại

- Khu host chưa dùng role `HOST` riêng; quyền quản lý dựa trên đăng nhập và `created_by`.
- Chưa thấy luồng duyệt bài trước khi công khai.
- Chưa thấy luồng thanh toán hoặc gói nâng cấp tin.
- Chưa đủ thông tin để đánh giá luồng vận hành production như backup, monitoring, CI/CD.

