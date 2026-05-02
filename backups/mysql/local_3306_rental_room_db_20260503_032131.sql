-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: rental_room_db
-- ------------------------------------------------------
-- Server version	8.0.45

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

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `rental_room_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `rental_room_db`;

--
-- Table structure for table `amenities`
--

DROP TABLE IF EXISTS `amenities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `amenities` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('BUILDING','ROOM','SERVICE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon_key` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `amenities`
--

LOCK TABLES `amenities` WRITE;
/*!40000 ALTER TABLE `amenities` DISABLE KEYS */;
INSERT INTO `amenities` VALUES (1,'Wi-Fi tốc độ cao','wifi','SERVICE','wifi','2026-04-20 18:16:52','2026-04-23 12:23:32'),(2,'Chỗ để xe','parking','BUILDING','parking-square','2026-04-20 18:16:52','2026-04-23 12:23:32'),(3,'Máy lạnh','air-conditioner','ROOM','air-vent','2026-04-20 18:16:52','2026-04-23 12:23:32'),(4,'WC riêng','private-toilet','ROOM','bath','2026-04-20 18:16:52','2026-04-23 12:23:32'),(5,'Camera an ninh','security-camera','BUILDING','cctv','2026-04-20 18:16:52','2026-04-20 18:16:52'),(6,'Bếp riêng','private-kitchen','ROOM','chef-hat','2026-04-20 18:16:52','2026-04-23 12:23:32'),(7,'Gác lửng','loft','ROOM','layers-3','2026-04-20 18:16:52','2026-04-23 12:23:32'),(8,'Máy giặt','washing-machine','SERVICE','washing-machine','2026-04-20 18:16:52','2026-04-23 12:23:32'),(9,'Cửa sổ thông thoáng','window','ROOM','blinds','2026-04-20 18:16:52','2026-04-23 12:23:32'),(10,'Cho nuôi thú cưng','pet-friendly','SERVICE','paw-print','2026-04-20 18:16:52','2026-04-23 12:23:32'),(11,'Ban công','balcony','ROOM','building-2','2026-04-20 18:16:52','2026-04-23 12:23:32'),(12,'Thang máy','elevator','BUILDING','arrow-up-down','2026-04-20 18:16:52','2026-04-23 12:23:32');
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
  `request_type` enum('CONTACT','VIEWING') COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preferred_viewing_time` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('CANCELLED','IN_PROGRESS','PENDING','RESOLVED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin_note` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `handled_by` bigint DEFAULT NULL,
  `handled_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_contact_requests_handler` (`handled_by`),
  KEY `idx_contact_requests_user_status` (`user_id`,`status`),
  KEY `idx_contact_requests_room_created` (`room_id`,`created_at`),
  KEY `idx_contact_requests_status` (`status`),
  KEY `idx_contact_requests_room_status_created` (`room_id`,`status`,`created_at`),
  CONSTRAINT `fk_contact_requests_handler` FOREIGN KEY (`handled_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_contact_requests_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
  CONSTRAINT `fk_contact_requests_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_requests`
--

LOCK TABLES `contact_requests` WRITE;
/*!40000 ALTER TABLE `contact_requests` DISABLE KEYS */;
INSERT INTO `contact_requests` VALUES (1,1,2,'VIEWING','Nguyễn Thị An','an.nguyen@example.com','0911222333','Em muốn xem phòng gần Đại học Quốc gia vào cuối tuần này nếu còn trống.','Thứ 7 sau 14:00','PENDING',NULL,NULL,NULL,'2026-04-12 02:00:00','2026-04-12 02:00:00'),(2,3,3,'CONTACT','Trần Quốc Bình','binh.tran@example.com','0933444555','Tôi cần thêm thông tin về phí dịch vụ và hợp đồng thuê khu Bách Khoa.','Buổi tối sau 19:00','IN_PROGRESS','Đã gọi lại và hẹn gửi thêm thông tin hợp đồng.',1,'2026-04-13 03:30:00','2026-04-13 01:15:00','2026-04-13 03:30:00'),(3,4,2,'VIEWING','Nguyễn Thị An','an.nguyen@example.com','0911222333','Cho em đặt lịch xem phòng sau giờ học ở khu Chùa Bộc.','Thứ 2 lúc 18:30','RESOLVED','Đã xem phòng và khách đang cân nhắc.',1,'2026-04-15 11:45:00','2026-04-14 04:20:00','2026-04-15 11:45:00'),(4,6,3,'CONTACT','Trần Quốc Bình','binh.tran@example.com','0933444555','Tôi quan tâm studio gần Mỹ Đình có ban công, vui lòng liên hệ sau giờ làm.','Ngày thường sau 18:30','PENDING',NULL,1,'2026-04-23 10:04:30','2026-04-16 00:50:00','2026-04-23 10:04:30'),(5,4,2,'VIEWING','Nguyễn Thị An','an.nguyen@example.com','0911222333',NULL,NULL,'IN_PROGRESS','Đã liên hệ',1,'2026-04-24 04:47:25','2026-04-24 04:22:48','2026-04-24 04:47:25'),(6,7,4,'VIEWING','Đào Công Minh','daocongminh204@gmail.com','0963096887','Mình muốn xem nhà','Chiều ngày 25-4','PENDING','Từ chối',1,'2026-04-27 11:56:19','2026-04-24 05:17:12','2026-04-27 11:56:19'),(7,7,4,'VIEWING','Nguyen Thi Man','daocongminh204@gmail.com','0963096887','em quan tam phong nay','sang chu nhat','RESOLVED','Từ chối',1,'2026-04-27 11:55:34','2026-04-25 03:01:39','2026-04-27 11:55:34');
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `districts`
--

LOCK TABLES `districts` WRITE;
/*!40000 ALTER TABLE `districts` DISABLE KEYS */;
INSERT INTO `districts` VALUES (1,'Cầu Giấy','cau-giay','Hà Nội',1,'2026-04-20 18:16:52','2026-04-23 12:35:20'),(2,'Đống Đa','dong-da','Hà Nội',2,'2026-04-20 18:16:52','2026-04-23 12:35:20'),(3,'Hai Bà Trưng','hai-ba-trung','Hà Nội',3,'2026-04-20 18:16:52','2026-04-23 12:35:20'),(4,'Thanh Xuân','thanh-xuan','Hà Nội',4,'2026-04-20 18:16:52','2026-04-23 12:35:20'),(5,'Nam Từ Liêm','nam-tu-liem','Hà Nội',5,'2026-04-20 18:16:52','2026-04-23 12:35:20');
/*!40000 ALTER TABLE `districts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `message` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` bit(1) NOT NULL,
  `target_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('NEW_CONTACT_REQUEST') COLLATE utf8mb4_unicode_ci NOT NULL,
  `recipient_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqqnsjxlwleyjbxlmm213jaj3f` (`recipient_id`),
  CONSTRAINT `FKqqnsjxlwleyjbxlmm213jaj3f` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'2026-04-25 10:01:39.053479','Nguyen Thi Man quan tâm phòng \"Nhà trọ 5 tầng Minh Khai\"',_binary '','/host/customers','Yêu cầu liên hệ mới','NEW_CONTACT_REQUEST',2),(2,'2026-04-25 10:01:39.089852','Nguyen Thi Man quan tâm phòng \"Nhà trọ 5 tầng Minh Khai\"',_binary '','/admin/contact-requests','Yêu cầu liên hệ mới','NEW_CONTACT_REQUEST',1);
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
  `created_at` datetime(6) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `revoked_at` datetime(6) DEFAULT NULL,
  `token_hash` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKo2mlirhldriil2y7krapq4frt` (`token_hash`),
  KEY `FK1lih5y2npsf8u5o3vhdb9y0os` (`user_id`),
  CONSTRAINT `FK1lih5y2npsf8u5o3vhdb9y0os` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,'2026-04-27 18:20:05.748247','2026-05-04 18:20:05.748247','2026-04-27 18:21:25.073743','5e2da5e2f46a47cd1dd88eb23fb6cda95a6345ca556114566baa3ea6c19a0b30',1),(2,'2026-04-27 18:21:31.429811','2026-05-04 18:21:31.429812','2026-04-27 18:28:41.859371','01eb8b95c95b9e31066b81c57a7f5ddd51fc0f128ce7ac78c289e02d635abf20',2),(3,'2026-04-27 18:28:47.601401','2026-05-04 18:28:47.601401','2026-04-27 20:01:19.112889','f6577ef03f324debb2dbafe7e9fd6eb66b93d4b8b8db3a56b30ddf316218a88f',1),(4,'2026-04-27 20:21:44.386161','2026-05-04 20:21:44.370387','2026-04-28 10:44:46.240211','6ab65ef1c901584a75ad7bc5de0537dbdbd28a8808345573ea1476802f921833',4);
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
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'USER','Người dùng thông thường','2026-04-20 18:16:52','2026-04-23 12:23:32'),(2,'ADMIN','Quản trị viên hệ thống','2026-04-20 18:16:52','2026-04-23 12:23:32');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_amenities`
--

LOCK TABLES `room_amenities` WRITE;
/*!40000 ALTER TABLE `room_amenities` DISABLE KEYS */;
INSERT INTO `room_amenities` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(1,2),(2,2),(3,2),(4,2),(6,2),(7,2),(8,2),(1,3),(2,3),(3,3),(5,3),(6,3),(7,3),(8,3),(1,4),(2,4),(3,4),(4,4),(5,4),(6,4),(7,4),(8,4),(1,5),(4,5),(7,5),(8,5),(2,6),(8,6),(2,7),(3,8),(8,8),(1,9),(5,9),(6,9),(4,11),(6,11),(3,12);
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
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt_text` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_thumbnail` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_room_images_room` (`room_id`,`sort_order`),
  CONSTRAINT `fk_room_images_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_images`
--

LOCK TABLES `room_images` WRITE;
/*!40000 ALTER TABLE `room_images` DISABLE KEYS */;
INSERT INTO `room_images` VALUES (1,1,'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80','Studio gần Đại học Quốc gia Hà Nội - ảnh 1',1,1,'2026-04-20 18:16:52'),(2,1,'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80','Studio gần Đại học Quốc gia Hà Nội - ảnh 2',2,0,'2026-04-20 18:16:52'),(3,2,'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80','Phòng gác lửng gần Đại học Thương mại - ảnh 1',1,1,'2026-04-20 18:16:52'),(4,2,'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80','Phòng gác lửng gần Đại học Thương mại - ảnh 2',2,0,'2026-04-20 18:16:52'),(5,3,'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80','Căn hộ mini gần Bách Khoa - ảnh 1',1,1,'2026-04-20 18:16:52'),(6,3,'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80','Căn hộ mini gần Bách Khoa - ảnh 2',2,0,'2026-04-20 18:16:52'),(7,4,'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80','Phòng trọ gần Học viện Ngân hàng - ảnh 1',1,1,'2026-04-20 18:16:52'),(8,4,'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80','Phòng trọ gần Học viện Ngân hàng - ảnh 2',2,0,'2026-04-20 18:16:52'),(9,5,'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80','Phòng mini gần Đại học Hà Nội - ảnh 1',1,1,'2026-04-20 18:16:52'),(10,5,'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80','Phòng mini gần Đại học Hà Nội - ảnh 2',2,0,'2026-04-20 18:16:52'),(11,6,'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80','Studio Mỹ Đình - ảnh 1',1,1,'2026-04-20 18:16:52'),(12,6,'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80','Studio Mỹ Đình - ảnh 2',2,0,'2026-04-20 18:16:52'),(16,7,'http://localhost:8080/uploads/rooms/d6c05cd9-db61-45c3-a597-fd5f553ad01f.jpg','Nhà trọ 5 tầng Minh Khai. HBT',1,1,'2026-04-26 09:55:54'),(17,8,'/uploads/rooms/1a40c5de-9190-403a-8223-4e163587de0c.jpg','Cho HỘ GIA ĐÌNH thuê nhà riêng, ở lâu dài',1,0,'2026-04-27 11:28:28'),(18,8,'/uploads/rooms/3c1d858b-2d1e-4d1a-b08c-69a58f7a50f5.jpg','Cho HỘ GIA ĐÌNH thuê nhà riêng, ở lâu dài',2,0,'2026-04-27 11:28:28'),(19,8,'/uploads/rooms/16006640-e314-4f3a-b024-51c8e750717d.jpg','Cho HỘ GIA ĐÌNH thuê nhà riêng, ở lâu dài',3,1,'2026-04-27 11:28:28');
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
  `admin_note` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `details` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `handled_at` datetime(6) DEFAULT NULL,
  `reason` enum('DUPLICATE','INAPPROPRIATE','OTHER','SCAM','UNAVAILABLE','WRONG_INFO') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('DISMISSED','NEW','RESOLVED','REVIEWING') COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `handled_by` bigint DEFAULT NULL,
  `reporter_id` bigint NOT NULL,
  `room_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKk6a255epukl1m9nlfuvvb48kj` (`handled_by`),
  KEY `FKsy9xvwlmde6ew7q4afxorn6eg` (`reporter_id`),
  KEY `FKmst4583gg8wn5cdf56kdabfic` (`room_id`),
  CONSTRAINT `FKk6a255epukl1m9nlfuvvb48kj` FOREIGN KEY (`handled_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FKmst4583gg8wn5cdf56kdabfic` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
  CONSTRAINT `FKsy9xvwlmde6ew7q4afxorn6eg` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_reports`
--

LOCK TABLES `room_reports` WRITE;
/*!40000 ALTER TABLE `room_reports` DISABLE KEYS */;
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
  `title` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `district_id` bigint NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `area` decimal(6,2) NOT NULL,
  `contact_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('AVAILABLE','FULL','HIDDEN') COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `created_by` bigint DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `listing_code` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `UKw87n059o27vwuvpev5mpcyp1` (`listing_code`),
  KEY `fk_rooms_district` (`district_id`),
  KEY `idx_rooms_listing` (`status`,`district_id`,`price`),
  KEY `idx_rooms_area` (`area`),
  KEY `idx_rooms_featured` (`is_featured`),
  KEY `idx_rooms_created_at` (`created_at`),
  KEY `idx_rooms_owner_status_created` (`created_by`,`status`,`created_at`),
  CONSTRAINT `fk_rooms_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_rooms_district` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'Studio gần Đại học Quốc gia Hà Nội, nội thất cơ bản','studio-gan-dai-hoc-quoc-gia-ha-noi-noi-that-co-ban','Phòng studio phù hợp sinh viên khu Đại học Quốc gia Hà Nội, không gian gọn gàng, có cửa sổ lớn, giữ xe trong nhà và khu vực an ninh.','15 Xuân Thủy, Dịch Vọng Hậu',1,4300000.00,22.00,'Nguyễn Văn Hùng','0909001001','AVAILABLE','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',1,1,'2026-04-05 01:30:00','2026-04-05 01:30:00',NULL,NULL,NULL),(2,'Phòng gác lửng gần Đại học Thương mại, giờ giấc tự do','phong-gac-lung-gan-dai-hoc-thuong-mai-gio-giac-tu-do','Phòng trọ có gác lửng, phù hợp 2 người ở, được nấu ăn, giữ xe miễn phí và thuận tiện đi Đại học Thương mại, Đại học Quốc gia.','32 Hồ Tùng Mậu, Mai Dịch',5,3800000.00,24.00,'Lê Thị Mai','0909001002','AVAILABLE','https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',1,1,'2026-04-06 02:00:00','2026-04-06 02:00:00',NULL,NULL,NULL),(3,'Căn hộ mini gần Bách Khoa - Kinh tế Quốc dân','can-ho-mini-gan-bach-khoa-kinh-te-quoc-dan','Căn hộ mini sạch sẽ, có thang máy, máy giặt chung, phù hợp sinh viên Bách Khoa, Kinh tế Quốc dân và người đi làm cần không gian yên tĩnh.','18 Tạ Quang Bửu, Bách Khoa',3,5200000.00,28.00,'Phạm Quốc Tuấn','0909001003','AVAILABLE','https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',0,1,'2026-04-07 03:10:00','2026-04-07 03:10:00',NULL,NULL,NULL),(4,'Phòng trọ gần Học viện Ngân hàng và Đại học Thủy lợi','phong-tro-gan-hoc-vien-ngan-hang-va-dai-hoc-thuy-loi','Phòng trọ đẹp, dân cư ổn định, có ban công nhỏ, phù hợp sinh viên Học viện Ngân hàng, Đại học Thủy lợi và người đi làm khu Đống Đa.','86 Chùa Bộc, Quang Trung',2,3900000.00,23.00,'Võ Minh Châu','0909001004','AVAILABLE','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',1,1,'2026-04-08 06:20:00','2026-04-08 06:20:00',NULL,NULL,NULL),(5,'Phòng mini gần Đại học Hà Nội, giá hợp lý','phong-mini-gan-dai-hoc-ha-noi-gia-hop-ly','Phòng mini giá hợp lý cho sinh viên Đại học Hà Nội và người đi làm khu Thanh Xuân, có máy lạnh, WC riêng và giao thông thuận tiện.','45 Nguyễn Trãi, Thanh Xuân Trung',4,3400000.00,18.00,'Trần Thị Hoa','0909001005','FULL','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',0,1,'2026-04-09 07:45:00','2026-04-09 07:45:00',NULL,NULL,NULL),(6,'Studio ban công gần Mỹ Đình và Đại học FPT','studio-ban-cong-gan-my-dinh-va-dai-hoc-fpt','Phòng studio thiết kế hiện đại, có ban công và cửa sổ lớn, phù hợp người cần không gian sống thông thoáng gần Mỹ Đình, Nam Từ Liêm.','27 Hàm Nghi, Mỹ Đình 2',5,5500000.00,30.00,'Nguyễn Văn Hùng','0909001001','FULL','https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',1,1,'2026-04-10 09:00:00','2026-04-27 11:20:39',NULL,NULL,NULL),(7,'Nhà trọ 5 tầng Minh Khai. HBT','nha-tro-5-tang-minh-khai-hbt','Gần các trường Đại học NEU, HUBT,..','76, Minh Khai, HBT, Hà Nội',3,3000000.00,10.00,'Nguyễn Thị An','0963096887','AVAILABLE','http://localhost:8080/uploads/rooms/d6c05cd9-db61-45c3-a597-fd5f553ad01f.jpg',0,2,'2026-04-24 04:11:23','2026-04-27 11:57:28',NULL,NULL,NULL),(8,'Cho HỘ GIA ĐÌNH thuê nhà riêng, ở lâu dài','cho-ho-gia-inh-thue-nha-rieng-o-lau-dai','Nhà riêng, sạch sẻ, gọn gàng phù hợp cho hộ gia đình thuê ở lâu dài:\n1. 4 tầng 1 tum, 5 phòng ngủ + 4 nhà vệ sinh + Bếp + Phòng để xe, có thệ thống PCCC\n2. Ô tô đỗ sát vách nhà\n3. Đường trước nhà thông ra Hồ điều hoà, cách Hồ điều hoà 15m\n4. Trong nhà đã lắp 4 điều hoà, 4 bình nóng lạnh, quạt trần, 1 máy giặt 10kg, 1 tủ lạnh','Số 14/1 ngõ 318 Bùi Xương Trạch, Phường Khương Đình, TP Hà Nội, Đường Bùi Xương Trạch, Phường Khương Đình, Quận Thanh Xuân, Hà Nội',4,12000000.00,32.00,'Nguyễn Thị An','0847564353','AVAILABLE','/uploads/rooms/16006640-e314-4f3a-b024-51c8e750717d.jpg',0,2,'2026-04-27 11:28:28','2026-04-27 11:57:44',NULL,NULL,NULL);
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
  `created_at` datetime(6) NOT NULL,
  `room_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK58x2l3kbylh8f9f2wrd62c767` (`user_id`,`room_id`),
  KEY `FKo5x2psxhy4yqdbj5j6kcdoy39` (`room_id`),
  CONSTRAINT `FKnyvrqc2yrmifvvu5p1utmuuus` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKo5x2psxhy4yqdbj5j6kcdoy39` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_rooms`
--

LOCK TABLES `saved_rooms` WRITE;
/*!40000 ALTER TABLE `saved_rooms` DISABLE KEYS */;
INSERT INTO `saved_rooms` VALUES (1,'2026-04-24 19:09:39.266385',6,4),(2,'2026-04-27 18:58:45.770719',8,1);
/*!40000 ALTER TABLE `saved_rooms` ENABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (2,1),(3,1),(4,1),(1,2);
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
  `full_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `host_bio` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','LOCKED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','admin@homi.vn','$2b$12$SeZgndXr8fLCE7w5qVpJb.BncibcCLniGtMVyPT5SeVPomi/n10pC','0909000000','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80','Cầu Giấy, Hà Nội','Quản lý các bài đăng phòng trọ mẫu của hệ thống Homi.','ACTIVE',1,'2026-04-01 01:00:00','2026-04-24 04:46:58'),(2,'Nguyễn Thị An','an.nguyen@example.com','$2b$12$Ot3.iK9gYFUlkXqX6UvzuO6iGk8gsMudLZToFNFyyPSLgFyPsY9W6','0911222333','https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80','Đống Đa, Hà Nội','Có phòng trọ nhỏ gần các trường đại học, ưu tiên sinh viên thuê dài hạn.','ACTIVE',1,'2026-04-02 02:15:00','2026-04-23 15:34:15'),(3,'Trần Quốc Bình','binh.tran@example.com','$2b$12$Ot3.iK9gYFUlkXqX6UvzuO6iGk8gsMudLZToFNFyyPSLgFyPsY9W6','0933444555','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80','Hai Bà Trưng, Hà Nội','Người đăng tin cá nhân, phản hồi nhanh các yêu cầu xem phòng.','ACTIVE',1,'2026-04-03 03:20:00','2026-04-23 15:34:15'),(4,'Đào Công Minh','daocongminh204@gmail.com','$2a$10$aP8khMYHaMTflRWnfXpDxu6NKRh2kJAMYydpUpT8Fd4XotWtbPoHe','0963096887','/uploads/rooms/44236df7-75de-41b4-b306-c5f2b17da76b.png',NULL,NULL,'ACTIVE',1,'2026-04-24 04:59:57','2026-04-24 05:16:07');
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

-- Dump completed on 2026-05-03  3:21:32
