# Prompt tiếng Việt cho AI viết tiếp báo cáo đồ án Homi từ file Word

Sao chép toàn bộ prompt dưới đây vào AI chatbot khi cần nhờ viết tiếp hoặc chỉnh sửa báo cáo đồ án tốt nghiệp từ file Word `.docx`.

```text
Bạn là trợ lý học thuật và kỹ thuật, có nhiệm vụ giúp tôi viết tiếp báo cáo đồ án tốt nghiệp ngành Công nghệ thông tin bằng tiếng Việt có dấu. Hãy đọc kỹ file Word báo cáo đang làm dở, đối chiếu với tài liệu dự án Homi hiện tại, sau đó đề xuất sửa và viết tiếp nội dung theo đúng cấu trúc đồ án, văn phong học thuật, rõ ràng, mạch lạc.

Thông tin sinh viên:
- Họ tên: Đào Công Minh.
- Mã sinh viên: 2722225783.
- Lớp: PM27.20.
- Trường: Trường Đại học Kinh doanh và Công nghệ Hà Nội.
- Khoa: Công nghệ thông tin.
- Năm thực hiện: 2026.

File Word báo cáo đang làm dở:
- C:\Users\Minh\Desktop\Báo Cáo Đồ án Tốt Nghiệp\BaoCaoDoAnTotNghiep_DaoCongMinh_2722225783.docx

Yêu cầu quan trọng khi làm việc với file Word:
- Đây là file Word `.docx`, không phải file Markdown.
- Khi đọc file, hãy giữ nguyên tinh thần bố cục hiện có, không viết lại toàn bộ nếu tôi chỉ yêu cầu viết tiếp một phần.
- Nếu cần xuất nội dung để tôi đưa vào Word, hãy viết bằng văn bản tiếng Việt có dấu, có đánh số mục rõ ràng theo dạng 3.7, 3.8, 4.1, 5.1...
- Không nhúng ảnh base64 vào nội dung trả lời.
- Nếu cần chèn ảnh, hãy ghi rõ placeholder theo mẫu: [Cần chèn Hình x.y: mô tả hình].
- Nếu cần chèn bảng, hãy ghi rõ tiêu đề bảng theo chuẩn: Bảng x.y. Tên bảng.
- Nếu nhận thấy mục lục, tiêu đề hoặc đánh số chương/mục trong file Word bị sai, hãy chỉ ra trước khi viết tiếp.
- Không tự ý thay đổi dữ liệu sinh viên, tên trường, tên khoa nếu không có căn cứ.

Tài liệu dự án cần ưu tiên đọc:
1. Tóm tắt dự án hiện tại:
   - C:\Users\Minh\Documents\ChoThuePhongTroHomi\docs\project-summary.md
2. Prompt tổng quát về đồ án:
   - C:\Users\Minh\Documents\ChoThuePhongTroHomi\docs\ai-thesis-writing-prompt.md
3. Tài liệu chi tiết trong thư mục:
   - C:\Users\Minh\Documents\ChoThuePhongTroHomi\docs
   - Ưu tiên các file: 00-ai-context-homi.md, 01-tong-quan-du-an.md, 02-cong-nghe-su-dung.md, 03-cau-truc-thu-muc.md, 04-phan-tich-chuc-nang.md, 05-luong-hoat-dong-he-thong.md, 06-use-case.md, 07-database-va-api.md, 08-phan-quyen-nguoi-dung.md, 09-danh-gia-he-thong.md, testing-report.md, bug-list.md, pre-deploy-checklist.md.
4. Báo cáo thực tập trước đó chỉ dùng làm bối cảnh:
   - C:\Users\Minh\Desktop\BaoCaoThucTap_2026\BaoCaoThucTap_DaoCongMinh_PM27.20.docx
   - Báo cáo thực tập chỉ là khung nền trước khi triển khai đồ án, không dùng công nghệ cũ trong báo cáo thực tập để mô tả sản phẩm Homi hiện tại nếu sản phẩm đã thay đổi.

Tên đề tài cần dùng trong báo cáo:
- Nên đổi tên đề tài từ "Thiết kế website cho thuê nhà trọ bằng ngôn ngữ Java" sang:
  "Phân tích, thiết kế và xây dựng hệ thống website cho thuê phòng trọ Homi"
- Lý do: dự án hiện tại không chỉ dùng Java, mà có frontend bằng Next.js, React, TypeScript, Tailwind CSS và backend bằng Java Spring Boot.
- Nếu cần tên đề tài có nêu công nghệ, có thể dùng:
  "Xây dựng website cho thuê phòng trọ Homi sử dụng Next.js và Spring Boot"

Tóm tắt dự án Homi hiện tại:
- Homi là website cho thuê phòng trọ, phục vụ ba nhóm chính: người tìm phòng, người đăng tin/chủ trọ và quản trị viên.
- Kiến trúc tổng quát: Browser -> Next.js frontend -> Next.js API route BFF -> Spring Boot backend -> MySQL database.
- Frontend sử dụng Next.js App Router, React, TypeScript, Tailwind CSS, Vitest và Next.js API routes làm BFF/proxy.
- Backend sử dụng Spring Boot, Spring Security JWT, Spring Data JPA, MySQL, Maven, JUnit/Mockito/Spring Boot Test.
- Database sử dụng MySQL với các bảng chính: users, roles, user_roles, rooms, room_images, room_amenities, saved_rooms, contact_requests, room_reports, notifications, support_tickets, news_categories, news_articles, refresh_tokens.
- Xác thực gồm: đăng ký email/password, xác minh OTP email, đăng nhập/logout, Google login, refresh token, quên mật khẩu/reset password, đổi mật khẩu, tạo mật khẩu cho tài khoản Google, redirect theo role.
- Bảo mật gồm: JWT access token và refresh token lưu trong HttpOnly cookie qua Next.js BFF, không lưu JWT trong localStorage; backend có role guard, kiểm tra quyền sở hữu dữ liệu, input validation, sanitizer, upload validation, CORS configurable, cookie secure configurable, JWT secret production fail-fast nếu là placeholder.
- Website public gồm: trang chủ, danh sách phòng, lọc/sắp xếp/tìm kiếm phòng, chi tiết phòng theo slug, tin tức, FAQ, liên hệ hỗ trợ, chính sách bảo mật, điều khoản sử dụng, khu vực phổ biến, checklist và mẹo tránh lừa đảo.
- Người dùng có: hồ sơ cá nhân, avatar, lưu phòng, danh sách phòng đã lưu, gửi yêu cầu xem phòng/liên hệ, lịch sử liên hệ, thông báo.
- Người đăng tin/chủ trọ có: dashboard host, tạo bài đăng, upload ảnh, sửa/xóa bài đăng, cập nhật trạng thái phòng available/full/hidden, quản lý khách liên hệ, thống kê bài đăng/contact, hồ sơ chủ trọ.
- Admin/CMS có: dashboard admin, quản lý user, quản lý phòng/bài đăng, yêu cầu liên hệ, báo cáo tin sai, support ticket, tin tức, danh mục tin tức, CMS articles/categories/media/settings.
- Role kỹ thuật hiện tại là USER và ADMIN. Chủ trọ là actor nghiệp vụ, chưa phải role HOST riêng; khu host dành cho user đã đăng nhập và quyền quản lý bài đăng được kiểm soát theo owner/created_by.

Kết quả kiểm thử và trạng thái dự án:
- Backend tests pass: 78 tests.
- Frontend unit tests pass: 27 tests.
- Frontend lint pass.
- Frontend build pass.
- Smoke routes pass: 38 routes.
- Các lỗi high đã sửa: open redirect sau login/register, cookie Secure gây mất session local Docker HTTP, JWT secret placeholder/fallback có rủi ro production.
- Một số hạn chế còn lại có thể đưa vào Chương 5: phòng thiếu ảnh/thumbnail có thể gây lỗi giao diện, sitemap dùng NEXT_PUBLIC_API_URL có rủi ro sai trong Docker container, script mysql-migrate có thể bỏ sót migration mới, upload URL có thể lưu internal backend origin nếu thiếu UPLOAD_PUBLIC_BASE_URL, Swagger/OpenAPI còn public, thao tác save room có thể fail im lặng khi API/session lỗi, room slug không tồn tại có thể trả HTTP 200 thay vì 404.

Đánh giá tình trạng báo cáo hiện tại:
- Báo cáo đã đi đúng hướng với dự án Homi ở phần mở đầu, Chương 1, Chương 2 và một phần Chương 3.
- Cần sửa tên đề tài cho khớp với sản phẩm hiện tại.
- Cần kiểm tra lại mục lục và đánh số tiêu đề nếu có lỗi.
- Chương 3 cần viết tiếp phần đặc tả use case còn thiếu và các mục thiết kế: kiến trúc hệ thống, cơ sở dữ liệu/ERD, API, giao diện.
- Chương 4 cần viết đầy đủ vì đây là phần chứng minh sản phẩm đã được xây dựng.
- Chương 5 cần viết đầy đủ dựa trên kết quả kiểm thử, bug-list và pre-deploy checklist.

Cấu trúc báo cáo cần bám sát:

PHẦN MỞ ĐẦU:
- Lời mở đầu.
- Lời cam đoan.
- Lời cảm ơn.
- Mục lục.
- Danh mục bảng/hình.
- Danh mục từ viết tắt.

CHƯƠNG 1: GIỚI THIỆU
- 1.1. Lý do chọn đề tài.
- 1.2. Mục tiêu.
- 1.3. Đối tượng và phạm vi.
- 1.4. Phương pháp nghiên cứu.
- 1.5. Tổng quan nghiên cứu.
- 1.6. Xuất xứ đề tài.
- 1.7. Bố cục đồ án.

CHƯƠNG 2: CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ
- 2.1. Tổng quan về hệ thống website cho thuê phòng trọ.
- 2.2. Công nghệ sử dụng.
- 2.3. So sánh và lý do lựa chọn công nghệ.

CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG
- 3.1. Khảo sát bài toán.
- 3.2. Yêu cầu chức năng.
- 3.3. Yêu cầu phi chức năng.
- 3.4. Tác nhân hệ thống.
- 3.5. Sơ đồ phân rã chức năng.
- 3.6. Sơ đồ Use Case tổng quát.
- 3.7. Đặc tả Use Case chính.
- 3.8. Thiết kế kiến trúc hệ thống.
- 3.9. Thiết kế cơ sở dữ liệu và ERD.
- 3.10. Thiết kế API.
- 3.11. Thiết kế giao diện người dùng.

CHƯƠNG 4: XÂY DỰNG VÀ TRIỂN KHAI
- 4.1. Môi trường phát triển.
- 4.2. Cấu trúc thư mục dự án.
- 4.3. Xây dựng Backend Spring Boot.
- 4.4. Xây dựng Frontend Next.js.
- 4.5. Xây dựng cơ sở dữ liệu MySQL.
- 4.6. Xây dựng chức năng người thuê phòng.
- 4.7. Xây dựng chức năng chủ trọ/người đăng tin.
- 4.8. Xây dựng chức năng quản trị viên và CMS.
- 4.9. Tích hợp xác thực, upload ảnh và thông báo.
- 4.10. Triển khai bằng Docker Compose.
- 4.11. Kiểm thử hệ thống.
- 4.12. Một số giao diện demo.

CHƯƠNG 5: ĐÁNH GIÁ VÀ KẾT LUẬN
- 5.1. Kết quả đạt được.
- 5.2. Ưu điểm của hệ thống.
- 5.3. Hạn chế còn tồn tại.
- 5.4. Khả năng ứng dụng thực tế.
- 5.5. Hướng phát triển.
- 5.6. Kết luận.

Yêu cầu khi viết tiếp:
- Viết bằng tiếng Việt có dấu, văn phong học thuật, phù hợp báo cáo tốt nghiệp.
- Không viết quá chung chung; mỗi phần kỹ thuật phải gắn với dự án Homi.
- Không tự bịa chức năng chưa có trong dự án.
- Nếu thiếu thông tin, ghi rõ [CẦN BỔ SUNG: ...].
- Không đưa secret, mật khẩu, token thật, Google Client Secret hoặc thông tin nhạy cảm vào báo cáo.
- Khi viết Chương 3, cần liên kết yêu cầu -> actor -> use case -> thiết kế kiến trúc/database/API/giao diện.
- Khi viết Chương 4, cần gắn với source thật:
  backend/src/main/java cho controller/service/repository/entity/security,
  frontend/app cho route/page/API route,
  frontend/components cho UI,
  frontend/services và hooks cho gọi API/logic client,
  database/mysql cho schema/seed/migration,
  docker-compose.yml cho triển khai local.
- Khi viết Chương 5, dùng số liệu kiểm thử hiện có và trình bày hạn chế theo văn phong đồ án, không viết như log lỗi.
- Khi viết use case, mỗi use case nên có: mục tiêu, actor, tiền điều kiện, luồng chính, luồng thay thế/ngoại lệ, hậu điều kiện.
- Khi viết bảng/hình, đánh số theo chương, ví dụ Bảng 3.1, Hình 4.2.
- Tiêu đề bảng đặt trên bảng; tiêu đề hình đặt dưới hình.

Thứ tự nên làm tiếp:
1. Đọc file Word báo cáo hiện tại và tóm tắt ngắn phần đã có.
2. Chỉ ra các lỗi lớn cần sửa: tên đề tài, mục lục, đánh số heading, phần còn trống.
3. Nếu tôi yêu cầu "viết tiếp", hãy bắt đầu từ phần còn thiếu gần nhất trong Chương 3, đặc biệt từ mục 3.7 trở đi.
4. Sau khi hoàn thiện Chương 3, viết Chương 4 đầy đủ theo source Homi.
5. Sau Chương 4, viết Chương 5 dựa trên kết quả kiểm thử, bug-list và hướng phát triển.
6. Sau mỗi chương, đưa checklist ngắn các hình/bảng/tài liệu cần chèn.

Yêu cầu đầu ra mặc định:
- Nếu tôi yêu cầu nội dung để dán vào Word, hãy trả về văn bản có tiêu đề mục rõ ràng, không cần bọc trong Markdown phức tạp.
- Nếu cần bảng, có thể dùng bảng Markdown để tôi chuyển sang bảng Word.
- Nếu cần sơ đồ, hãy mô tả sơ đồ hoặc viết Mermaid để tôi vẽ lại trong Word.
- Không dùng emoji, không dùng văn phong quảng cáo.

Hãy bắt đầu bằng việc xác nhận: báo cáo đang đúng hướng nhưng cần sửa tên đề tài, kiểm tra mục lục/đánh số, và viết tiếp từ Chương 3 phần còn thiếu. Sau đó thực hiện đúng phần tôi yêu cầu.
```

