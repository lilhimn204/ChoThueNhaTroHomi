SET NAMES utf8mb4;
USE rental_room_db;

-- Demo roles
INSERT INTO roles (id, name, description) VALUES
    (1, 'USER', 'Người dùng thông thường'),
    (2, 'ADMIN', 'Quản trị viên hệ thống')
ON DUPLICATE KEY UPDATE
    description = VALUES(description);

-- Demo users
-- Passwords:
-- admin.thuenhahomi@gmail.com -> admin123
-- an.nguyen@example.com -> 123456
-- binh.tran@example.com -> 123456
INSERT INTO users (
    id,
    full_name,
    email,
    password_hash,
    phone,
    avatar_url,
    address,
    host_bio,
    status,
    enabled,
    created_at,
    updated_at
) VALUES
    (
        1,
        'Admin Hệ Thống',
        'admin.thuenhahomi@gmail.com',
        '$2b$12$SeZgndXr8fLCE7w5qVpJb.BncibcCLniGtMVyPT5SeVPomi/n10pC',
        '0909000000',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        'Cầu Giấy, Hà Nội',
        'Quản lý các bài đăng phòng trọ mẫu của hệ thống Homi.',
        'ACTIVE',
        TRUE,
        '2026-04-01 08:00:00',
        '2026-04-01 08:00:00'
    ),
    (
        2,
        'Nguyễn Thị An',
        'an.nguyen@example.com',
        '$2b$12$Ot3.iK9gYFUlkXqX6UvzuO6iGk8gsMudLZToFNFyyPSLgFyPsY9W6',
        '0911222333',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        'Đống Đa, Hà Nội',
        'Có phòng trọ nhỏ gần các trường đại học, ưu tiên sinh viên thuê dài hạn.',
        'ACTIVE',
        TRUE,
        '2026-04-02 09:15:00',
        '2026-04-02 09:15:00'
    ),
    (
        3,
        'Trần Quốc Bình',
        'binh.tran@example.com',
        '$2b$12$Ot3.iK9gYFUlkXqX6UvzuO6iGk8gsMudLZToFNFyyPSLgFyPsY9W6',
        '0933444555',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        'Hai Bà Trưng, Hà Nội',
        'Người đăng tin cá nhân, phản hồi nhanh các yêu cầu xem phòng.',
        'ACTIVE',
        TRUE,
        '2026-04-03 10:20:00',
        '2026-04-03 10:20:00'
    )
ON DUPLICATE KEY UPDATE
    full_name = VALUES(full_name),
    email = VALUES(email),
    password_hash = VALUES(password_hash),
    phone = VALUES(phone),
    avatar_url = VALUES(avatar_url),
    address = VALUES(address),
    host_bio = VALUES(host_bio),
    status = VALUES(status),
    enabled = VALUES(enabled),
    updated_at = VALUES(updated_at);

INSERT INTO user_roles (user_id, role_id) VALUES
    (1, 2),
    (2, 1),
    (3, 1)
ON DUPLICATE KEY UPDATE
    role_id = VALUES(role_id);

-- Districts in Hà Nội
INSERT INTO districts (id, name, slug, city_name, display_order) VALUES
    (1, 'Cầu Giấy', 'cau-giay', 'Hà Nội', 1),
    (2, 'Đống Đa', 'dong-da', 'Hà Nội', 2),
    (3, 'Hai Bà Trưng', 'hai-ba-trung', 'Hà Nội', 3),
    (4, 'Thanh Xuân', 'thanh-xuan', 'Hà Nội', 4),
    (5, 'Nam Từ Liêm', 'nam-tu-liem', 'Hà Nội', 5),
    (6, 'Bắc Từ Liêm', 'bac-tu-liem', 'Hà Nội', 6),
    (7, 'Hà Đông', 'ha-dong', 'Hà Nội', 7),
    (8, 'Hoàng Mai', 'hoang-mai', 'Hà Nội', 8),
    (9, 'Long Biên', 'long-bien', 'Hà Nội', 9),
    (10, 'Ba Đình', 'ba-dinh', 'Hà Nội', 10),
    (11, 'Hoàn Kiếm', 'hoan-kiem', 'Hà Nội', 11),
    (12, 'Tây Hồ', 'tay-ho', 'Hà Nội', 12),
    (13, 'Gia Lâm', 'gia-lam', 'Hà Nội', 13),
    (14, 'Thanh Trì', 'thanh-tri', 'Hà Nội', 14),
    (15, 'Đông Anh', 'dong-anh', 'Hà Nội', 15),
    (16, 'Hoài Đức', 'hoai-duc', 'Hà Nội', 16),
    (17, 'Chương Mỹ', 'chuong-my', 'Hà Nội', 17),
    (18, 'Mê Linh', 'me-linh', 'Hà Nội', 18)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    slug = VALUES(slug),
    city_name = VALUES(city_name),
    display_order = VALUES(display_order);

-- Amenities
INSERT INTO amenities (id, name, slug, category, icon_key) VALUES
    (1, 'Wi-Fi tốc độ cao', 'wifi', 'SERVICE', 'wifi'),
    (2, 'Chỗ để xe', 'parking', 'BUILDING', 'parking-square'),
    (3, 'Máy lạnh', 'air-conditioner', 'ROOM', 'air-vent'),
    (4, 'WC riêng', 'private-toilet', 'ROOM', 'bath'),
    (5, 'Camera an ninh', 'security-camera', 'BUILDING', 'cctv'),
    (6, 'Bếp riêng', 'private-kitchen', 'ROOM', 'chef-hat'),
    (7, 'Gác lửng', 'loft', 'ROOM', 'layers-3'),
    (8, 'Máy giặt', 'washing-machine', 'SERVICE', 'washing-machine'),
    (9, 'Cửa sổ thông thoáng', 'window', 'ROOM', 'blinds'),
    (10, 'Cho nuôi thú cưng', 'pet-friendly', 'SERVICE', 'paw-print'),
    (11, 'Ban công', 'balcony', 'ROOM', 'building-2'),
    (12, 'Thang máy', 'elevator', 'BUILDING', 'arrow-up-down')
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    category = VALUES(category),
    icon_key = VALUES(icon_key);

-- Rooms
INSERT INTO rooms (
    id,
    title,
    slug,
    description,
    address,
    district_id,
    price,
    area,
    contact_name,
    contact_phone,
    status,
    thumbnail,
    is_featured,
    created_by,
    created_at,
    updated_at
) VALUES
    (
        1,
        'Studio gần Đại học Quốc gia Hà Nội, nội thất cơ bản',
        'studio-gan-dai-hoc-quoc-gia-ha-noi-noi-that-co-ban',
        'Phòng studio phù hợp sinh viên khu Đại học Quốc gia Hà Nội, không gian gọn gàng, có cửa sổ lớn, giữ xe trong nhà và khu vực an ninh.',
        '15 Xuân Thủy, Dịch Vọng Hậu',
        1,
        4300000,
        22.00,
        'Nguyễn Văn Hùng',
        '0909001001',
        'AVAILABLE',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
        TRUE,
        1,
        '2026-04-05 08:30:00',
        '2026-04-05 08:30:00'
    ),
    (
        2,
        'Phòng gác lửng gần Đại học Thương mại, giờ giấc tự do',
        'phong-gac-lung-gan-dai-hoc-thuong-mai-gio-giac-tu-do',
        'Phòng trọ có gác lửng, phù hợp 2 người ở, được nấu ăn, giữ xe miễn phí và thuận tiện đi Đại học Thương mại, Đại học Quốc gia.',
        '32 Hồ Tùng Mậu, Mai Dịch',
        5,
        3800000,
        24.00,
        'Lê Thị Mai',
        '0909001002',
        'AVAILABLE',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
        TRUE,
        1,
        '2026-04-06 09:00:00',
        '2026-04-06 09:00:00'
    ),
    (
        3,
        'Căn hộ mini gần Bách Khoa - Kinh tế Quốc dân',
        'can-ho-mini-gan-bach-khoa-kinh-te-quoc-dan',
        'Căn hộ mini sạch sẽ, có thang máy, máy giặt chung, phù hợp sinh viên Bách Khoa, Kinh tế Quốc dân và người đi làm cần không gian yên tĩnh.',
        '18 Tạ Quang Bửu, Bách Khoa',
        3,
        5200000,
        28.00,
        'Phạm Quốc Tuấn',
        '0909001003',
        'AVAILABLE',
        'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
        FALSE,
        1,
        '2026-04-07 10:10:00',
        '2026-04-07 10:10:00'
    ),
    (
        4,
        'Phòng trọ gần Học viện Ngân hàng và Đại học Thủy lợi',
        'phong-tro-gan-hoc-vien-ngan-hang-va-dai-hoc-thuy-loi',
        'Phòng trọ đẹp, dân cư ổn định, có ban công nhỏ, phù hợp sinh viên Học viện Ngân hàng, Đại học Thủy lợi và người đi làm khu Đống Đa.',
        '86 Chùa Bộc, Quang Trung',
        2,
        3900000,
        23.00,
        'Võ Minh Châu',
        '0909001004',
        'AVAILABLE',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
        TRUE,
        1,
        '2026-04-08 13:20:00',
        '2026-04-08 13:20:00'
    ),
    (
        5,
        'Phòng mini gần Đại học Hà Nội, giá hợp lý',
        'phong-mini-gan-dai-hoc-ha-noi-gia-hop-ly',
        'Phòng mini giá hợp lý cho sinh viên Đại học Hà Nội và người đi làm khu Thanh Xuân, có máy lạnh, WC riêng và giao thông thuận tiện.',
        '45 Nguyễn Trãi, Thanh Xuân Trung',
        4,
        3400000,
        18.00,
        'Trần Thị Hoa',
        '0909001005',
        'FULL',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
        FALSE,
        1,
        '2026-04-09 14:45:00',
        '2026-04-09 14:45:00'
    ),
    (
        6,
        'Studio ban công gần Mỹ Đình và Đại học FPT',
        'studio-ban-cong-gan-my-dinh-va-dai-hoc-fpt',
        'Phòng studio thiết kế hiện đại, có ban công và cửa sổ lớn, phù hợp người cần không gian sống thông thoáng gần Mỹ Đình, Nam Từ Liêm.',
        '27 Hàm Nghi, Mỹ Đình 2',
        5,
        5500000,
        30.00,
        'Nguyễn Văn Hùng',
        '0909001001',
        'AVAILABLE',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
        TRUE,
        1,
        '2026-04-10 16:00:00',
        '2026-04-10 16:00:00'
    )
ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    slug = VALUES(slug),
    description = VALUES(description),
    address = VALUES(address),
    district_id = VALUES(district_id),
    price = VALUES(price),
    area = VALUES(area),
    contact_name = VALUES(contact_name),
    contact_phone = VALUES(contact_phone),
    status = VALUES(status),
    thumbnail = VALUES(thumbnail),
    is_featured = VALUES(is_featured),
    created_by = VALUES(created_by),
    updated_at = VALUES(updated_at);

-- Room images
INSERT INTO room_images (id, room_id, image_url, alt_text, sort_order, is_thumbnail) VALUES
    (1, 1, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80', 'Studio gần Đại học Quốc gia Hà Nội - ảnh 1', 1, TRUE),
    (2, 1, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80', 'Studio gần Đại học Quốc gia Hà Nội - ảnh 2', 2, FALSE),
    (3, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80', 'Phòng gác lửng gần Đại học Thương mại - ảnh 1', 1, TRUE),
    (4, 2, 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80', 'Phòng gác lửng gần Đại học Thương mại - ảnh 2', 2, FALSE),
    (5, 3, 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80', 'Căn hộ mini gần Bách Khoa - ảnh 1', 1, TRUE),
    (6, 3, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80', 'Căn hộ mini gần Bách Khoa - ảnh 2', 2, FALSE),
    (7, 4, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80', 'Phòng trọ gần Học viện Ngân hàng - ảnh 1', 1, TRUE),
    (8, 4, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80', 'Phòng trọ gần Học viện Ngân hàng - ảnh 2', 2, FALSE),
    (9, 5, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80', 'Phòng mini gần Đại học Hà Nội - ảnh 1', 1, TRUE),
    (10, 5, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80', 'Phòng mini gần Đại học Hà Nội - ảnh 2', 2, FALSE),
    (11, 6, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80', 'Studio Mỹ Đình - ảnh 1', 1, TRUE),
    (12, 6, 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80', 'Studio Mỹ Đình - ảnh 2', 2, FALSE)
ON DUPLICATE KEY UPDATE
    image_url = VALUES(image_url),
    alt_text = VALUES(alt_text),
    sort_order = VALUES(sort_order),
    is_thumbnail = VALUES(is_thumbnail);

-- Room amenity mappings
INSERT INTO room_amenities (room_id, amenity_id) VALUES
    (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 9),
    (2, 1), (2, 2), (2, 3), (2, 4), (2, 6), (2, 7),
    (3, 1), (3, 2), (3, 3), (3, 4), (3, 8), (3, 12),
    (4, 1), (4, 2), (4, 4), (4, 5), (4, 11),
    (5, 1), (5, 3), (5, 4), (5, 9),
    (6, 1), (6, 2), (6, 3), (6, 4), (6, 9), (6, 11)
ON DUPLICATE KEY UPDATE
    amenity_id = VALUES(amenity_id);

-- Contact requests
INSERT INTO contact_requests (
    id,
    room_id,
    user_id,
    request_type,
    full_name,
    email,
    phone,
    message,
    preferred_viewing_time,
    status,
    admin_note,
    handled_by,
    handled_at,
    created_at,
    updated_at
) VALUES
    (
        1,
        1,
        2,
        'VIEWING',
        'Nguyễn Thị An',
        'an.nguyen@example.com',
        '0911222333',
        'Em muốn xem phòng gần Đại học Quốc gia vào cuối tuần này nếu còn trống.',
        'Thứ 7 sau 14:00',
        'PENDING',
        NULL,
        NULL,
        NULL,
        '2026-04-12 09:00:00',
        '2026-04-12 09:00:00'
    ),
    (
        2,
        3,
        3,
        'CONTACT',
        'Trần Quốc Bình',
        'binh.tran@example.com',
        '0933444555',
        'Tôi cần thêm thông tin về phí dịch vụ và hợp đồng thuê khu Bách Khoa.',
        'Buổi tối sau 19:00',
        'IN_PROGRESS',
        'Đã gọi lại và hẹn gửi thêm thông tin hợp đồng.',
        1,
        '2026-04-13 10:30:00',
        '2026-04-13 08:15:00',
        '2026-04-13 10:30:00'
    ),
    (
        3,
        4,
        2,
        'VIEWING',
        'Nguyễn Thị An',
        'an.nguyen@example.com',
        '0911222333',
        'Cho em đặt lịch xem phòng sau giờ học ở khu Chùa Bộc.',
        'Thứ 2 lúc 18:30',
        'RESOLVED',
        'Đã xem phòng và khách đang cân nhắc.',
        1,
        '2026-04-15 18:45:00',
        '2026-04-14 11:20:00',
        '2026-04-15 18:45:00'
    ),
    (
        4,
        6,
        3,
        'CONTACT',
        'Trần Quốc Bình',
        'binh.tran@example.com',
        '0933444555',
        'Tôi quan tâm studio gần Mỹ Đình có ban công, vui lòng liên hệ sau giờ làm.',
        'Ngày thường sau 18:30',
        'PENDING',
        NULL,
        NULL,
        NULL,
        '2026-04-16 07:50:00',
        '2026-04-16 07:50:00'
    )
ON DUPLICATE KEY UPDATE
    status = VALUES(status),
    admin_note = VALUES(admin_note),
    handled_by = VALUES(handled_by),
    handled_at = VALUES(handled_at),
    updated_at = VALUES(updated_at);

-- Room reports
INSERT INTO room_reports (
    id,
    room_id,
    reporter_id,
    reason,
    details,
    status,
    admin_note,
    handled_by,
    handled_at,
    created_at,
    updated_at
) VALUES
    (
        1,
        5,
        2,
        'UNAVAILABLE',
        'Người đăng tin báo phòng đã hết nhưng bài đăng vẫn hiển thị còn phòng trên website.',
        'NEW',
        NULL,
        NULL,
        NULL,
        '2026-04-18 09:30:00',
        '2026-04-18 09:30:00'
    ),
    (
        2,
        2,
        3,
        'WRONG_INFO',
        'Giá phòng thực tế cao hơn giá đăng trên bài viết, cần admin xác minh lại.',
        'REVIEWING',
        'Đã ghi nhận, cần liên hệ chủ trọ để đối chiếu thông tin giá.',
        1,
        '2026-04-18 14:10:00',
        '2026-04-18 13:40:00',
        '2026-04-18 14:10:00'
    )
ON DUPLICATE KEY UPDATE
    reason = VALUES(reason),
    details = VALUES(details),
    status = VALUES(status),
    admin_note = VALUES(admin_note),
    handled_by = VALUES(handled_by),
    handled_at = VALUES(handled_at),
    updated_at = VALUES(updated_at);

-- Saved rooms
INSERT INTO saved_rooms (id, user_id, room_id, created_at) VALUES
    (1, 2, 1, '2026-04-17 09:00:00'),
    (2, 2, 4, '2026-04-17 09:05:00'),
    (3, 3, 3, '2026-04-17 10:15:00'),
    (4, 3, 6, '2026-04-17 10:20:00')
ON DUPLICATE KEY UPDATE
    created_at = VALUES(created_at);

-- In-app notifications
INSERT INTO notifications (
    id,
    recipient_id,
    type,
    title,
    message,
    target_url,
    is_read,
    created_at
) VALUES
    (
        1,
        1,
        'NEW_CONTACT_REQUEST',
        'Yêu cầu liên hệ mới',
        'Nguyễn Thị An đã gửi yêu cầu xem phòng Studio gần Đại học Quốc gia Hà Nội.',
        '/admin/contact-requests',
        FALSE,
        '2026-04-12 09:00:00'
    ),
    (
        2,
        1,
        'NEW_CONTACT_REQUEST',
        'Yêu cầu liên hệ mới',
        'Trần Quốc Bình cần thêm thông tin về phí dịch vụ và hợp đồng thuê khu Bách Khoa.',
        '/admin/contact-requests',
        TRUE,
        '2026-04-13 08:15:00'
    ),
    (
        3,
        1,
        'NEW_CONTACT_REQUEST',
        'Yêu cầu liên hệ mới',
        'Trần Quốc Bình quan tâm studio gần Mỹ Đình có ban công.',
        '/admin/contact-requests',
        FALSE,
        '2026-04-16 07:50:00'
    )
ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    message = VALUES(message),
    target_url = VALUES(target_url),
    is_read = VALUES(is_read),
    created_at = VALUES(created_at);
