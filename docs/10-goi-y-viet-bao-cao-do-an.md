# 10. Gợi Ý Viết Báo Cáo Đồ Án

## 1. Cách đặt tên đề tài

Một số tên phù hợp:

- Xây dựng website tìm kiếm và quản lý phòng trọ Homi.
- Xây dựng hệ thống hỗ trợ thuê phòng trọ tại Hà Nội.
- Xây dựng website cho thuê phòng trọ tích hợp xác thực Google, OTP và quản trị nội dung.

## 2. Gợi ý cấu trúc báo cáo

### Chương 1: Tổng quan đề tài

Nội dung nên có:

- Lý do chọn đề tài.
- Vấn đề thực tế khi tìm phòng trọ.
- Mục tiêu hệ thống.
- Phạm vi đề tài.
- Đối tượng sử dụng: người thuê, người đăng tin, admin.

Có thể lấy ý từ:

- `01-tong-quan-du-an.md`
- `04-phan-tich-chuc-nang.md`

### Chương 2: Cơ sở lý thuyết và công nghệ

Nội dung nên có:

- Kiến trúc client-server.
- REST API.
- JWT và refresh token.
- OAuth/Google login.
- OTP email verification.
- ORM/JPA.
- MySQL.
- Next.js App Router.
- Spring Boot.

Có thể lấy ý từ:

- `02-cong-nghe-su-dung.md`
- `08-phan-quyen-nguoi-dung.md`

### Chương 3: Phân tích hệ thống

Nội dung nên có:

- Tác nhân.
- Trường hợp sử dụng.
- Luồng nghiệp vụ.
- Yêu cầu chức năng.
- Yêu cầu phi chức năng.

Có thể lấy ý từ:

- `04-phan-tich-chuc-nang.md`
- `05-luong-hoat-dong-he-thong.md`
- `06-use-case.md`

### Chương 4: Thiết kế hệ thống

Nội dung nên có:

- Kiến trúc tổng thể.
- Thiết kế database.
- Thiết kế API.
- Thiết kế phân quyền.
- Thiết kế giao diện chính.

Có thể lấy ý từ:

- `03-cau-truc-thu-muc.md`
- `07-database-va-api.md`
- `08-phan-quyen-nguoi-dung.md`

Sơ đồ nên vẽ:

- Sơ đồ trường hợp sử dụng.
- ERD database.
- Sequence diagram đăng ký OTP.
- Sequence diagram đăng nhập Google.
- Sequence diagram đăng tin phòng.
- Sequence diagram admin duyệt/quản lý dữ liệu.

### Chương 5: Cài đặt và triển khai

Nội dung nên có:

- Cấu trúc source code.
- Cài đặt backend.
- Cài đặt frontend.
- Cấu hình database.
- Cấu hình Google OAuth và Gmail SMTP.
- Cách chạy bằng Docker Compose.
- Cách kiểm thử.

Có thể lấy ý từ:

- `02-cong-nghe-su-dung.md`
- `03-cau-truc-thu-muc.md`
- `02-cong-nghe-su-dung.md`
- `huong-dan-don-file-nang-va-cai-lai.md`

### Chương 6: Kết quả đạt được

Nội dung nên có:

- Ảnh giao diện trang chủ.
- Ảnh danh sách phòng và bộ lọc.
- Ảnh chi tiết phòng.
- Ảnh đăng ký OTP.
- Ảnh đăng nhập Google.
- Ảnh hồ sơ cá nhân.
- Ảnh host dashboard.
- Ảnh admin.
- Ảnh CMS.
- Ảnh tin tức, hỗ trợ, khám phá.

Nên mô tả ngắn mỗi màn hình: mục đích, dữ liệu hiển thị, API liên quan.

### Chương 7: Đánh giá và hướng phát triển

Nội dung nên có:

- Ưu điểm.
- Hạn chế.
- Hướng phát triển.
- Bài học kinh nghiệm.

Có thể lấy ý từ:

- `09-danh-gia-he-thong.md`

## 3. Các điểm nên nhấn mạnh khi bảo vệ

### Auth nâng cao

Homi không chỉ có đăng nhập thường mà còn có:

- Đăng ký OTP qua Gmail.
- Google login.
- Forgot password bằng OTP.
- HttpOnly cookie.
- Refresh token.
- Tài khoản Google có thể tạo password local.

### Database thực tế

Database không chỉ có user và phòng, mà còn có:

- Tiện ích.
- Quận/khu vực.
- Ảnh phòng.
- Phòng đã lưu.
- Yêu cầu liên hệ.
- Báo cáo tin sai.
- Ticket hỗ trợ.
- Tin tức và danh mục.
- Refresh token.

### Admin và CMS

Điểm nổi bật:

- Admin quản lý dữ liệu nghiệp vụ.
- CMS riêng cho nội dung.
- Quản lý user có khóa/mở khóa, phân quyền, xác minh email.

### UI/UX

Website có:

- Light/dark mode.
- Mobile responsive.
- Dropdown điều hướng rõ.
- Empty state, loading, error/success message.
- Form có validate.

## 4. Mẫu yêu cầu tiếng Việt cho AI viết báo cáo

Bạn có thể dùng mẫu yêu cầu sau khi muốn nhờ AI viết hoặc chỉnh báo cáo đồ án:

```text
Bạn là giảng viên hướng dẫn đồ án ngành Công nghệ thông tin.
Hãy đọc bộ tài liệu Homi trong thư mục docs, đặc biệt là:
- 00-ai-context-homi.md
- 01-tong-quan-du-an.md
- 04-phan-tich-chuc-nang.md
- 05-luong-hoat-dong-he-thong.md
- 07-database-va-api.md
- 08-phan-quyen-nguoi-dung.md

Sau đó hãy giúp tôi viết báo cáo đồ án bằng tiếng Việt, văn phong học thuật, dễ hiểu, đúng với source code hiện tại.
Không tự bịa chức năng chưa có. Nếu thiếu thông tin, hãy ghi rõ giả định.
```

## 5. Gợi ý mô tả kỹ thuật ngắn

Đoạn có thể dùng trong báo cáo:

> Hệ thống Homi được xây dựng theo kiến trúc client-server, trong đó frontend sử dụng Next.js App Router để xây dựng giao diện và các API route trung gian, backend sử dụng Spring Boot để cung cấp REST API, xử lý xác thực, phân quyền và nghiệp vụ. Dữ liệu được lưu trữ trong MySQL với các bảng quan hệ cho người dùng, phòng, tiện ích, liên hệ, báo cáo và tin tức. Hệ thống hỗ trợ đăng ký xác minh OTP qua email, đăng nhập Google, JWT access token, refresh token và phân quyền admin.

## 6. Checklist trước khi nộp đồ án

- Chạy được frontend và backend.
- Database có dữ liệu demo đủ đẹp.
- Đăng ký OTP hoạt động hoặc có mô phỏng nếu môi trường không gửi mail.
- Google login hoạt động với domain/callback hợp lệ.
- Admin login được bằng tài khoản admin đúng.
- Các trang chính không lỗi giao diện.
- Chạy kiểm thử backend.
- Chạy frontend lint/build nếu máy đủ tài nguyên.
- Ảnh chụp màn hình trong báo cáo rõ ràng.
- Không để secret thật trong báo cáo hoặc mã nguồn nộp công khai.
