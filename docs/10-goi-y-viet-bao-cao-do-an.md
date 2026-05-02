# 10. Gợi ý viết báo cáo đồ án

## 1. Mục tiêu tài liệu

Tài liệu này gợi ý cách chuyển nội dung phân tích source code Homi vào báo cáo đồ án tốt nghiệp ngành Công nghệ thông tin. Có thể dùng bộ tài liệu trong thư mục `docs` làm nguồn để viết các chương chính của báo cáo.

## 2. Gợi ý cấu trúc báo cáo

Có thể tổ chức báo cáo theo 4 chương chính:

- Chương 1: Tổng quan đề tài.
- Chương 2: Cơ sở lý thuyết và công nghệ sử dụng.
- Chương 3: Phân tích và thiết kế hệ thống.
- Chương 4: Cài đặt, kiểm thử và đánh giá.

Ngoài ra có thể thêm:

- Mở đầu.
- Kết luận và hướng phát triển.
- Tài liệu tham khảo.
- Phụ lục API/database/giao diện.

## 3. Gợi ý cho Chương 1: Tổng quan đề tài

### 3.1. Nội dung nên trình bày

Chương 1 nên tập trung vào lý do chọn đề tài, bài toán thực tế và mục tiêu hệ thống.

Có thể dùng nội dung từ:

- `docs/01-tong-quan-du-an.md`
- Một phần `docs/09-danh-gia-he-thong.md`

### 3.2. Dàn ý đề xuất

1. Lý do chọn đề tài.
2. Thực trạng nhu cầu tìm phòng trọ.
3. Vấn đề của cách tìm phòng truyền thống:
   - Thông tin phân tán.
   - Khó so sánh giá/diện tích/khu vực.
   - Khó theo dõi phòng đã quan tâm.
   - Chủ trọ khó quản lý yêu cầu liên hệ.
4. Mục tiêu đề tài:
   - Xây dựng website tìm và cho thuê phòng trọ.
   - Hỗ trợ tìm kiếm, lọc và xem chi tiết phòng.
   - Hỗ trợ người dùng lưu phòng và gửi yêu cầu xem phòng.
   - Hỗ trợ người đăng tin quản lý bài đăng và khách liên hệ.
   - Hỗ trợ admin quản lý hệ thống.
5. Phạm vi đề tài.
6. Đối tượng sử dụng:
   - Khách chưa đăng nhập.
   - Người thuê phòng.
   - Chủ trọ/người đăng tin.
   - Admin.
7. Phương pháp thực hiện.

### 3.3. Đoạn văn mẫu

Đề tài “Xây dựng website tìm và cho thuê phòng trọ Homi” hướng đến việc hỗ trợ người thuê phòng tiếp cận thông tin phòng trọ một cách rõ ràng, có khả năng tìm kiếm và lọc theo nhu cầu. Hệ thống đồng thời cung cấp công cụ cho người đăng tin quản lý bài đăng, theo dõi khách liên hệ và hỗ trợ quản trị viên kiểm soát dữ liệu toàn hệ thống. Đây là bài toán có tính thực tiễn cao, phù hợp với nhu cầu số hóa quy trình tìm kiếm và cho thuê phòng trọ tại các khu vực đô thị.

## 4. Gợi ý cho Chương 2: Cơ sở lý thuyết và công nghệ sử dụng

### 4.1. Nội dung nên trình bày

Chương 2 nên giới thiệu các công nghệ, mô hình và khái niệm dùng trong dự án.

Có thể dùng nội dung từ:

- `docs/02-cong-nghe-su-dung.md`
- `docs/03-cau-truc-thu-muc.md`
- Một phần `docs/08-phan-quyen-nguoi-dung.md`

### 4.2. Dàn ý đề xuất

1. Kiến trúc web client-server.
2. REST API.
3. Frontend với Next.js, React và TypeScript.
4. Backend với Spring Boot.
5. ORM và Spring Data JPA.
6. Cơ sở dữ liệu quan hệ MySQL.
7. Xác thực JWT và refresh token.
8. Cookie HttpOnly và mô hình BFF/proxy trong Next.js.
9. Docker Compose.
10. Kiểm thử phần mềm.

### 4.3. Gợi ý cách viết phần công nghệ

Khi viết về công nghệ, nên tránh chỉ liệt kê tên thư viện. Nên giải thích vì sao công nghệ đó phù hợp với hệ thống:

- Next.js phù hợp vì hỗ trợ App Router, SEO metadata, route handler và giao diện React hiện đại.
- Spring Boot phù hợp vì hỗ trợ xây dựng REST API nhanh, tích hợp Spring Security, JPA và validation.
- MySQL phù hợp vì dữ liệu có nhiều quan hệ rõ ràng như user, phòng, tiện ích, yêu cầu liên hệ.
- JWT phù hợp cho REST API stateless.
- Docker Compose giúp dựng đồng bộ frontend, backend và database.

## 5. Gợi ý cho Chương 3: Phân tích và thiết kế hệ thống

### 5.1. Nội dung nên trình bày

Đây là chương quan trọng nhất về mặt phân tích thiết kế. Nên dùng nhiều nội dung từ:

- `docs/04-phan-tich-chuc-nang.md`
- `docs/05-luong-hoat-dong-he-thong.md`
- `docs/06-use-case.md`
- `docs/07-database-va-api.md`
- `docs/08-phan-quyen-nguoi-dung.md`

### 5.2. Dàn ý đề xuất

1. Khảo sát yêu cầu hệ thống.
2. Phân tích actor:
   - Khách chưa đăng nhập.
   - Người thuê phòng.
   - Chủ trọ/người đăng tin.
   - Admin.
3. Phân tích chức năng theo actor.
4. Biểu đồ Use Case.
5. Đặc tả Use Case.
6. Thiết kế kiến trúc tổng thể.
7. Thiết kế cơ sở dữ liệu.
8. Thiết kế API.
9. Thiết kế phân quyền.
10. Thiết kế các luồng xử lý chính.

### 5.3. Gợi ý phần phân tích yêu cầu

Có thể chia yêu cầu thành:

#### Yêu cầu chức năng

- Quản lý tài khoản.
- Tìm kiếm và lọc phòng.
- Xem chi tiết phòng.
- Lưu phòng.
- Gửi yêu cầu xem phòng.
- Xem lịch sử liên hệ.
- Quản lý bài đăng.
- Quản lý khách liên hệ.
- Quản lý người dùng.
- Quản lý báo cáo tin đăng.
- Dashboard thống kê.

#### Yêu cầu phi chức năng

- Giao diện dễ sử dụng, responsive.
- API có xác thực và phân quyền.
- Mật khẩu được mã hóa.
- Token không lưu trực tiếp trong JavaScript client.
- Database có ràng buộc khóa ngoại.
- Hệ thống có thể chạy bằng Docker.
- Có khả năng mở rộng thêm role `HOST`, duyệt bài, thanh toán.

### 5.4. Gợi ý phần Use Case

Sử dụng trực tiếp `docs/06-use-case.md` để đưa vào báo cáo:

- Bảng actor.
- Danh sách use case theo actor.
- Sơ đồ Mermaid có thể chuyển thành hình ảnh.
- Bảng đặc tả chi tiết từng use case.

Khi đưa vào báo cáo Word/PDF, nên chọn các use case tiêu biểu để trình bày chi tiết:

- Đăng ký/đăng nhập.
- Tìm kiếm/lọc phòng.
- Xem chi tiết và gửi yêu cầu xem phòng.
- Lưu phòng.
- Chủ trọ đăng bài.
- Admin quản lý bài đăng/yêu cầu.

Các use case còn lại có thể để ở phụ lục.

### 5.5. Gợi ý phần thiết kế database

Sử dụng `docs/07-database-va-api.md`.

Nên trình bày:

- Sơ đồ ERD.
- Bảng `users`, `roles`, `rooms`, `room_images`, `room_amenities`, `amenities`, `districts`, `saved_rooms`, `contact_requests`, `room_reports`, `notifications`, `refresh_tokens`.
- Giải thích các quan hệ:
  - User - Role: nhiều-nhiều.
  - User - Room: một-nhiều qua `created_by`.
  - Room - Amenity: nhiều-nhiều.
  - User - SavedRoom - Room: user lưu nhiều phòng.
  - Room - ContactRequest: một phòng có nhiều yêu cầu.
  - User - Notification: một user nhận nhiều thông báo.

### 5.6. Gợi ý phần thiết kế API

Nên trình bày API theo nhóm:

- Auth API.
- Public room API.
- User API.
- Host API.
- Admin API.
- Upload API.
- Notification API.

Không nhất thiết đưa toàn bộ endpoint vào nội dung chính nếu báo cáo bị giới hạn số trang. Có thể đưa bảng API đầy đủ vào phụ lục.

### 5.7. Gợi ý phần phân quyền

Điểm quan trọng cần viết rõ:

- Backend có role `USER` và `ADMIN`.
- Admin endpoint được bảo vệ bằng `ROLE_ADMIN`.
- Các endpoint còn lại yêu cầu đăng nhập nếu không nằm trong danh sách public.
- Khu host hiện chưa có role `HOST`; quyền host dựa trên đăng nhập và sở hữu bài đăng `created_by`.

Cách diễn đạt đề xuất:

> Trong phạm vi hiện tại, hệ thống cho phép người dùng đã đăng nhập đăng tin phòng trọ. Các thao tác sửa, xóa và cập nhật trạng thái bài đăng được giới hạn bằng quan hệ sở hữu thông qua trường `created_by`. Do đó, chủ trọ/người đăng tin được xem là actor nghiệp vụ, chưa được tách thành role kỹ thuật riêng trong backend. Đây là một hạn chế và được đề xuất cải tiến bằng cách bổ sung role `HOST` trong hướng phát triển.

## 6. Gợi ý cho Chương 4: Cài đặt, kiểm thử và đánh giá

### 6.1. Nội dung nên trình bày

Chương 4 nên mô tả kết quả cài đặt, giao diện chính, kiểm thử và đánh giá.

Có thể dùng nội dung từ:

- `docs/02-cong-nghe-su-dung.md`
- `docs/03-cau-truc-thu-muc.md`
- `docs/04-phan-tich-chuc-nang.md`
- `docs/09-danh-gia-he-thong.md`

### 6.2. Dàn ý đề xuất

1. Môi trường cài đặt.
2. Cấu hình chạy hệ thống.
3. Một số màn hình chính:
   - Trang chủ.
   - Danh sách phòng.
   - Chi tiết phòng.
   - Đăng nhập/đăng ký OTP.
   - Phòng đã lưu.
   - Lịch sử liên hệ.
   - Dashboard host.
   - Quản lý bài đăng host.
   - Dashboard admin.
   - Quản lý phòng/user/yêu cầu/báo cáo.
4. Kiểm thử chức năng.
5. Đánh giá kết quả đạt được.
6. Hạn chế.

### 6.3. Gợi ý bảng kiểm thử

| Mã test | Chức năng | Dữ liệu kiểm thử | Kết quả mong đợi |
|---|---|---|---|
| TC01 | Đăng ký tài khoản | Email mới, mật khẩu hợp lệ | Tạo tài khoản chờ OTP |
| TC02 | Xác minh OTP | OTP đúng | Kích hoạt tài khoản, đăng nhập |
| TC03 | Đăng nhập | Email/mật khẩu đúng | Đăng nhập thành công |
| TC04 | Tìm phòng | Lọc theo quận và giá | Trả danh sách phù hợp |
| TC05 | Xem chi tiết phòng | Slug hợp lệ | Hiển thị thông tin phòng |
| TC06 | Lưu phòng | User đã đăng nhập | Phòng được lưu/bỏ lưu |
| TC07 | Gửi yêu cầu xem phòng | Form hợp lệ | Tạo contact request |
| TC08 | Host tạo bài | Dữ liệu phòng hợp lệ | Bài đăng mới được lưu |
| TC09 | Host sửa bài người khác | Room không thuộc user | Bị từ chối/không tìm thấy |
| TC10 | Admin quản lý user | Khóa user thường | User bị khóa |

### 6.4. Gợi ý đánh giá kết quả

Nên trình bày theo các nhóm:

- Kết quả đạt được:
  - Hoàn thành các chức năng tìm phòng, liên hệ, lưu phòng, host, admin.
  - Có xác thực OTP/Google.
  - Có dashboard và báo cáo.
  - Có database quan hệ và API rõ ràng.
- Hạn chế:
  - Chưa có role `HOST`.
  - Chưa có duyệt bài.
  - Chưa có thanh toán/chat.
  - Chưa đủ thông tin về production monitoring.
- Hướng phát triển:
  - Bổ sung role host.
  - Duyệt bài.
  - Chat realtime.
  - Thanh toán gói tin.
  - Upload ảnh lên cloud storage.

## 7. Gợi ý phần kết luận

### 7.1. Nội dung nên có

Kết luận nên trả lời ba câu hỏi:

1. Đề tài đã giải quyết được vấn đề gì?
2. Hệ thống đã đạt được những chức năng nào?
3. Còn hạn chế gì và hướng phát triển ra sao?

### 7.2. Đoạn kết luận mẫu

Sau quá trình phân tích, thiết kế và xây dựng, hệ thống Homi đã đáp ứng được các chức năng cơ bản của một website tìm và cho thuê phòng trọ. Người dùng có thể tìm kiếm, lọc và xem chi tiết phòng; đăng ký, đăng nhập, lưu phòng và gửi yêu cầu xem phòng. Người đăng tin có thể quản lý bài đăng và khách liên hệ, trong khi quản trị viên có thể theo dõi dashboard, quản lý phòng, người dùng, yêu cầu liên hệ và báo cáo tin đăng. Hệ thống được xây dựng theo kiến trúc tách frontend, backend và database, sử dụng Next.js, Spring Boot và MySQL.

Bên cạnh các kết quả đạt được, hệ thống vẫn còn một số hạn chế như chưa tách role `HOST` riêng, chưa có quy trình duyệt bài trước khi công khai, chưa tích hợp thanh toán và chat realtime. Trong tương lai, hệ thống có thể được phát triển thêm các chức năng này để tăng tính thực tế và khả năng triển khai thương mại.

## 8. Gợi ý hướng phát triển

Có thể đưa các hướng sau vào phần cuối báo cáo:

- Bổ sung role `HOST` và quy trình đăng ký/nâng cấp tài khoản chủ trọ.
- Bổ sung duyệt bài đăng trước khi công khai.
- Xây dựng chat realtime giữa người thuê và chủ trọ.
- Tích hợp bản đồ trực tiếp và tìm kiếm theo vị trí.
- Thêm thanh toán/gói đăng tin nổi bật.
- Bổ sung đánh giá chủ trọ/phòng.
- Chuyển lưu trữ ảnh sang cloud storage.
- Bổ sung audit log cho thao tác admin.
- Bổ sung kiểm thử e2e và CI/CD.
- Bổ sung backup, monitoring và logging production.

## 9. Gợi ý sử dụng tài liệu trong thư mục docs

| File docs | Nên dùng cho phần nào |
|---|---|
| `01-tong-quan-du-an.md` | Chương 1, mở đầu, phạm vi đề tài |
| `02-cong-nghe-su-dung.md` | Chương 2, môi trường cài đặt |
| `03-cau-truc-thu-muc.md` | Chương 2 hoặc Chương 4 |
| `04-phan-tich-chuc-nang.md` | Chương 3 |
| `05-luong-hoat-dong-he-thong.md` | Chương 3, phần thiết kế luồng xử lý |
| `06-use-case.md` | Chương 3, phần Use Case |
| `07-database-va-api.md` | Chương 3, phần database/API hoặc phụ lục |
| `08-phan-quyen-nguoi-dung.md` | Chương 3, phần bảo mật/phân quyền |
| `09-danh-gia-he-thong.md` | Chương 4 và kết luận |
| `10-goi-y-viet-bao-cao-do-an.md` | Khung tổng hợp để viết báo cáo chính |

## 10. Lưu ý khi viết báo cáo

- Viết trung thực theo hiện trạng source code.
- Không mô tả `HOST` như role backend nếu chưa nâng cấp code.
- Nếu thiếu thông tin vận hành production, ghi “chưa đủ thông tin để đánh giá”.
- Nên đưa sơ đồ Use Case, ERD và sequence/flowchart vào chương phân tích thiết kế.
- Nên đưa bảng API đầy đủ vào phụ lục nếu nội dung chính quá dài.
- Nên chụp màn hình giao diện thật của website để minh họa Chương 4.

