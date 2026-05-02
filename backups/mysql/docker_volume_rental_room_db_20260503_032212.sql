-- MySQL dump 10.13  Distrib 8.4.9, for Linux (x86_64)
--
-- Host: localhost    Database: rental_room_db
-- ------------------------------------------------------
-- Server version	8.4.9

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `rental_room_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `rental_room_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `rental_room_db`;

--
-- Table structure for table `amenities`
--

DROP TABLE IF EXISTS `amenities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `amenities` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `category` enum('ROOM','BUILDING','SERVICE') NOT NULL DEFAULT 'ROOM',
  `icon_key` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `amenities`
--

LOCK TABLES `amenities` WRITE;
/*!40000 ALTER TABLE `amenities` DISABLE KEYS */;
INSERT INTO `amenities` VALUES (1,'Wi-Fi tốc độ cao','wifi','SERVICE','wifi','2026-04-28 11:31:37','2026-04-28 11:31:37'),(2,'Chỗ để xe','parking','BUILDING','parking-square','2026-04-28 11:31:37','2026-04-28 11:31:37'),(3,'Máy lạnh','air-conditioner','ROOM','air-vent','2026-04-28 11:31:37','2026-04-28 11:31:37'),(4,'WC riêng','private-toilet','ROOM','bath','2026-04-28 11:31:37','2026-04-28 11:31:37'),(5,'Camera an ninh','security-camera','BUILDING','cctv','2026-04-28 11:31:37','2026-04-28 11:31:37'),(6,'Bếp riêng','private-kitchen','ROOM','chef-hat','2026-04-28 11:31:37','2026-04-28 11:31:37'),(7,'Gác lửng','loft','ROOM','layers-3','2026-04-28 11:31:37','2026-04-28 11:31:37'),(8,'Máy giặt','washing-machine','SERVICE','washing-machine','2026-04-28 11:31:37','2026-04-28 11:31:37'),(9,'Cửa sổ thông thoáng','window','ROOM','blinds','2026-04-28 11:31:37','2026-04-28 11:31:37'),(10,'Cho nuôi thú cưng','pet-friendly','SERVICE','paw-print','2026-04-28 11:31:37','2026-04-28 11:31:37'),(11,'Ban công','balcony','ROOM','building-2','2026-04-28 11:31:37','2026-04-28 11:31:37'),(12,'Thang máy','elevator','BUILDING','arrow-up-down','2026-04-28 11:31:37','2026-04-28 11:31:37');
/*!40000 ALTER TABLE `amenities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_requests`
--

DROP TABLE IF EXISTS `contact_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_requests` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `room_id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `request_type` enum('CONTACT','VIEWING') NOT NULL DEFAULT 'VIEWING',
  `full_name` varchar(120) NOT NULL,
  `email` varchar(120) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `message` varchar(1000) DEFAULT NULL,
  `preferred_viewing_time` varchar(120) DEFAULT NULL,
  `status` enum('PENDING','IN_PROGRESS','RESOLVED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `admin_note` varchar(500) DEFAULT NULL,
  `handled_by` bigint DEFAULT NULL,
  `handled_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_contact_requests_handler` (`handled_by`),
  KEY `idx_contact_requests_user_status` (`user_id`,`status`),
  KEY `idx_contact_requests_room_created` (`room_id`,`created_at`),
  KEY `idx_contact_requests_room_status_created` (`room_id`,`status`,`created_at`),
  KEY `idx_contact_requests_status` (`status`),
  CONSTRAINT `fk_contact_requests_handler` FOREIGN KEY (`handled_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_contact_requests_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
  CONSTRAINT `fk_contact_requests_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_requests`
--

LOCK TABLES `contact_requests` WRITE;
/*!40000 ALTER TABLE `contact_requests` DISABLE KEYS */;
INSERT INTO `contact_requests` VALUES (1,1,2,'VIEWING','Nguyễn Thị An','an.nguyen@example.com','0911222333','Em muốn xem phòng gần Đại học Quốc gia vào cuối tuần này nếu còn trống.','Thứ 7 sau 14:00','PENDING',NULL,NULL,NULL,'2026-04-12 09:00:00','2026-04-12 09:00:00'),(2,3,3,'CONTACT','Trần Quốc Bình','binh.tran@example.com','0933444555','Tôi cần thêm thông tin về phí dịch vụ và hợp đồng thuê khu Bách Khoa.','Buổi tối sau 19:00','IN_PROGRESS','Đã gọi lại và hẹn gửi thêm thông tin hợp đồng.',1,'2026-04-13 10:30:00','2026-04-13 08:15:00','2026-04-13 10:30:00'),(3,4,2,'VIEWING','Nguyễn Thị An','an.nguyen@example.com','0911222333','Cho em đặt lịch xem phòng sau giờ học ở khu Chùa Bộc.','Thứ 2 lúc 18:30','RESOLVED','Đã xem phòng và khách đang cân nhắc.',1,'2026-04-15 18:45:00','2026-04-14 11:20:00','2026-04-15 18:45:00'),(4,6,3,'CONTACT','Trần Quốc Bình','binh.tran@example.com','0933444555','Tôi quan tâm studio gần Mỹ Đình có ban công, vui lòng liên hệ sau giờ làm.','Ngày thường sau 18:30','PENDING',NULL,NULL,NULL,'2026-04-16 07:50:00','2026-04-16 07:50:00');
/*!40000 ALTER TABLE `contact_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `districts`
--

DROP TABLE IF EXISTS `districts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `districts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `city_name` varchar(100) NOT NULL,
  `display_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `districts`
--

LOCK TABLES `districts` WRITE;
/*!40000 ALTER TABLE `districts` DISABLE KEYS */;
INSERT INTO `districts` VALUES (1,'Cầu Giấy','cau-giay','Hà Nội',1,'2026-04-28 11:31:37','2026-04-28 11:31:37'),(2,'Đống Đa','dong-da','Hà Nội',2,'2026-04-28 11:31:37','2026-04-28 11:31:37'),(3,'Hai Bà Trưng','hai-ba-trung','Hà Nội',3,'2026-04-28 11:31:37','2026-04-28 11:31:37'),(4,'Thanh Xuân','thanh-xuan','Hà Nội',4,'2026-04-28 11:31:37','2026-04-28 11:31:37'),(5,'Nam Từ Liêm','nam-tu-liem','Hà Nội',5,'2026-04-28 11:31:37','2026-04-28 11:31:37'),(6,'Bắc Từ Liêm','bac-tu-liem','Hà Nội',6,'2026-04-28 19:29:08','2026-04-28 19:29:08'),(7,'Hà Đông','ha-dong','Hà Nội',7,'2026-04-28 19:29:08','2026-04-28 19:29:08'),(8,'Hoàng Mai','hoang-mai','Hà Nội',8,'2026-04-28 19:29:08','2026-04-28 19:29:08'),(9,'Long Biên','long-bien','Hà Nội',9,'2026-04-28 19:29:08','2026-04-28 19:29:08'),(10,'Ba Đình','ba-dinh','Hà Nội',10,'2026-04-28 19:29:08','2026-04-28 19:29:08'),(11,'Hoàn Kiếm','hoan-kiem','Hà Nội',11,'2026-04-28 19:29:08','2026-04-28 19:29:08'),(12,'Tây Hồ','tay-ho','Hà Nội',12,'2026-04-28 19:29:08','2026-04-28 19:29:08'),(13,'Gia Lâm','gia-lam','Hà Nội',13,'2026-04-28 19:29:08','2026-04-28 19:29:08'),(14,'Thanh Trì','thanh-tri','Hà Nội',14,'2026-04-28 19:29:08','2026-04-28 19:29:08'),(15,'Đông Anh','dong-anh','Hà Nội',15,'2026-04-28 19:29:08','2026-04-28 19:29:08'),(16,'Hoài Đức','hoai-duc','Hà Nội',16,'2026-04-28 19:29:08','2026-04-28 19:29:08'),(17,'Chương Mỹ','chuong-my','Hà Nội',17,'2026-04-28 19:29:08','2026-04-28 19:29:08'),(18,'Mê Linh','me-linh','Hà Nội',18,'2026-04-28 19:29:08','2026-04-28 19:29:08');
/*!40000 ALTER TABLE `districts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news_articles`
--

DROP TABLE IF EXISTS `news_articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news_articles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(180) NOT NULL,
  `slug` varchar(220) NOT NULL,
  `seo_title` varchar(180) DEFAULT NULL,
  `seo_description` varchar(320) DEFAULT NULL,
  `og_image_url` varchar(255) DEFAULT NULL,
  `canonical_url` varchar(255) DEFAULT NULL,
  `summary` varchar(360) NOT NULL,
  `content` text NOT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `category` varchar(80) NOT NULL,
  `status` enum('DRAFT','PUBLISHED') NOT NULL DEFAULT 'DRAFT',
  `published_at` timestamp NULL DEFAULT NULL,
  `author_name` varchar(120) NOT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `last_edited_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `fk_news_articles_creator` (`created_by`),
  KEY `idx_news_articles_status_published` (`status`,`published_at`),
  KEY `idx_news_articles_category_status` (`category`,`status`),
  KEY `idx_news_articles_updated` (`updated_at`),
  KEY `idx_news_articles_featured_status_published` (`is_featured`,`status`,`published_at`),
  KEY `fk_news_articles_editor` (`updated_by`),
  CONSTRAINT `fk_news_articles_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_news_articles_editor` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news_articles`
--

LOCK TABLES `news_articles` WRITE;
/*!40000 ALTER TABLE `news_articles` DISABLE KEYS */;
INSERT INTO `news_articles` VALUES (1,'Homi Khởi Động Chuyên Mục Cập Nhật Nguồn Cung Phòng Thuê Hà Nội','homi-khoi-dong-chuyen-muc-cap-nhat-nguon-cung-phong-thue-ha-noi',NULL,NULL,NULL,NULL,'Chuyên mục tin tức mới của Homi tập trung vào nguồn cung phòng thuê, căn hộ dịch vụ và các khu vực có nhu cầu tìm phòng cao tại Hà Nội.','# Homi Khởi Động Chuyên Mục Cập Nhật Nguồn Cung Phòng Thuê Hà Nội\n\nHomi chính thức bổ sung nhóm bài viết cập nhật thị trường nhằm giúp người thuê phòng theo dõi nguồn cung mới, biến động giá và các khu vực đang được quan tâm.\n\n## Tập Trung Vào Nhu Cầu Thuê Thực Tế\n\nCác nội dung được xây dựng theo hướng ngắn gọn, dễ đọc và ưu tiên thông tin có ích trong quá trình tìm phòng. Người dùng có thể tham khảo nhanh các khu vực nổi bật, loại hình phòng đang phổ biến và những lưu ý trước khi đặt lịch xem phòng.\n\n## Hỗ Trợ Người Thuê Ra Quyết Định Nhanh Hơn\n\nThay vì chỉ xem từng tin đăng riêng lẻ, người thuê có thêm góc nhìn tổng quan về khu vực, mức giá và tiện ích xung quanh. Đây là cơ sở để so sánh phòng phù hợp hơn với ngân sách, thời gian di chuyển và nhu cầu sinh hoạt.\n\n## Tiếp Tục Hoàn Thiện Dữ Liệu\n\nHomi sẽ ưu tiên cập nhật các nhóm thông tin liên quan đến phòng trọ, căn hộ mini, căn hộ dịch vụ và nhà riêng cho thuê. Mỗi bài viết đều hướng đến mục tiêu giúp quá trình tìm phòng minh bạch, nhanh và an toàn hơn.','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',1,'Thông báo Homi','PUBLISHED','2026-05-01 08:00:00','Homi Editorial',NULL,1,'2026-05-01 08:00:00','2026-05-02 08:55:50','2026-05-02 11:12:55'),(2,'Cụm Căn Hộ Dịch Vụ Minh Khai Hoàn Thiện Giai Đoạn 1, Tăng Lựa Chọn Cho Người Đi Làm','cum-can-ho-dich-vu-minh-khai-hoan-thien-giai-doan-1-tang-lua-chon-cho-nguoi-di-lam',NULL,NULL,NULL,NULL,'Nguồn cung căn hộ dịch vụ quanh Minh Khai tiếp tục được chú ý nhờ vị trí kết nối Hai Bà Trưng, Times City và các trục văn phòng lân cận.','# Cụm Căn Hộ Dịch Vụ Minh Khai Hoàn Thiện Giai Đoạn 1\n\nKhu vực Minh Khai ghi nhận thêm nhóm căn hộ dịch vụ được hoàn thiện theo hướng tối ưu diện tích, phù hợp người đi làm cần không gian riêng và thời gian di chuyển ngắn.\n\n## Vị Trí Kết Nối Nhiều Cụm Tiện Ích\n\nTừ Minh Khai, người thuê có thể tiếp cận nhanh các trục Bạch Mai, Đại La, Times City và khu trung tâm Hai Bà Trưng. Đây là lợi thế đáng chú ý với nhóm người đi làm cần cân bằng giữa chi phí thuê và thời gian di chuyển.\n\n## Thiết Kế Ưu Tiên Sự Gọn Gàng\n\nCác căn hộ dịch vụ trong nhóm nguồn cung này thường ưu tiên WC riêng, khu bếp nhỏ, chỗ để xe và hệ thống khóa an toàn. Với người thuê sống một mình hoặc theo cặp, mô hình này giúp hạn chế phát sinh thêm chi phí nội thất ban đầu.\n\n## Lưu Ý Khi Xem Phòng\n\n- Kiểm tra kỹ điện nước, phí dịch vụ và gửi xe.\n- Hỏi rõ quy định giờ giấc, khách đến chơi và nuôi thú cưng.\n- Đối chiếu ảnh đăng tin với tình trạng thực tế trước khi đặt cọc.\n\nNgười thuê nên đặt lịch xem trực tiếp và lưu lại các điều khoản quan trọng trước khi ký hợp đồng.','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',1,'Tin dự án','PUBLISHED','2026-04-30 09:00:00','Homi Editorial',NULL,NULL,'2026-04-30 09:00:00','2026-05-02 08:55:50','2026-05-02 08:55:50'),(3,'Cầu Giấy Tiếp Tục Là Khu Vực Được Tìm Kiếm Nhiều Trong Nhóm Phòng Trọ Gần Trường','cau-giay-tiep-tuc-la-khu-vuc-duoc-tim-kiem-nhieu-trong-nhom-phong-tro-gan-truong',NULL,NULL,NULL,NULL,'Nhu cầu thuê phòng tại Cầu Giấy duy trì ổn định nhờ mật độ trường đại học, văn phòng và tiện ích sinh hoạt cao.','# Cầu Giấy Tiếp Tục Là Khu Vực Được Tìm Kiếm Nhiều\n\nCầu Giấy vẫn là một trong những khu vực có lượng tìm kiếm phòng trọ cao trên Homi, đặc biệt ở nhóm sinh viên và người mới đi làm.\n\n## Lợi Thế Từ Hệ Sinh Thái Tiện Ích\n\nKhu vực này tập trung nhiều trường đại học, tòa nhà văn phòng, tuyến xe buýt và dịch vụ ăn uống. Nhờ đó, người thuê dễ tìm được phòng phù hợp với nhiều mức ngân sách khác nhau.\n\n## Mức Giá Cần So Sánh Theo Từng Tuyến Phố\n\nCác phòng gần trục Xuân Thủy, Cầu Giấy, Trần Thái Tông thường có lợi thế di chuyển nhưng giá có thể cao hơn khu trong ngõ. Người thuê nên so sánh thêm diện tích, phí dịch vụ và tình trạng nội thất thay vì chỉ nhìn giá niêm yết.\n\n## Gợi Ý Khi Lọc Phòng\n\n- Ưu tiên bộ lọc theo khoảng giá trước.\n- Chọn tiện ích thật sự cần như WC riêng, điều hòa, chỗ để xe.\n- Lưu phòng phù hợp để so sánh lại sau khi xem trực tiếp.\n\nCách tiếp cận này giúp giảm thời gian lọc tin và tránh bỏ sót phòng phù hợp.','https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',0,'Thị trường','PUBLISHED','2026-04-29 10:30:00','Homi Editorial',NULL,NULL,'2026-04-29 10:30:00','2026-05-02 08:55:50','2026-05-02 08:55:50'),(4,'Những Điểm Cần Kiểm Tra Trước Khi Đặt Cọc Phòng Thuê Trong Tháng 5','nhung-diem-can-kiem-tra-truoc-khi-dat-coc-phong-thue-trong-thang-5',NULL,NULL,NULL,NULL,'Trước khi đặt cọc, người thuê nên rà soát tình trạng phòng, chi phí phát sinh và điều khoản hoàn cọc để hạn chế rủi ro.','# Những Điểm Cần Kiểm Tra Trước Khi Đặt Cọc Phòng Thuê Trong Tháng 5\n\nThời điểm đầu hè thường ghi nhận nhu cầu tìm phòng tăng lên, đặc biệt với sinh viên chuẩn bị chuyển chỗ ở và người đi làm thay đổi nơi làm việc. Vì vậy, người thuê cần kiểm tra kỹ trước khi chốt phòng.\n\n## Kiểm Tra Tình Trạng Phòng\n\nNgười thuê nên quan sát tường, trần, nhà vệ sinh, cửa khóa, ổ điện và khả năng thoát nước. Các lỗi nhỏ nên được ghi lại bằng ảnh hoặc tin nhắn để tránh tranh cãi sau khi nhận phòng.\n\n## Hỏi Rõ Toàn Bộ Chi Phí\n\nNgoài tiền thuê chính, cần hỏi thêm tiền điện, nước, wifi, vệ sinh, gửi xe, phí thang máy và chi phí phát sinh nếu có khách ở lại. Tổng chi phí hàng tháng mới là con số phản ánh đúng khả năng chi trả.\n\n## Đọc Kỹ Điều Khoản Đặt Cọc\n\nHợp đồng nên ghi rõ số tiền cọc, thời hạn báo trước khi trả phòng, điều kiện hoàn cọc và trách nhiệm sửa chữa. Nếu chủ nhà yêu cầu cọc trước khi xem phòng, người thuê cần thận trọng.\n\nMột quy trình kiểm tra rõ ràng giúp người thuê giảm rủi ro và giữ thế chủ động khi thương lượng.','https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80',0,'Kinh nghiệm','PUBLISHED','2026-04-28 14:00:00','Homi Editorial',NULL,NULL,'2026-04-28 14:00:00','2026-05-02 08:55:50','2026-05-02 08:55:50');
/*!40000 ALTER TABLE `news_articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news_categories`
--

DROP TABLE IF EXISTS `news_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news_categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` varchar(300) DEFAULT NULL,
  `display_order` int NOT NULL DEFAULT '0',
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_news_categories_enabled_order` (`enabled`,`display_order`,`name`)
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news_categories`
--

LOCK TABLES `news_categories` WRITE;
/*!40000 ALTER TABLE `news_categories` DISABLE KEYS */;
INSERT INTO `news_categories` VALUES (1,'Hướng dẫn thuê phòng','huong-dan-thue-phong','Bài viết hướng dẫn quy trình tìm và thuê phòng an toàn.',10,1,'2026-05-01 21:22:18','2026-05-02 08:55:50'),(2,'Kinh nghiệm','kinh-nghiem','Kinh nghiệm thực tế cho người thuê phòng tại Hà Nội.',20,1,'2026-05-01 21:22:18','2026-05-02 08:55:50'),(3,'Thị trường','thi-truong','Cập nhật xu hướng giá thuê và khu vực nổi bật.',30,1,'2026-05-01 21:22:18','2026-05-02 08:55:50'),(4,'Thông báo Homi','thong-bao-homi','Thông báo sản phẩm và chính sách từ Homi.',40,1,'2026-05-01 21:22:18','2026-05-02 08:55:50'),(14,'Tin dự án','tin-du-an','Tin cập nhật về nguồn cung phòng, căn hộ dịch vụ và dự án cho thuê.',25,1,'2026-05-02 08:55:50','2026-05-02 08:55:50');
/*!40000 ALTER TABLE `news_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `recipient_id` bigint NOT NULL,
  `type` enum('NEW_CONTACT_REQUEST') NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` varchar(500) NOT NULL,
  `target_url` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notifications_recipient_read_created` (`recipient_id`,`is_read`,`created_at`),
  KEY `idx_notifications_recipient_created` (`recipient_id`,`created_at`),
  CONSTRAINT `fk_notifications_recipient` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,1,'NEW_CONTACT_REQUEST','Yeu cau lien he moi','Nguyen Thi An da gui yeu cau xem phong Studio gan Dai hoc Quoc gia Ha Noi.','/admin/contact-requests',1,'2026-04-12 09:00:00'),(2,1,'NEW_CONTACT_REQUEST','Yeu cau lien he moi','Tran Quoc Binh can them thong tin ve phi dich vu va hop dong thue khu Bach Khoa.','/admin/contact-requests',1,'2026-04-13 08:15:00'),(3,1,'NEW_CONTACT_REQUEST','Yeu cau lien he moi','Tran Quoc Binh quan tam studio gan My Dinh co ban cong.','/admin/contact-requests',1,'2026-04-16 07:50:00'),(4,2,'NEW_CONTACT_REQUEST','Yêu cầu liên hệ mới','Nguyễn Thị An quan tâm phòng \"Nhà trọ 5 tầng Minh Khai\"','/host/customers',1,'2026-04-28 11:41:48'),(5,1,'NEW_CONTACT_REQUEST','Yêu cầu liên hệ mới','Nguyễn Thị An quan tâm phòng \"Nhà trọ 5 tầng Minh Khai\"','/admin/contact-requests',1,'2026-04-28 11:41:48');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `token_hash` varchar(64) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `revoked_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_hash` (`token_hash`),
  KEY `idx_refresh_tokens_user_active` (`user_id`,`revoked_at`,`expires_at`),
  KEY `idx_refresh_tokens_expires` (`expires_at`),
  CONSTRAINT `fk_refresh_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,1,'05bf9184a4caa4171fb8eb207602f61fd5d65a9d0f41012eee6168d88054b8c2','2026-05-05 11:32:06','2026-04-28 11:32:18','2026-04-28 11:32:06'),(2,2,'f6f96127c7504e2e4820b00790cb541c16f9694d271b2cc5debd87286ed27e18','2026-05-05 11:33:38','2026-04-28 11:45:31','2026-04-28 11:33:38'),(3,1,'b80238c6003b0004dbda44dc3939e5f8af49c171e82d2a7044c806f9425fea39','2026-05-05 11:45:43','2026-04-28 11:50:22','2026-04-28 11:45:43'),(4,2,'5eacc048199aec4aae7bb525bf18450e4d21407d92072b1220c3d62170770e7b','2026-05-05 11:50:27','2026-04-28 15:18:28','2026-04-28 11:50:27'),(5,2,'645394f77e0088f527e2021c5b6e286c68dfc749dfb99ec456a298a93152a4fe','2026-05-05 15:18:35','2026-04-28 16:17:44','2026-04-28 15:18:35'),(6,2,'2d0c517884519cfb36fa7e12229074797a6c1a75d49facff35f7693cd77b0392','2026-05-05 15:37:37',NULL,'2026-04-28 15:37:37'),(7,1,'226845daaaf37fdde8cd18b15ddc22841b7c1170d139a4f2386a4eefc5c7d317','2026-05-05 16:17:50','2026-04-28 19:45:03','2026-04-28 16:17:50'),(8,1,'51d44a94b43879984b7e814595707167504f60d02888f351adfeb27e916dcf3b','2026-05-05 19:00:01','2026-04-28 19:40:36','2026-04-28 19:00:01'),(9,2,'f89337432a3724369bd4c67f38a075da1d8853392ae793293dc13cb4c39bbda9','2026-05-05 19:41:09','2026-04-28 19:45:06','2026-04-28 19:41:09'),(10,1,'b715b6c54aa7d2fd983bbf9fc116a04a6a7fda939c4e278a5679bbaf28d21ce9','2026-05-05 19:45:22','2026-04-28 19:45:44','2026-04-28 19:45:22'),(11,3,'4f5f25de5e019c84fe82689aae976df3135690adb3f00bdb5ac58cfcf916871a','2026-05-05 19:45:50','2026-04-28 20:20:07','2026-04-28 19:45:50'),(12,1,'a2ad0c89a243d24ee115700f3d7e5ef39b3ec353cb1ae1698472658f8ba3461f','2026-05-05 20:20:30',NULL,'2026-04-28 20:20:30'),(13,1,'a5fee9d4f7c1f19edf9fe624fe6b19d91884dd5ca4693fcfc9f599ef968816ad','2026-05-05 20:50:49','2026-04-29 11:00:14','2026-04-28 20:50:49'),(14,1,'9e52e6b5fbc7d9f9eedd966adbc8565f97a055c403ab805fdd98ee7d126f9eb8','2026-05-05 20:59:11',NULL,'2026-04-28 20:59:11'),(15,1,'0d5494eedab17cbdc3fe2adcdf6354b0a2031a68b6290890bc458474693b1b02','2026-05-05 21:41:44','2026-04-28 21:44:43','2026-04-28 21:41:44'),(16,2,'838eb828192d0650afd16df42b6d5446bea4ac7cd260e19b9dc73f540eb39a97','2026-05-05 21:45:02','2026-04-28 21:45:10','2026-04-28 21:45:02'),(17,1,'8be203b9d030beda1f6cdca558a07a475e3999089fcc7b043a1c5ace5bb5d9dc','2026-05-05 21:45:16','2026-04-29 11:16:02','2026-04-28 21:45:16'),(18,1,'21b7d5271b076f4c06f9f15342279637568f9329976edb59d2a2dd487720d125','2026-05-06 11:00:27','2026-04-30 20:39:07','2026-04-29 11:00:27'),(19,1,'3daf69e2111e134984108288624ccce807aab1ed022e5b332dac68adb1827f3f','2026-05-06 11:16:11',NULL,'2026-04-29 11:16:11'),(20,1,'18d56bcf2719f84135d6ade9b113d19697259538f7b289e9a329765886fb7ba7','2026-05-06 11:17:32',NULL,'2026-04-29 11:17:32'),(21,2,'952df56c7868c06e9be9a02c95486b18394f52736365d1fb23872ea73168e974','2026-05-06 19:49:45',NULL,'2026-04-29 19:49:45'),(22,2,'dfdce9457d24ace44173df135c9dd95ed34eedf074bcd92d83f83381893a42e9','2026-05-06 19:52:07',NULL,'2026-04-29 19:52:07'),(23,2,'734aa6cc93607221d26d098061f2fbf164d5fde2e7cfd04e69b768a4d96e2924','2026-05-06 19:55:25',NULL,'2026-04-29 19:55:25'),(24,4,'5f684ad947c2c5cc5d9e987cb752b783ed16bf36de1976c324e3c4b112b5dbaf','2026-05-06 19:55:55','2026-04-29 19:56:40','2026-04-29 19:55:55'),(25,1,'cceea3c0a0d593a38fb45a427f848cdaf3d877d8e50cfd85d1ddbda644df24c3','2026-05-06 19:56:54','2026-04-29 19:57:15','2026-04-29 19:56:54'),(26,1,'f4e512087b7a27e74f4691e519138586cd81efb5212e2b914a3a38226543b905','2026-05-06 19:57:32','2026-04-29 20:00:35','2026-04-29 19:57:32'),(27,2,'63606d88f1fef41cd76a328b2a3fba96d2c93822498a3d281746241ed4a4010c','2026-05-07 18:51:00',NULL,'2026-04-30 18:51:00'),(28,1,'00bf2fd7a332502903c9364792e44868627c0a8dca33cc97bb35aa2b4fdc24d3','2026-05-07 20:39:07','2026-04-30 20:55:19','2026-04-30 20:39:07'),(29,1,'aead45b71f923f01c81a1a9ddd98cc622fdcdc781e53825dfbe10f4a733b3a7c','2026-05-07 20:46:42','2026-04-30 20:47:45','2026-04-30 20:46:42'),(30,1,'049867c9306e85a402da3aaf84d36a477fab4c393ec683bb086159e5f901d83d','2026-05-07 20:55:30','2026-04-30 21:43:03','2026-04-30 20:55:30'),(31,1,'c21105b7d3bd2e61cb5bdefcc3ae844a59c8587eb5372b777e8561a5e91224ab','2026-05-07 20:58:26','2026-04-30 20:58:28','2026-04-30 20:58:26'),(32,4,'c554663af96f9dcf1f316b9176131172d564e5d9482cb9c2403115340f6e6bdb','2026-05-07 20:58:35','2026-04-30 20:59:37','2026-04-30 20:58:35'),(33,4,'2073db26b9d7c096b3065ce7ec9421b5ee2310c0ca99b8e626b6297c4e3405aa','2026-05-07 21:05:38','2026-04-30 21:11:09','2026-04-30 21:05:38'),(34,1,'9d1ad4cdd1d5554f7079699129fb9678f8450afc3548c40225a46f4592943e05','2026-05-07 21:11:19','2026-04-30 21:15:59','2026-04-30 21:11:19'),(35,4,'b2d0f4b3e274df356e94152a0cc8c9125e4de706561acbe984755ec7deba2638','2026-05-07 21:16:04','2026-04-30 21:19:54','2026-04-30 21:16:04'),(36,2,'e28c7a5e3bcec705bb2d84b9cf9e5768f40e0b8a67a29a3d6eee92182a0cc5e8','2026-05-07 21:20:05',NULL,'2026-04-30 21:20:05'),(37,4,'f45154342047cb174da9fe6271298763c105c4f784347a5b034fd5e0245142ec','2026-05-07 21:20:42','2026-04-30 21:20:56','2026-04-30 21:20:42'),(38,3,'edb9b173f77d980baa8919c4a6f0a543c1a2866e83a48ad0c7bab659ffcf92a2','2026-05-07 21:21:06','2026-04-30 21:40:42','2026-04-30 21:21:06'),(39,2,'d99dd972e077103d83d0bded036f55781bc93a0d3b884a04f811c5341e7bd51d','2026-05-07 21:41:29','2026-04-30 21:43:24','2026-04-30 21:41:29'),(40,2,'3f9390914028703332b1eb3d21ec48ca9c2105ac2fda1a4f03328e9c36dac7e7','2026-05-08 14:35:17',NULL,'2026-05-01 14:35:17'),(41,4,'ac0ce8b2600ac14d5d22cc283b1bc1a21f122e167fb15974ba15b6185692baed','2026-05-08 14:48:17','2026-05-01 16:08:43','2026-05-01 14:48:17'),(42,2,'71372123bf674edba14b5561609e6f0ad4c8af6bb04551d38949bb826cf6e9ba','2026-05-08 14:56:34',NULL,'2026-05-01 14:56:34'),(43,3,'97a2530e4d58468dc16a63c49d56daa88633951b436fbc2f2a2f4279b633b889','2026-05-08 16:34:14','2026-05-01 16:34:51','2026-05-01 16:34:14'),(44,1,'5d325c83d3f429f233aadf4b7267a968093fead2f5da1c98d39738dd50ac4053','2026-05-08 16:34:56','2026-05-02 11:20:02','2026-05-01 16:34:56'),(45,4,'f818fd5cc926044478c4c33e715f5f24cd97f025a749c5613601eca8eb276a8f','2026-05-09 11:20:09','2026-05-02 11:20:21','2026-05-02 11:20:09'),(46,1,'9f2b30d70f611be40c694fcdb5c8edc7ec441df8095edbbb5dda4d3809a5c9f7','2026-05-09 11:20:27','2026-05-02 11:21:09','2026-05-02 11:20:27'),(47,1,'69d42623fe0d7aa61264d65bd006e0fcc4693b1c2dc73b089049697015cc1f81','2026-05-09 11:46:13','2026-05-02 17:12:00','2026-05-02 11:46:13'),(48,1,'680c0eeea2d8d955cd799cd6b5fcf7f64d32ec2a1999d0c19b981711631de804','2026-05-09 18:31:33','2026-05-02 18:31:55','2026-05-02 18:31:33'),(49,5,'430c151f33b5b4c57c2163df35647aca626161ad2aebf7ef8300d2bb65f212cf','2026-05-09 18:32:03','2026-05-02 18:35:49','2026-05-02 18:32:03'),(50,7,'ccb48fa4e6728901e066368c6f1cf6374792f2e2380df3f19cfcece396219a15','2026-05-09 18:38:37','2026-05-02 18:38:49','2026-05-02 18:38:37'),(51,1,'5822ee361655340397cadd6091fb0c2c765bf7d6de464d1568f4dc4b3176d5b8','2026-05-09 18:39:38','2026-05-02 18:39:40','2026-05-02 18:39:38'),(52,1,'6ea613706a5b6aa0a21bb53d8e648e06e0cc09b2bfd8efb89805bec1b6692026','2026-05-09 18:39:47','2026-05-02 18:40:17','2026-05-02 18:39:47'),(53,2,'d37b117b59f36ec31c70c1cdad041781b1f63d07423f8f9c02f296a19023a563','2026-05-09 18:40:24','2026-05-02 18:40:42','2026-05-02 18:40:24'),(54,1,'10bfd79734014ff60423d3a15297345cdc0cbf37b450da7bae7979e912311bf0','2026-05-09 18:43:47','2026-05-02 18:46:48','2026-05-02 18:43:47'),(55,1,'e8da0fcd9157ebac45071f9e41b26574d56eabf7672f7c8e870cea720c9b2b91','2026-05-09 18:46:48','2026-05-02 18:50:20','2026-05-02 18:46:48'),(56,1,'f00a521f60835a13b41111c7e91bd28f8587aaa56518332930ca148904120e89','2026-05-09 18:51:01','2026-05-02 18:51:10','2026-05-02 18:51:01'),(57,1,'e8a93c938125bf8475c882f3f0a20e88eeae7c701e935c8375c5f58d9a94f8a6','2026-05-09 19:01:22','2026-05-02 19:01:38','2026-05-02 19:01:22'),(58,8,'36ed1ecf07b6675f56d6b09d8fdc5149aa5c690c4f99ced90ff1993f1a9f851a','2026-05-09 19:03:58','2026-05-02 19:04:07','2026-05-02 19:03:58'),(59,1,'dfc726e49d2b0057114cc5d7c723139e006e20e6a45b6390d746e09d84fb80b7','2026-05-09 19:04:50',NULL,'2026-05-02 19:04:50');
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'USER','Người dùng thông thường','2026-04-28 11:31:37','2026-04-28 11:31:37'),(2,'ADMIN','Quản trị viên hệ thống','2026-04-28 11:31:37','2026-04-28 11:31:37');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_amenities`
--

DROP TABLE IF EXISTS `room_amenities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_amenities` (
  `room_id` bigint NOT NULL,
  `amenity_id` bigint NOT NULL,
  PRIMARY KEY (`room_id`,`amenity_id`),
  KEY `fk_room_amenities_amenity` (`amenity_id`),
  CONSTRAINT `fk_room_amenities_amenity` FOREIGN KEY (`amenity_id`) REFERENCES `amenities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_room_amenities_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_amenities`
--

LOCK TABLES `room_amenities` WRITE;
/*!40000 ALTER TABLE `room_amenities` DISABLE KEYS */;
INSERT INTO `room_amenities` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(1,2),(2,2),(3,2),(4,2),(6,2),(1,3),(2,3),(3,3),(5,3),(6,3),(1,4),(2,4),(3,4),(4,4),(5,4),(6,4),(1,5),(4,5),(2,6),(2,7),(3,8),(1,9),(5,9),(6,9),(4,11),(6,11),(3,12);
/*!40000 ALTER TABLE `room_amenities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_images`
--

DROP TABLE IF EXISTS `room_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `room_id` bigint NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `alt_text` varchar(150) DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_thumbnail` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_room_images_room` (`room_id`,`sort_order`),
  CONSTRAINT `fk_room_images_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_images`
--

LOCK TABLES `room_images` WRITE;
/*!40000 ALTER TABLE `room_images` DISABLE KEYS */;
INSERT INTO `room_images` VALUES (1,1,'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80','Studio gần Đại học Quốc gia Hà Nội - ảnh 1',1,1,'2026-04-28 11:31:37'),(2,1,'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80','Studio gần Đại học Quốc gia Hà Nội - ảnh 2',2,0,'2026-04-28 11:31:37'),(3,2,'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80','Phòng gác lửng gần Đại học Thương mại - ảnh 1',1,1,'2026-04-28 11:31:37'),(4,2,'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80','Phòng gác lửng gần Đại học Thương mại - ảnh 2',2,0,'2026-04-28 11:31:37'),(5,3,'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80','Căn hộ mini gần Bách Khoa - ảnh 1',1,1,'2026-04-28 11:31:37'),(6,3,'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80','Căn hộ mini gần Bách Khoa - ảnh 2',2,0,'2026-04-28 11:31:37'),(7,4,'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80','Phòng trọ gần Học viện Ngân hàng - ảnh 1',1,1,'2026-04-28 11:31:37'),(8,4,'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80','Phòng trọ gần Học viện Ngân hàng - ảnh 2',2,0,'2026-04-28 11:31:37'),(9,5,'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80','Phòng mini gần Đại học Hà Nội - ảnh 1',1,1,'2026-04-28 11:31:37'),(10,5,'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80','Phòng mini gần Đại học Hà Nội - ảnh 2',2,0,'2026-04-28 11:31:37'),(11,6,'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80','Studio Mỹ Đình - ảnh 1',1,1,'2026-04-28 11:31:37'),(12,6,'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80','Studio Mỹ Đình - ảnh 2',2,0,'2026-04-28 11:31:37');
/*!40000 ALTER TABLE `room_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_reports`
--

DROP TABLE IF EXISTS `room_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_reports` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `room_id` bigint NOT NULL,
  `reporter_id` bigint NOT NULL,
  `reason` enum('WRONG_INFO','DUPLICATE','SCAM','UNAVAILABLE','INAPPROPRIATE','OTHER') NOT NULL,
  `details` varchar(1000) DEFAULT NULL,
  `status` enum('NEW','REVIEWING','RESOLVED','DISMISSED') NOT NULL DEFAULT 'NEW',
  `admin_note` varchar(500) DEFAULT NULL,
  `handled_by` bigint DEFAULT NULL,
  `handled_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_room_reports_handler` (`handled_by`),
  KEY `idx_room_reports_status_created` (`status`,`created_at`),
  KEY `idx_room_reports_reason` (`reason`),
  KEY `idx_room_reports_room_created` (`room_id`,`created_at`),
  KEY `idx_room_reports_reporter_created` (`reporter_id`,`created_at`),
  CONSTRAINT `fk_room_reports_handler` FOREIGN KEY (`handled_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_room_reports_reporter` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_room_reports_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_reports`
--

LOCK TABLES `room_reports` WRITE;
/*!40000 ALTER TABLE `room_reports` DISABLE KEYS */;
INSERT INTO `room_reports` VALUES (1,5,2,'UNAVAILABLE','Nguoi dang tin bao phong da het nhung bai dang van hien thi con phong tren website.','NEW',NULL,NULL,NULL,'2026-04-18 09:30:00','2026-04-18 09:30:00'),(2,2,3,'WRONG_INFO','Gia phong thuc te cao hon gia dang tren bai viet, can admin xac minh lai.','RESOLVED','Da ghi nhan, can lien he chu tro de doi chieu thong tin gia.',1,'2026-04-28 11:46:48','2026-04-18 13:40:00','2026-04-28 11:46:48');
/*!40000 ALTER TABLE `room_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `listing_code` varchar(5) DEFAULT NULL,
  `title` varchar(180) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `address` varchar(255) NOT NULL,
  `district_id` bigint NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `area` decimal(6,2) NOT NULL,
  `contact_name` varchar(120) NOT NULL,
  `contact_phone` varchar(20) NOT NULL,
  `status` enum('AVAILABLE','FULL','HIDDEN') NOT NULL DEFAULT 'AVAILABLE',
  `room_type` enum('APARTMENT','MINI_APARTMENT','PRIVATE_HOUSE','BOARDING_ROOM') NOT NULL DEFAULT 'BOARDING_ROOM',
  `thumbnail` varchar(255) DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `created_by` bigint DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `listing_code` (`listing_code`),
  KEY `fk_rooms_district` (`district_id`),
  KEY `idx_rooms_listing` (`status`,`district_id`,`price`),
  KEY `idx_rooms_owner_status_created` (`created_by`,`status`,`created_at`),
  KEY `idx_rooms_area` (`area`),
  KEY `idx_rooms_featured` (`is_featured`),
  KEY `idx_rooms_created_at` (`created_at`),
  KEY `idx_rooms_type_status` (`room_type`,`status`),
  CONSTRAINT `fk_rooms_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_rooms_district` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'17919','Studio gần Đại học Quốc gia Hà Nội, nội thất cơ bản','studio-gan-dai-hoc-quoc-gia-ha-noi-noi-that-co-ban','Phòng studio phù hợp sinh viên khu Đại học Quốc gia Hà Nội, không gian gọn gàng, có cửa sổ lớn, giữ xe trong nhà và khu vực an ninh.','15 Xuân Thủy, Dịch Vọng Hậu',1,4300000.00,22.00,'Nguyễn Văn Hùng','0909001001','AVAILABLE','BOARDING_ROOM','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',1,1,'2026-04-05 08:30:00','2026-04-28 11:31:37'),(2,'25838','Phòng gác lửng gần Đại học Thương mại, giờ giấc tự do','phong-gac-lung-gan-dai-hoc-thuong-mai-gio-giac-tu-do','Phòng trọ có gác lửng, phù hợp 2 người ở, được nấu ăn, giữ xe miễn phí và thuận tiện đi Đại học Thương mại, Đại học Quốc gia.','32 Hồ Tùng Mậu, Mai Dịch',5,3800000.00,24.00,'Lê Thị Mai','0909001002','AVAILABLE','BOARDING_ROOM','https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',1,1,'2026-04-06 09:00:00','2026-04-28 11:31:37'),(3,'33757','Căn hộ mini gần Bách Khoa - Kinh tế Quốc dân','can-ho-mini-gan-bach-khoa-kinh-te-quoc-dan','Căn hộ mini sạch sẽ, có thang máy, máy giặt chung, phù hợp sinh viên Bách Khoa, Kinh tế Quốc dân và người đi làm cần không gian yên tĩnh.','18 Tạ Quang Bửu, Bách Khoa',3,5200000.00,28.00,'Phạm Quốc Tuấn','0909001003','AVAILABLE','BOARDING_ROOM','https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',0,1,'2026-04-07 10:10:00','2026-04-28 11:31:37'),(4,'41676','Phòng trọ gần Học viện Ngân hàng và Đại học Thủy lợi','phong-tro-gan-hoc-vien-ngan-hang-va-dai-hoc-thuy-loi','Phòng trọ đẹp, dân cư ổn định, có ban công nhỏ, phù hợp sinh viên Học viện Ngân hàng, Đại học Thủy lợi và người đi làm khu Đống Đa.','86 Chùa Bộc, Quang Trung',2,3900000.00,23.00,'Võ Minh Châu','0909001004','AVAILABLE','BOARDING_ROOM','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',1,1,'2026-04-08 13:20:00','2026-04-28 11:31:37'),(5,'49595','Phòng mini gần Đại học Hà Nội, giá hợp lý','phong-mini-gan-dai-hoc-ha-noi-gia-hop-ly','Phòng mini giá hợp lý cho sinh viên Đại học Hà Nội và người đi làm khu Thanh Xuân, có máy lạnh, WC riêng và giao thông thuận tiện.','45 Nguyễn Trãi, Thanh Xuân Trung',4,3400000.00,18.00,'Trần Thị Hoa','0909001005','FULL','BOARDING_ROOM','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',0,1,'2026-04-09 14:45:00','2026-04-28 11:31:37'),(6,'57514','Studio ban công gần Mỹ Đình và Đại học FPT','studio-ban-cong-gan-my-dinh-va-dai-hoc-fpt','Phòng studio thiết kế hiện đại, có ban công và cửa sổ lớn, phù hợp người cần không gian sống thông thoáng gần Mỹ Đình, Nam Từ Liêm.','27 Hàm Nghi, Mỹ Đình 2',5,5500000.00,30.00,'Nguyễn Văn Hùng','0909001001','AVAILABLE','BOARDING_ROOM','https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',1,1,'2026-04-10 16:00:00','2026-04-28 11:31:37');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saved_rooms`
--

DROP TABLE IF EXISTS `saved_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saved_rooms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `room_id` bigint NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_saved_rooms_user_room` (`user_id`,`room_id`),
  KEY `idx_saved_rooms_user_created` (`user_id`,`created_at`),
  KEY `idx_saved_rooms_room` (`room_id`),
  CONSTRAINT `fk_saved_rooms_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_saved_rooms_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_rooms`
--

LOCK TABLES `saved_rooms` WRITE;
/*!40000 ALTER TABLE `saved_rooms` DISABLE KEYS */;
INSERT INTO `saved_rooms` VALUES (2,2,4,'2026-04-17 09:05:00'),(3,3,3,'2026-04-17 10:15:00'),(4,3,6,'2026-04-17 10:20:00'),(5,1,6,'2026-04-28 20:51:39'),(6,1,4,'2026-04-28 20:51:41');
/*!40000 ALTER TABLE `saved_rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support_tickets`
--

DROP TABLE IF EXISTS `support_tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_tickets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `type` enum('ROOM_REPORT','CONTACT') NOT NULL,
  `listing_reference` varchar(255) DEFAULT NULL,
  `reason` varchar(120) DEFAULT NULL,
  `full_name` varchar(120) DEFAULT NULL,
  `email` varchar(120) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(180) NOT NULL,
  `message` varchar(1500) NOT NULL,
  `status` enum('NEW','REVIEWING','RESOLVED','DISMISSED') NOT NULL DEFAULT 'NEW',
  `admin_note` varchar(600) DEFAULT NULL,
  `handled_by` bigint DEFAULT NULL,
  `handled_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_support_tickets_handler` (`handled_by`),
  KEY `idx_support_tickets_type_status_created` (`type`,`status`,`created_at`),
  KEY `idx_support_tickets_status_created` (`status`,`created_at`),
  CONSTRAINT `fk_support_tickets_handler` FOREIGN KEY (`handled_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_tickets`
--

LOCK TABLES `support_tickets` WRITE;
/*!40000 ALTER TABLE `support_tickets` DISABLE KEYS */;
/*!40000 ALTER TABLE `support_tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `fk_user_roles_role` (`role_id`),
  CONSTRAINT `fk_user_roles_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_roles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (2,1),(3,1),(5,1),(7,1),(8,1),(1,2),(4,2);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `full_name` varchar(120) NOT NULL,
  `email` varchar(120) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `host_bio` varchar(500) DEFAULT NULL,
  `email_verified` tinyint(1) NOT NULL DEFAULT '1',
  `auth_provider` enum('LOCAL','GOOGLE') NOT NULL DEFAULT 'LOCAL',
  `google_id` varchar(120) DEFAULT NULL,
  `otp_hash` varchar(255) DEFAULT NULL,
  `otp_expires_at` timestamp NULL DEFAULT NULL,
  `otp_attempts` int NOT NULL DEFAULT '0',
  `otp_resend_count` int NOT NULL DEFAULT '0',
  `otp_last_sent_at` timestamp NULL DEFAULT NULL,
  `password_reset_otp_hash` varchar(255) DEFAULT NULL,
  `password_reset_otp_expires_at` timestamp NULL DEFAULT NULL,
  `password_reset_otp_attempts` int NOT NULL DEFAULT '0',
  `password_reset_otp_resend_count` int NOT NULL DEFAULT '0',
  `password_reset_otp_last_sent_at` timestamp NULL DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','LOCKED') NOT NULL DEFAULT 'ACTIVE',
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  `lock_reason` varchar(300) DEFAULT NULL,
  `locked_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `uk_users_google_id` (`google_id`),
  KEY `idx_users_status` (`status`),
  KEY `idx_users_auth_provider` (`auth_provider`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin Homi','admin.thuenhahomi@gmail.com','$2b$12$SeZgndXr8fLCE7w5qVpJb.BncibcCLniGtMVyPT5SeVPomi/n10pC','0909000000','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80','Cầu Giấy, Hà Nội','Quản lý các bài đăng phòng trọ mẫu của hệ thống Homi.',1,'LOCAL',NULL,NULL,NULL,0,0,NULL,'$2a$10$MQG89UzNF.vijfSnfyISe.Uo4ekJ5kgOaXIC3p9ocY7IvJR2NWZpS','2026-05-02 19:24:07',0,0,'2026-05-02 19:14:07','ACTIVE',1,NULL,NULL,'2026-04-01 08:00:00','2026-05-02 19:28:42'),(2,'Nguyễn Thị An','an.nguyen@example.com','$2b$12$Ot3.iK9gYFUlkXqX6UvzuO6iGk8gsMudLZToFNFyyPSLgFyPsY9W6','0911222333','https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80','Đống Đa, Hà Nội','Có phòng trọ nhỏ gần các trường đại học, ưu tiên sinh viên thuê dài hạn.',1,'LOCAL',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,0,NULL,'ACTIVE',1,NULL,NULL,'2026-04-02 09:15:00','2026-04-02 09:15:00'),(3,'Trần Quốc Bình','binh.tran@example.com','$2b$12$Ot3.iK9gYFUlkXqX6UvzuO6iGk8gsMudLZToFNFyyPSLgFyPsY9W6','0933444555','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80','Hai Bà Trưng, Hà Nội','Người đăng tin cá nhân, phản hồi nhanh các yêu cầu xem phòng.',1,'LOCAL',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,0,NULL,'ACTIVE',1,NULL,NULL,'2026-04-03 10:20:00','2026-04-03 10:20:00'),(4,'Công Minh Đào','daocongminh204@gmail.com','$2a$10$01p.ezFvHJv.9COBgVNjHu9aYziA65EpdRbOVhlQwG3FMbdVggWUG','0963096887','https://lh3.googleusercontent.com/a/ACg8ocJmdjSBws1GFbqynU6l4SE_D3Eg4Nd7L1QDFerg-jBDKOShLfao=s96-c',NULL,NULL,1,'GOOGLE','105732462191678561784',NULL,NULL,0,0,NULL,NULL,NULL,0,0,NULL,'ACTIVE',1,NULL,NULL,'2026-04-29 19:55:55','2026-05-02 19:01:33'),(5,'Hoàng Duy Khánh','lilhimn.204@gmail.com','$2a$10$oIQdw7Iei2OB8MF6WpP1ZeejEBnMBRqZ.ZQtCzd.6m2kEQsqVcZse','09785869706',NULL,NULL,NULL,1,'LOCAL',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,0,NULL,'ACTIVE',1,NULL,NULL,'2026-05-02 17:15:20','2026-05-02 18:31:48'),(7,'Khánh Juzo','vupedi16666@gmail.com','$2a$10$JbNJvo/wJaMnO.iTsAvI7uoPHG2sdzYwExNO.WccyjUmgPPwX13IS',NULL,'https://lh3.googleusercontent.com/a/ACg8ocISqKVpyWgW6W7_l24JcWZtwFRY_Jyv4f8yx2mcCnxUP4sLtSWj=s96-c',NULL,NULL,1,'GOOGLE','105110917011196823702',NULL,NULL,0,0,NULL,NULL,NULL,0,0,NULL,'ACTIVE',1,NULL,NULL,'2026-05-02 18:38:37','2026-05-02 18:38:37'),(8,'Dao Duy Vu','hdk.sphn@gmail.com','$2a$10$FIKe0LFfmTJJiKIB3P8dNe/sYaGAmgqhWcEGMJbyaMBr7.x4q4E96','095668795',NULL,NULL,NULL,1,'LOCAL',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,0,NULL,'ACTIVE',1,NULL,NULL,'2026-05-02 19:03:19','2026-05-02 19:03:58');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'rental_room_db'
--

--
-- Dumping routines for database 'rental_room_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-02 20:22:12
