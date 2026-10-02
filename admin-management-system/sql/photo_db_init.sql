mysqldump : mysqldump: [Warning] Using a password on the command line interface can be insecure.
所在位置 行:1 字符: 93
+ ... _init.sql"; mysqldump -uroot -p123456 --default-character-set=utf8mb4 ...
+                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (mysqldump: [War...an be insecure.:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: photo_db
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Current Database: `photo_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `photo_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `photo_db`;

--
-- Table structure for table `admin_log`
--

DROP TABLE IF EXISTS `admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `admin_id` int DEFAULT NULL COMMENT '操作人ID',
  `admin_username` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '操作人账号',
  `module_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '模块：gameNav游戏导航 / photo图片管理',
  `operate_type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '操作类型：add新增 / edit编辑 / del删除',
  `target_id` int DEFAULT NULL COMMENT '被修改数据id',
  `content` text COLLATE utf8mb4_unicode_ci COMMENT '操作详情',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'pending' COMMENT 'pending待审核 pass通过 reject驳回',
  `audit_admin_id` int DEFAULT NULL COMMENT '审核人ID',
  `audit_admin_username` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '审核人账号',
  `audit_time` datetime DEFAULT NULL COMMENT '审核时间',
  `audit_note` text COLLATE utf8mb4_unicode_ci COMMENT '审核备注',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_log`
--

LOCK TABLES `admin_log` WRITE;
/*!40000 ALTER TABLE `admin_log` DISABLE KEYS */;
INSERT INTO `admin_log` VALUES (1,30,'admin','gameNav','edit',43,'申请编辑游戏【诛仙世界123】，原记录ID:42','pass',30,'admin','2026-09-29 16:45:43','','2026-09-29 16:10:24'),(2,30,'admin','gameNav','del',44,'申请删除游戏记录ID:42','pass',30,'admin','2026-09-29 16:45:34','','2026-09-29 16:11:01'),(3,30,'admin','gameNav','edit',45,'申请编辑游戏【诛仙世界123】，原记录ID:1','pass',30,'admin','2026-09-29 16:46:53','','2026-09-29 16:46:05'),(4,30,'admin','gameNav','edit',46,'申请编辑游戏【诛仙世界1234】，原记录ID:1','reject',30,'admin','2026-09-29 17:01:27','','2026-09-29 17:01:22'),(5,30,'admin','gameNav','edit',47,'申请编辑游戏【诛仙世界12345】，原记录ID:1','pass',30,'admin','2026-09-29 17:01:41','','2026-09-29 17:01:38'),(6,30,'admin','gameNav','edit',48,'申请编辑游戏【诛仙世界】，原记录ID:1','pass',30,'admin','2026-09-29 17:01:57','','2026-09-29 17:01:52'),(7,33,'admin1','gameNav','edit',49,'申请编辑游戏【完美游戏社区21】，原记录ID:41','reject',32,'321','2026-09-29 18:16:33','','2026-09-29 18:11:19'),(8,32,'321','gameNav','del',50,'申请删除游戏记录ID:49','pass',32,'321','2026-09-29 18:16:54','','2026-09-29 18:16:50'),(9,33,'admin1','gameNav','edit',51,'申请编辑游戏【完美游戏社区213】，原记录ID:49','pass',30,'admin','2026-09-29 18:19:26','','2026-09-29 18:19:15'),(10,30,'admin','gameNav','edit',52,'申请编辑游戏【完美游戏社区】，原记录ID:49','pass',30,'admin','2026-09-29 18:19:51','','2026-09-29 18:19:47'),(11,30,'admin','gameNav','add',53,'新增游戏【1234】分类：客户端游戏','pass',30,'admin','2026-10-01 22:58:09','','2026-10-01 22:58:05'),(12,32,'321','gameNav','edit',54,'申请编辑游戏【1234】，原记录ID:53','pass',32,'321','2026-10-01 23:03:12','','2026-10-01 23:03:08'),(13,33,'admin1','gameNav','edit',55,'申请编辑游戏【1234】，原记录ID:53','reject',30,'admin','2026-10-01 23:03:41','','2026-10-01 23:03:34');
/*!40000 ALTER TABLE `admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_user`
--

DROP TABLE IF EXISTS `admin_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `role` varchar(20) DEFAULT NULL,
  `nickname` varchar(100) DEFAULT NULL,
  `sort` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_user`
--

LOCK TABLES `admin_user` WRITE;
/*!40000 ALTER TABLE `admin_user` DISABLE KEYS */;
INSERT INTO `admin_user` VALUES (30,'admin','123456','admin','超级管理员',3),(32,'321','321','admin','321',4),(33,'admin1','123456','user','123',3);
/*!40000 ALTER TABLE `admin_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_log`
--

DROP TABLE IF EXISTS `audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '类型:gameNav 游戏导航',
  `target_id` int NOT NULL COMMENT '被审核数据id',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '审核结果 pass / reject',
  `audit_admin_id` int NOT NULL COMMENT '操作管理员id',
  `audit_admin_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '操作管理员名称',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_log`
--

LOCK TABLES `audit_log` WRITE;
/*!40000 ALTER TABLE `audit_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_nav`
--

DROP TABLE IF EXISTS `game_nav`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_nav` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `category` varchar(50) NOT NULL COMMENT '分类：客户端游戏/手机游戏/游戏平台',
  `game_name` varchar(100) NOT NULL COMMENT '游戏名称',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `status` varchar(20) NOT NULL DEFAULT 'pending' COMMENT '状态 pending待审核 pass已通过 reject驳回',
  `link` varchar(255) DEFAULT NULL COMMENT '跳转链接',
  `target_id` int DEFAULT NULL COMMENT '审核用关联ID',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_nav`
--

LOCK TABLES `game_nav` WRITE;
/*!40000 ALTER TABLE `game_nav` DISABLE KEYS */;
INSERT INTO `game_nav` VALUES (1,'客户端游戏','诛仙世界',1,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 17:01:57'),(2,'客户端游戏','完美世界经典版',2,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(3,'客户端游戏','笑傲江湖',3,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(4,'客户端游戏','武林外传',4,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(5,'客户端游戏','梦幻诛仙2',5,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(6,'客户端游戏','诛仙',6,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(7,'客户端游戏','DOTA2',7,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(8,'客户端游戏','完美世界2国际版',8,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(9,'客户端游戏','神魔大陆2',9,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(10,'客户端游戏','赤壁',10,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(11,'客户端游戏','神鬼传奇',11,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(12,'客户端游戏','神鬼世界',12,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(13,'客户端游戏','神雕侠侣',13,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(14,'客户端游戏','CSGO',14,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(15,'手机游戏','异环',1,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(16,'手机游戏','乖离性百万亚瑟王：环',2,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(17,'手机游戏','女神异闻录：夜幕魅影',3,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(18,'手机游戏','一拳超人：世界',4,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(19,'手机游戏','梦幻新诛仙手游',5,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(20,'手机游戏','黑猫奇闻社',6,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(21,'手机游戏','新诛仙手游',7,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(22,'手机游戏','完美世界：诸神之战',8,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(23,'手机游戏','神雕侠侣手游',9,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(24,'手机游戏','梦间集',10,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(25,'手机游戏','梦间集',11,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(26,'手机游戏','梦间集',12,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(27,'手机游戏','幻塔',13,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(28,'手机游戏','诛仙2',14,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(29,'手机游戏','淡墨水云乡',15,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(30,'手机游戏','天龙八部2：飞龙战天',16,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(31,'手机游戏','我的起源',17,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(32,'手机游戏','非常英雄救世奇缘',18,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(33,'手机游戏','新笑傲江湖手游',19,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(34,'手机游戏','新神魔大陆手游',20,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(35,'手机游戏','战神遗迹',21,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(36,'手机游戏','梦间集',22,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(37,'手机游戏','梦间集',23,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(38,'手机游戏','梦间集',24,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(39,'游戏平台','完美游戏平台',1,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(40,'游戏平台','完美电竞平台',2,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(41,'游戏平台','完美游戏社区',3,'pass',NULL,NULL,'2026-09-29 14:57:49','2026-09-29 14:57:49'),(49,'游戏平台','完美游戏社区',0,'pass','',41,'2026-09-29 18:11:19','2026-09-29 18:19:51'),(53,'客户端游戏','1234',0,'pass','',NULL,'2026-10-01 22:58:05','2026-10-01 22:58:09');
/*!40000 ALTER TABLE `game_nav` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_nav_apply`
--

DROP TABLE IF EXISTS `game_nav_apply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_nav_apply` (
  `id` int NOT NULL AUTO_INCREMENT,
  `operate_type` varchar(20) NOT NULL COMMENT 'add新增 / edit编辑 / del删除',
  `target_id` int DEFAULT NULL COMMENT '原game_nav的id，新增为null',
  `category` varchar(100) DEFAULT NULL,
  `game_name` varchar(100) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_nav_apply`
--

LOCK TABLES `game_nav_apply` WRITE;
/*!40000 ALTER TABLE `game_nav_apply` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_nav_apply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `photo_info`
--

DROP TABLE IF EXISTS `photo_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `photo_info` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `big_title` varchar(255) NOT NULL COMMENT '大标题',
  `small_title` varchar(255) NOT NULL COMMENT '小标题',
  `description` text COMMENT '图片描述文字',
  `img_path` varchar(500) NOT NULL COMMENT '照片路径',
  `img_path2` varchar(500) DEFAULT NULL COMMENT '第二张图片路径',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  `link` varchar(500) DEFAULT '' COMMENT '跳转链接',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photo_info`
--

LOCK TABLES `photo_info` WRITE;
/*!40000 ALTER TABLE `photo_info` DISABLE KEYS */;
INSERT INTO `photo_info` VALUES (7,'异环','超自然都市开放世界1','跃入异常有趣的都市生活','/uploads/1790250764693-wm1.png','/uploads/1790250764693-wmt1.jpg','2026-09-24 19:52:44','2026-09-29 14:33:44','www.baidu.com'),(8,'诛仙世界','首款UE5仙侠MMO端游','纯血MMO端游《诛仙世界》，将于12月19日震撼公测！','/uploads/1790250801933-wm2.png','/uploads/1790250801933-wmt2.jpg','2026-09-24 19:53:21','2026-09-24 19:53:21',''),(9,'幻塔','轻科幻开放世界手游','带上幻想去冒险','/uploads/1790250845745-wm3.png','/uploads/1790250845745-wmt3.jpg','2026-09-24 19:54:05','2026-09-24 19:54:05',''),(10,'梦幻新诛仙手游','诛仙如梦仙侠大世界','《梦幻新诛仙》川魂主题资料片【千面】震撼来袭！免费无级别战灵千面妖姬登场！','/uploads/1790250915215-wm4.png','/uploads/1790250915215-wmt4.jpg','2026-09-24 19:55:15','2026-09-24 19:55:15',''),(11,'诛仙2','超感官拟真仙法战斗','重塑万象法则，再赴青云之巅！','/uploads/1790251122469-wm5.png','/uploads/1790251136240-wmt5.jpg','2026-09-24 19:58:42','2026-09-24 19:58:56',''),(12,'完美世界：诸神之战','经典奇幻修真MMO','经典还原当年完美世界，横竖版自由切换，畅享奇幻修真新体验','/uploads/1790251289422-wm6.png','/uploads/1790251289425-wmt6.jpg','2026-09-24 20:01:29','2026-09-24 20:01:29',''),(13,'天龙八部2：飞龙战天','金庸正版经典武侠创新手游','金庸正版经典武侠创新手游','/uploads/1790251640934-wm7.png','/uploads/1790251640936-wmt7.jpg','2026-09-24 20:07:20','2026-09-24 20:07:20',''),(14,'《诛仙》手游','王者巅峰赛开战！','《诛仙》手游全新版本，劲爽联动百事可乐，助战5V5王者巅峰赛！一起决战青云之巅！','/uploads/1790251767112-wm8.png','/uploads/1790251767113-wmt8.jpg','2026-09-24 20:09:27','2026-09-24 20:09:27',''),(15,'女神异闻录：夜幕魅影','异世界都市冒险JRPG','规则破坏者的协奏曲·序！《女神异闻录：夜幕魅影》2.0主线版本现已开启！','/uploads/1790251874647-wm9.png','/uploads/1790251874648-wmt9.jpg','2026-09-24 20:11:14','2026-09-24 20:11:14',''),(16,'新笑傲江湖','清韵国风国创新武侠','武当·太极流派重制，首届全公平1V1来袭！群雄逐鹿瓜分现金大奖！登陆免费领转职卷轴！','/uploads/1790251924279-wm10.png','/uploads/1790251924280-wmt10.jpg','2026-09-24 20:12:04','2026-09-24 20:12:04',''),(17,'诛仙','经典仙侠端游','情撼九天 一剑诛仙','/uploads/1790252037591-wm11.png','/uploads/1790252037591-wmt11.jpg','2026-09-24 20:13:57','2026-09-24 20:13:57',''),(18,'淡墨水云乡','东方意境模拟经营手游','诗画山河，织造人间','/uploads/1790252086140-wm12.png','/uploads/1790252086141-wmt12.jpg','2026-09-24 20:14:46','2026-09-24 20:14:46',''),(19,'乖离性百万亚瑟王：环','SQEX正版协力打牌RPG','《乖离性百万亚瑟王：环》测试招募火热开启中！','/uploads/1790306103502-wm13.png','/uploads/1790306103504-wmt13.jpg','2026-09-25 11:15:03','2026-09-25 11:15:03',''),(20,'完美游戏社区','完美世界官方福利社区','《完美游戏社区》全面升级，百万福利等你来拿','/uploads/1790306150570-wm14.png','/uploads/1790306150571-wmt14.jpg','2026-09-25 11:15:50','2026-09-25 11:15:50','');
/*!40000 ALTER TABLE `photo_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'photo_db'
--

--
-- Dumping routines for database 'photo_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-02 14:44:07
