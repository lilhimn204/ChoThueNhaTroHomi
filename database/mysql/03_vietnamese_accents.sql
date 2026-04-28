SET NAMES utf8mb4;
USE rental_room_db;

UPDATE roles SET description = 'Người dùng thông thường' WHERE id = 1;
UPDATE roles SET description = 'Quản trị viên hệ thống' WHERE id = 2;

UPDATE users SET full_name = 'Admin Hệ Thống' WHERE id = 1;
UPDATE users SET full_name = 'Nguyễn Thị An' WHERE id = 2;
UPDATE users SET full_name = 'Trần Quốc Bình' WHERE id = 3;

UPDATE districts SET name = 'Cầu Giấy', city_name = 'Hà Nội' WHERE id = 1;
UPDATE districts SET name = 'Đống Đa', city_name = 'Hà Nội' WHERE id = 2;
UPDATE districts SET name = 'Hai Bà Trưng', city_name = 'Hà Nội' WHERE id = 3;
UPDATE districts SET name = 'Thanh Xuân', city_name = 'Hà Nội' WHERE id = 4;
UPDATE districts SET name = 'Nam Từ Liêm', city_name = 'Hà Nội' WHERE id = 5;
UPDATE districts SET name = 'Bắc Từ Liêm', city_name = 'Hà Nội' WHERE slug = 'bac-tu-liem';
UPDATE districts SET name = 'Hà Đông', city_name = 'Hà Nội' WHERE slug = 'ha-dong';
UPDATE districts SET name = 'Hoàng Mai', city_name = 'Hà Nội' WHERE slug = 'hoang-mai';
UPDATE districts SET name = 'Long Biên', city_name = 'Hà Nội' WHERE slug = 'long-bien';
UPDATE districts SET name = 'Ba Đình', city_name = 'Hà Nội' WHERE slug = 'ba-dinh';
UPDATE districts SET name = 'Hoàn Kiếm', city_name = 'Hà Nội' WHERE slug = 'hoan-kiem';
UPDATE districts SET name = 'Tây Hồ', city_name = 'Hà Nội' WHERE slug = 'tay-ho';
UPDATE districts SET name = 'Gia Lâm', city_name = 'Hà Nội' WHERE slug = 'gia-lam';
UPDATE districts SET name = 'Thanh Trì', city_name = 'Hà Nội' WHERE slug = 'thanh-tri';
UPDATE districts SET name = 'Đông Anh', city_name = 'Hà Nội' WHERE slug = 'dong-anh';
UPDATE districts SET name = 'Hoài Đức', city_name = 'Hà Nội' WHERE slug = 'hoai-duc';
UPDATE districts SET name = 'Chương Mỹ', city_name = 'Hà Nội' WHERE slug = 'chuong-my';
UPDATE districts SET name = 'Mê Linh', city_name = 'Hà Nội' WHERE slug = 'me-linh';

UPDATE amenities SET name = 'Wi-Fi tốc độ cao' WHERE id = 1;
UPDATE amenities SET name = 'Chỗ để xe' WHERE id = 2;
UPDATE amenities SET name = 'Máy lạnh' WHERE id = 3;
UPDATE amenities SET name = 'WC riêng' WHERE id = 4;
UPDATE amenities SET name = 'Camera an ninh' WHERE id = 5;
UPDATE amenities SET name = 'Bếp riêng' WHERE id = 6;
UPDATE amenities SET name = 'Gác lửng' WHERE id = 7;
UPDATE amenities SET name = 'Máy giặt' WHERE id = 8;
UPDATE amenities SET name = 'Cửa sổ thông thoáng' WHERE id = 9;
UPDATE amenities SET name = 'Cho nuôi thú cưng' WHERE id = 10;
UPDATE amenities SET name = 'Ban công' WHERE id = 11;
UPDATE amenities SET name = 'Thang máy' WHERE id = 12;

UPDATE rooms
SET title = 'Studio gần Đại học Quốc gia Hà Nội, nội thất cơ bản',
    description = 'Phòng studio phù hợp sinh viên khu Đại học Quốc gia Hà Nội, không gian gọn gàng, có cửa sổ lớn, giữ xe trong nhà và khu vực an ninh.',
    address = '15 Xuân Thủy, Dịch Vọng Hậu',
    contact_name = 'Nguyễn Văn Hùng'
WHERE id = 1;

UPDATE rooms
SET title = 'Phòng gác lửng gần Đại học Thương mại, giờ giấc tự do',
    description = 'Phòng trọ có gác lửng, phù hợp 2 người ở, được nấu ăn, giữ xe miễn phí và thuận tiện đi Đại học Thương mại, Đại học Quốc gia.',
    address = '32 Hồ Tùng Mậu, Mai Dịch',
    contact_name = 'Lê Thị Mai'
WHERE id = 2;

UPDATE rooms
SET title = 'Căn hộ mini gần Bách Khoa - Kinh tế Quốc dân',
    description = 'Căn hộ mini sạch sẽ, có thang máy, máy giặt chung, phù hợp sinh viên Bách Khoa, Kinh tế Quốc dân và người đi làm cần không gian yên tĩnh.',
    address = '18 Tạ Quang Bửu, Bách Khoa',
    contact_name = 'Phạm Quốc Tuấn'
WHERE id = 3;

UPDATE rooms
SET title = 'Phòng trọ gần Học viện Ngân hàng và Đại học Thủy lợi',
    description = 'Phòng trọ đẹp, dân cư ổn định, có ban công nhỏ, phù hợp sinh viên Học viện Ngân hàng, Đại học Thủy lợi và người đi làm khu Đống Đa.',
    address = '86 Chùa Bộc, Quang Trung',
    contact_name = 'Võ Minh Châu'
WHERE id = 4;

UPDATE rooms
SET title = 'Phòng mini gần Đại học Hà Nội, giá hợp lý',
    description = 'Phòng mini giá hợp lý cho sinh viên Đại học Hà Nội và người đi làm khu Thanh Xuân, có máy lạnh, WC riêng và giao thông thuận tiện.',
    address = '45 Nguyễn Trãi, Thanh Xuân Trung',
    contact_name = 'Trần Thị Hoa'
WHERE id = 5;

UPDATE rooms
SET title = 'Studio ban công gần Mỹ Đình và Đại học FPT',
    description = 'Phòng studio thiết kế hiện đại, có ban công và cửa sổ lớn, phù hợp người cần không gian sống thông thoáng gần Mỹ Đình, Nam Từ Liêm.',
    address = '27 Hàm Nghi, Mỹ Đình 2',
    contact_name = 'Nguyễn Văn Hùng'
WHERE id = 6;

UPDATE room_images SET alt_text = 'Studio gần Đại học Quốc gia Hà Nội - ảnh 1' WHERE id = 1;
UPDATE room_images SET alt_text = 'Studio gần Đại học Quốc gia Hà Nội - ảnh 2' WHERE id = 2;
UPDATE room_images SET alt_text = 'Phòng gác lửng gần Đại học Thương mại - ảnh 1' WHERE id = 3;
UPDATE room_images SET alt_text = 'Phòng gác lửng gần Đại học Thương mại - ảnh 2' WHERE id = 4;
UPDATE room_images SET alt_text = 'Căn hộ mini gần Bách Khoa - ảnh 1' WHERE id = 5;
UPDATE room_images SET alt_text = 'Căn hộ mini gần Bách Khoa - ảnh 2' WHERE id = 6;
UPDATE room_images SET alt_text = 'Phòng trọ gần Học viện Ngân hàng - ảnh 1' WHERE id = 7;
UPDATE room_images SET alt_text = 'Phòng trọ gần Học viện Ngân hàng - ảnh 2' WHERE id = 8;
UPDATE room_images SET alt_text = 'Phòng mini gần Đại học Hà Nội - ảnh 1' WHERE id = 9;
UPDATE room_images SET alt_text = 'Phòng mini gần Đại học Hà Nội - ảnh 2' WHERE id = 10;
UPDATE room_images SET alt_text = 'Studio Mỹ Đình - ảnh 1' WHERE id = 11;
UPDATE room_images SET alt_text = 'Studio Mỹ Đình - ảnh 2' WHERE id = 12;

UPDATE contact_requests
SET full_name = 'Nguyễn Thị An',
    message = 'Em muốn xem phòng gần Đại học Quốc gia vào cuối tuần này nếu còn trống.',
    preferred_viewing_time = 'Thứ 7 sau 14:00'
WHERE id = 1;

UPDATE contact_requests
SET full_name = 'Trần Quốc Bình',
    message = 'Tôi cần thêm thông tin về phí dịch vụ và hợp đồng thuê khu Bách Khoa.',
    preferred_viewing_time = 'Buổi tối sau 19:00',
    admin_note = 'Đã gọi lại và hẹn gửi thêm thông tin hợp đồng.'
WHERE id = 2;

UPDATE contact_requests
SET full_name = 'Nguyễn Thị An',
    message = 'Cho em đặt lịch xem phòng sau giờ học ở khu Chùa Bộc.',
    preferred_viewing_time = 'Thứ 2 lúc 18:30',
    admin_note = 'Đã xem phòng và khách đang cân nhắc.'
WHERE id = 3;

UPDATE contact_requests
SET full_name = 'Trần Quốc Bình',
    message = 'Tôi quan tâm studio gần Mỹ Đình có ban công, vui lòng liên hệ sau giờ làm.',
    preferred_viewing_time = 'Ngày thường sau 18:30'
WHERE id = 4;
