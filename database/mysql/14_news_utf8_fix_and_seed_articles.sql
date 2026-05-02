SET NAMES utf8mb4;
USE rental_room_db;

-- Repair category names that were seeded with mojibake in older local volumes.
UPDATE news_categories
SET
    name = 'Hướng dẫn thuê phòng',
    description = 'Bài viết hướng dẫn quy trình tìm và thuê phòng an toàn.',
    display_order = 10,
    enabled = TRUE
WHERE slug = 'huong-dan-thue-phong';

UPDATE news_categories
SET
    name = 'Kinh nghiệm',
    description = 'Kinh nghiệm thực tế cho người thuê phòng tại Hà Nội.',
    display_order = 20,
    enabled = TRUE
WHERE slug = 'kinh-nghiem';

UPDATE news_categories
SET
    name = 'Thị trường',
    description = 'Cập nhật xu hướng giá thuê và khu vực nổi bật.',
    display_order = 30,
    enabled = TRUE
WHERE slug = 'thi-truong';

UPDATE news_categories
SET
    name = 'Thông báo Homi',
    description = 'Thông báo sản phẩm và chính sách từ Homi.',
    display_order = 40,
    enabled = TRUE
WHERE slug = 'thong-bao-homi';

INSERT INTO news_categories (name, slug, description, display_order, enabled)
VALUES
    ('Tin dự án', 'tin-du-an', 'Tin cập nhật về nguồn cung phòng, căn hộ dịch vụ và dự án cho thuê.', 25, TRUE)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    description = VALUES(description),
    display_order = VALUES(display_order),
    enabled = VALUES(enabled);

UPDATE news_articles
SET category = 'Hướng dẫn thuê phòng'
WHERE category = 'HÆ°á»›ng dáº«n thuÃª phÃ²ng';

UPDATE news_articles
SET category = 'Kinh nghiệm'
WHERE category = 'Kinh nghiá»‡m';

UPDATE news_articles
SET category = 'Thị trường'
WHERE category = 'Thá»‹ trÆ°á»ng';

UPDATE news_articles
SET category = 'Thông báo Homi'
WHERE category = 'ThÃ´ng bÃ¡o Homi';

INSERT INTO news_articles (
    title,
    slug,
    summary,
    content,
    thumbnail_url,
    is_featured,
    category,
    status,
    published_at,
    author_name,
    last_edited_at
)
VALUES
    (
        'Homi Khởi Động Chuyên Mục Cập Nhật Nguồn Cung Phòng Thuê Hà Nội',
        'homi-khoi-dong-chuyen-muc-cap-nhat-nguon-cung-phong-thue-ha-noi',
        'Chuyên mục tin tức mới của Homi tập trung vào nguồn cung phòng thuê, căn hộ dịch vụ và các khu vực có nhu cầu tìm phòng cao tại Hà Nội.',
        '# Homi Khởi Động Chuyên Mục Cập Nhật Nguồn Cung Phòng Thuê Hà Nội

Homi chính thức bổ sung nhóm bài viết cập nhật thị trường nhằm giúp người thuê phòng theo dõi nguồn cung mới, biến động giá và các khu vực đang được quan tâm.

## Tập Trung Vào Nhu Cầu Thuê Thực Tế

Các nội dung được xây dựng theo hướng ngắn gọn, dễ đọc và ưu tiên thông tin có ích trong quá trình tìm phòng. Người dùng có thể tham khảo nhanh các khu vực nổi bật, loại hình phòng đang phổ biến và những lưu ý trước khi đặt lịch xem phòng.

## Hỗ Trợ Người Thuê Ra Quyết Định Nhanh Hơn

Thay vì chỉ xem từng tin đăng riêng lẻ, người thuê có thêm góc nhìn tổng quan về khu vực, mức giá và tiện ích xung quanh. Đây là cơ sở để so sánh phòng phù hợp hơn với ngân sách, thời gian di chuyển và nhu cầu sinh hoạt.

## Tiếp Tục Hoàn Thiện Dữ Liệu

Homi sẽ ưu tiên cập nhật các nhóm thông tin liên quan đến phòng trọ, căn hộ mini, căn hộ dịch vụ và nhà riêng cho thuê. Mỗi bài viết đều hướng đến mục tiêu giúp quá trình tìm phòng minh bạch, nhanh và an toàn hơn.',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        TRUE,
        'Thông báo Homi',
        'PUBLISHED',
        '2026-05-01 08:00:00',
        'Homi Editorial',
        '2026-05-01 08:00:00'
    ),
    (
        'Cụm Căn Hộ Dịch Vụ Minh Khai Hoàn Thiện Giai Đoạn 1, Tăng Lựa Chọn Cho Người Đi Làm',
        'cum-can-ho-dich-vu-minh-khai-hoan-thien-giai-doan-1-tang-lua-chon-cho-nguoi-di-lam',
        'Nguồn cung căn hộ dịch vụ quanh Minh Khai tiếp tục được chú ý nhờ vị trí kết nối Hai Bà Trưng, Times City và các trục văn phòng lân cận.',
        '# Cụm Căn Hộ Dịch Vụ Minh Khai Hoàn Thiện Giai Đoạn 1

Khu vực Minh Khai ghi nhận thêm nhóm căn hộ dịch vụ được hoàn thiện theo hướng tối ưu diện tích, phù hợp người đi làm cần không gian riêng và thời gian di chuyển ngắn.

## Vị Trí Kết Nối Nhiều Cụm Tiện Ích

Từ Minh Khai, người thuê có thể tiếp cận nhanh các trục Bạch Mai, Đại La, Times City và khu trung tâm Hai Bà Trưng. Đây là lợi thế đáng chú ý với nhóm người đi làm cần cân bằng giữa chi phí thuê và thời gian di chuyển.

## Thiết Kế Ưu Tiên Sự Gọn Gàng

Các căn hộ dịch vụ trong nhóm nguồn cung này thường ưu tiên WC riêng, khu bếp nhỏ, chỗ để xe và hệ thống khóa an toàn. Với người thuê sống một mình hoặc theo cặp, mô hình này giúp hạn chế phát sinh thêm chi phí nội thất ban đầu.

## Lưu Ý Khi Xem Phòng

- Kiểm tra kỹ điện nước, phí dịch vụ và gửi xe.
- Hỏi rõ quy định giờ giấc, khách đến chơi và nuôi thú cưng.
- Đối chiếu ảnh đăng tin với tình trạng thực tế trước khi đặt cọc.

Người thuê nên đặt lịch xem trực tiếp và lưu lại các điều khoản quan trọng trước khi ký hợp đồng.',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
        TRUE,
        'Tin dự án',
        'PUBLISHED',
        '2026-04-30 09:00:00',
        'Homi Editorial',
        '2026-04-30 09:00:00'
    ),
    (
        'Cầu Giấy Tiếp Tục Là Khu Vực Được Tìm Kiếm Nhiều Trong Nhóm Phòng Trọ Gần Trường',
        'cau-giay-tiep-tuc-la-khu-vuc-duoc-tim-kiem-nhieu-trong-nhom-phong-tro-gan-truong',
        'Nhu cầu thuê phòng tại Cầu Giấy duy trì ổn định nhờ mật độ trường đại học, văn phòng và tiện ích sinh hoạt cao.',
        '# Cầu Giấy Tiếp Tục Là Khu Vực Được Tìm Kiếm Nhiều

Cầu Giấy vẫn là một trong những khu vực có lượng tìm kiếm phòng trọ cao trên Homi, đặc biệt ở nhóm sinh viên và người mới đi làm.

## Lợi Thế Từ Hệ Sinh Thái Tiện Ích

Khu vực này tập trung nhiều trường đại học, tòa nhà văn phòng, tuyến xe buýt và dịch vụ ăn uống. Nhờ đó, người thuê dễ tìm được phòng phù hợp với nhiều mức ngân sách khác nhau.

## Mức Giá Cần So Sánh Theo Từng Tuyến Phố

Các phòng gần trục Xuân Thủy, Cầu Giấy, Trần Thái Tông thường có lợi thế di chuyển nhưng giá có thể cao hơn khu trong ngõ. Người thuê nên so sánh thêm diện tích, phí dịch vụ và tình trạng nội thất thay vì chỉ nhìn giá niêm yết.

## Gợi Ý Khi Lọc Phòng

- Ưu tiên bộ lọc theo khoảng giá trước.
- Chọn tiện ích thật sự cần như WC riêng, điều hòa, chỗ để xe.
- Lưu phòng phù hợp để so sánh lại sau khi xem trực tiếp.

Cách tiếp cận này giúp giảm thời gian lọc tin và tránh bỏ sót phòng phù hợp.',
        'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
        FALSE,
        'Thị trường',
        'PUBLISHED',
        '2026-04-29 10:30:00',
        'Homi Editorial',
        '2026-04-29 10:30:00'
    ),
    (
        'Những Điểm Cần Kiểm Tra Trước Khi Đặt Cọc Phòng Thuê Trong Tháng 5',
        'nhung-diem-can-kiem-tra-truoc-khi-dat-coc-phong-thue-trong-thang-5',
        'Trước khi đặt cọc, người thuê nên rà soát tình trạng phòng, chi phí phát sinh và điều khoản hoàn cọc để hạn chế rủi ro.',
        '# Những Điểm Cần Kiểm Tra Trước Khi Đặt Cọc Phòng Thuê Trong Tháng 5

Thời điểm đầu hè thường ghi nhận nhu cầu tìm phòng tăng lên, đặc biệt với sinh viên chuẩn bị chuyển chỗ ở và người đi làm thay đổi nơi làm việc. Vì vậy, người thuê cần kiểm tra kỹ trước khi chốt phòng.

## Kiểm Tra Tình Trạng Phòng

Người thuê nên quan sát tường, trần, nhà vệ sinh, cửa khóa, ổ điện và khả năng thoát nước. Các lỗi nhỏ nên được ghi lại bằng ảnh hoặc tin nhắn để tránh tranh cãi sau khi nhận phòng.

## Hỏi Rõ Toàn Bộ Chi Phí

Ngoài tiền thuê chính, cần hỏi thêm tiền điện, nước, wifi, vệ sinh, gửi xe, phí thang máy và chi phí phát sinh nếu có khách ở lại. Tổng chi phí hàng tháng mới là con số phản ánh đúng khả năng chi trả.

## Đọc Kỹ Điều Khoản Đặt Cọc

Hợp đồng nên ghi rõ số tiền cọc, thời hạn báo trước khi trả phòng, điều kiện hoàn cọc và trách nhiệm sửa chữa. Nếu chủ nhà yêu cầu cọc trước khi xem phòng, người thuê cần thận trọng.

Một quy trình kiểm tra rõ ràng giúp người thuê giảm rủi ro và giữ thế chủ động khi thương lượng.',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80',
        FALSE,
        'Kinh nghiệm',
        'PUBLISHED',
        '2026-04-28 14:00:00',
        'Homi Editorial',
        '2026-04-28 14:00:00'
    )
ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    summary = VALUES(summary),
    content = VALUES(content),
    thumbnail_url = VALUES(thumbnail_url),
    is_featured = VALUES(is_featured),
    category = VALUES(category),
    status = VALUES(status),
    published_at = VALUES(published_at),
    author_name = VALUES(author_name),
    last_edited_at = VALUES(last_edited_at);
