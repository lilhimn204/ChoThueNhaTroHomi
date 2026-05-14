# BÁO CÁO REVIEW ĐỒ ÁN WEBSITE HOMI

## 1. Thông tin tổng quan

- **Tên đồ án:** Homi - Website cho thuê phòng trọ.
- **Mục tiêu:** Xây dựng hệ thống giúp người thuê tìm kiếm, xem thông tin, lưu phòng và gửi yêu cầu liên hệ; chủ trọ quản lý tin đăng và khách quan tâm; admin quản trị phòng, người dùng và yêu cầu liên hệ.
- **Đối tượng sử dụng:** Người thuê phòng, chủ trọ, quản trị viên hệ thống.
- **Công nghệ sử dụng:**
  - **Frontend:** Next.js 16, React 19, TypeScript, TailwindCSS 4, Vitest, lucide-react, Recharts.
  - **Backend:** Java 21, Spring Boot 3.5, Spring Security, Spring Data JPA, Bean Validation, JWT, Maven.
  - **Database:** MySQL, script SQL thủ công trong `database/mysql`.
  - **Khác:** Upload ảnh local, HttpOnly cookie BFF ở Next.js, tài liệu kiến trúc trong thư mục `docs`.

### Phạm vi kiểm tra

Báo cáo này được lập dựa trên việc đọc source code, tài liệu, script database và chạy các lệnh kiểm tra kỹ thuật trong dự án:

- Backend: `.\mvnw.cmd test` - **pass**, 29 test chạy thành công.
- Frontend: `npm run lint` - **fail**, còn 5 lỗi lint và 2 warning.
- Frontend: `npm test` - **fail**, test `auth-storage` chưa cập nhật theo cơ chế auth mới.
- Frontend: `npm run build` - **fail**, lỗi TypeScript tại `frontend/components/ui/confirm-dialog.tsx`.

Do frontend build đang fail, chưa đủ thông tin để đánh giá bằng production runtime hoặc ảnh chụp thực tế trên trình duyệt. Phần UI/responsive/dark mode được đánh giá chủ yếu qua source code, CSS, component và cấu trúc route.

## 2. Nhận xét tổng quan

Homi là một đồ án có phạm vi khá đầy đủ so với đề tài website cho thuê phòng trọ. Dự án không chỉ có trang danh sách và chi tiết phòng, mà còn có đăng nhập/đăng ký, lưu phòng, lịch sử liên hệ, dashboard chủ trọ, dashboard admin, upload ảnh, thông báo nội bộ và API backend riêng. Đây là mức độ triển khai tốt hơn nhiều đồ án CRUD cơ bản.

Điểm mạnh lớn nhất là kiến trúc tách frontend/backend rõ ràng, backend có phân quyền, validation, JWT, rate limit đăng nhập, xử lý lỗi tập trung và test pass. Frontend có hệ thống component tương đối nhất quán, có theme sáng/tối, layout tenant/host/admin riêng, có trạng thái loading/error/empty và trải nghiệm tìm kiếm khá hoàn chỉnh.

Tuy nhiên, ở trạng thái hiện tại, đồ án chưa đạt mức "sẵn sàng nộp bản cuối" vì frontend không build được. Đây là lỗi nghiêm trọng khi chấm đồ án phần triển khai. Ngoài ra, test frontend bị lệch so với code auth hiện tại, lint còn lỗi, script schema chưa phản ánh đủ entity mới như `SavedRoom` và `Notification`, một số text UI thiếu dấu tiếng Việt, và một vài tài liệu đã lỗi thời so với implementation.

Đánh giá tổng thể: đồ án có nền tảng tốt, ý tưởng phù hợp, chức năng phong phú, backend khá chắc; nhưng cần sửa các lỗi build/test/lint và đồng bộ database trước khi có thể xem là hoàn thiện.

## 3. Đánh giá giao diện UI/UX

### Điểm tốt

- Giao diện phù hợp với bài toán cho thuê phòng trọ: tập trung vào tìm kiếm, giá, diện tích, khu vực, trạng thái phòng và hành động liên hệ.
- Trang danh sách phòng có bộ lọc theo từ khóa, khu vực, giá, diện tích, trạng thái, tiện ích, sắp xếp và phân trang. Đây là luồng quan trọng nhất của người thuê.
- Trang chi tiết phòng có cấu trúc hợp lý: gallery, thông tin chính, tiện ích, chủ phòng/thông tin liên hệ và form gửi yêu cầu.
- Có dashboard riêng cho admin và chủ trọ, giúp phân tách rõ bối cảnh sử dụng.
- Có các trạng thái rỗng/loading/error ở nhiều màn hình, tránh cảm giác giao diện bị "chết" khi chưa có dữ liệu.
- Component UI dùng class Tailwind và token CSS tương đối nhất quán, có các phần tử như `Button`, `Input`, `Select`, `Tabs`, `Toast`, `ConfirmDialog`.

### Điểm chưa tốt

- Frontend hiện không build được do lỗi TypeScript ở `frontend/components/ui/confirm-dialog.tsx:111`. Component `ConfirmDialog` truyền `ref` vào `Button`, nhưng `Button` tại `frontend/components/ui/button.tsx` chưa hỗ trợ `forwardRef`.
- Một số text tiếng Việt thiếu dấu hoặc chưa chuyên nghiệp:
  - `frontend/components/forms/contact-form-card.tsx:174`: `"Đăng nhập de tiep tuc"`.
  - `frontend/components/admin/admin-contact-requests-client.tsx:323`: `"Trạng thái moi"`.
  - `frontend/components/admin/admin-rooms-client.tsx:479`: `"Giá / thang"`.
  - `frontend/components/admin/admin-rooms-client.tsx:486`: `"Diện tích (m2)"` nên thống nhất với `m²`.
- `frontend/components/host/host-posts-client.tsx:100` vẫn dùng `window.confirm()` khi xóa bài đăng, trong khi admin có `ConfirmDialog`. Trải nghiệm xác nhận thao tác nguy hiểm chưa đồng nhất.
- Một số component dùng class `dark:*` trong khi theme chính đang dựa trên `[data-theme="dark"]`. Nếu Tailwind dark mode không cấu hình theo class tương ứng, một vài vùng như dialog có thể không đổi màu như kỳ vọng.
- Chưa thấy triển khai bản đồ/phạm vi địa lý thực sự trong frontend, dù dự án có biến môi trường `NEXT_PUBLIC_GOONG_MAPTILES_KEY` và dependency `maplibre-gl`. Với website phòng trọ, bản đồ là tính năng có giá trị cao.

### Đề xuất cải thiện UI/UX

- Sửa dứt điểm build error trước, vì đây là điều kiện tối thiểu để demo/nộp bài.
- Chuẩn hóa toàn bộ text tiếng Việt, đơn vị tiền, đơn vị diện tích và format ngày giờ.
- Thống nhất modal xác nhận cho host/admin thay vì dùng `window.confirm()`.
- Thêm bản đồ vị trí phòng, hoặc ít nhất là link mở vị trí trên bản đồ.
- Thêm thông tin thực tế hơn ở phòng: tiền điện/nước, cọc, giờ giấc, nội quy, chỗ để xe, khoảng cách đến trường/chợ/bến xe.
- Với form dài của host/admin, nên chia nhóm thông tin rõ hơn: thông tin cơ bản, giá/diện tích, vị trí, tiện ích, ảnh, trạng thái.

## 4. Đánh giá chức năng

### Người thuê phòng

**Đã có:**

- Xem trang chủ và danh sách phòng.
- Tìm kiếm, lọc, sắp xếp, phân trang.
- Xem chi tiết phòng.
- Đăng ký, đăng nhập, đăng xuất.
- Gửi yêu cầu liên hệ/đặt lịch xem phòng.
- Lưu/bỏ lưu phòng.
- Xem danh sách phòng đã lưu.
- Xem lịch sử liên hệ.
- Nhận thông báo trong ứng dụng.
- Cập nhật hồ sơ cá nhân.

**Nhận xét:**

Luồng người thuê được triển khai khá đầy đủ cho đồ án. Đặc biệt, lưu phòng và lịch sử liên hệ là hai chức năng giúp hệ thống vượt khỏi mức web giới thiệu thông thường.

**Cần cải thiện:**

- Form liên hệ hiện yêu cầu đăng nhập. Điều này hợp lý nếu muốn quản lý lịch sử, nhưng thực tế nhiều website vẫn cho khách gửi liên hệ nhanh. Nếu giữ yêu cầu đăng nhập, UI cần giải thích rõ hơn.
- Nên có chức năng so sánh phòng hoặc ghi chú cá nhân cho phòng đã lưu.
- Nên có lọc theo khoảng giá đầy đủ hơn. Frontend hiện thiên về chọn ngưỡng `maxPrice`/`minArea`, trong khi người dùng thường muốn cả khoảng min/max.
- Nên có tìm kiếm theo vị trí gần trường, quận, phường hoặc bán kính trên bản đồ.

### Chủ trọ

**Đã có:**

- Dashboard thống kê tin đăng và liên hệ.
- Danh sách bài đăng của chính mình.
- Tạo bài đăng.
- Sửa bài đăng.
- Cập nhật trạng thái phòng.
- Xóa bài đăng.
- Quản lý khách/yêu cầu liên hệ theo phòng của mình.
- Cập nhật hồ sơ chủ trọ.

**Nhận xét:**

Phần chủ trọ là điểm mạnh của đồ án. Backend có kiểm tra quyền sở hữu bằng `createdById`, ví dụ trong `backend/src/main/java/com/trotot/backend/service/HostService.java`, nên chủ trọ không thao tác trực tiếp lên phòng của người khác.

**Cần cải thiện:**

- Dự án hiện không có role `HOST` riêng; mọi user đã đăng nhập về mặt kỹ thuật có thể dùng chức năng host. Đây là quyết định sản phẩm có thể chấp nhận cho đồ án, nhưng nên ghi rõ trong tài liệu. Nếu muốn chuyên nghiệp hơn, nên có luồng "nâng cấp thành chủ trọ" hoặc role `HOST`.
- Form tạo/sửa bài đăng nên hỗ trợ upload nhiều ảnh thay vì chủ yếu dùng thumbnail/URL.
- Nên có trạng thái duyệt bài: nháp, chờ duyệt, đã duyệt, bị từ chối. Hiện admin/host quản lý trạng thái phòng nhưng chưa thấy workflow kiểm duyệt tin đăng rõ ràng.
- Nên có lịch hẹn xem phòng theo ngày giờ cụ thể, tránh chỉ ghi chuỗi text.

### Admin

**Đã có:**

- Dashboard tổng quan.
- Quản lý phòng.
- Quản lý người dùng.
- Quản lý yêu cầu liên hệ.
- Cập nhật trạng thái yêu cầu.
- Export CSV ở một số màn hình.
- Phân quyền API admin bằng Spring Security: `/api/v1/admin/**` yêu cầu role `ADMIN`.

**Nhận xét:**

Phần admin đủ để demo quản trị hệ thống cơ bản. Có dashboard, bảng dữ liệu, lọc và thao tác trạng thái. Backend phân quyền admin rõ ràng trong `SecurityConfig`.

**Cần cải thiện:**

- Admin nên có màn hình duyệt bài đăng của chủ trọ trước khi hiển thị công khai.
- Nên có audit log cho thao tác quan trọng: khóa user, ẩn phòng, xóa phòng, cập nhật yêu cầu.
- Nên có bộ lọc nâng cao cho user, phòng và yêu cầu liên hệ.
- Chưa thấy chức năng quản lý báo cáo vi phạm/phòng giả, đây là chức năng thực tế quan trọng.
- Admin room hiện có tạo/cập nhật trạng thái/xóa, nhưng cần kiểm tra lại khả năng sửa đầy đủ thông tin phòng trong UI admin. Chưa đủ thông tin để kết luận đã hoàn chỉnh.

## 5. Đánh giá code và cấu trúc dự án

### Frontend

**Điểm tốt:**

- Cấu trúc route rõ ràng theo Next.js App Router: tenant, host, admin, auth và BFF API route.
- Có lớp service riêng trong `frontend/services`, giúp component không gọi API quá tùy tiện.
- Có custom hook như `use-auth`, `use-room-search`, tách một phần logic khỏi UI.
- Có component guard cho auth/admin/host.
- Auth đã chuyển sang HttpOnly cookie qua Next.js route handler, tốt hơn lưu JWT trong localStorage.

**Vấn đề cần sửa:**

- `npm run build` fail:
  - File: `frontend/components/ui/confirm-dialog.tsx:111`.
  - Nguyên nhân: truyền `ref` vào `Button`, nhưng `Button` chưa `forwardRef`.
  - Mức độ: nghiêm trọng, vì không build được frontend.
- `npm run lint` fail với 5 lỗi `react-hooks/set-state-in-effect`:
  - `frontend/components/admin/admin-users-client.tsx:68`
  - `frontend/components/layout/notification-bell.tsx:64`
  - `frontend/components/providers/theme-provider.tsx:43`
  - `frontend/components/rooms/rooms-page-client.tsx:54`
  - `frontend/components/rooms/saved-rooms-page-client.tsx:37`
- `npm test` fail do test `frontend/lib/__tests__/auth-storage.test.ts` vẫn kiểm tra cơ chế cũ `homi.access_token`, `readStoredToken`, trong khi code đã chuyển sang HttpOnly cookie và chỉ lưu user cache trong localStorage.
- Một số tài liệu trong `docs` chưa đồng bộ với code hiện tại. Ví dụ tài liệu integration còn mô tả JWT trong localStorage, trong khi code hiện dùng HttpOnly cookie/BFF.

### Backend

**Điểm tốt:**

- Backend có cấu trúc tầng tương đối chuẩn: controller, service, repository, entity, dto, mapper/specification.
- Spring Security cấu hình rõ:
  - Stateless session.
  - JWT filter.
  - Public endpoint cho login/register và public rooms.
  - Admin endpoint yêu cầu role `ADMIN`.
  - Có security headers.
  - Có CORS config.
  - Có rate limit cho auth endpoint.
- Validation và xử lý lỗi tập trung tốt hơn mức cơ bản của đồ án.
- Có `InputSanitizer` cho một số dữ liệu text như contact request, room, host profile.
- Backend test pass 29/29, đây là điểm cộng lớn.

**Vấn đề cần cải thiện:**

- `RoomService` và một số service có trách nhiệm khá lớn. Với quy mô lớn hơn, nên tách nhỏ phần search/filter, image sync, admin mutation và public read.
- `backend/src/main/java/com/trotot/backend/repository/specification/RoomSpecifications.java:108-118` lọc tiện ích theo kiểu "có ít nhất một tiện ích được chọn". Nếu UI làm người dùng hiểu là "phải có tất cả tiện ích", logic này sẽ gây sai kỳ vọng.
- `backend/src/main/java/com/trotot/backend/service/ImageProcessingService.java:103-104` trả về ảnh gốc nếu ảnh nhỏ hơn giới hạn. Nếu ảnh PNG có alpha và được ghi ra JPEG ở `writeJpeg`, có rủi ro lỗi màu/encode. Khi resize thì có convert `TYPE_INT_RGB`, nhưng khi không resize thì chưa convert.
- `backend/src/main/java/com/trotot/backend/service/FileStorageService.java:98-101` cho phép WEBP theo content type, nhưng Java `ImageIO` mặc định thường không đọc WEBP nếu không thêm plugin. Có thể xảy ra tình huống validate cho qua nhưng xử lý ảnh thất bại.
- `backend/src/main/resources/application.yml` đang có fallback local như `DB_PASSWORD:123456`, `ddl-auto: update`, JWT secret demo và log DEBUG. Phù hợp môi trường học tập/local, nhưng không nên dùng nguyên cho production.

### Database/API

**Điểm tốt:**

- Schema cơ bản có các bảng chính: roles, users, user_roles, districts, amenities, rooms, room_images, room_amenities, contact_requests.
- Có seed dữ liệu demo, phù hợp cho chấm đồ án và demo.
- API có phân quyền rõ cho public/auth/admin/host/user.
- DTO request/response được tách riêng, không trả entity trực tiếp ở hầu hết luồng chính.

**Vấn đề cần sửa:**

- `database/mysql/01_schema.sql` chưa có bảng `saved_rooms` và `notifications`, trong khi backend đã có entity/repository `SavedRoom` và `Notification`. Hiện backend có thể tự tạo bảng nhờ `ddl-auto: update`, nhưng script database chính không còn là nguồn sự thật đầy đủ.
- Chưa thấy migration tool như Flyway hoặc Liquibase. Với đồ án nhỏ có thể dùng script SQL, nhưng khi đã có nhiều lần nâng cấp như `04_host_upgrade.sql`, nên cân nhắc migration version rõ ràng.
- Cần đồng bộ tài liệu database với entity hiện tại.

## 6. Đánh giá responsive và dark mode

### Responsive

**Điểm tốt:**

- Source frontend dùng nhiều breakpoint Tailwind như `md`, `lg`, `xl`.
- Danh sách phòng có layout grid và mobile filter drawer, phù hợp với mobile.
- Admin/host có bảng và một số mô tả cho trải nghiệm mobile.
- Header, navigation, card và form có dấu hiệu đã tính đến màn hình nhỏ.

**Rủi ro/chưa đủ thông tin:**

- Do frontend build fail, chưa thể xác nhận bằng production build trên desktop/tablet/mobile.
- Các bảng admin/host có nhiều cột; nếu không có scroll hoặc layout card hóa trên mobile, dễ bị tràn ngang.
- Form dài của host/admin cần kiểm tra trực tiếp trên mobile để đảm bảo nút submit, upload ảnh và select không bị chồng lấn.

### Dark mode

**Điểm tốt:**

- Có `ThemeProvider`, `ThemeToggle`, CSS variable và `[data-theme="dark"]`.
- Cách dùng token màu giúp theme có thể mở rộng và bảo trì tốt hơn so với hard-code màu rải rác.

**Rủi ro/chưa đủ thông tin:**

- Một số class `dark:*` có thể không hoạt động nếu Tailwind không được cấu hình đúng theo chiến lược theme hiện tại.
- Cần kiểm tra contrast thực tế trên các vùng: dialog, toast, card phòng, bảng admin, input form và trạng thái badge.
- Nên dùng một cách tiếp cận thống nhất: hoặc toàn bộ dựa trên CSS variable `[data-theme]`, hoặc cấu hình Tailwind `darkMode` rõ ràng.

## 7. Đánh giá bảo mật và dữ liệu

### Điểm tốt

- JWT được đặt trong HttpOnly cookie ở frontend BFF, giảm rủi ro token bị đọc bởi JavaScript.
- Backend vẫn hỗ trợ Bearer token và JWT filter.
- Spring Security phân quyền admin rõ ràng.
- CSRF bị disable ở backend nhưng kiến trúc hiện dùng JWT/stateless và BFF proxy. Rủi ro thấp hơn so với cookie session truyền thống, tuy nhiên vẫn nên có kiểm tra Origin/CSRF token cho các mutation quan trọng nếu triển khai thật.
- Có rate limit đăng nhập/đăng ký ở `RateLimitFilter`: 10 request/60 giây cho `POST /api/v1/auth/**`.
- Có validate DTO và xử lý lỗi tập trung.
- Có sanitize input ở nhiều luồng text.
- Upload ảnh giới hạn content type và kích thước.

### Vấn đề cần lưu ý

- `.env.local` frontend có biến `NEXT_PUBLIC_GOONG_MAPTILES_KEY`. Vì là `NEXT_PUBLIC`, key này sẽ lộ ở client theo thiết kế. Nếu dùng thật, cần giới hạn domain/quota và không dùng key nhạy cảm.
- Chưa thấy password reset, email verification, đổi mật khẩu, khóa tài khoản theo nhiều lần đăng nhập sai.
- Chưa thấy audit log cho admin.
- `application.yml` dùng secret demo và password mặc định local. Cần tách profile dev/prod rõ hơn.
- Upload ảnh cần xử lý chắc hơn với WEBP/PNG alpha như đã nêu ở phần backend.
- Admin note ở `ContactRequestService` dùng `trimToNull` thay vì sanitizer nhất quán như các field khác.

## 8. Bảng chấm điểm

| Tiêu chí | Điểm | Nhận xét ngắn |
|---|---:|---|
| Ý tưởng | 8.5/10 | Đề tài thực tế, đúng nhu cầu, có đủ 3 nhóm người dùng tenant/host/admin. |
| Giao diện | 7.5/10 | Bố cục tốt và nhất quán, nhưng còn lỗi text, chưa xác nhận runtime do build fail. |
| Trải nghiệm người dùng | 7.5/10 | Luồng chính khá đầy đủ; cần cải thiện map, lịch hẹn, upload nhiều ảnh và giải thích auth. |
| Chức năng | 8.0/10 | Nhiều chức năng hơn CRUD cơ bản; thiếu một số chức năng thực tế như duyệt tin, báo cáo vi phạm, reset password. |
| Code | 6.8/10 | Backend tốt, frontend có cấu trúc ổn nhưng build/lint/test đang fail nên bị trừ nhiều. |
| Database/API | 7.5/10 | API khá tốt, schema cơ bản ổn; script DB chưa đồng bộ với entity mới, chưa có migration tool. |
| Responsive | 7.2/10 | Code có responsive, nhưng cần kiểm tra runtime; bảng admin/host là điểm rủi ro. |
| Tổng thể | 7.4/10 | Đồ án có nền tảng tốt và nhiều chức năng, nhưng phải sửa lỗi build/test/lint trước khi nộp. |

## 9. Danh sách lỗi/cải thiện ưu tiên

### Cần sửa gấp

1. Sửa lỗi build frontend:
   - `frontend/components/ui/confirm-dialog.tsx:111`
   - `frontend/components/ui/button.tsx`
   - Hướng xử lý: cho `Button` hỗ trợ `forwardRef` hoặc không truyền `ref` trực tiếp vào `Button`.

2. Cập nhật test auth-storage:
   - `frontend/lib/__tests__/auth-storage.test.ts`
   - Test hiện vẫn kỳ vọng token trong localStorage (`homi.access_token`) và `readStoredToken`, không khớp với cơ chế HttpOnly cookie hiện tại.

3. Sửa lỗi lint React hooks:
   - `frontend/components/admin/admin-users-client.tsx:68`
   - `frontend/components/layout/notification-bell.tsx:64`
   - `frontend/components/providers/theme-provider.tsx:43`
   - `frontend/components/rooms/rooms-page-client.tsx:54`
   - `frontend/components/rooms/saved-rooms-page-client.tsx:37`

4. Đồng bộ schema database:
   - Bổ sung bảng cho `SavedRoom` và `Notification` vào script SQL/migration.
   - Không phụ thuộc hoàn toàn vào `ddl-auto: update` nếu nộp hoặc deploy.

5. Sửa text UI thiếu dấu:
   - `Đăng nhập de tiep tuc` -> `Đăng nhập để tiếp tục`.
   - `Trạng thái moi` -> `Trạng thái mới`.
   - `Giá / thang` -> `Giá / tháng`.

### Nên cải thiện

1. Chuẩn hóa dark mode: thống nhất CSS variable `[data-theme]` và Tailwind dark variant.
2. Thay `window.confirm()` ở host bằng `ConfirmDialog`.
3. Thêm upload nhiều ảnh cho chủ trọ/admin.
4. Thêm bản đồ vị trí phòng hoặc ít nhất link bản đồ.
5. Thêm workflow duyệt bài đăng cho admin.
6. Cập nhật tài liệu `docs` theo code hiện tại, đặc biệt phần auth và kết quả build/test.
7. Làm rõ logic lọc tiện ích là "có một trong các tiện ích" hay "có tất cả tiện ích".
8. Tách profile dev/prod trong backend config.
9. Cải thiện xử lý ảnh WEBP/PNG alpha trong backend.

### Có thể bổ sung sau

1. Đánh giá/rating phòng và chủ trọ.
2. Báo cáo tin giả/tin vi phạm.
3. Chat trực tiếp giữa người thuê và chủ trọ.
4. Lịch hẹn xem phòng bằng calendar/time slot.
5. So sánh phòng đã lưu.
6. Reset password, đổi mật khẩu, xác thực email.
7. Xác minh chủ trọ/phòng thật.
8. Quản lý hợp đồng, đặt cọc, thanh toán.
9. Gợi ý phòng tương tự.
10. Analytics nâng cao cho chủ trọ và admin.

## 10. Kết luận

Với vai trò giảng viên chấm đồ án, tôi đánh giá Homi là một đồ án có định hướng đúng, phạm vi chức năng tốt và thể hiện được năng lực full-stack. Dự án có backend tương đối chắc, có phân quyền, validation, test pass và nhiều API phục vụ đúng nghiệp vụ. Frontend có nhiều màn hình và luồng người dùng thực tế, không chỉ dừng ở hiển thị danh sách phòng.

Điểm trừ lớn nhất là trạng thái kỹ thuật cuối cùng chưa sạch: frontend không build được, lint fail, test frontend fail và schema database chưa đồng bộ với entity mới. Khi chấm đồ án, lỗi build là lỗi nghiêm trọng vì ảnh hưởng trực tiếp đến khả năng demo, deploy và bảo trì.

Nếu sửa các lỗi ưu tiên trong mục 9, cập nhật lại tài liệu và kiểm thử responsive/dark mode bằng trình duyệt thật, đồ án có thể đạt mức khá tốt đến tốt. Ở trạng thái hiện tại, tôi chấm tổng thể khoảng **7.4/10**: ý tưởng và backend tốt, chức năng phong phú, nhưng chất lượng hoàn thiện frontend và đồng bộ database cần được nâng lên trước khi nộp bản cuối.
