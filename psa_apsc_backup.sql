/*!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.6.18-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: psa
-- ------------------------------------------------------
-- Server version	10.6.18-MariaDB-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `psa`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `psa` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci */;

USE `psa`;

--
-- Table structure for table `APSApplicationItems`
--

DROP TABLE IF EXISTS `APSApplicationItems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `APSApplicationItems` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pkg_id` int(10) unsigned NOT NULL DEFAULT 0,
  `license_type_id` int(10) unsigned NOT NULL DEFAULT 0,
  `disabled` enum('false','true') NOT NULL DEFAULT 'false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `license_type_id` (`license_type_id`,`pkg_id`),
  KEY `pkg_id` (`pkg_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `APSApplicationItems`
--

LOCK TABLES `APSApplicationItems` WRITE;
/*!40000 ALTER TABLE `APSApplicationItems` DISABLE KEYS */;
/*!40000 ALTER TABLE `APSApplicationItems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `APSCatalogUpdates`
--

DROP TABLE IF EXISTS `APSCatalogUpdates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `APSCatalogUpdates` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `package_name` varchar(255) DEFAULT NULL,
  `package_version` varchar(30) DEFAULT NULL,
  `package_release` varchar(30) DEFAULT NULL,
  `update_name` varchar(255) DEFAULT NULL,
  `update_version` varchar(30) DEFAULT NULL,
  `update_release` varchar(30) DEFAULT NULL,
  `update_vendor` varchar(255) DEFAULT NULL,
  `update_packager` varchar(255) DEFAULT NULL,
  `received` datetime DEFAULT '1970-01-01 00:00:00',
  `update_type` enum('patch','upgrade') NOT NULL DEFAULT 'patch',
  `recommended` enum('false','true') NOT NULL DEFAULT 'false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `APSCatalogUpdates`
--

LOCK TABLES `APSCatalogUpdates` WRITE;
/*!40000 ALTER TABLE `APSCatalogUpdates` DISABLE KEYS */;
/*!40000 ALTER TABLE `APSCatalogUpdates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `APSClientApplicationItems`
--

DROP TABLE IF EXISTS `APSClientApplicationItems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `APSClientApplicationItems` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `client_id` int(10) unsigned NOT NULL DEFAULT 0,
  `app_item_id` int(10) unsigned NOT NULL DEFAULT 0,
  `instances_limit` int(10) NOT NULL DEFAULT -1,
  `broadcast` enum('false','true') NOT NULL DEFAULT 'false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `client_app_item` (`client_id`,`app_item_id`),
  KEY `client_id` (`client_id`),
  KEY `app_item_id` (`app_item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `APSClientApplicationItems`
--

LOCK TABLES `APSClientApplicationItems` WRITE;
/*!40000 ALTER TABLE `APSClientApplicationItems` DISABLE KEYS */;
/*!40000 ALTER TABLE `APSClientApplicationItems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `APSLicenseTypes`
--

DROP TABLE IF EXISTS `APSLicenseTypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `APSLicenseTypes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `application_name` varchar(255) NOT NULL,
  `application_versions` varchar(255) NOT NULL,
  `application_features` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `license_type_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `license_type_hash` (`license_type_hash`),
  UNIQUE KEY `application_name` (`application_name`,`application_versions`,`application_features`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `APSLicenseTypes`
--

LOCK TABLES `APSLicenseTypes` WRITE;
/*!40000 ALTER TABLE `APSLicenseTypes` DISABLE KEYS */;
/*!40000 ALTER TABLE `APSLicenseTypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `APSLicenses`
--

DROP TABLE IF EXISTS `APSLicenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `APSLicenses` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `license_type_id` int(10) unsigned NOT NULL DEFAULT 0,
  `key_number` varchar(255) NOT NULL,
  `source` text DEFAULT NULL,
  `ka_url` varchar(255) NOT NULL,
  `expiration_date` date DEFAULT NULL,
  `update_date` date DEFAULT NULL,
  `personal` enum('false','true') NOT NULL DEFAULT 'false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_number` (`key_number`),
  KEY `license_type_id` (`license_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `APSLicenses`
--

LOCK TABLES `APSLicenses` WRITE;
/*!40000 ALTER TABLE `APSLicenses` DISABLE KEYS */;
/*!40000 ALTER TABLE `APSLicenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ApiRpcCallsStat`
--

DROP TABLE IF EXISTS `ApiRpcCallsStat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ApiRpcCallsStat` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Version` varchar(7) NOT NULL,
  `Operator` varchar(50) NOT NULL,
  `Command` varchar(50) NOT NULL,
  `Session` varchar(8) NOT NULL DEFAULT '0',
  `FilterName` varchar(50) NOT NULL DEFAULT '0',
  `GroupOperation` int(10) NOT NULL DEFAULT 0,
  `LastExecutionDate` datetime NOT NULL DEFAULT '1970-01-01 00:00:00',
  `Count` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `LogItem` (`Version`,`Operator`,`Command`,`Session`,`FilterName`,`GroupOperation`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ApiRpcCallsStat`
--

LOCK TABLES `ApiRpcCallsStat` WRITE;
/*!40000 ALTER TABLE `ApiRpcCallsStat` DISABLE KEYS */;
INSERT INTO `ApiRpcCallsStat` VALUES (1,'1.6.9.1','webspace','get','admin','',1,'2024-09-11 10:35:28',1),(2,'1.6.9.1','server','get','admin','',0,'2024-10-05 05:07:15',2458),(3,'1.6.9.1','php-handler','get','admin','',1,'2024-10-04 06:32:20',28),(4,'1.6.9.1','ip','get','admin','',0,'2024-10-04 14:44:02',53),(5,'1.6.9.1','php-handler','get','admin','id',0,'2024-10-04 08:24:01',145),(6,'1.6.9.1','mail','get_prefs','admin','site-id',0,'2024-10-04 12:35:19',91),(7,'1.6.9.1','site','get','admin','id',0,'2024-10-05 05:03:02',285),(8,'1.6.9.1','extension','call','admin','',0,'2024-09-19 06:33:48',4),(9,'1.6.9.1','server','get_misc','admin','property',1,'2024-10-04 12:35:19',19),(10,'1.6.9.1','dns','get','admin','site-id',0,'2024-09-19 06:35:21',5),(11,'1.6.9.1','webspace','get','admin','id',0,'2024-09-19 06:33:48',5),(12,'1.6.9.1','certificate','get-pool','admin','domain-name',0,'2024-09-19 06:35:20',2),(13,'1.6.9.1','certificate','install','admin','',0,'2024-09-14 07:46:12',1),(14,'1.6.9.1','mail','get_info','admin','site-id',0,'2024-09-19 04:16:08',1),(15,'1.6.9.1','site','set','admin','id',0,'2024-09-19 06:35:31',2),(16,'1.6.9.1','dns','get_rec','admin','site-id',0,'2024-09-19 06:35:07',1),(17,'1.6.9.1','dns','add_rec','admin','',0,'2024-09-19 06:35:07',1),(18,'1.6.9.1','certificate','update','admin','',0,'2024-09-19 06:35:20',1),(19,'1.6.9.1','mail','set_prefs','admin','site-id',0,'2024-09-19 06:35:21',1);
/*!40000 ALTER TABLE `ApiRpcCallsStat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ApsTokens`
--

DROP TABLE IF EXISTS `ApsTokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ApsTokens` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `subscriptionId` int(10) unsigned NOT NULL,
  `applicationId` varchar(2000) NOT NULL,
  `instanceId` int(10) unsigned DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ApsTokens`
--

LOCK TABLES `ApsTokens` WRITE;
/*!40000 ALTER TABLE `ApsTokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `ApsTokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BackendCache`
--

DROP TABLE IF EXISTS `BackendCache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BackendCache` (
  `key` varchar(128) NOT NULL,
  `data` text NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BackendCache`
--

LOCK TABLES `BackendCache` WRITE;
/*!40000 ALTER TABLE `BackendCache` DISABLE KEYS */;
/*!40000 ALTER TABLE `BackendCache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BackupExcludeFiles`
--

DROP TABLE IF EXISTS `BackupExcludeFiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BackupExcludeFiles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `files` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BackupExcludeFiles`
--

LOCK TABLES `BackupExcludeFiles` WRITE;
/*!40000 ALTER TABLE `BackupExcludeFiles` DISABLE KEYS */;
/*!40000 ALTER TABLE `BackupExcludeFiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BackupsScheduled`
--

DROP TABLE IF EXISTS `BackupsScheduled`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BackupsScheduled` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `obj_id` int(10) unsigned NOT NULL DEFAULT 0,
  `obj_type` enum('server','reseller','client','domain') NOT NULL,
  `repository` enum('local','ext','local-and-ext') NOT NULL DEFAULT 'local',
  `last` datetime DEFAULT NULL,
  `period` int(10) unsigned NOT NULL DEFAULT 0,
  `active` enum('false','true') NOT NULL,
  `processed` enum('false','true') NOT NULL,
  `rotation` int(11) NOT NULL DEFAULT 0,
  `prefix` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `split_size` bigint(20) unsigned NOT NULL DEFAULT 0,
  `suspend` enum('false','true') NOT NULL DEFAULT 'false',
  `with_content` enum('false','true') NOT NULL DEFAULT 'true',
  `backup_day` int(10) unsigned NOT NULL DEFAULT 0,
  `backup_time` varchar(8) NOT NULL DEFAULT '00:00:00',
  `content_type` enum('backup_content_all_at_domain','backup_content_vhost_only','backup_content_mail_only') NOT NULL DEFAULT 'backup_content_all_at_domain',
  `full_backup_period` int(11) unsigned NOT NULL DEFAULT 0,
  `mssql_native_backup` int(1) NOT NULL DEFAULT 1,
  `backupExcludeFilesId` int(10) unsigned DEFAULT NULL,
  `backupExcludeLogs` int(1) NOT NULL DEFAULT 0,
  `remoteStorage` varchar(255) DEFAULT NULL,
  `exclude_mail` int(1) NOT NULL DEFAULT 0,
  `exclude_user_files` int(1) NOT NULL DEFAULT 0,
  `exclude_user_databases` int(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BackupsScheduled`
--

LOCK TABLES `BackupsScheduled` WRITE;
/*!40000 ALTER TABLE `BackupsScheduled` DISABLE KEYS */;
INSERT INTO `BackupsScheduled` VALUES (1,1,'server','local','2024-10-05 00:08:03',86400,'true','false',4,NULL,NULL,0,'false','true',0,'00:00:00','backup_content_all_at_domain',604800,1,NULL,0,NULL,0,0,0);
/*!40000 ALTER TABLE `BackupsScheduled` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BackupsSettings`
--

DROP TABLE IF EXISTS `BackupsSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BackupsSettings` (
  `id` int(10) unsigned DEFAULT NULL,
  `type` enum('domain','client','server') NOT NULL DEFAULT 'domain',
  `param` varchar(255) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  UNIQUE KEY `id` (`id`,`type`,`param`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BackupsSettings`
--

LOCK TABLES `BackupsSettings` WRITE;
/*!40000 ALTER TABLE `BackupsSettings` DISABLE KEYS */;
INSERT INTO `BackupsSettings` VALUES (1,'server','backup_local_setting_last_backup_time','2024-10-05T00:07:07+0000'),(1,'server','backup_local_setting_last_full_backup_time','2024-09-29T00:10:54+0000'),(1,'server','backup_local_setting_last_full_backup_size','39612'),(1,'server','backup_local_setting_last_incremental_backup_time','2024-10-05T00:07:07+0000'),(1,'server','backup_local_setting_last_incremental_backup_size','8457');
/*!40000 ALTER TABLE `BackupsSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BlUpgradeActions`
--

DROP TABLE IF EXISTS `BlUpgradeActions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BlUpgradeActions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `action` varchar(255) NOT NULL,
  `status` enum('new','error','skip','success') NOT NULL DEFAULT 'new',
  `message` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BlUpgradeActions`
--

LOCK TABLES `BlUpgradeActions` WRITE;
/*!40000 ALTER TABLE `BlUpgradeActions` DISABLE KEYS */;
INSERT INTO `BlUpgradeActions` VALUES (1,'Plesk\\Upgrade\\Action_PanelAccess','success',NULL),(2,'Plesk\\Upgrade\\Action_UpgradeExtensions','success',NULL),(3,'Plesk\\Upgrade\\Action_UpgradeExtensions','success',NULL);
/*!40000 ALTER TABLE `BlUpgradeActions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BlUpgrades`
--

DROP TABLE IF EXISTS `BlUpgrades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BlUpgrades` (
  `id` varchar(255) NOT NULL,
  `status` enum('new','fatal','optional','success') NOT NULL DEFAULT 'new',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BlUpgrades`
--

LOCK TABLES `BlUpgrades` WRITE;
/*!40000 ALTER TABLE `BlUpgrades` DISABLE KEYS */;
INSERT INTO `BlUpgrades` VALUES ('2012-01-13-18-56-00','success'),('2012-04-10-14-39-48','success'),('2012-10-01-12-57-27','success'),('2014-11-20-12-30-24','success'),('2015-02-17-03-42-16','success'),('2015-04-17-04-59-48','success'),('2015-04-17-05-14-55','success'),('2015-04-17-05-17-21','success'),('2015-04-17-05-19-33','success'),('2015-06-23-17-35-48','success'),('2015-07-16-13-24-42','success'),('2015-07-21-06-46-01','success'),('2015-07-24-10-25-20','success'),('2015-12-07-06-07-30','success'),('2017-02-16-10-51-31','success'),('2017-07-17-15-42-03','success'),('2017-09-14-10-43-29','success'),('2017-12-06-07-47-38','success'),('2018-07-05-13-59-10','success'),('2018-07-19-09-11-02','success'),('2018-09-04-04-45-30','success'),('2019-02-18-14-09-55','success'),('2019-02-19-12-00-23','success'),('2019-02-21-03-43-42','success'),('2019-04-25-14-46-58','success'),('2019-06-06-01-40-27','success'),('2019-11-11-13-20-40','success'),('2019-12-17-06-50-14','success'),('2020-01-21-06-35-35','success'),('2020-02-11-01-27-43','success'),('2020-03-18-10-49-47','success'),('2020-03-19-17-13-39','success'),('2020-04-17-10-39-36','success'),('2020-05-13-08-59-59','success'),('2020-08-25-03-09-46','success'),('2021-03-01-16-52-12','success'),('2021-09-22-15-20-44','success'),('2023-12-05-12-53-37','success'),('2023-12-06-06-34-07','success'),('2024-05-10-10-00-00','success'),('2024-05-27-21-16-14','success'),('2024-08-13-11-38-24','success');
/*!40000 ALTER TABLE `BlUpgrades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CertificateRepositories`
--

DROP TABLE IF EXISTS `CertificateRepositories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CertificateRepositories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CertificateRepositories`
--

LOCK TABLES `CertificateRepositories` WRITE;
/*!40000 ALTER TABLE `CertificateRepositories` DISABLE KEYS */;
INSERT INTO `CertificateRepositories` VALUES (1),(2);
/*!40000 ALTER TABLE `CertificateRepositories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CliCallsStat`
--

DROP TABLE IF EXISTS `CliCallsStat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CliCallsStat` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `util` varchar(255) NOT NULL,
  `command` varchar(255) NOT NULL,
  `lastExecutionDateTime` datetime NOT NULL DEFAULT '1970-01-01 00:00:00',
  `count` bigint(20) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `utilCommand` (`command`,`util`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CliCallsStat`
--

LOCK TABLES `CliCallsStat` WRITE;
/*!40000 ALTER TABLE `CliCallsStat` DISABLE KEYS */;
INSERT INTO `CliCallsStat` VALUES (1,'admin','get-login-link','2024-09-19 06:12:07',4),(2,'save-installation-info','save','2024-09-11 10:36:26',1),(5,'httpdmng','reload','2024-10-05 00:00:06',44),(9,'scheduled_backup','dump','2024-10-05 00:06:01',21);
/*!40000 ALTER TABLE `CliCallsStat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ClientsTraffic`
--

DROP TABLE IF EXISTS `ClientsTraffic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ClientsTraffic` (
  `cl_id` int(10) unsigned NOT NULL DEFAULT 0,
  `date` date NOT NULL DEFAULT '1970-01-01',
  `http_in` bigint(20) unsigned NOT NULL DEFAULT 0,
  `http_out` bigint(20) unsigned NOT NULL DEFAULT 0,
  `ftp_in` bigint(20) unsigned NOT NULL DEFAULT 0,
  `ftp_out` bigint(20) unsigned NOT NULL DEFAULT 0,
  `smtp_in` bigint(20) unsigned NOT NULL DEFAULT 0,
  `smtp_out` bigint(20) unsigned NOT NULL DEFAULT 0,
  `pop3_imap_in` bigint(20) unsigned NOT NULL DEFAULT 0,
  `pop3_imap_out` bigint(20) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`cl_id`,`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ClientsTraffic`
--

LOCK TABLES `ClientsTraffic` WRITE;
/*!40000 ALTER TABLE `ClientsTraffic` DISABLE KEYS */;
INSERT INTO `ClientsTraffic` VALUES (1,'2024-09-14',0,7163184442,7200,8982,0,0,0,0),(1,'2024-09-15',0,12165817456,0,0,0,0,0,0),(1,'2024-09-16',0,10182159568,196193,1711620,0,0,0,0),(1,'2024-09-17',0,9845635859,34454721573,0,0,0,0,0),(1,'2024-09-18',0,13131193821,0,0,0,0,0,0),(1,'2024-09-19',0,13225663027,2877050729,287103490,3573,0,0,0),(1,'2024-09-20',0,11994271749,612072,2206745,0,0,0,0),(1,'2024-09-21',0,14977783641,2514617,2104906,0,0,0,0),(1,'2024-09-22',0,11460827926,0,0,0,0,0,0),(1,'2024-09-23',0,12942952204,1022973129,2593246,616919,0,0,0),(1,'2024-09-24',0,10706696039,559714,2023058,0,0,0,0),(1,'2024-09-25',0,11918406278,2911162,4597040,6445,0,0,0),(1,'2024-09-26',0,11583950543,1418695,1354801,960629,0,0,0),(1,'2024-09-27',0,14440958299,707265,829618,3296,0,0,0),(1,'2024-09-28',0,14950495045,0,0,0,0,0,0),(1,'2024-09-29',0,10183995609,0,0,0,0,0,0),(1,'2024-09-30',0,12440294861,3291962514,2622733,0,0,0,0),(1,'2024-10-01',0,14041272332,6759572215,3607639,3485795,0,0,0),(1,'2024-10-02',0,17823947702,3266550378,3092047,4523,0,0,0),(1,'2024-10-03',0,17274058539,826535,2492652,0,0,0,0),(1,'2024-10-04',0,3383466518,0,0,3416,0,0,0);
/*!40000 ALTER TABLE `ClientsTraffic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Configurations`
--

DROP TABLE IF EXISTS `Configurations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Configurations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `serviceNodeId` int(10) unsigned NOT NULL DEFAULT 1,
  `file` blob DEFAULT NULL,
  `version` varchar(255) NOT NULL,
  `objectType` varchar(255) NOT NULL,
  `objectId` int(10) unsigned DEFAULT NULL,
  `status` enum('error','generation','ok') NOT NULL DEFAULT 'error',
  `active` enum('false','true') NOT NULL DEFAULT 'true',
  `description` blob DEFAULT NULL,
  `errorFile` blob DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `objectTypeAndId_index` (`objectType`,`objectId`),
  KEY `status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Configurations`
--

LOCK TABLES `Configurations` WRITE;
/*!40000 ALTER TABLE `Configurations` DISABLE KEYS */;
INSERT INTO `Configurations` VALUES (1,'server',1,'/etc/apache2/plesk.conf.d/server.conf','17280235690.52748200','server',NULL,'ok','true',NULL,''),(2,'nginx',1,'/etc/nginx/plesk.conf.d/server.conf','17262883290.83123200','nginxServer',NULL,'ok','true',NULL,''),(3,'domainWebmail',1,'/etc/apache2/plesk.conf.d/webmails/fetishmegastore.com_webmail.conf','17280451690.87904900','domain',1,'ok','true',NULL,''),(4,'nginxDomainWebmail',1,'/etc/nginx/plesk.conf.d/webmails/fetishmegastore.com_webmail.conf','17280451690.88008800','nginxDomain',1,'ok','true',NULL,''),(5,'domainVhost',1,'/var/www/vhosts/system/fetishmegastore.com/conf/httpd.conf','17275049000.36114300','domain',1,'ok','true',NULL,''),(6,'nginxDomainModSecurity',1,'/var/www/vhosts/system/fetishmegastore.com/conf/modsecurity_nginx.conf','17275049000.36514300','nginxDomain',1,'ok','true',NULL,''),(7,'nginxDomainVhost',1,'/var/www/vhosts/system/fetishmegastore.com/conf/nginx.conf','17275049000.36514300','nginxDomain',1,'ok','true',NULL,'');
/*!40000 ALTER TABLE `Configurations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DatabaseCustomHosts`
--

DROP TABLE IF EXISTS `DatabaseCustomHosts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DatabaseCustomHosts` (
  `id` int(10) unsigned NOT NULL,
  `host` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DatabaseCustomHosts`
--

LOCK TABLES `DatabaseCustomHosts` WRITE;
/*!40000 ALTER TABLE `DatabaseCustomHosts` DISABLE KEYS */;
/*!40000 ALTER TABLE `DatabaseCustomHosts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DatabaseServers`
--

DROP TABLE IF EXISTS `DatabaseServers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DatabaseServers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `host` varchar(255) NOT NULL,
  `port` int(10) unsigned DEFAULT NULL,
  `type` enum('mysql','postgresql','mssql') NOT NULL DEFAULT 'mysql',
  `server_version` char(255) DEFAULT NULL,
  `admin_login` char(255) NOT NULL,
  `admin_password` char(255) NOT NULL,
  `parameters_id` int(10) unsigned DEFAULT NULL,
  `last_error` enum('no_error','connection_failed','permission_denied','other_error','credentials_not_set') NOT NULL DEFAULT 'no_error',
  `fork` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `host_port` (`host`,`port`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DatabaseServers`
--

LOCK TABLES `DatabaseServers` WRITE;
/*!40000 ALTER TABLE `DatabaseServers` DISABLE KEYS */;
INSERT INTO `DatabaseServers` VALUES (1,'localhost',3306,'mysql','10.6.18','admin','******',NULL,'no_error','mariadb');
/*!40000 ALTER TABLE `DatabaseServers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DatabaseUserRemoteAccessRules`
--

DROP TABLE IF EXISTS `DatabaseUserRemoteAccessRules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DatabaseUserRemoteAccessRules` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ipAddress` varchar(39) NOT NULL,
  `mask` varchar(15) NOT NULL,
  `type` enum('allow','deny') NOT NULL,
  `databaseUserId` int(10) unsigned NOT NULL,
  `firewallRuleId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DatabaseUserRemoteAccessRules`
--

LOCK TABLES `DatabaseUserRemoteAccessRules` WRITE;
/*!40000 ALTER TABLE `DatabaseUserRemoteAccessRules` DISABLE KEYS */;
/*!40000 ALTER TABLE `DatabaseUserRemoteAccessRules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DomainAliasesParameters`
--

DROP TABLE IF EXISTS `DomainAliasesParameters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DomainAliasesParameters` (
  `aliasId` int(10) unsigned NOT NULL,
  `param` varchar(255) NOT NULL,
  `val` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`aliasId`,`param`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DomainAliasesParameters`
--

LOCK TABLES `DomainAliasesParameters` WRITE;
/*!40000 ALTER TABLE `DomainAliasesParameters` DISABLE KEYS */;
/*!40000 ALTER TABLE `DomainAliasesParameters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DomainKeys`
--

DROP TABLE IF EXISTS `DomainKeys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DomainKeys` (
  `domainServiceId` int(10) unsigned NOT NULL,
  `selector` varchar(255) NOT NULL,
  `privateKey` blob DEFAULT NULL,
  `publicKey` blob DEFAULT NULL,
  PRIMARY KEY (`domainServiceId`,`selector`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DomainKeys`
--

LOCK TABLES `DomainKeys` WRITE;
/*!40000 ALTER TABLE `DomainKeys` DISABLE KEYS */;
INSERT INTO `DomainKeys` VALUES (2,'default','','');
/*!40000 ALTER TABLE `DomainKeys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DomainOutgoingMessagesPeaks`
--

DROP TABLE IF EXISTS `DomainOutgoingMessagesPeaks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DomainOutgoingMessagesPeaks` (
  `domainId` int(10) unsigned NOT NULL,
  `beginDate` datetime NOT NULL,
  `endDate` datetime DEFAULT NULL,
  `rejected` bigint(20) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`domainId`,`beginDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DomainOutgoingMessagesPeaks`
--

LOCK TABLES `DomainOutgoingMessagesPeaks` WRITE;
/*!40000 ALTER TABLE `DomainOutgoingMessagesPeaks` DISABLE KEYS */;
/*!40000 ALTER TABLE `DomainOutgoingMessagesPeaks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DomainOutgoingMessagesStats`
--

DROP TABLE IF EXISTS `DomainOutgoingMessagesStats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DomainOutgoingMessagesStats` (
  `domainId` int(10) unsigned NOT NULL,
  `collectDate` datetime NOT NULL,
  `limitValue` bigint(20) NOT NULL DEFAULT -1,
  `passed` bigint(20) unsigned NOT NULL DEFAULT 0,
  `rejected` bigint(20) unsigned NOT NULL DEFAULT 0,
  `passed_fixed` bigint(20) unsigned NOT NULL DEFAULT 0,
  `rejected_verified` bigint(20) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`domainId`,`collectDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DomainOutgoingMessagesStats`
--

LOCK TABLES `DomainOutgoingMessagesStats` WRITE;
/*!40000 ALTER TABLE `DomainOutgoingMessagesStats` DISABLE KEYS */;
/*!40000 ALTER TABLE `DomainOutgoingMessagesStats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DomainServices`
--

DROP TABLE IF EXISTS `DomainServices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DomainServices` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `dom_id` int(10) unsigned NOT NULL DEFAULT 0,
  `type` enum('mail','tomcat','maillists','web') DEFAULT NULL,
  `status` bigint(20) NOT NULL DEFAULT 0,
  `parameters_id` int(10) unsigned NOT NULL DEFAULT 0,
  `ipCollectionId` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `dom_id` (`dom_id`),
  KEY `parameters_id` (`parameters_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DomainServices`
--

LOCK TABLES `DomainServices` WRITE;
/*!40000 ALTER TABLE `DomainServices` DISABLE KEYS */;
INSERT INTO `DomainServices` VALUES (1,1,'web',0,0,1),(2,1,'mail',0,1,2);
/*!40000 ALTER TABLE `DomainServices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DomainsTraffic`
--

DROP TABLE IF EXISTS `DomainsTraffic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DomainsTraffic` (
  `dom_id` int(10) unsigned NOT NULL DEFAULT 0,
  `date` date NOT NULL DEFAULT '1970-01-01',
  `http_in` bigint(20) unsigned NOT NULL DEFAULT 0,
  `http_out` bigint(20) unsigned NOT NULL DEFAULT 0,
  `ftp_in` bigint(20) unsigned NOT NULL DEFAULT 0,
  `ftp_out` bigint(20) unsigned NOT NULL DEFAULT 0,
  `smtp_in` bigint(20) unsigned NOT NULL DEFAULT 0,
  `smtp_out` bigint(20) unsigned NOT NULL DEFAULT 0,
  `pop3_imap_in` bigint(20) unsigned NOT NULL DEFAULT 0,
  `pop3_imap_out` bigint(20) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`dom_id`,`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DomainsTraffic`
--

LOCK TABLES `DomainsTraffic` WRITE;
/*!40000 ALTER TABLE `DomainsTraffic` DISABLE KEYS */;
INSERT INTO `DomainsTraffic` VALUES (1,'2024-09-14',0,7163184442,7200,8982,0,0,0,0),(1,'2024-09-15',0,12165817456,0,0,0,0,0,0),(1,'2024-09-16',0,10182159568,196193,1711620,0,0,0,0),(1,'2024-09-17',0,9845635859,34454721573,0,0,0,0,0),(1,'2024-09-18',0,13131193821,0,0,0,0,0,0),(1,'2024-09-19',0,13225663027,2877050729,287103490,3573,0,0,0),(1,'2024-09-20',0,11994271749,612072,2206745,0,0,0,0),(1,'2024-09-21',0,14977783641,2514617,2104906,0,0,0,0),(1,'2024-09-22',0,11460827926,0,0,0,0,0,0),(1,'2024-09-23',0,12942952204,1022973129,2593246,616919,0,0,0),(1,'2024-09-24',0,10706696039,559714,2023058,0,0,0,0),(1,'2024-09-25',0,11918406278,2911162,4597040,6445,0,0,0),(1,'2024-09-26',0,11583950543,1418695,1354801,960629,0,0,0),(1,'2024-09-27',0,14440958299,707265,829618,3296,0,0,0),(1,'2024-09-28',0,14950495045,0,0,0,0,0,0),(1,'2024-09-29',0,10183995609,0,0,0,0,0,0),(1,'2024-09-30',0,12440294861,3291962514,2622733,0,0,0,0),(1,'2024-10-01',0,14041272332,6759572215,3607639,3485795,0,0,0),(1,'2024-10-02',0,17823947702,3266550378,3092047,4523,0,0,0),(1,'2024-10-03',0,17274058539,826535,2492652,0,0,0,0),(1,'2024-10-04',0,3383466518,0,0,3416,0,0,0);
/*!40000 ALTER TABLE `DomainsTraffic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DynamicIpSecurity`
--

DROP TABLE IF EXISTS `DynamicIpSecurity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DynamicIpSecurity` (
  `dom_id` int(10) unsigned NOT NULL,
  `isDenyByConcurrentRequests` int(11) NOT NULL DEFAULT 0,
  `maxConcurrentRequests` int(10) unsigned NOT NULL DEFAULT 5,
  `isDenyByRequestRate` int(11) NOT NULL DEFAULT 0,
  `maxRequests` int(10) unsigned NOT NULL DEFAULT 20,
  `requestInterval` int(10) unsigned NOT NULL DEFAULT 200,
  PRIMARY KEY (`dom_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DynamicIpSecurity`
--

LOCK TABLES `DynamicIpSecurity` WRITE;
/*!40000 ALTER TABLE `DynamicIpSecurity` DISABLE KEYS */;
/*!40000 ALTER TABLE `DynamicIpSecurity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EmailActivations`
--

DROP TABLE IF EXISTS `EmailActivations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `EmailActivations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `hash` varchar(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT '1970-01-01 00:00:00',
  `clientId` int(11) unsigned NOT NULL DEFAULT 0,
  `smbUserId` int(11) unsigned NOT NULL DEFAULT 0,
  `adminAliasId` int(11) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `hash` (`hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EmailActivations`
--

LOCK TABLES `EmailActivations` WRITE;
/*!40000 ALTER TABLE `EmailActivations` DISABLE KEYS */;
/*!40000 ALTER TABLE `EmailActivations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Fail2BanIps`
--

DROP TABLE IF EXISTS `Fail2BanIps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Fail2BanIps` (
  `jail` varchar(20) NOT NULL,
  `address` varchar(240) NOT NULL,
  PRIMARY KEY (`jail`,`address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Fail2BanIps`
--

LOCK TABLES `Fail2BanIps` WRITE;
/*!40000 ALTER TABLE `Fail2BanIps` DISABLE KEYS */;
/*!40000 ALTER TABLE `Fail2BanIps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GL_remote_domains`
--

DROP TABLE IF EXISTS `GL_remote_domains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `GL_remote_domains` (
  `serviceNodeId` int(11) NOT NULL DEFAULT 1,
  `domain` varchar(255) NOT NULL,
  `type` enum('black','white') NOT NULL DEFAULT 'black',
  PRIMARY KEY (`serviceNodeId`,`domain`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GL_remote_domains`
--

LOCK TABLES `GL_remote_domains` WRITE;
/*!40000 ALTER TABLE `GL_remote_domains` DISABLE KEYS */;
INSERT INTO `GL_remote_domains` VALUES (1,'*.office365.com','white'),(1,'*.outlook.com','white'),(1,'*.outlook.office.com','white'),(1,'*facebook.com','white'),(1,'*google.com','white'),(1,'*mail.ru','white'),(1,'*parallels.com','white'),(1,'*plesk.com','white'),(1,'*rambler.ru','white'),(1,'*yahoo.com','white'),(1,'*yandex.ru','white'),(1,'*[0-9][0-9]-[0-9][0-9]-[0-9][0-9]*','black'),(1,'*[0-9][0-9].[0-9][0-9].[0-9][0-9]*','black'),(1,'*[0-9][0-9][0-9]-[0-9][0-9][0-9]-[0-9][0-9][0-9]*','black'),(1,'*[0-9][0-9][0-9].[0-9][0-9][0-9].[0-9[0-9]][0-9]*','black'),(1,'dsl|broadband|hsd','black'),(1,'dynamic|static|ppp|dyn-ip|dial-up','black');
/*!40000 ALTER TABLE `GL_remote_domains` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GL_settings`
--

DROP TABLE IF EXISTS `GL_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `GL_settings` (
  `serviceNodeId` int(11) NOT NULL DEFAULT 1,
  `param` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`serviceNodeId`,`param`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GL_settings`
--

LOCK TABLES `GL_settings` WRITE;
/*!40000 ALTER TABLE `GL_settings` DISABLE KEYS */;
INSERT INTO `GL_settings` VALUES (1,'enabled','false'),(1,'expireInterval','51840'),(1,'greyInterval','5'),(1,'penaltyEnabled','false'),(1,'penaltyInterval','2');
/*!40000 ALTER TABLE `GL_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IP_Addresses`
--

DROP TABLE IF EXISTS `IP_Addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `IP_Addresses` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(39) NOT NULL,
  `mask` varchar(15) NOT NULL DEFAULT '255.255.255.0',
  `iface` varchar(255) NOT NULL,
  `ssl_certificate_id` int(10) unsigned NOT NULL DEFAULT 0,
  `default_domain_id` int(10) unsigned NOT NULL DEFAULT 0,
  `ftps` enum('false','true') NOT NULL DEFAULT 'false',
  `status` bigint(20) unsigned NOT NULL DEFAULT 0,
  `serviceNodeId` int(10) unsigned NOT NULL DEFAULT 1,
  `public_ip_address` varchar(39) DEFAULT NULL,
  `main` enum('false','true') NOT NULL DEFAULT 'false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ip_address` (`ip_address`),
  KEY `ssl_certificate_id` (`ssl_certificate_id`),
  KEY `default_domain_id` (`default_domain_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IP_Addresses`
--

LOCK TABLES `IP_Addresses` WRITE;
/*!40000 ALTER TABLE `IP_Addresses` DISABLE KEYS */;
INSERT INTO `IP_Addresses` VALUES (1,'95.211.107.87','255.255.255.240','eno1',2,0,'false',0,1,NULL,'true');
/*!40000 ALTER TABLE `IP_Addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IisAppPoolDomains`
--

DROP TABLE IF EXISTS `IisAppPoolDomains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `IisAppPoolDomains` (
  `domainId` int(10) unsigned NOT NULL,
  `poolId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`domainId`),
  KEY `poolId` (`poolId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IisAppPoolDomains`
--

LOCK TABLES `IisAppPoolDomains` WRITE;
/*!40000 ALTER TABLE `IisAppPoolDomains` DISABLE KEYS */;
/*!40000 ALTER TABLE `IisAppPoolDomains` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IisAppPools`
--

DROP TABLE IF EXISTS `IisAppPools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `IisAppPools` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `serviceNodeId` int(10) unsigned NOT NULL DEFAULT 1,
  `ownerType` enum('client','domain') NOT NULL DEFAULT 'client',
  `ownerId` int(10) unsigned NOT NULL,
  `identity` varchar(20) NOT NULL,
  `isStarted` int(11) NOT NULL DEFAULT 1,
  `cpuLimit` int(11) NOT NULL DEFAULT -1,
  `cpuLimitAction` enum('NoAction','KillW3wp','Throttle','ThrottleUnderLoad') NOT NULL DEFAULT 'NoAction',
  `cpuLimitInterval` int(10) unsigned NOT NULL DEFAULT 5,
  `maxProcesses` int(10) unsigned NOT NULL DEFAULT 1,
  `idleTimeout` int(10) unsigned NOT NULL DEFAULT 5,
  `idleTimeoutAction` enum('Terminate','Suspend') NOT NULL DEFAULT 'Terminate',
  `recyclingByTime` int(11) NOT NULL DEFAULT 1740,
  `recyclingByRequests` int(11) NOT NULL DEFAULT -1,
  `recyclingByVirtualMemory` bigint(11) NOT NULL DEFAULT -1,
  `recyclingByPrivateMemory` bigint(11) NOT NULL DEFAULT -1,
  `managedPipelineMode` enum('Classic','Integrated') NOT NULL DEFAULT 'Integrated',
  `externalId` varchar(255) DEFAULT NULL,
  `enable32bitAppOnWin64` int(1) NOT NULL DEFAULT 1,
  `loadUserProfile` int(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ownerId` (`serviceNodeId`,`ownerType`,`ownerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IisAppPools`
--

LOCK TABLES `IisAppPools` WRITE;
/*!40000 ALTER TABLE `IisAppPools` DISABLE KEYS */;
/*!40000 ALTER TABLE `IisAppPools` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IisAppPoolsPolicy`
--

DROP TABLE IF EXISTS `IisAppPoolsPolicy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `IisAppPoolsPolicy` (
  `serviceNodeId` int(10) unsigned NOT NULL DEFAULT 1,
  `mode` enum('shared','dedicated','mixed') NOT NULL DEFAULT 'mixed',
  PRIMARY KEY (`serviceNodeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IisAppPoolsPolicy`
--

LOCK TABLES `IisAppPoolsPolicy` WRITE;
/*!40000 ALTER TABLE `IisAppPoolsPolicy` DISABLE KEYS */;
INSERT INTO `IisAppPoolsPolicy` VALUES (1,'mixed');
/*!40000 ALTER TABLE `IisAppPoolsPolicy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IpAddressesCollections`
--

DROP TABLE IF EXISTS `IpAddressesCollections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `IpAddressesCollections` (
  `ipCollectionId` int(10) unsigned NOT NULL,
  `ipAddressId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ipCollectionId`,`ipAddressId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IpAddressesCollections`
--

LOCK TABLES `IpAddressesCollections` WRITE;
/*!40000 ALTER TABLE `IpAddressesCollections` DISABLE KEYS */;
INSERT INTO `IpAddressesCollections` VALUES (1,1),(2,1);
/*!40000 ALTER TABLE `IpAddressesCollections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IpCollections`
--

DROP TABLE IF EXISTS `IpCollections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `IpCollections` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IpCollections`
--

LOCK TABLES `IpCollections` WRITE;
/*!40000 ALTER TABLE `IpCollections` DISABLE KEYS */;
INSERT INTO `IpCollections` VALUES (1),(2);
/*!40000 ALTER TABLE `IpCollections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Limits`
--

DROP TABLE IF EXISTS `Limits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Limits` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `limit_name` varchar(255) NOT NULL,
  `value` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`,`limit_name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Limits`
--

LOCK TABLES `Limits` WRITE;
/*!40000 ALTER TABLE `Limits` DISABLE KEYS */;
INSERT INTO `Limits` VALUES (1,'disk_space',-1),(1,'disk_space_soft',-1),(1,'expiration',-1),(1,'expiration_soft',-1),(1,'ext_limit_wp_toolkit_smart_update_instances',-1),(1,'ext_limit_wp_toolkit_virtual_patches_instances',-1),(1,'ext_limit_wp_toolkit_wp_backups',-1),(1,'ext_limit_wp_toolkit_wp_instances',-1),(1,'ext_limit_xovi_max_keywords',-1),(1,'max_box',-1),(1,'max_db',-1),(1,'max_dom_aliases',-1),(1,'max_maillists',-1),(1,'max_mn',-1),(1,'max_site',-1),(1,'max_subdom',-1),(1,'max_subftp_users',-1),(1,'max_traffic',-1),(1,'max_traffic_soft',-1),(1,'max_wu',-1),(1,'mbox_quota',-1);
/*!40000 ALTER TABLE `Limits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LimitsReservation`
--

DROP TABLE IF EXISTS `LimitsReservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LimitsReservation` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `collectionRef` varchar(128) NOT NULL,
  `limitName` varchar(255) NOT NULL,
  `value` bigint(20) DEFAULT NULL,
  `expiration` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `collection` (`collectionRef`,`limitName`),
  KEY `expiration` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LimitsReservation`
--

LOCK TABLES `LimitsReservation` WRITE;
/*!40000 ALTER TABLE `LimitsReservation` DISABLE KEYS */;
/*!40000 ALTER TABLE `LimitsReservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Logos`
--

DROP TABLE IF EXISTS `Logos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Logos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `fake` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Logos`
--

LOCK TABLES `Logos` WRITE;
/*!40000 ALTER TABLE `Logos` DISABLE KEYS */;
/*!40000 ALTER TABLE `Logos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MailLists`
--

DROP TABLE IF EXISTS `MailLists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MailLists` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `dom_id` int(10) unsigned NOT NULL DEFAULT 0,
  `name` varchar(255) NOT NULL,
  `status` bigint(20) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `dom_id` (`dom_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MailLists`
--

LOCK TABLES `MailLists` WRITE;
/*!40000 ALTER TABLE `MailLists` DISABLE KEYS */;
/*!40000 ALTER TABLE `MailLists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MailMessagesStat`
--

DROP TABLE IF EXISTS `MailMessagesStat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MailMessagesStat` (
  `date` date NOT NULL DEFAULT '1970-01-01',
  `sent` bigint(20) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MailMessagesStat`
--

LOCK TABLES `MailMessagesStat` WRITE;
/*!40000 ALTER TABLE `MailMessagesStat` DISABLE KEYS */;
/*!40000 ALTER TABLE `MailMessagesStat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MailOutgoingMessagesPeaks`
--

DROP TABLE IF EXISTS `MailOutgoingMessagesPeaks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MailOutgoingMessagesPeaks` (
  `mailId` int(10) unsigned NOT NULL,
  `beginDate` datetime NOT NULL,
  `endDate` datetime DEFAULT NULL,
  `rejected` bigint(20) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`mailId`,`beginDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MailOutgoingMessagesPeaks`
--

LOCK TABLES `MailOutgoingMessagesPeaks` WRITE;
/*!40000 ALTER TABLE `MailOutgoingMessagesPeaks` DISABLE KEYS */;
/*!40000 ALTER TABLE `MailOutgoingMessagesPeaks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MailOutgoingMessagesStats`
--

DROP TABLE IF EXISTS `MailOutgoingMessagesStats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MailOutgoingMessagesStats` (
  `mailId` int(10) unsigned NOT NULL,
  `collectDate` datetime NOT NULL,
  `limitValue` bigint(20) NOT NULL DEFAULT -1,
  `passed` bigint(20) unsigned NOT NULL DEFAULT 0,
  `rejected` bigint(20) unsigned NOT NULL DEFAULT 0,
  `passed_fixed` bigint(20) unsigned NOT NULL DEFAULT 0,
  `rejected_verified` bigint(20) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`mailId`,`collectDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MailOutgoingMessagesStats`
--

LOCK TABLES `MailOutgoingMessagesStats` WRITE;
/*!40000 ALTER TABLE `MailOutgoingMessagesStats` DISABLE KEYS */;
/*!40000 ALTER TABLE `MailOutgoingMessagesStats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ModuleSettings`
--

DROP TABLE IF EXISTS `ModuleSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ModuleSettings` (
  `module_id` int(10) unsigned NOT NULL DEFAULT 0,
  `name` varchar(255) NOT NULL,
  `value` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`module_id`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ModuleSettings`
--

LOCK TABLES `ModuleSettings` WRITE;
/*!40000 ALTER TABLE `ModuleSettings` DISABLE KEYS */;
INSERT INTO `ModuleSettings` VALUES (3,'serviceAvailable','1'),(3,'serviceErrno','0'),(3,'serviceError',''),(3,'showPricesVAT',''),(3,'vatPreferencesProcessed','1'),(3,'vatShowPopover','none'),(4,'curlErrorCode','0'),(4,'genericNotification--360Monitoring-v3-displayed','true'),(4,'genericNotification--le-shortening-v2-displayed','true'),(4,'genericNotification--SitejetTest-v4-displayed','true'),(4,'unavailableMailPorts-checked','true'),(5,'installExtension_laravel','1'),(5,'installExtension_nodejs','1'),(5,'rolloutSitejetExtensionStatusCompleted','1'),(6,'key_exists','false'),(6,'supported_plesk_versions','[\"18.0.63\",\"18.0.64\"]'),(8,'gitmanImported','true'),(9,'detachedInstancesCount','0'),(9,'foundInstancesCount','0'),(9,'instancesAutoUpdateDuration','0'),(9,'instancesAutoUpdateStartedAtTimestamp','1728020341'),(9,'localServerId','fb41bf15-17e3-4ce5-a0dc-3048ecd7ebb7'),(9,'remotePluginServerId','f76e13a4-4f34-4d6c-949d-d1ae8a3666bb'),(9,'sendReportAfter','1728137327'),(9,'virtualPatchesLastCheckDate','1728056642'),(9,'vulnerabilityDatabaseEncodedIndicatorPhrase','$AES-128-CBC$azqlpDvIjVXVImetTnP4Hw==$012MNFVRO3JsK0K9hA4CE4PeeQ6uuimL5Ry0o6B6py/uZ2uX6MNJaQ2m7uZxUEFPj8CzhSROUZ24M5+ZHYP+LBEaNK67pGhzxtGmUNm6i+lePKhZbyRKt4xNpdtJAu4jaBQcXFFrGvWvZ7POVs3wy5K8tI2l2cJAjedYIc9lldQ='),(9,'vulnerabilityDatabaseLastUpdateTimestamp','1728099209'),(9,'wptInstallationId','75f06f23-e386-4310-a292-cec9470b72d6'),(10,'backup-schedule-in-progress',''),(10,'http2-enable-in-progress',''),(10,'statistics__feed_service','{\"retrieved\":{\"date\":\"2024-10-04T10:00:01+00:00\",\"serviceUrl\":\"https:\\/\\/advisor.plesk.com\\/\",\"group\":\"default-group\"}}'),(10,'system-auto-update-turn-on-in-progress',''),(12,'ra_auto_tools_update_hour','6'),(12,'ra_auto_tools_update_minute','17'),(12,'ra_dom_auto_scan','12'),(12,'ra_dow_auto_scan','0'),(12,'ra_hour_auto_scan','6'),(12,'ra_last_successful_tools_update','1728023540'),(12,'ra_max_possible_antivirus_mem','1024'),(12,'ra_max_possible_worker_count','4'),(12,'ra_send_stats_minute','31'),(13,'common-challenge-dir','enabled'),(14,'lastReportDatetimeServer','1728053101'),(14,'secure-panel-email','cyber-media@gmx.net'),(14,'secure-panel-hostname','s10860938.dedi.leaseweb.net'),(14,'statistics-csr-count','2'),(18,'lastMailJournalCursor','s=55f13eb46beb48c2a1ef5bef4bc0d89d;i=82fcb;b=47375a9d7ef14b2dac2a734551758dd2;m=13fcee280b1;t=623b2fe5e6f3b;x=f0d2aada74c583ad'),(18,'lastReboot','1726727974'),(18,'mailServerName','postfix'),(18,'rotateScheduledTaskId','0x14313f821057331e25d7c3696851bafa'),(18,'scheduledTaskId','0xc7d2bc3489ad734bfa91bcccf58d470a'),(22,'service_name','\"systemd-timesync\"'),(25,'handlers','[{\"enabled\":true,\"installed\":true,\"version\":\"22.9.0\",\"fullVersion\":\"22.9.0\",\"path\":\"\\/opt\\/plesk\\/node\\/22\\/bin\\/node\",\"npmPath\":\"\\/opt\\/plesk\\/node\\/22\\/bin\\/npm\",\"yarnPath\":\"\\/opt\\/plesk\\/node\\/22\\/bin\\/yarn\",\"domainsCount\":0},{\"enabled\":true,\"installed\":true,\"version\":\"16.20.2\",\"fullVersion\":\"16.20.2\",\"path\":\"\\/opt\\/plesk\\/node\\/16\\/bin\\/node\",\"npmPath\":\"\\/opt\\/plesk\\/node\\/16\\/bin\\/npm\",\"yarnPath\":\"\\/opt\\/plesk\\/node\\/16\\/bin\\/yarn\",\"domainsCount\":0},{\"enabled\":true,\"installed\":true,\"version\":\"18.20.4\",\"fullVersion\":\"18.20.4\",\"path\":\"\\/opt\\/plesk\\/node\\/18\\/bin\\/node\",\"npmPath\":\"\\/opt\\/plesk\\/node\\/18\\/bin\\/npm\",\"yarnPath\":\"\\/opt\\/plesk\\/node\\/18\\/bin\\/yarn\",\"domainsCount\":0},{\"enabled\":true,\"installed\":true,\"version\":\"20.18.0\",\"fullVersion\":\"20.18.0\",\"path\":\"\\/opt\\/plesk\\/node\\/20\\/bin\\/node\",\"npmPath\":\"\\/opt\\/plesk\\/node\\/20\\/bin\\/npm\",\"yarnPath\":\"\\/opt\\/plesk\\/node\\/20\\/bin\\/yarn\",\"domainsCount\":0}]'),(25,'possibleToInstallHandlers','[]'),(27,'activated','false'),(27,'kolab-release',''),(27,'kolab-version','16.15.8'),(27,'pc-support',''),(27,'permission-default','1'),(27,'system-id','32934276-14cf-4060-a5a9-dd67c3a1b8cf');
/*!40000 ALTER TABLE `ModuleSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Modules`
--

DROP TABLE IF EXISTS `Modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Modules` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `packname` varchar(255) NOT NULL,
  `display_name` varchar(255) NOT NULL,
  `version` varchar(30) NOT NULL,
  `release` int(10) unsigned NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `icon` varchar(255) NOT NULL,
  `plesk_max_version` varchar(30) DEFAULT NULL,
  `status` enum('true','false') NOT NULL DEFAULT 'true',
  `hidden` int(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Modules`
--

LOCK TABLES `Modules` WRITE;
/*!40000 ALTER TABLE `Modules` DISABLE KEYS */;
INSERT INTO `Modules` VALUES (1,'configurations-troubleshooter','plesk-config-troubleshooter','Webserver Configurations Troubleshooter','',20000,'A tool for investigation and correction of possible errors in web servers configurations.','',NULL,'true',0),(2,'rest-api','','Plesk RESTful API','2.3.0',3560,'Plesk RESTful API','','','true',1),(3,'catalog','','Extensions Catalog','1.17.10',1375,'Extensions Catalog','','','true',1),(4,'notifier','','Notifier','1.6.17',3614,'This extension helps you to stay up-to-date with urgent notifications from Plesk team.','','','true',1),(5,'galileo','','Galileo','1.5.17',3736,'','','','true',1),(6,'platform360','','Platform360','1.10.3',1564,'Plesk-side integration with Platform360.','','','true',1),(7,'performance-booster','','Performance Booster','1.1.12',4050,'An extension that helps to optimize sites hosted on Plesk','','','true',1),(8,'git','','Git','2.5.3',26,'Deploy your sites and web apps in Plesk from your local or remote git repositories. Integration with GitHub and Bitbucket is also available.','','','true',0),(9,'wp-toolkit','','WP Toolkit','6.5.3',8751,'WP Toolkit is a powerful WordPress management tool that allows you to mass manage and secure your WordPress sites, plugins and themes.','','','true',0),(10,'advisor','','Advisor','1.10.1',1443,'A step-by-step guide on conforming the best practices regarding security and performance of the server and hosted websites.','','','true',0),(11,'xovi','','SEO Toolkit','1.1.21',3727,'SEO Toolkit gives insights about current sites ranking in search engines, social media reach, comparison to main competitors and advice with expert tips how to optimize the sites for more awareness / visitors.','','','true',0),(12,'revisium-antivirus','','ImunifyAV','2.13.3',1,'Intelligent antivirus and security monitoring tool for websites with one-click automatic malware cleanup, domains reputation monitoring and blacklist status check.','','','true',0),(13,'sslit','','SSL It!','1.15.5',4063,'With SSL It! you can do all of the following in a single interface (which replaces the usual “SSL/TLS Certificates” interface):\n\nPurchase, install, and renew certificates from various CAs.\nSecure your domain, webmail, the \"www\" subdomain for the domain, a','','','true',0),(14,'letsencrypt','','Let\'s Encrypt','3.2.8',3078,'Let\'s Encrypt is a certificate authority (CA) that issues free SSL/TLS certificates you can use to secure your websites.','','','true',0),(15,'repair-kit','','Repair Kit','1.3.8',3238,'Repair Kit - a graphical interface for plesk repair utility.','','','true',0),(16,'composer','','PHP Composer','1.3.1',3051,'Use PHP Composer without SSH access','','','true',0),(17,'monitoring','','Monitoring','2.9.8',1399,'Monitoring (former Advanced Monitoring) monitors your server metrics and displays them as visually appealing graphs.','','','true',0),(18,'log-browser','','Log Browser','1.9.4',1637,'Access the logs to check and troubleshoot the system and mail services.','','','true',0),(19,'ssh-terminal','','SSH Terminal','1.3.8',111,'Access the server from Plesk via a secure web-based SSH client. Available to both the Plesk administrator and subscription owners.','','','true',0),(20,'site-import','','Site Import','1.8.9',1525,'Import your website or mail account hosted on a different server into Plesk. Migrate content from servers running both Linux and Windows, or even from servers that do not have Plesk installed. Importing websites and mail accounts has never been so easy an','','','true',0),(21,'plesk-sitejet','','Sitejet Builder','1.1.3',3764,'Sitejet Builder is a seamlessly integrated, free, and beginner-friendly low-code/no-code site builder and editor for Plesk.','','','true',0),(22,'ntp-timesync','','NTP Timesync','1.3.2',656,'Extension that enables and configures time synchronization over Network Time Protocol','','','true',0),(23,'mfa','','Multi-Factor Authentication (MFA)','1.0.3',937,'Multi-factor authentication with a one-time passcode generated by Google Authenticator or another MFA\n    app.\n  ','','','true',0),(24,'laravel','','Laravel Toolkit','1.4.11',699,'Manage Laravel applications running on your Plesk server.','','','true',0),(25,'nodejs','','Node.js Toolkit','2.3.15',3990,'Node.js is an open-source, cross-platform runtime environment for developing server-side Web applications written in JavaScript. The extension enables you to deploy Node.js apps, start/stop/restart them, install NPM packages, edit config files and more.','','','true',0),(26,'ssh-keys','','SSH Keys Manager','1.2.2',10,'Extension provides UI for management of SSH keys.','','','true',0),(27,'kolab','','Plesk Premium Email, powered by Kolab','16.15.8',0,'Provide a wider range of advanced mail and collaboration services to your customers with Plesk Premium Email, powered by Kolab.','','','true',0);
/*!40000 ALTER TABLE `Modules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notes`
--

DROP TABLE IF EXISTS `Notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Notes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `text` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notes`
--

LOCK TABLES `Notes` WRITE;
/*!40000 ALTER TABLE `Notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `Notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notifications`
--

DROP TABLE IF EXISTS `Notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Notifications` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `send2admin` varchar(1) NOT NULL,
  `send2reseller` varchar(1) DEFAULT NULL,
  `send2client` varchar(1) NOT NULL,
  `send2email` varchar(1) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subj` varchar(255) DEFAULT NULL,
  `note_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `note_id` (`note_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notifications`
--

LOCK TABLES `Notifications` WRITE;
/*!40000 ALTER TABLE `Notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `Notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PackageUpdateLocks`
--

DROP TABLE IF EXISTS `PackageUpdateLocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PackageUpdateLocks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `serviceNodeId` int(10) unsigned NOT NULL,
  `package` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `package` (`serviceNodeId`,`package`),
  KEY `serviceNodeId` (`serviceNodeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PackageUpdateLocks`
--

LOCK TABLES `PackageUpdateLocks` WRITE;
/*!40000 ALTER TABLE `PackageUpdateLocks` DISABLE KEYS */;
/*!40000 ALTER TABLE `PackageUpdateLocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PackageUpdateNotifications`
--

DROP TABLE IF EXISTS `PackageUpdateNotifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PackageUpdateNotifications` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `serviceNodeId` int(10) unsigned NOT NULL,
  `eventDate` datetime NOT NULL DEFAULT '1970-01-01 00:00:00',
  `notificationSent` int(1) NOT NULL DEFAULT 0,
  `data` mediumtext DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `eventDate` (`serviceNodeId`,`eventDate`),
  KEY `serviceNodeId` (`serviceNodeId`),
  KEY `notificationSent` (`notificationSent`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PackageUpdateNotifications`
--

LOCK TABLES `PackageUpdateNotifications` WRITE;
/*!40000 ALTER TABLE `PackageUpdateNotifications` DISABLE KEYS */;
INSERT INTO `PackageUpdateNotifications` VALUES (1,1,'2024-09-12 06:25:35',0,'{\"available\":[],\"success\":[],\"failed\":[]}'),(2,1,'2024-09-13 06:26:15',0,'{\"available\":[],\"success\":[],\"failed\":[]}'),(3,1,'2024-09-14 06:25:29',0,'{\"available\":[],\"success\":[],\"failed\":[]}'),(4,1,'2024-09-15 06:25:26',0,'{\"available\":[],\"success\":[],\"failed\":[]}'),(5,1,'2024-09-16 06:25:27',0,'{\"available\":[],\"success\":[],\"failed\":[]}'),(6,1,'2024-09-17 06:26:23',1,'{\"available\":{\"curl\":{\"name\":\"curl\",\"version_from\":\"7.81.0-1ubuntu1.17\",\"version_to\":\"7.81.0-1ubuntu1.18\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"libcurl3-gnutls\":{\"name\":\"libcurl3-gnutls\",\"version_from\":\"7.81.0-1ubuntu1.17\",\"version_to\":\"7.81.0-1ubuntu1.18\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"libcurl4\":{\"name\":\"libcurl4\",\"version_from\":\"7.81.0-1ubuntu1.17\",\"version_to\":\"7.81.0-1ubuntu1.18\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"libpython3.10\":{\"name\":\"libpython3.10\",\"version_from\":\"3.10.12-1~22.04.5\",\"version_to\":\"3.10.12-1~22.04.6\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"libpython3.10-minimal\":{\"name\":\"libpython3.10-minimal\",\"version_from\":\"3.10.12-1~22.04.5\",\"version_to\":\"3.10.12-1~22.04.6\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"libpython3.10-stdlib\":{\"name\":\"libpython3.10-stdlib\",\"version_from\":\"3.10.12-1~22.04.5\",\"version_to\":\"3.10.12-1~22.04.6\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"python3-update-manager\":{\"name\":\"python3-update-manager\",\"version_from\":\"1:22.04.20\",\"version_to\":\"1:22.04.21\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"python3.10\":{\"name\":\"python3.10\",\"version_from\":\"3.10.12-1~22.04.5\",\"version_to\":\"3.10.12-1~22.04.6\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"python3.10-minimal\":{\"name\":\"python3.10-minimal\",\"version_from\":\"3.10.12-1~22.04.5\",\"version_to\":\"3.10.12-1~22.04.6\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"update-manager-core\":{\"name\":\"update-manager-core\",\"version_from\":\"1:22.04.20\",\"version_to\":\"1:22.04.21\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"}},\"success\":{\"curl\":{\"name\":\"curl\",\"version_from\":\"7.81.0-1ubuntu1.17\",\"version_to\":\"7.81.0-1ubuntu1.18\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"libcurl3-gnutls\":{\"name\":\"libcurl3-gnutls\",\"version_from\":\"7.81.0-1ubuntu1.17\",\"version_to\":\"7.81.0-1ubuntu1.18\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"libcurl4\":{\"name\":\"libcurl4\",\"version_from\":\"7.81.0-1ubuntu1.17\",\"version_to\":\"7.81.0-1ubuntu1.18\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"libpython3.10\":{\"name\":\"libpython3.10\",\"version_from\":\"3.10.12-1~22.04.5\",\"version_to\":\"3.10.12-1~22.04.6\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"libpython3.10-minimal\":{\"name\":\"libpython3.10-minimal\",\"version_from\":\"3.10.12-1~22.04.5\",\"version_to\":\"3.10.12-1~22.04.6\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"libpython3.10-stdlib\":{\"name\":\"libpython3.10-stdlib\",\"version_from\":\"3.10.12-1~22.04.5\",\"version_to\":\"3.10.12-1~22.04.6\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"python3-update-manager\":{\"name\":\"python3-update-manager\",\"version_from\":\"1:22.04.20\",\"version_to\":\"1:22.04.21\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"python3.10\":{\"name\":\"python3.10\",\"version_from\":\"3.10.12-1~22.04.5\",\"version_to\":\"3.10.12-1~22.04.6\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"python3.10-minimal\":{\"name\":\"python3.10-minimal\",\"version_from\":\"3.10.12-1~22.04.5\",\"version_to\":\"3.10.12-1~22.04.6\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"update-manager-core\":{\"name\":\"update-manager-core\",\"version_from\":\"1:22.04.20\",\"version_to\":\"1:22.04.21\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"}},\"failed\":[]}'),(7,1,'2024-09-18 06:27:16',1,'{\"available\":{\"libexpat1\":{\"name\":\"libexpat1\",\"version_from\":\"2.4.7-1ubuntu0.3\",\"version_to\":\"2.4.7-1ubuntu0.4\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"}},\"success\":{\"libexpat1\":{\"name\":\"libexpat1\",\"version_from\":\"2.4.7-1ubuntu0.3\",\"version_to\":\"2.4.7-1ubuntu0.4\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"}},\"failed\":[]}'),(8,1,'2024-09-19 06:25:41',0,'{\"available\":{\"apparmor\":{\"name\":\"apparmor\",\"version_from\":\"3.0.4-2ubuntu2.3build2\",\"version_to\":\"3.0.4-2ubuntu2.4\",\"repo_from\":\"Ubuntu for jammy-security by Ubuntu\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"libapparmor1\":{\"name\":\"libapparmor1\",\"version_from\":\"3.0.4-2ubuntu2.3build2\",\"version_to\":\"3.0.4-2ubuntu2.4\",\"repo_from\":\"Ubuntu for jammy-security by Ubuntu\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"}},\"success\":{\"apparmor\":{\"name\":\"apparmor\",\"version_from\":\"3.0.4-2ubuntu2.3build2\",\"version_to\":\"3.0.4-2ubuntu2.4\",\"repo_from\":\"Ubuntu for jammy-security by Ubuntu\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"libapparmor1\":{\"name\":\"libapparmor1\",\"version_from\":\"3.0.4-2ubuntu2.3build2\",\"version_to\":\"3.0.4-2ubuntu2.4\",\"repo_from\":\"Ubuntu for jammy-security by Ubuntu\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"}},\"failed\":[]}'),(9,1,'2024-09-20 06:25:49',1,'{\"available\":{\"libmm-glib0\":{\"name\":\"libmm-glib0\",\"version_from\":\"1.20.0-1~ubuntu22.04.3\",\"version_to\":\"1.20.0-1~ubuntu22.04.4\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"modemmanager\":{\"name\":\"modemmanager\",\"version_from\":\"1.20.0-1~ubuntu22.04.3\",\"version_to\":\"1.20.0-1~ubuntu22.04.4\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"}},\"success\":{\"libmm-glib0\":{\"name\":\"libmm-glib0\",\"version_from\":\"1.20.0-1~ubuntu22.04.3\",\"version_to\":\"1.20.0-1~ubuntu22.04.4\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"modemmanager\":{\"name\":\"modemmanager\",\"version_from\":\"1.20.0-1~ubuntu22.04.3\",\"version_to\":\"1.20.0-1~ubuntu22.04.4\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"}},\"failed\":[]}'),(10,1,'2024-09-21 06:25:30',1,'{\"available\":{\"ubuntu-advantage-tools\":{\"name\":\"ubuntu-advantage-tools\",\"version_from\":\"33.2~22.04\",\"version_to\":\"34~22.04\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"ubuntu-pro-client\":{\"name\":\"ubuntu-pro-client\",\"version_from\":\"33.2~22.04\",\"version_to\":\"34~22.04\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"ubuntu-pro-client-l10n\":{\"name\":\"ubuntu-pro-client-l10n\",\"version_from\":\"33.2~22.04\",\"version_to\":\"34~22.04\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"}},\"success\":{\"ubuntu-advantage-tools\":{\"name\":\"ubuntu-advantage-tools\",\"version_from\":\"33.2~22.04\",\"version_to\":\"34~22.04\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"ubuntu-pro-client\":{\"name\":\"ubuntu-pro-client\",\"version_from\":\"33.2~22.04\",\"version_to\":\"34~22.04\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"ubuntu-pro-client-l10n\":{\"name\":\"ubuntu-pro-client-l10n\",\"version_from\":\"33.2~22.04\",\"version_to\":\"34~22.04\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"}},\"failed\":[]}'),(11,1,'2024-09-22 06:25:27',1,'{\"available\":{\"libpcap0.8\":{\"name\":\"libpcap0.8\",\"version_from\":\"1.10.1-4build1\",\"version_to\":\"1.10.1-4ubuntu1.22.04.1\",\"repo_from\":\"Ubuntu for jammy by Ubuntu\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"}},\"success\":{\"libpcap0.8\":{\"name\":\"libpcap0.8\",\"version_from\":\"1.10.1-4build1\",\"version_to\":\"1.10.1-4ubuntu1.22.04.1\",\"repo_from\":\"Ubuntu for jammy by Ubuntu\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"}},\"failed\":[]}'),(12,1,'2024-09-23 06:25:29',0,'{\"available\":[],\"success\":[],\"failed\":[]}'),(13,1,'2024-09-24 06:25:38',0,'{\"available\":[],\"success\":[],\"failed\":[]}'),(14,1,'2024-09-25 06:25:56',1,'{\"available\":{\"intel-microcode\":{\"name\":\"intel-microcode\",\"version_from\":\"3.20240813.0ubuntu0.22.04.2\",\"version_to\":\"3.20240910.0ubuntu0.22.04.1\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"ubuntu-minimal\":{\"name\":\"ubuntu-minimal\",\"version_from\":\"1.481.3\",\"version_to\":\"1.481.4\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"ubuntu-standard\":{\"name\":\"ubuntu-standard\",\"version_from\":\"1.481.3\",\"version_to\":\"1.481.4\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"}},\"success\":{\"intel-microcode\":{\"name\":\"intel-microcode\",\"version_from\":\"3.20240813.0ubuntu0.22.04.2\",\"version_to\":\"3.20240910.0ubuntu0.22.04.1\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"ubuntu-minimal\":{\"name\":\"ubuntu-minimal\",\"version_from\":\"1.481.3\",\"version_to\":\"1.481.4\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"ubuntu-standard\":{\"name\":\"ubuntu-standard\",\"version_from\":\"1.481.3\",\"version_to\":\"1.481.4\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"}},\"failed\":[]}'),(15,1,'2024-09-26 06:25:42',0,'{\"available\":{\"ca-certificates\":{\"name\":\"ca-certificates\",\"version_from\":\"20230311ubuntu0.22.04.1\",\"version_to\":\"20240203~22.04.1\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"}},\"success\":{\"ca-certificates\":{\"name\":\"ca-certificates\",\"version_from\":\"20230311ubuntu0.22.04.1\",\"version_to\":\"20240203~22.04.1\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"}},\"failed\":[]}'),(16,1,'2024-09-27 06:26:57',1,'{\"available\":{\"libapr1\":{\"name\":\"libapr1\",\"version_from\":\"1.7.0-8ubuntu0.22.04.1\",\"version_to\":\"1.7.0-8ubuntu0.22.04.2\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"libopenjp2-7\":{\"name\":\"libopenjp2-7\",\"version_from\":\"2.4.0-6\",\"version_to\":\"2.4.0-6ubuntu0.1\",\"repo_from\":\"Ubuntu for jammy by Ubuntu\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"linux-firmware\":{\"name\":\"linux-firmware\",\"version_from\":\"20220329.git681281e4-0ubuntu3.31\",\"version_to\":\"20220329.git681281e4-0ubuntu3.34\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"python3-configobj\":{\"name\":\"python3-configobj\",\"version_from\":\"5.0.6-5\",\"version_to\":\"5.0.6-5ubuntu0.1\",\"repo_from\":\"Ubuntu for jammy by Ubuntu\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"}},\"success\":{\"libapr1\":{\"name\":\"libapr1\",\"version_from\":\"1.7.0-8ubuntu0.22.04.1\",\"version_to\":\"1.7.0-8ubuntu0.22.04.2\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"libopenjp2-7\":{\"name\":\"libopenjp2-7\",\"version_from\":\"2.4.0-6\",\"version_to\":\"2.4.0-6ubuntu0.1\",\"repo_from\":\"Ubuntu for jammy by Ubuntu\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"linux-firmware\":{\"name\":\"linux-firmware\",\"version_from\":\"20220329.git681281e4-0ubuntu3.31\",\"version_to\":\"20220329.git681281e4-0ubuntu3.34\",\"repo_from\":\"now\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"},\"python3-configobj\":{\"name\":\"python3-configobj\",\"version_from\":\"5.0.6-5\",\"version_to\":\"5.0.6-5ubuntu0.1\",\"repo_from\":\"Ubuntu for jammy by Ubuntu\",\"repo_to\":\"Ubuntu for jammy-updates by Ubuntu\"}},\"failed\":[]}'),(17,1,'2024-09-28 06:25:28',0,'{\"available\":[],\"success\":[],\"failed\":[]}'),(18,1,'2024-09-29 06:25:25',0,'{\"available\":[],\"success\":[],\"failed\":[]}'),(19,1,'2024-09-30 06:25:26',0,'{\"available\":[],\"success\":[],\"failed\":[]}'),(20,1,'2024-10-02 06:25:35',0,'{\"available\":[],\"success\":[],\"failed\":[]}'),(21,1,'2024-10-03 06:25:24',0,'{\"available\":[],\"success\":[],\"failed\":[]}'),(22,1,'2024-10-04 06:25:37',0,'{\"available\":[],\"success\":[],\"failed\":[]}');
/*!40000 ALTER TABLE `PackageUpdateNotifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PanelNotificationMessages`
--

DROP TABLE IF EXISTS `PanelNotificationMessages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PanelNotificationMessages` (
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `clientId` int(10) unsigned DEFAULT NULL,
  `adminAliasId` int(10) unsigned DEFAULT NULL,
  `isRead` int(1) NOT NULL DEFAULT 0,
  `isFavorite` int(1) NOT NULL DEFAULT 0,
  `subject` varchar(255) NOT NULL,
  `message` text DEFAULT NULL,
  `actionText` varchar(255) NOT NULL,
  `actionLink` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `area` varchar(255) NOT NULL,
  `context` varchar(255) NOT NULL,
  `contextIconUrl` varchar(255) NOT NULL,
  `isViewed` int(1) NOT NULL DEFAULT 0,
  `code` varchar(255) NOT NULL,
  `openInNewTab` int(1) NOT NULL DEFAULT 0,
  `messageKey` varchar(255) DEFAULT NULL,
  `isPromotion` int(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `clientId` (`clientId`),
  KEY `adminAliasId` (`adminAliasId`),
  KEY `isRead` (`isRead`),
  KEY `isFavorite` (`isFavorite`),
  KEY `category` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PanelNotificationMessages`
--

LOCK TABLES `PanelNotificationMessages` WRITE;
/*!40000 ALTER TABLE `PanelNotificationMessages` DISABLE KEYS */;
INSERT INTO `PanelNotificationMessages` VALUES ('2024-09-11 10:35:18',1,1,NULL,0,0,'Welcome to Plesk Obsidian!','<div id=\"welcome-notification-image\">\n    <img src=\"https://assets.plesk.com/static/notifications/welcometoobsidian.png\" style=\"max-width: 100%\">\n</div>\n<br>\n<p>Congratulations! The new version of Plesk has been installed. Plesk Obsidian is our most powerful management platform proven on servers, sites, apps, hosting &amp; cloud businesses.</p>\n<p>With Obsidian you get:</p>\n<b>Your User Experience Improved</b>\n<p>Obsidian new look and feel is the most professional yet for users, admins and resellers, thus streamlining the Web Project Lifecycle. Comfortably manage websites from one screen with our revised Website Overview. Enjoy better File Manager UX and advanced, personalized HTML notifications, keeping you in control – even when logged off.</p>\n<b>Tougher Security and Monitoring</b>\n<p>Obsidian is more robust, hence effective at avoiding outages and revenue loss. ModSecurity &amp; Fail2ban secure by default with 3rd-party extensions available, but now server security is broader with SSL It! and all its capabilities. SNI for Mail Services ensures your conversations stay private on SMTP, IMAP &amp; POP connections.</p>\n<b>Productivity and Value Maximized</b>\n<p>Get a ready-to-code platform and optimized Web stack full of deployment tools you’ll love (Git, Redis, Memcached, Node.js, and Docker). Be SEO-friendly with the permanent HTTP &gt; HTTPS redirect enabled for new sites by default. Avoid hassle because crashed services restart automatically. Try other new features: PHP Composer (PHP Dependency Manager), optimized backups (less disk space needed for backing up and restoration), and the PageSpeed module (precompiled with nginx).</p>\n<b>More Flexibility and Control</b>\n<p>All features are more useful and faster out of the box, including the new Monitoring &amp; Grafana extensions. The new Restricted Mode lets you control which server-side operations Plesk admins can perform. Plus, admins, resellers, and users can easily move domains between subscriptions both via Obsidian interface and CLI.</p>\n<p>Join discussion about Plesk Obsidian on our <a href=\"https://www.facebook.com/groups/plesk/\" target=\"_blank\">Facebook Group</a> or <a href=\"https://talk.plesk.com/\" target=\"_blank\">Community Forum</a>.</p>','Learn more','https://docs.plesk.com/release-notes/obsidian/whats-new/','Information','Maintenance','Plesk Updates','/cp/theme/icons/16/plesk/update-light.png',1,'panelUpdateToObsidian',1,NULL,0),('2024-09-13 09:30:36',2,1,NULL,0,0,'Best practices: using external monitoring','<html>\n    <head>\n        <style type=\"text/css\"> html{ margin: 0; height: 100%; overflow: hidden; }</style>\n    </head>\n    <body>\n        <img style=\"float:left; margin: 0px 10px 10px 0px;\" src=\"/modules/monitoring/images/site-monitoring-promo.png\" height=\"128px\">\n        <p><b>Best practices: using external monitoring</b></p>\n        <p>To catch downtime on the spot and not to lose money and potential customers, we recommend that you monitor your website externally with 360 Monitoring. 360 Monitoring Lite is free of charge, now and always.</p>\n    </body>\n</html>','Continue','https://360monitoring.com/inproduct-trial/','Promotion','','Plesk Monitoring','/modules/monitoring/images/site-monitoring-promo.png',1,'ext-notifier-notification-genericPanelNotification',1,'360Monitoring-v3',1),('2024-09-13 09:30:36',3,1,NULL,0,0,'Design beautiful, conversion-driven websites, directly in your Plesk interface.','<html> \n	<head> \n		<style type=\"text/css\"> html{ margin: 0; height: 100%; overflow: hidden; } </style>\n	</head> \n	<body>\n		<img src=\"https://1931990292.rsc.cdn77.org/assets/2023-09-11_SiteJet_Promo_Notificiation/plesk-sitejet-builder-605_168.png\" style=\"max-width: 100%\">\n		<br><br>\n		<p>Hi, we are thrilled to introduce the Sitejet Builder, our free, beginner-friendly site builder seamlessly integrated within the Plesk control panel, featuring designer templates, an AI-driven Text Generator, and more. With this free extension, you and your clients can create conversion-driven and SEO-friendly websites in no time.</p>\n	</body>\n</html>','Check it out!','/modules/plesk-sitejet/index.php/index','Promotion','','Sitejet Builder Extension','',1,'ext-notifier-notification-genericPanelNotification',1,'SitejetTest-v4',0),('2024-09-19 03:53:58',4,1,NULL,0,0,'2024-09-16 04:47 UTC: The server has been restarted','<div>\n    <div style=\"width: 100%\">\n        <img style=\"max-width: 95%;\" src=\"/modules/log-browser/images/reboot-maintenance.png\">\n    </div>\n    <div>To make sure there were no errors and everything works well after the restart, check the system logs in Log Browser.</div>\n</div>','See Logs','/modules/log-browser/index.php/index/index','Information','','Log Browser','/extras/log-browser/_meta/icons/32x32.png',1,'ext-log-browser-notification-serverRebootPanelNotification',0,'',0),('2024-09-19 03:53:59',5,1,NULL,0,0,'Shortening the Let\'s Encrypt Chain of Trust','<html>\n    <head>\n        <style type=\"text/css\"> html{ margin: 0; height: 100%; overflow: hidden; }</style>\n    </head>\n    <body>\n                <p>\nStarting from <b>February 8th, 2024</b>, <a href=\"https://letsencrypt.org/2023/07/10/cross-sign-expiration.html\" target=\"_blank\">Let’s Encrypt is going to stop using the DST Root CA X3 certificate</a> for cross-sign by default. Website visitors using devices running Android 7.0 or earlier will start seeing a \"website insecure\" warning when browsing websites secured by Let’s Encrypt certificates issued after that date.\n                </p>\n                <p>\nIf a significant number of visitors to your websites use legacy hardware or software that do not have new ISRG Root X1 certificate in the OS trust store, we strongly recommend that you follow the steps in <a href=\"https://support.plesk.com/hc/en-us/articles/16694815120663\" target=\"_blank\">this KB article</a> before February 8th, 2024.\n                </p>\n        <br><br>\n    </body>\n</html>','Read the KB article','https://support.plesk.com/hc/en-us/articles/16694815120663','Information','','Let\'s Encrypt','',1,'ext-notifier-notification-genericPanelNotification',1,'le-shortening-v2',0),('2024-09-20 04:30:27',6,1,NULL,0,0,'2024-09-19 06:39 UTC: The server has been restarted','<div>\n    <div style=\"width: 100%\">\n        <img style=\"max-width: 95%;\" src=\"/modules/log-browser/images/reboot-maintenance.png\">\n    </div>\n    <div>To make sure there were no errors and everything works well after the restart, check the system logs in Log Browser.</div>\n</div>','See Logs','/modules/log-browser/index.php/index/index','Information','','Log Browser','/extras/log-browser/_meta/icons/32x32.png',1,'ext-log-browser-notification-serverRebootPanelNotification',0,'',0),('2024-09-23 11:17:59',7,1,NULL,0,0,'Plesk Obsidian 18.0.64 has been installed','Your Plesk has been updated. Learn what’s new in Plesk Obsidian Change Log on our website.','What\'s new','http://docs.plesk.com/release-notes?platform=unix&locale=en-US&version=18.0.64','Information','Maintenance','Plesk Updates','/cp/theme/icons/16/plesk/update-light.png',1,'panelUpdateSuccess',1,NULL,0);
/*!40000 ALTER TABLE `PanelNotificationMessages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PanelNotificationTemplateSettings`
--

DROP TABLE IF EXISTS `PanelNotificationTemplateSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PanelNotificationTemplateSettings` (
  `code` varchar(255) NOT NULL,
  `sendToAdmin` int(1) NOT NULL DEFAULT 0,
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PanelNotificationTemplateSettings`
--

LOCK TABLES `PanelNotificationTemplateSettings` WRITE;
/*!40000 ALTER TABLE `PanelNotificationTemplateSettings` DISABLE KEYS */;
/*!40000 ALTER TABLE `PanelNotificationTemplateSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Parameters`
--

DROP TABLE IF EXISTS `Parameters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Parameters` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parameter` varchar(255) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`,`parameter`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Parameters`
--

LOCK TABLES `Parameters` WRITE;
/*!40000 ALTER TABLE `Parameters` DISABLE KEYS */;
INSERT INTO `Parameters` VALUES (1,'activeDkimSelector','default'),(1,'domain_keys_sign','true'),(1,'mailAutodiscovery','1'),(1,'mailProviderType','local'),(1,'nonexist_mail','reject');
/*!40000 ALTER TABLE `Parameters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Permissions`
--

DROP TABLE IF EXISTS `Permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Permissions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `permission` varchar(255) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`,`permission`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Permissions`
--

LOCK TABLES `Permissions` WRITE;
/*!40000 ALTER TABLE `Permissions` DISABLE KEYS */;
INSERT INTO `Permissions` VALUES (1,'access_appcatalog','true'),(1,'access_service_users','true'),(1,'allow_account_ftp_backups','true'),(1,'allow_account_local_backups','true'),(1,'allow_ftp_backups','true'),(1,'allow_insecure_sites','true'),(1,'allow_local_backups','true'),(1,'allow_oversell','true'),(1,'create_clients','true'),(1,'create_domains','true'),(1,'manage_anonftp','true'),(1,'manage_crontab','true'),(1,'manage_dns','true'),(1,'manage_domain_aliases','true'),(1,'manage_log','true'),(1,'manage_maillists','true'),(1,'manage_mail_autodiscover','true'),(1,'manage_mail_settings','true'),(1,'manage_not_chroot_shell','true'),(1,'manage_performance','true'),(1,'manage_performance_bandwidth','true'),(1,'manage_performance_connections','true'),(1,'manage_phosting','true'),(1,'manage_phosting_asp','true'),(1,'manage_phosting_asp_dot_net','true'),(1,'manage_phosting_cgi','true'),(1,'manage_phosting_errdocs','true'),(1,'manage_phosting_fastcgi','true'),(1,'manage_phosting_perl','true'),(1,'manage_phosting_php','true'),(1,'manage_phosting_python','true'),(1,'manage_phosting_ssi','true'),(1,'manage_phosting_ssl','true'),(1,'manage_phosting_webdeploy','true'),(1,'manage_php_settings','true'),(1,'manage_php_version','true'),(1,'manage_protected_dirs','true'),(1,'manage_quota','true'),(1,'manage_secure_passwords','true'),(1,'manage_server_actionlog','true'),(1,'manage_server_admin_access','true'),(1,'manage_server_app_vault','true'),(1,'manage_server_backup','true'),(1,'manage_server_branding','true'),(1,'manage_server_components','true'),(1,'manage_server_crontab','true'),(1,'manage_server_custom_buttons','true'),(1,'manage_server_db','true'),(1,'manage_server_db_management','true'),(1,'manage_server_dns_template','true'),(1,'manage_server_domain_traffic_report','true'),(1,'manage_server_events','true'),(1,'manage_server_firewall','true'),(1,'manage_server_info','true'),(1,'manage_server_ip_addresses','true'),(1,'manage_server_languages','true'),(1,'manage_server_license','true'),(1,'manage_server_mail','true'),(1,'manage_server_mailgate','true'),(1,'manage_server_mail_autodiscover','true'),(1,'manage_server_mail_black_white_lists','true'),(1,'manage_server_mass_email','true'),(1,'manage_server_modules','true'),(1,'manage_server_notifications','true'),(1,'manage_server_optimization','true'),(1,'manage_server_php','true'),(1,'manage_server_preview_domain','true'),(1,'manage_server_reboot','true'),(1,'manage_server_services','true'),(1,'manage_server_sessions','true'),(1,'manage_server_settings','true'),(1,'manage_server_shutdown','true'),(1,'manage_server_skeleton','true'),(1,'manage_server_spam_filter','true'),(1,'manage_server_ssl_certificates','true'),(1,'manage_server_summary_report','true'),(1,'manage_server_support','true'),(1,'manage_server_time','true'),(1,'manage_server_troubleshooting_enable','true'),(1,'manage_server_ui','true'),(1,'manage_server_updates','true'),(1,'manage_server_virus_protection','true'),(1,'manage_server_webmail','true'),(1,'manage_sh_access','true'),(1,'manage_spamfilter','true'),(1,'manage_subdomains','true'),(1,'manage_subftp','true'),(1,'manage_virusfilter','true'),(1,'manage_website_maintenance','true'),(1,'manage_webstat','true'),(1,'remote_access_interface','true'),(1,'remote_db_connection','true'),(1,'select_db_server','true'),(2,'access_appcatalog','true'),(2,'access_service_users','true'),(2,'allow_account_ftp_backups','true'),(2,'allow_account_local_backups','true'),(2,'allow_ftp_backups','true'),(2,'allow_insecure_sites','true'),(2,'allow_local_backups','true'),(2,'create_domains','true'),(2,'ext_permission_git_manage_git','true'),(2,'ext_permission_kolab_manage_kolab','false'),(2,'ext_permission_kolab_manage_kolab_free','true'),(2,'ext_permission_laravel_manage_laravel_toolkit','true'),(2,'ext_permission_nodejs_state_management','true'),(2,'ext_permission_nodejs_support_management','true'),(2,'ext_permission_nodejs_version_management','true'),(2,'ext_permission_plesk_sitejet_access_xovi_integration','true'),(2,'ext_permission_plesk_sitejet_create_sitejet_site','true'),(2,'ext_permission_wp_toolkit_manage_autoupdates','true'),(2,'ext_permission_wp_toolkit_manage_cloning','true'),(2,'ext_permission_wp_toolkit_manage_security_wordpress_toolkit','true'),(2,'ext_permission_wp_toolkit_manage_smart_php_update','true'),(2,'ext_permission_wp_toolkit_manage_syncing','true'),(2,'ext_permission_wp_toolkit_manage_wordpress_toolkit','true'),(2,'manage_anonftp','true'),(2,'manage_crontab','true'),(2,'manage_dns','true'),(2,'manage_domain_aliases','true'),(2,'manage_log','true'),(2,'manage_maillists','true'),(2,'manage_mail_autodiscover','true'),(2,'manage_mail_settings','true'),(2,'manage_not_chroot_shell','true'),(2,'manage_performance','true'),(2,'manage_phosting','true'),(2,'manage_phosting_cgi','true'),(2,'manage_phosting_errdocs','true'),(2,'manage_phosting_fastcgi','true'),(2,'manage_phosting_perl','true'),(2,'manage_phosting_php','true'),(2,'manage_phosting_python','true'),(2,'manage_phosting_ssi','true'),(2,'manage_phosting_ssl','true'),(2,'manage_phosting_webdeploy','true'),(2,'manage_php_settings','true'),(2,'manage_php_version','true'),(2,'manage_protected_dirs','true'),(2,'manage_quota','true'),(2,'manage_sh_access','true'),(2,'manage_spamfilter','true'),(2,'manage_subdomains','true'),(2,'manage_subftp','true'),(2,'manage_virusfilter','true'),(2,'manage_website_maintenance','true'),(2,'manage_webstat','true'),(2,'remote_db_connection','true'),(2,'select_db_server','true');
/*!40000 ALTER TABLE `Permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PersistentCache`
--

DROP TABLE IF EXISTS `PersistentCache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PersistentCache` (
  `key` varchar(128) NOT NULL,
  `uid` varchar(32) NOT NULL,
  `expire` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `events` varchar(255) NOT NULL,
  PRIMARY KEY (`key`,`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PersistentCache`
--

LOCK TABLES `PersistentCache` WRITE;
/*!40000 ALTER TABLE `PersistentCache` DISABLE KEYS */;
INSERT INTO `PersistentCache` VALUES ('0e1d449b09ee54999786deef8a081130','','2024-10-05 06:32:19','event_cache_expired'),('0f656f5f639ae8994364406d2cc1f909','','2024-10-05 06:32:19','event_cache_expired'),('0fa6d2eacd1279eb4090ca764415b23d','','2024-10-05 06:32:19','event_cache_expired'),('15dc2a3f8b1a3e440c8ae217a2892bb2','','2024-10-05 06:32:19','event_cache_expired'),('15f6a3b9899f93be669ce845196e8da0','','2024-10-05 06:32:19','event_cache_expired'),('1706c947310970005633bd382cbf5e73','','2024-10-05 06:32:19','event_cache_expired'),('1ab19c79fef127251f37c25afa3ef06a','','2024-10-05 06:32:18','event_cache_expired'),('1e06883638973e755c7ac7be842b7b17','','2024-10-05 06:32:17','reset_feed_cache'),('25e300bc5e407022afe5b7bf3a6eadb7','','2024-10-05 06:32:19','event_cache_expired'),('4acff927974d36a7f8a49be1f409bafc','','2024-10-05 06:32:20','event_cache_expired'),('4b56fe881651c4ee54a568a2b17f028f','','2024-10-05 06:32:19','event_cache_expired'),('4dd53eaa549666eff1ebeb6304351a74','','2024-10-05 06:32:20','event_cache_expired'),('565017077fae2c4ac9baf6ecd9fb5ea7','','2024-10-05 06:32:17','reset_feed_cache'),('5693110c31a34ce74cc1f88ce9fe478c','','2024-10-05 06:32:18','event_cache_expired'),('58f67b071377e8bde95ff86b5ece93e7','','2024-10-05 06:32:19','event_cache_expired'),('65d26fc7f2621768643a60195c55eb87','','2024-10-05 06:32:19','event_cache_expired'),('671a10920da578d5cb22799640bf57bf','','2024-10-05 06:32:18','event_cache_expired'),('67927270cc866402cd2c878b56466048','','2024-10-05 06:32:19','event_cache_expired'),('6cd0ed463badd243cb99acbcdbb76268','','2024-10-05 06:32:19','event_cache_expired'),('6e3460ed353e4a6bca22616af2a6dee9','','2024-10-05 06:32:19','event_cache_expired'),('6fbf527819123c95c3f53460c1322749','','2024-10-05 06:32:18','event_cache_expired'),('711de2d581987325376ab3f2c9370c53','','2024-10-05 06:32:18','event_cache_expired'),('76df5a1d39990f375732186c7e1d2e80','','2024-10-05 06:32:20','event_cache_expired'),('795f498ae39846d31e42056a967b5932','','2024-10-05 06:32:19','event_cache_expired'),('799cea91f5540b63f79aa7149af26b25','','2024-10-05 06:32:18','event_cache_expired'),('956d88b0f31a28c1d510a0ba085c0d4d','','2024-10-14 08:24:02','recent-search'),('961d83b440d1ec49a198bea4b3fee633','','2024-10-05 06:32:19','event_cache_expired'),('9f09c9f40e34eadb32d22f5236f6903c','','2024-10-05 06:32:19','event_cache_expired'),('a09ba7aaa5215d020e75749434cb20ea','','2024-10-05 08:23:31','event_cache_expired'),('acaa7283c8abafba2ed4f9e5390b35a8','','2024-10-05 06:32:19','event_cache_expired'),('b7a40079a4ac01f8c04a74d8339158fd','','2024-10-05 06:32:19','event_cache_expired'),('b98384953b9a5509ed6629a415605bd4','','2024-10-05 06:32:19','event_cache_expired'),('bd103a3f3783de962b651e0ec7ad88c3','','2024-10-05 06:32:18','event_cache_expired'),('be2b04e604adeb85c5a7f46aaa517704','','2024-10-05 06:32:19','event_cache_expired'),('c47b831a2a0dedb8c9498ef8ace2206e','','2024-10-05 06:32:20','event_cache_expired'),('cbb83e4a5a66bbd36824707facd07fe8','','2024-10-05 06:32:19','event_cache_expired'),('d12f3d61b0d57e26561c9ee9fdbf8d57','','2024-10-05 08:23:31','event_cache_expired'),('d259a9f0000a33b7f55891fdc7eaf008','','2024-10-05 06:32:20','event_cache_expired'),('d5c97e8b2c1b93ffdc47df60b762ab82','','2024-10-05 06:32:20','event_cache_expired'),('d6590413e66a748ed01c6e8f2cf35972','','2024-10-05 06:32:19','event_cache_expired'),('d7b50e59c2c08cd9a81c626bb2680daf','','2024-10-05 06:32:18','event_cache_expired'),('ed4ad1288035af9d426a2be1c3a4d978','','2024-10-05 06:32:19','event_cache_expired'),('fa14fd69f10e2cb5273dc187c50b976a','','2024-10-05 06:32:19','event_cache_expired'),('fc82865d620c81c2c045c99e8bb2eee7','','2024-10-05 06:32:19','event_cache_expired'),('fe7a8dbd02210653b40e3aa38f385485','','2024-10-05 06:32:19','event_cache_expired'),('https://ext.plesk.com/api/v4/categories?version=18.0.64&platform=unix&with-hidden&with-unstable&locale=en-US&country=XX','','2024-10-07 06:33:01','reset_extensions_catalog_cache'),('https://ext.plesk.com/api/v4/packages?platform=unix&with-hidden&with-unstable','','2024-10-07 06:32:17','reset_extensions_catalog_cache'),('https://ext.plesk.com/api/v4/packages?with-details=link&platform=unix&with-hidden&with-unstable&locale=en-US&country=XX','','2024-10-07 06:32:50','reset_extensions_catalog_cache'),('hyperscaler_name','','2024-10-11 06:29:28',''),('screenshot:9ce861e90011e4273e0fa873a30a21178e7c3bb8','','2024-10-05 06:03:02','reset_screenshot_cache');
/*!40000 ALTER TABLE `PersistentCache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PhpSettings`
--

DROP TABLE IF EXISTS `PhpSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PhpSettings` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `noteId` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PhpSettings`
--

LOCK TABLES `PhpSettings` WRITE;
/*!40000 ALTER TABLE `PhpSettings` DISABLE KEYS */;
INSERT INTO `PhpSettings` VALUES (1,0);
/*!40000 ALTER TABLE `PhpSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PhpSettingsCustom`
--

DROP TABLE IF EXISTS `PhpSettingsCustom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PhpSettingsCustom` (
  `id` int(10) unsigned NOT NULL,
  `value` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PhpSettingsCustom`
--

LOCK TABLES `PhpSettingsCustom` WRITE;
/*!40000 ALTER TABLE `PhpSettingsCustom` DISABLE KEYS */;
/*!40000 ALTER TABLE `PhpSettingsCustom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PhpSettingsParameters`
--

DROP TABLE IF EXISTS `PhpSettingsParameters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PhpSettingsParameters` (
  `id` int(10) unsigned NOT NULL DEFAULT 0,
  `name` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  PRIMARY KEY (`id`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PhpSettingsParameters`
--

LOCK TABLES `PhpSettingsParameters` WRITE;
/*!40000 ALTER TABLE `PhpSettingsParameters` DISABLE KEYS */;
INSERT INTO `PhpSettingsParameters` VALUES (1,'disable_functions','opcache_get_status'),(1,'enableFastcgi','on'),(1,'error_reporting','E_ALL & ~E_NOTICE & ~E_STRICT & ~E_DEPRECATED'),(1,'open_basedir','{WEBSPACEROOT}{/}{:}{TMP}{/}'),(1,'pm','ondemand'),(1,'pm.max_children','10'),(1,'pm.max_spare_servers','1'),(1,'pm.min_spare_servers','1'),(1,'pm.start_servers','1'),(1,'safe_mode','off');
/*!40000 ALTER TABLE `PhpSettingsParameters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PlanItemProperties`
--

DROP TABLE IF EXISTS `PlanItemProperties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PlanItemProperties` (
  `plan_item_id` int(10) unsigned NOT NULL DEFAULT 0,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`plan_item_id`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PlanItemProperties`
--

LOCK TABLES `PlanItemProperties` WRITE;
/*!40000 ALTER TABLE `PlanItemProperties` DISABLE KEYS */;
/*!40000 ALTER TABLE `PlanItemProperties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PlanItems`
--

DROP TABLE IF EXISTS `PlanItems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PlanItems` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `classname` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `isVisible` int(10) unsigned NOT NULL DEFAULT 1,
  `applicableToSubscription` int(10) unsigned NOT NULL DEFAULT 0,
  `applicableToEmail` int(10) unsigned NOT NULL DEFAULT 0,
  `applicableToSite` int(10) unsigned NOT NULL DEFAULT 0,
  `uuid` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `uuid` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PlanItems`
--

LOCK TABLES `PlanItems` WRITE;
/*!40000 ALTER TABLE `PlanItems` DISABLE KEYS */;
/*!40000 ALTER TABLE `PlanItems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PlansSubscriptions`
--

DROP TABLE IF EXISTS `PlansSubscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PlansSubscriptions` (
  `subscription_id` int(10) unsigned NOT NULL,
  `plan_id` int(10) unsigned NOT NULL,
  `quantity` int(10) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`subscription_id`,`plan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PlansSubscriptions`
--

LOCK TABLES `PlansSubscriptions` WRITE;
/*!40000 ALTER TABLE `PlansSubscriptions` DISABLE KEYS */;
INSERT INTO `PlansSubscriptions` VALUES (1,4,1);
/*!40000 ALTER TABLE `PlansSubscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PleskStats`
--

DROP TABLE IF EXISTS `PleskStats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PleskStats` (
  `param` varchar(255) NOT NULL,
  `value` blob DEFAULT NULL,
  PRIMARY KEY (`param`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PleskStats`
--

LOCK TABLES `PleskStats` WRITE;
/*!40000 ALTER TABLE `PleskStats` DISABLE KEYS */;
INSERT INTO `PleskStats` VALUES ('apacheRestartStatistics','{\"restartGraceful\":{\"restartTime\":{\"maxDay\":3.21075,\"max90Day\":3.26391,\"avgDay\":3.202845,\"avg90Day\":3.1867113333333337},\"restartsPerDay\":{\"avgDay\":2,\"avg90Day\":60},\"fallbackRestarts\":{\"day\":0,\"90Day\":0}},\"restartFull\":{\"restartTime\":{\"maxDay\":0,\"max90Day\":3.97834,\"avgDay\":0,\"avg90Day\":3.069133833333334},\"restartsPerDay\":{\"avgDay\":0,\"avg90Day\":6}},\"places\":{\"cli \\/opt\\/psa\\/admin\\/plib\\/Upgrade\\/upgrade.php\":1,\"cli \\/opt\\/psa\\/admin\\/sbin\\/httpdmng\":42,\"cli \\/usr\\/local\\/psa\\/bin\\/http2_pref\":1,\"cli \\/opt\\/psa\\/admin\\/plib\\/scripts\\/task-async-executor.php\":3,\"POST \\/cp\\/graphql\":1,\"POST \\/opt\\/psa\\/admin\\/plib\\/api-cli\\/domain.php\":3,\"POST \\/smb\\/web\\/web-server-settings\\/id\":2,\"POST \\/modules\\/nodejs\\/index.php\\/api\\/enable-domain\":2,\"cli \\/usr\\/local\\/psa\\/bin\\/subscription_settings\":1,\"cli \\/opt\\/psa\\/admin\\/plib\\/modules\\/kolab\\/scripts\\/post-install.php\":3,\"POST \\/modules\\/sslit\\/index.php\\/https-redirect\\/disable\\/\":1,\"cli \\/opt\\/psa\\/admin\\/plib\\/scripts\\/interface_async_executor.php\":1,\"POST \\/modules\\/sslit\\/index.php\\/index\\/reload\\/\":1,\"POST \\/modules\\/sslit\\/index.php\\/https-redirect\\/update-configuration\\/\":1}}'),('backup_average_db_size','35749888'),('backup_average_db_size_dumped','1568679'),('backup_average_mail_size','69632'),('backup_average_mail_size_dumped','273'),('backup_average_vhost_size','29272839509'),('backup_average_vhost_size_dumped','28159876639'),('backup_dumps_in_repository_client','0'),('backup_dumps_in_repository_domain','0'),('backup_dumps_in_repository_reseller','0'),('backup_dumps_in_repository_server','15'),('backup_server_wide_settings_check_backup_disk_space','1'),('backup_server_wide_settings_daemon_timeout','30'),('backup_server_wide_settings_days_to_keep_sessions','30'),('backup_server_wide_settings_force_debug_log','0'),('backup_server_wide_settings_free_disk_space','20'),('backup_server_wide_settings_keep_temp_dump','1800'),('backup_server_wide_settings_max_log_files','10'),('backup_server_wide_settings_max_log_size','1048576'),('backup_server_wide_settings_max_number_of_log_dirs','30'),('backup_server_wide_settings_max_transfer_download_time','86400'),('backup_server_wide_settings_migration_transport',NULL),('backup_server_wide_settings_min_transfer_download_speed','1.25'),('backup_server_wide_settings_mssql_native_backup_enabled','1'),('backup_server_wide_settings_nice_adjustment','10'),('backup_server_wide_settings_nice_always','1'),('backup_server_wide_settings_nice_io_adjustment','7'),('backup_server_wide_settings_used_space_coefficient','0.7'),('backup_total_db_count','4'),('backup_total_mail_count','3'),('backup_total_vhost_count','3'),('backup_type_full','21'),('certificates','{\"total\":2,\"error\":0,\"selfSigned\":1,\"trusted\":1,\"extendedValidation\":0,\"expired\":0}'),('controlPanelDatabaseStats','{\"warningNumber\":0,\"errorNumber\":0,\"warnings\":{\"TYPE\":\"array\",\"VALUE\":[]},\"errors\":{\"TYPE\":\"array\",\"VALUE\":[]}}'),('customizedWebsites','{\"apache\":0,\"nginx\":1}'),('dailyTask-AnalyseClientStatistics','{\"date\":\"2024-10-04 06:32:17\",\"duration\":0.2197}'),('dailyTask-AnalyseDomainStatistics','{\"date\":\"2024-10-04 06:32:16\",\"duration\":0.2342}'),('dailyTask-AutoresponderEndDate','{\"date\":\"2024-10-05 04:17:01\",\"duration\":0.0017}'),('dailyTask-BackupRestoreStats','{\"date\":\"2024-09-29 06:47:02\",\"duration\":0.9504}'),('dailyTask-CheckDomainsResolve','{\"date\":\"2024-10-04 06:29:16\",\"duration\":0.013}'),('dailyTask-CheckForUpdates','{\"date\":\"2024-10-04 06:25:15\",\"duration\":14.1883}'),('dailyTask-CheckPostponedFeedback','{\"date\":\"2024-10-04 06:32:49\",\"duration\":0.0008}'),('dailyTask-CleanupPanelNotifications','{\"date\":\"2024-10-04 06:33:01\",\"duration\":0.0011}'),('dailyTask-ComposerSelfUpdate','{\"date\":\"2024-09-29 06:47:57\",\"duration\":54.8664}'),('dailyTask-ExecuteGlCleaner','{\"date\":\"2024-10-04 06:32:21\",\"duration\":0.0126}'),('dailyTask-ExecuteSpamtrain','{\"date\":\"2024-10-04 06:32:17\",\"duration\":0.0113}'),('dailyTask-ExecuteStatistics','{\"date\":\"2024-10-04 06:32:16\",\"duration\":4.7398}'),('dailyTask-ExecuteWebStatistics','{\"date\":\"2024-10-04 06:32:47\",\"duration\":25.7346}'),('dailyTask-InstallSystemPackageUpdates','{\"date\":\"2024-10-04 06:25:37\",\"duration\":21.2838}'),('dailyTask-InstallUpdates','{\"date\":\"2024-10-04 06:25:15\",\"duration\":0.0022}'),('dailyTask-LoadCustomizations','{\"date\":\"2024-10-05 04:17:01\",\"duration\":0.0006}'),('dailyTask-LongTasksRotation','{\"date\":\"2024-10-04 06:33:02\",\"duration\":0.0905}'),('dailyTask-MailUsage','{\"date\":\"2024-10-04 06:32:11\",\"duration\":0.0129}'),('dailyTask-OptimizeStatistics','{\"date\":\"2024-10-04 06:32:16\",\"duration\":0.0022}'),('dailyTask-PleskUsage','{\"date\":\"2024-10-04 06:32:11\",\"duration\":174.6566}'),('dailyTask-ProcessAutoreports','{\"date\":\"2024-10-04 06:32:16\",\"duration\":0.0019}'),('dailyTask-RemoveSpamTempFiles','{\"date\":\"2024-10-04 06:32:17\",\"duration\":0.0044}'),('dailyTask-ReportProductAgreement','{\"date\":\"2024-10-05 04:17:01\",\"duration\":0.0007}'),('dailyTask-ReportTrialAgreement','{\"date\":\"2024-10-05 04:17:01\",\"duration\":0.0007}'),('dailyTask-ReportUsage','{\"date\":\"2024-10-04 06:33:04\",\"duration\":2.2044}'),('dailyTask-RotateTrash','{\"date\":\"2024-10-04 06:32:16\",\"duration\":0.0328}'),('dailyTask-SearchIndex','{\"date\":\"2024-10-04 06:33:01\",\"duration\":11.8536}'),('dailyTask-Sitebuilder','{\"date\":\"2024-10-04 06:32:11\",\"duration\":0.0013}'),('dailyTask-StoreProtectedConfigs','{\"date\":\"2024-10-04 06:32:21\",\"duration\":0.1053}'),('dailyTask-UpdateApsApplications','{\"date\":\"2024-10-04 06:32:17\",\"duration\":0.0883}'),('dailyTask-UpdateApsCache','{\"date\":\"2024-10-04 06:32:17\",\"duration\":0.0255}'),('dailyTask-UpdateKeys','{\"date\":\"2024-10-04 06:29:16\",\"duration\":219.0012}'),('dailyTask-UpdateModSecurityRuleSet','{\"date\":\"2024-10-04 06:32:49\",\"duration\":2.1431}'),('dailyTask-UpdatePhpCurlCertificates','{\"date\":\"2024-09-29 06:47:01\",\"duration\":0.0021}'),('dailyTask-UpgradeExtensions','{\"date\":\"2024-10-04 06:32:21\",\"duration\":3.4974}'),('dailyTask-UpgradePanel','{\"date\":\"2024-10-05 04:17:01\",\"duration\":0.0019}'),('dailyTask-WappspectorScan','{\"date\":\"2024-10-04 06:29:16\",\"duration\":0.0069}'),('dailyTask-WebsitesDiagnosticChecksRotation','{\"date\":\"2024-10-04 06:33:02\",\"duration\":0.0019}'),('ext-advisor','{\"feed\":{\"retrieved\":{\"date\":\"2024-10-03T10:00:01+00:00\",\"serviceUrl\":\"https:\\/\\/advisor.plesk.com\\/\",\"group\":\"default-group\"}},\"rating\":{\"total\":4850,\"current\":3380,\"relative\":70,\"level\":\"medium\",\"isHigh\":false},\"blacklist\":{\"TYPE\":\"array\",\"VALUE\":[\"ImunifyQuickPatch\"]},\"adviceList\":{\"Imunify360\":{\"maxPoints\":150,\"currentPoints\":0,\"isHidden\":false},\"Http2\":{\"maxPoints\":50,\"currentPoints\":50,\"isHidden\":false},\"SslDomains\":{\"maxPoints\":450,\"currentPoints\":450,\"isHidden\":false},\"WordPressDomains\":{\"maxPoints\":210,\"currentPoints\":210,\"isHidden\":false},\"SecurePanel\":{\"maxPoints\":300,\"currentPoints\":100,\"isHidden\":false},\"SectigoSsl\":{\"maxPoints\":50,\"currentPoints\":0,\"isHidden\":false},\"KernelCare\":{\"maxPoints\":50,\"currentPoints\":0,\"isHidden\":false},\"GoogleAuthenticator\":{\"maxPoints\":10,\"currentPoints\":0,\"isHidden\":false},\"ImunifyQuickPatch\":{\"maxPoints\":120,\"currentPoints\":0,\"isHidden\":true},\"SpeedKit\":{\"maxPoints\":150,\"currentPoints\":0,\"isHidden\":false},\"PageSpeed\":{\"maxPoints\":150,\"currentPoints\":0,\"isHidden\":false},\"PhpDomains\":{\"maxPoints\":200,\"currentPoints\":200,\"isHidden\":false},\"Firewall\":{\"maxPoints\":310,\"currentPoints\":0,\"isHidden\":false},\"AutoUpdate\":{\"maxPoints\":300,\"currentPoints\":300,\"isHidden\":false},\"ModSecurityAndFail2ban\":{\"maxPoints\":350,\"currentPoints\":350,\"isHidden\":false},\"PasswordStrength\":{\"maxPoints\":200,\"currentPoints\":200,\"isHidden\":false},\"PleskUpdate\":{\"maxPoints\":200,\"currentPoints\":200,\"isHidden\":false},\"RegularBackups\":{\"maxPoints\":300,\"currentPoints\":100,\"isHidden\":false},\"SeoToolkit\":{\"maxPoints\":100,\"currentPoints\":100,\"isHidden\":false},\"SystemTime\":{\"maxPoints\":50,\"currentPoints\":50,\"isHidden\":true},\"ImunifyAV\":{\"maxPoints\":150,\"currentPoints\":150,\"isHidden\":false},\"Acronis\":{\"maxPoints\":100,\"currentPoints\":0,\"isHidden\":false},\"CloudPro\":{\"maxPoints\":100,\"currentPoints\":0,\"isHidden\":false},\"EmailSecurity\":{\"maxPoints\":70,\"currentPoints\":0,\"isHidden\":true},\"IisImpersonatePrivilegeVulnerability\":{\"maxPoints\":0,\"currentPoints\":0,\"isHidden\":true},\"Platform360_PleskSynergy\":{\"maxPoints\":100,\"currentPoints\":0,\"isHidden\":false},\"WpToolkit_UpToDate\":{\"maxPoints\":200,\"currentPoints\":200,\"isHidden\":false},\"EmailSecurity_InstallationStatus\":{\"maxPoints\":130,\"currentPoints\":130,\"isHidden\":true},\"WpToolkit_SmartUpdates\":{\"maxPoints\":100,\"currentPoints\":100,\"isHidden\":true}}}'),('ext-catalog','{\"curlVersion\":\"7.81.0\",\"sslVersion\":\"OpenSSL\\/3.0.2\",\"serviceAvailable\":true,\"serviceErrno\":0,\"serviceError\":\"\",\"showVAT\":false,\"taxCountry\":\"XX\"}'),('ext-composer','{\"commandsSuccessFailure\":[],\"subscriptionsWithExecutedCommands\":0,\"subscriptionsWithRegularCommandsExecution\":0,\"subscriptionsWithComposerJson\":{\"total\":1,\"permissiveShell\":0,\"noShell\":1,\"chRootedShell\":0},\"subscriptionsWithScannedComposerJson\":{\"total\":1,\"permissiveShell\":0,\"noShell\":1,\"chRootedShell\":0}}'),('ext-galileo','{\"activeGhe\":\"rollout-sitejet-extension\"}'),('ext-git','{\"total\":0,\"pull\":0,\"push\":0,\"active\":0,\"manual\":0,\"disabled\":0,\"deployments\":0,\"withSmbUsers\":0,\"smbUsersTotal\":0}'),('ext-kolab','{\"licensed\":false,\"hasLicense\":false,\"numLicensed\":0,\"nfrLicensed\":\"N\\/A\",\"version\":\"16.15.8-0\",\"installed\":false,\"updateConfig\":3,\"pleskVersion\":\"18.0.64\",\"pleskUpdate\":\"0\",\"osName\":\"Ubuntu\",\"osVersion\":\"22.04\",\"osArch\":\"x86_64\",\"virtualization\":false,\"systemId\":\"32934276-14cf-4060-a5a9-dd67c3a1b8cf\",\"domains\":{\"numTotal\":1,\"numPrimary\":1,\"numHosting\":1,\"numMailservice\":1,\"numWildcard\":-1,\"numIDN\":0,\"numEligible\":1,\"permissions\":{\"manage_kolab\":0,\"manage_kolab_free\":1},\"freemium\":1,\"premium\":0,\"roundcube\":0},\"users\":{\"numTotal\":1,\"numPrimary\":1,\"numHosting\":1,\"numMailservice\":1,\"numWildcard\":-1,\"numIDN\":0,\"numEligible\":1,\"permissions\":{\"manage_kolab\":0,\"manage_kolab_free\":1},\"freemium\":1,\"premium\":0},\"mailboxes\":{\"numTotal\":0,\"numPrimary\":0,\"numHosting\":0,\"numMailservice\":0,\"numWildcard\":-1,\"numIDN\":0,\"numEligible\":0,\"permissions\":{\"manage_kolab\":0,\"manage_kolab_free\":0},\"freemium\":0,\"premium\":0},\"ext-email-security\":false,\"ext-seafile\":false,\"ext-mattermost\":false,\"ext-collabora\":false}'),('ext-laravel','{\"repositoryType\":{\"local\":1,\"remote\":0},\"scan\":1,\"enabledApps\":1,\"queueCount\":0}'),('ext-letsencrypt','{\"live\":1,\"requests\":2,\"sanAvg\":2,\"sanMax\":2,\"servicesSecuredByLetsEncrypt\":{\"panel\":false,\"mail-server\":false},\"domainChallenges\":{\"succeed\":5,\"failed\":484},\"securingErrors\":{\"acme\":[],\"problemAdviser\":[],\"internal\":[]},\"issueCertificateErrors\":0,\"sqliteDatabaseSize\":188416,\"domainSecuring\":{\"durationAvg\":3,\"durationMax\":16,\"dnsCountSucceed\":1,\"dnsCountFailed\":0,\"dnsDurationAvgSucceed\":10,\"dnsDurationAvgFailed\":0},\"scriptExecution\":{\"cli\":{\"adviser\":0,\"other\":0}},\"panelSecuringOnInstall\":{\"succeed\":0,\"failed\":2,\"skipped\":0},\"isCommonChallengeDirectoryUsed\":true,\"acmeProtocolVersion\":\"acme-v02\",\"acmeDirectoryUrl\":\"https:\\/\\/acme-v02.api.letsencrypt.org\\/directory\",\"liveWildcard\":1}'),('ext-log-browser','{\"perfGetLogListTime\":{\"TYPE\":\"array\",\"VALUE\":[]},\"perfGetFilteredLogListTime\":{\"TYPE\":\"array\",\"VALUE\":[]}}'),('ext-monitoring','{\"alerts\":[],\"tabs\":[],\"placements\":[],\"source\":{\"type\":\"sw-collectd\"},\"exceptions\":[]}'),('ext-nodejs','{\"enabledApps\":{\"TYPE\":\"array\",\"VALUE\":[]}}'),('ext-notifier','{\"autoUpdate178\":{\"displayed\":false,\"closed\":false},\"autoUpdate\":{\"displayed\":false,\"closed\":false},\"juicyPotato\":{\"displayed\":false,\"closed\":false},\"warnTrialAbusers\":{\"displayed\":false,\"closed\":false},\"unavailableMailPorts\":{\"displayed\":false,\"closed\":false},\"warnTLS\":{\"displayed\":false,\"closed\":false},\"sitejetPromo\":{\"displayed\":false,\"closed\":false},\"welcomePanel\":{\"displayed\":false,\"closed\":false},\"curlErrorCode\":0}'),('ext-performance-booster','{\"domains\":{\"enabledStages\":[],\"disabledStages\":[],\"neverOptimized\":1},\"dbSettings\":{\"state\":0,\"checkerThreshold\":15,\"detectedCounter\":0,\"appliedCounter\":0}}'),('ext-plesk-sitejet','{\"sites-total\":0,\"sites-published\":0,\"sites-published-l30d\":0,\"domains-published-by-customer\":[],\"domains-published-complete\":true}'),('ext-repair-kit','{\"clicks\":{\"check\":{\"Mail\":0,\"WebAndFtp\":0,\"Dns\":0,\"PleskDatabase\":0,\"FileSystem\":0,\"Mysql\":0,\"PleskInstallation\":0},\"repair\":{\"Mail\":0,\"WebAndFtp\":0,\"Dns\":0,\"PleskDatabase\":0,\"FileSystem\":0,\"Mysql\":0,\"PleskInstallation\":0}},\"issues\":{\"check\":{\"Mail\":0,\"WebAndFtp\":0,\"Dns\":0,\"PleskDatabase\":0,\"FileSystem\":0,\"Mysql\":0,\"PleskInstallation\":0},\"repair\":{\"Mail\":0,\"WebAndFtp\":0,\"Dns\":0,\"PleskDatabase\":0,\"FileSystem\":0,\"Mysql\":0,\"PleskInstallation\":0}},\"multipleRunClicks\":{\"check\":0,\"repair\":0},\"customRunClicks\":0}'),('ext-rest-api','{\"usage\":{\"TYPE\":\"array\",\"VALUE\":[]}}'),('ext-revisium-antivirus','{\"reports_views_admin\":0,\"report_views\":0,\"main_view_admin\":0,\"main_view\":0,\"manual_db_day\":0,\"manual_db_month\":0,\"fails_day\":0,\"fails_month\":0,\"queue_timeouts_month\":0,\"scan_timeouts_month\":0,\"about_hits\":0,\"ip\":\"95.211.107.87\",\"ra_ver\":\"2.13.2.1\",\"os_type\":\"Ubuntu 22.04\",\"panel_name\":\"Plesk\",\"panel_ver\":\"18.0.64\",\"install_id\":\"6ad277c0cbd4d626ece0c704d50c5f03\",\"cpu_cores\":8,\"mem_size\":31942,\"wsite_num\":1,\"wsite_infected\":0,\"files_per_wsite_ave\":0,\"files_per_wsite_max\":0,\"mlw_db_updatetime\":1727936221,\"license\":0,\"users_per_server\":1,\"lasttime_reinstalled\":1727504901,\"set_days_backup\":7,\"set_trim\":1,\"set_working_threads\":2,\"set_banner\":1,\"set_shortcut\":1,\"set_quickscan\":1,\"set_skipmedia\":1,\"set_optimize\":1,\"set_period\":3,\"set_starttime\":6,\"set_notifications\":\"1\",\"last_modified\":1728023528,\"last_modified_str\":\"2024-10-04 06:32:08\",\"eula_accepted\":0,\"infected_sites\":{\"TYPE\":\"array\",\"VALUE\":[]}}'),('ext-site-import','{\"mail-migrations\":{\"TYPE\":\"array\",\"VALUE\":[]},\"migrator_version\":\"1.8.9-2024.09.05.10.38\",\"sessions\":[],\"site-migrations\":{\"TYPE\":\"array\",\"VALUE\":[]},\"subscriptions\":[]}'),('ext-sslit','{\"live\":1,\"sanAvg\":2,\"sanMax\":2,\"liveWildcard\":1,\"liveMail\":1,\"liveCertificates\":{\"TYPE\":\"array\",\"VALUE\":[{\"total\":1,\"vendorId\":\"letsencrypt.letsencrypt\"},{\"vendorId\":\"total\",\"productId\":\"total\",\"total\":1}]},\"keepSecuredTask\":{\"durationAvg\":3,\"durationMax\":17},\"hsts\":{\"enabledDomainsCount\":0,\"enabledSubDomainsCount\":0,\"maxAgeAvg\":0,\"enabledIncludeSubdomains\":{\"domainsCount\":0,\"subDomainsCount\":0},\"enabledApplyToWebMail\":{\"domainsCount\":0,\"subDomainsCount\":0}},\"ocspStapling\":{\"enabledDomainsCount\":0,\"subDomainsCount\":0},\"paidExtensionsAutoInstalled\":[],\"liveDomainsTotal\":1,\"liveDomainsDetailed\":{\"TYPE\":\"array\",\"VALUE\":[{\"type\":\"domain\",\"hosting\":\"vrt_hst\",\"count\":1}]},\"liveWebmailsTotal\":1,\"liveWebmailsDetailed\":{\"TYPE\":\"array\",\"VALUE\":[{\"type\":\"kolab_ppe\",\"hosting\":\"vrt_hst\",\"count\":1}]},\"dane\":{\"liveCertificatesWithDANE\":1},\"failedOrders\":{\"TYPE\":\"array\",\"VALUE\":[{\"total\":482,\"vendorId\":\"letsencrypt.letsencrypt\",\"productId\":\"base\"},{\"vendorId\":\"total\",\"productId\":\"total\",\"total\":482}]},\"createdOrders\":{\"TYPE\":\"array\",\"VALUE\":[{\"total\":484,\"vendorId\":\"letsencrypt.letsencrypt\",\"productId\":\"base\"},{\"vendorId\":\"total\",\"productId\":\"total\",\"total\":484}]},\"createdFakeOrders\":{\"TYPE\":\"array\",\"VALUE\":[{\"vendorId\":\"total\",\"productId\":\"total\",\"total\":0}]},\"completedOrders\":{\"TYPE\":\"array\",\"VALUE\":[{\"total\":2,\"vendorId\":\"letsencrypt.letsencrypt\",\"productId\":\"base\"},{\"vendorId\":\"total\",\"productId\":\"total\",\"total\":2}]},\"canceledOrders\":{\"TYPE\":\"array\",\"VALUE\":[{\"vendorId\":\"total\",\"productId\":\"total\",\"total\":0}]},\"totalUnsecuredDomains\":1,\"removedEmptyOrders\":0,\"totalUploadedCertificates\":0,\"sqliteDatabaseSize\":376832,\"domainsToKeepSecured\":0,\"mainDomainsToKeepSecured\":0,\"keepSecuredOptions\":{\"www\":0,\"webmail\":0,\"mail\":0,\"domainAliases\":0},\"panelKeepSecured\":true,\"errors\":{\"TYPE\":\"array\",\"VALUE\":[]}}'),('ext-wp-toolkit','{\"wptInstallationID\":\"75f06f23-e386-4310-a292-cec9470b72d6\",\"allowedByLicense\":false,\"enabled\":true,\"generatedScreenshotsCount\":0,\"generateScreenshotPleskSdkAttemptsCount\":0,\"generateScreenshotPleskSdkSuccessCount\":0,\"generateScreenshotPleskSdkErrorHttp4xxCount\":0,\"generateScreenshotPleskSdkErrorHttp5xxCount\":0,\"generateScreenshotPleskSdkErrorNoResponseCount\":0,\"generateScreenshotPleskSdkRateLimitExceededCount\":0,\"generateScreenshotResponses\":{\"TYPE\":\"array\",\"VALUE\":[{\"type\":\"PleskSdk\",\"response\":\"2xx\",\"count\":0},{\"type\":\"PleskSdk\",\"response\":\"4xx\",\"count\":0},{\"type\":\"PleskSdk\",\"response\":\"5xx\",\"count\":0},{\"type\":\"PleskSdk\",\"response\":\"noResponse\",\"count\":0}]},\"defaultInstallationLanguage\":\"default\",\"multisites\":0,\"subdomainMultisites\":0,\"subdirectoriesMultisites\":0,\"withAutoUpdates\":0,\"withPluginsAutoUpdates\":0,\"withThemesAutoUpdates\":0,\"newSecurityCheckersGoToSecurity\":0,\"newSecurityCheckersClosed\":0,\"siteHealthSuccess\":0,\"siteHealthSuccessTimeSpent\":0,\"siteHealthFail\":0,\"siteHealthFailTimeSpent\":0,\"siteUrlSync\":0,\"plugins\":[],\"themes\":[],\"versions\":[],\"instances\":0,\"hiddenInstances\":0,\"ignoredInstances\":0,\"brokenInstances\":0,\"brokenHiddenInstances\":0,\"quarantinedInstances\":0,\"instancesOnUnsupportedPhp\":0,\"instancesOnOutdatedPhp\":0,\"normalInstances\":0,\"outdatedInstances\":0,\"unsupportedInstances\":0,\"clientsInstances\":{\"TYPE\":\"array\",\"VALUE\":[]},\"phpVersions\":[],\"labels\":[],\"Cloned\":0,\"Clones\":0,\"MaxClones\":0,\"SyncedFrom\":0,\"SyncedTo\":0,\"MaxSyncsFrom\":0,\"MaxSyncsTo\":0,\"TotalSyncs\":0,\"smartUpdates\":{\"numberOfWebsitesWithSmartUpdateEnabled\":0,\"confirmedSuccessfully\":0,\"rejectedAsUnsuccessful\":0,\"smartUpdatesInitialCheckAttempts\":0,\"smartUpdatesInitialCheckFails\":0,\"smartUpdatesInitialCheckNotEqual\":0,\"smartUpdatesInitialCheckEqual\":0},\"sets\":7,\"sets_contents\":{\"TYPE\":\"array\",\"VALUE\":[{\"name\":\"WordPress Essentials\",\"plugins\":5,\"themes\":0},{\"name\":\"E-Commerce pack\",\"plugins\":8,\"themes\":0},{\"name\":\"WordPress Classic\",\"plugins\":1,\"themes\":0},{\"name\":\"Jetpack\",\"plugins\":1,\"themes\":0},{\"name\":\"WordPress Essentials with Jetpack\",\"plugins\":6,\"themes\":0},{\"name\":\"E-Commerce pack with Jetpack\",\"plugins\":9,\"themes\":0},{\"name\":\"WordPress Classic with Jetpack\",\"plugins\":2,\"themes\":0}]},\"remoteServerConnectionAttemptsWithRequiredTty\":0,\"remoteServers\":{\"TYPE\":\"array\",\"VALUE\":[]},\"remoteAgentInstances\":0,\"cliCall\":{\"TYPE\":\"array\",\"VALUE\":[]},\"featuresUsage\":{\"SitesWithSearchEngineIndexingEnabled\":0,\"SitesWithNginxCachingEnabled\":0,\"SitesWithPasswordProtectionEnabled\":0,\"SitesWithDebugEnabled\":{\"debugEnabledTotal\":0,\"WP_DEBUG_LOG\":0,\"WP_DEBUG_DISPLAY\":0,\"SCRIPT_DEBUG\":0,\"SAVEQUERIES\":0},\"SitesWithSecurityMeasuresApplied\":{\"adminUsername\":0,\"dbPrefix\":0,\"disableFileEditing\":0,\"disableUnusedScripting\":0,\"securityPermissions\":0,\"pingbacks\":0,\"scriptsConcatenation\":0,\"securityKeys\":0,\"blockAuthorsScan\":0,\"blockHtFiles\":0,\"blockPotentiallySensitiveFiles\":0,\"blockSensitiveFiles\":0,\"botProtection\":0,\"secureConfig\":0,\"secureContent\":0,\"disableScriptInCache\":0,\"secureIncludes\":0,\"secureIndexing\":0,\"secureXmlRpc\":0},\"SitesWithDisabledWpCron\":0,\"SitesWithDeniedWpCronTaskReplacement\":0,\"wptoolkitJetpackAffiliateSites\":0,\"wptoolkitJetpackInstallationFree\":0,\"wptoolkitJetpackInstallationPersonal\":0,\"wptoolkitJetpackInstallationPremium\":0,\"wptoolkitJetpackInstallationProfessional\":0}}'),('ext-xovi','{\"LicenseType\":\"free\",\"LicenseLimits\":{\"KeywordLimit\":5,\"UsedKeywords\":0,\"PreviewMode\":false},\"Domains\":{\"Total\":1,\"Scanned\":0,\"NotScanned\":1},\"Potential\":{\"Best\":[],\"Worst\":[]},\"Tasks\":{\"Open\":0,\"Done\":0,\"Skipped\":0,\"Total\":0}}'),('gdpr_cookies','{\"cookie\":{\"phpMyAdmin_https\":{\"createdAt\":\"2024-09-14T04:37:53+0000\",\"REQUEST_URI\":\"\\/smb\\/web\\/overview\\/id\\/1\\/type\\/domain\"},\"sessionID\":{\"createdAt\":\"2024-09-19T04:13:42+0000\",\"REQUEST_URI\":\"\\/admin\\/server\\/tools\"},\"smtpSettings-hidden\":{\"createdAt\":\"2024-09-19T04:14:39+0000\",\"REQUEST_URI\":\"\\/admin\\/mail-gate\\/\"},\"theme\":{\"createdAt\":\"2024-09-19T06:36:51+0000\",\"REQUEST_URI\":\"\\/cp\\/graphql\"}}}'),('liveMailboxes','1'),('mailCertificates','{\"total\":1,\"error\":0,\"selfSigned\":0,\"trusted\":1,\"extendedValidation\":0,\"expired\":0}'),('mailNotifications','{\"daily\":0,\"weekly\":0,\"monthly\":8}'),('nginxClientMaxBodySize','{\"domains\":1,\"servicePlans\":0}'),('npmDependencies','{\"qs\":1,\"babel-preset-power-assert\":1,\"jest\":1,\"jest-environment-jsdom\":1,\"microbundle\":1,\"power-assert\":1,\"@ably\\/laravel-echo\":1,\"@inertiajs\\/react\":1,\"@stripe\\/react-stripe-js\":1,\"@stripe\\/stripe-js\":1,\"@wojtekmaj\\/react-timerange-picker\":1,\"ably\":1,\"agora-react-uikit\":1,\"agora-rtc-sdk-ng\":1,\"antd\":1,\"cropperjs\":1,\"get-video-duration\":1,\"inertiajs\":1,\"lodash.debounce\":1,\"plyr-react\":1,\"qrcode.react\":1,\"react-cookie-consent\":1,\"react-cropper\":1,\"react-google-recaptcha-v3\":1,\"react-icons\":1,\"react-image-gallery\":1,\"react-nl2br\":1,\"react-router-dom\":1,\"react-slick\":1,\"react-toastify\":1,\"react-tooltip\":1,\"sanitize-html-react\":1,\"slick-carousel\":1,\"ssr-window\":1,\"@headlessui\\/react\":1,\"@inertiajs\\/inertia\":1,\"@inertiajs\\/inertia-react\":1,\"@inertiajs\\/progress\":1,\"@tailwindcss\\/forms\":1,\"@vitejs\\/plugin-react\":1,\"autoprefixer\":1,\"axios\":1,\"laravel-echo\":1,\"laravel-vite-plugin\":1,\"lodash\":1,\"postcss\":1,\"prettier\":1,\"pusher-js\":1,\"react\":1,\"react-dom\":1,\"tailwindcss\":1,\"video.js\":1,\"vite\":1}'),('panelNotifications','{\"countPerNotifications\":{\"panelUpdateAvailable\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0}}},\"panelUpdateSuccess\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":1,\"viewed\":0,\"read\":0,\"favorite\":0}}},\"panelHotfixSuccess\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0}}},\"panelUpdateError\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0}}},\"panelUpdateToObsidian\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":1,\"viewed\":1,\"read\":0,\"favorite\":0}}},\"wafRulesApplied\":{\"sendToAdmin\":false,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0}}},\"allWebsitesSwitcherAvailable\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0}}},\"brokenPhpHandlersOnDomains\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0}}},\"ext-catalog-notification-purchasedAndNotInstalledNotification\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0}}},\"ext-notifier-notification-genericPanelNotification\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":3,\"viewed\":3,\"read\":0,\"favorite\":0}}},\"ext-notifier-notification-couponPanelNotification\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0}}},\"ext-galileo-notification-imunifyAvPanelNotification\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0}}},\"ext-galileo-notification-pleskEmailSecurityPanelNotification\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0}}},\"ext-galileo-notification-domainCreatePanelNotification\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0}}},\"ext-galileo-notification-acronisPanelNotification\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0}}},\"ext-galileo-notification-googleAuthPanelNotification\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0}}},\"ext-galileo-notification-adventPanelNotification\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0}}},\"ext-performance-booster-notification-additionalDbOptimization\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0}}},\"ext-sslit-notification-secureDomainPanelNotification\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0}}},\"ext-letsencrypt-notification-SslItInstallationNotification\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0}}},\"ext-letsencrypt-notification-SslItFailedInstallationNotification\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0}}},\"ext-letsencrypt-notification-SslItBlacklistedFailedInstallationNotification\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0}}},\"ext-letsencrypt-notification-SslItTurningOnNotification\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0}}},\"ext-monitoring-notification-panel_threshold_alert\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0}}},\"ext-monitoring-notification-panel_threshold_ok\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0}}},\"ext-monitoring-notification-panel_cloud_alert\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0}}},\"ext-log-browser-notification-serverRebootPanelNotification\":{\"sendToAdmin\":true,\"countByPeriods\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":2,\"viewed\":1,\"read\":0,\"favorite\":0}}}},\"countPerServer\":{\"weekly\":{\"total\":0,\"viewed\":0,\"read\":0,\"favorite\":0},\"monthly\":{\"total\":7,\"viewed\":5,\"read\":0,\"favorite\":0}}}'),('passwordChangesTotal','3'),('pum','{\"enabled\":true,\"packages\":1009,\"locked\":0,\"lockedDetails\":{\"TYPE\":\"array\",\"VALUE\":[]},\"autoupdates\":true,\"notifications\":true,\"safeUpdates\":true}'),('sslOptions','{\"protocols\":\"TLSv1.2 TLSv1.3\",\"ciphers\":\"EECDH+AESGCM+AES128:EECDH+AESGCM+AES256:EECDH+CHACHA20:EECDH+SHA256+AES128:EECDH+SHA384+AES256:EECDH+SHA1+AES128:EECDH+SHA1+AES256:EECDH+HIGH:AESGCM+AES128:AESGCM+AES256:CHACHA20:SHA256+AES128:SHA256+AES256:SHA1+AES128:SHA1+AES256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK:!KRB5:!aECDH:!kDH:!EDH\",\"cipherServerOrder\":true}'),('virtualDirectories','{\"createdByUserCount\":0,\"windowsAuthenticationCount\":0}'),('webserverTemplates','{\"apache\":{\"custom\":\"\",\"default\":\"f9d03fdb8d9d38020774cbc86af2e697f5c2f33f\"},\"nginx\":{\"custom\":\"\",\"default\":\"9c37d86a5980f26f9d0544a0ff57500c0fb31c79\"}}'),('websiteListType','{\"dynamic\":{\"admin\":1,\"reseller\":0,\"client\":0},\"dynamic_simple\":{\"admin\":0,\"reseller\":0,\"client\":0}}'),('websitesDiagnostic','{\"isRegularCheckEnabledInUI\":false,\"serverData\":{\"ulimit\":0}}'),('websitesServedBy','{\"total\":{\"apache\":0,\"apacheNginx\":1,\"nginx\":0},\"wordpress\":{\"apache\":0,\"apacheNginx\":0,\"nginx\":0}}');
/*!40000 ALTER TABLE `PleskStats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Repository`
--

DROP TABLE IF EXISTS `Repository`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Repository` (
  `rep_id` int(10) unsigned NOT NULL,
  `component_id` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`rep_id`,`component_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Repository`
--

LOCK TABLES `Repository` WRITE;
/*!40000 ALTER TABLE `Repository` DISABLE KEYS */;
INSERT INTO `Repository` VALUES (1,2),(2,3);
/*!40000 ALTER TABLE `Repository` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RestrictedDomains`
--

DROP TABLE IF EXISTS `RestrictedDomains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RestrictedDomains` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RestrictedDomains`
--

LOCK TABLES `RestrictedDomains` WRITE;
/*!40000 ALTER TABLE `RestrictedDomains` DISABLE KEYS */;
INSERT INTO `RestrictedDomains` VALUES (29,'163.com'),(99,'360.cn'),(91,'360buy.com'),(86,'about.com'),(76,'adf.ly'),(63,'adobe.com'),(77,'alibaba.com'),(85,'alipay.com'),(56,'amazon.co.jp'),(75,'amazon.co.uk'),(8,'amazon.com'),(62,'amazon.de'),(69,'aol.com'),(36,'apple.com'),(50,'ask.com'),(65,'avg.com'),(28,'babylon.com'),(5,'baidu.com'),(54,'bbc.co.uk'),(23,'bing.com'),(46,'blogger.com'),(12,'blogspot.com'),(79,'blogspot.in'),(71,'cnn.com'),(53,'conduit.com'),(48,'craigslist.org'),(94,'dailymotion.com'),(92,'ebay.co.uk'),(19,'ebay.com'),(74,'ebay.de'),(78,'espn.go.com'),(1,'facebook.com'),(45,'fc2.com'),(64,'flickr.com'),(55,'go.com'),(59,'google.ca'),(82,'google.co.id'),(13,'google.co.in'),(20,'google.co.jp'),(26,'google.co.uk'),(2,'google.com'),(89,'google.com.au'),(37,'google.com.br'),(24,'google.com.hk'),(57,'google.com.mx'),(80,'google.com.tr'),(21,'google.de'),(41,'google.es'),(27,'google.fr'),(42,'google.it'),(97,'google.pl'),(40,'google.ru'),(33,'googleusercontent.com'),(52,'hao123.com'),(84,'huffingtonpost.com'),(66,'ifeng.com'),(47,'imdb.com'),(95,'imgur.com'),(83,'instagram.com'),(14,'linkedin.com'),(7,'live.com'),(90,'livedoor.com'),(61,'livejasmin.com'),(34,'mail.ru'),(31,'microsoft.com'),(17,'msn.com'),(73,'mywebsearch.com'),(93,'netflix.com'),(58,'odnoklassniki.ru'),(39,'paypal.com'),(35,'pinterest.com'),(68,'pornhub.com'),(9,'qq.com'),(70,'rakuten.co.jp'),(81,'redtube.com'),(16,'sina.com.cn'),(88,'sogou.com'),(51,'sohu.com'),(38,'soso.com'),(87,'stackoverflow.com'),(67,'t.co'),(11,'taobao.com'),(72,'thepiratebay.sx'),(44,'tmall.com'),(32,'tumblr.com'),(10,'twitter.com'),(98,'uol.com.br'),(25,'vk.com'),(30,'weibo.com'),(6,'wikipedia.org'),(22,'wordpress.com'),(43,'xhamster.com'),(49,'xvideos.com'),(15,'yahoo.co.jp'),(4,'yahoo.com'),(18,'yandex.ru'),(60,'youku.com'),(3,'youtube.com'),(96,'zedo.com');
/*!40000 ALTER TABLE `RestrictedDomains` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SBConfig`
--

DROP TABLE IF EXISTS `SBConfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SBConfig` (
  `param_name` varchar(255) DEFAULT NULL,
  `param_value` varchar(255) DEFAULT NULL,
  UNIQUE KEY `param_name` (`param_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SBConfig`
--

LOCK TABLES `SBConfig` WRITE;
/*!40000 ALTER TABLE `SBConfig` DISABLE KEYS */;
/*!40000 ALTER TABLE `SBConfig` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SBResellers`
--

DROP TABLE IF EXISTS `SBResellers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SBResellers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `client_id` int(10) unsigned NOT NULL,
  `sb_client_login` varchar(255) NOT NULL,
  `sb_reseller_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `client_id` (`client_id`),
  UNIQUE KEY `sb_client_login` (`sb_client_login`),
  UNIQUE KEY `sb_reseller_id` (`sb_reseller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SBResellers`
--

LOCK TABLES `SBResellers` WRITE;
/*!40000 ALTER TABLE `SBResellers` DISABLE KEYS */;
/*!40000 ALTER TABLE `SBResellers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ScheduledTasks`
--

DROP TABLE IF EXISTS `ScheduledTasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ScheduledTasks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `hash` varchar(255) NOT NULL,
  `serviceNodeId` int(10) unsigned NOT NULL,
  `sysUserId` int(10) unsigned DEFAULT NULL,
  `sysUserLogin` varchar(255) DEFAULT NULL,
  `isActive` int(1) NOT NULL DEFAULT 0,
  `type` enum('exec','http','php') NOT NULL DEFAULT 'exec',
  `phpHandlerId` varchar(255) DEFAULT NULL,
  `command` text NOT NULL,
  `arguments` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `notify` enum('ignore','errors','always') NOT NULL DEFAULT 'ignore',
  `emailType` enum('default','owner','custom') NOT NULL DEFAULT 'owner',
  `email` text DEFAULT NULL,
  `minute` varchar(255) NOT NULL,
  `hour` varchar(255) NOT NULL,
  `dayOfMonth` varchar(255) NOT NULL,
  `month` varchar(255) NOT NULL,
  `dayOfWeek` varchar(255) NOT NULL,
  `period` int(11) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `serviceNodeId` (`serviceNodeId`),
  KEY `sysUserId` (`sysUserId`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ScheduledTasks`
--

LOCK TABLES `ScheduledTasks` WRITE;
/*!40000 ALTER TABLE `ScheduledTasks` DISABLE KEYS */;
INSERT INTO `ScheduledTasks` VALUES (1,'0xb4af9b8f6f2f9be7ed4c4d4233357c97',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/catalog/scripts/update-index.php\'','','Extension catalog','ignore','owner','','57','4','*','*','*',86400),(2,'0x64d833d005c81063c6401660a9aa98fb',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/notifier/scripts/check-compatible-tls.php\'','','Extension notifier','ignore','owner','','2','7','*','*','*',86400),(3,'0x42fa6023340c780f029651525b58b6c6',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/notifier/scripts/check-mail-ports.php\'','','Extension notifier','ignore','owner','','30','2','*','*','*',86400),(4,'0x1cf1a4cb24a8b7e7ac53212d314ff6c3',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/galileo/scripts/galileo-every-hour.php\'','','Extension galileo','ignore','owner','','39','*','*','*','*',3600),(5,'0x27a1b4cca4b697063d54dd06798031ff',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/platform360/scripts/check-secret-key.php\'','','Extension platform360','ignore','owner','','0','12','*','*','*',86400),(6,'0x7b6310e31155ceade36ba1330b81f8b0',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/platform360/scripts/check-plesk-version.php\'','','Extension platform360','ignore','owner','','27','12','*','*','3',604800),(7,'0x0985e5e9b1127cf62da05a3566af0725',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/wp-toolkit/scripts/maintenance.php\'','','Extension wp-toolkit','ignore','owner','','44','*','*','*','*',3600),(8,'0x0333ef19ed6f9e95466624a3f803f8fd',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/wp-toolkit/scripts/instances-auto-update.php\'','','Extension wp-toolkit','ignore','owner','','39','5','*','*','*',86400),(9,'0xbd4ffbd945a269a23b7badddcfa59877',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/advisor/scripts/update-cache.php\'','','Extension advisor','ignore','owner','','0','0','*','*','*',86400),(10,'0x5e2deea7c278e5c98b792490df9101f0',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/advisor/scripts/update-config.php\'','','Extension advisor','ignore','owner','','0','10','*','*','*',86400),(13,'0xaa2052b4ee99dd9ed47b9473a6c66a8e',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/xovi/scripts/analyze-logs.php\'','','Extension xovi','ignore','owner','','54','3','*','*','*',86400),(15,'0x0eff527b920d0b25013cfb8cc1c8f7a6',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/xovi/scripts/clear-cache.php\'','','Extension xovi','ignore','owner','','0','0','*','*','0',604800),(21,'0x16ee951a45abdfc394b0075e6576dcdd',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/sslit/scripts/keep-secured.php\'','','Extension sslit','ignore','owner','','54','*','*','*','*',3600),(22,'0xd93de60ab82b3616af6bdd95ded4ca44',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/sslit/scripts/complete-order.php\'','','Extension sslit','ignore','owner','','7','*','*','*','*',3600),(23,'0x886f8c7afa1144bf620bb8c8ea94dbf7',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/sslit/scripts/daily-tasks.php\'','','Extension sslit','ignore','owner','','8','9','*','*','*',86400),(24,'0x158e026f74abe055caa6c468f5414a22',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/sslit/scripts/panel-notifications.php\'','','Extension sslit','ignore','owner','','35','*','*','*','*',3600),(25,'0x0af60be6a5811f019430170ef7fcfdfc',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/letsencrypt/scripts/remove-expired-tokens.php\'','','Extension letsencrypt','ignore','owner','','31','22','*','*','1',604800),(26,'0x6a7d441dd4d8681e2090b551146a7102',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/letsencrypt/scripts/maintenance.php\'','','Extension letsencrypt','ignore','owner','','45','14','*','*','*',86400),(27,'0x791f38af9cfd8f8c7c9d5978f6e691cf',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/composer/scripts/refresh-packages.php\'','','Extension composer','ignore','owner','','8','23','*','*','3',604800),(28,'0x7472cc71845ba0681f32e3980ba4549c',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/composer/scripts/update-plugins.php\'','','Extension composer','ignore','owner','','5','1','*','*','2',604800),(29,'0x90d868a69b50227c7b9f7a7f9a42fcd5',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/composer/scripts/self-update.php\'','','Extension composer','ignore','owner','','28','23','*','*','3',604800),(30,'0x4b9e8d130b4beb64b4a7bf592af21be1',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/monitoring/scripts/detect-hardware-changes.php\'','','Extension monitoring','ignore','owner','','4','*','*','*','*',3600),(31,'0xe08b0c358e919fda433c253b53760d31',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/monitoring/scripts/cloud-alerts.php\'','','Extension monitoring','ignore','owner','','7,17,27,37,47,57','*','*','*','*',0),(32,'0x7c01048bd3c4d095e248da472ac40e1c',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/monitoring/scripts/update-agent-version.php\'','','Extension monitoring','ignore','owner','','27','9','*','*','*',86400),(33,'0xc7d2bc3489ad734bfa91bcccf58d470a',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/log-browser/scripts/parse-logs.php\'','','Extension log-browser','ignore','owner','','13','*','*','*','*',3600),(37,'0xa44c79cb62eac21529efa56763046ae0',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/nodejs/scripts/nodejs-auto-update.php\'','','Extension nodejs','ignore','owner','','21','2','*','*','5',604800),(41,'0x89f0330c8c2aecc2c0422b01212d8648',1,NULL,'root',1,'exec',NULL,'cd /var/www/vhosts/fetishmegastore.com/httpdocs && /opt/psa/admin/bin/php artisan translations:json','','','ignore','owner','','00','00','*','*','*',86400),(42,'0xadfe87fa261b7d253d32a718fde2af01',1,NULL,'root',1,'exec',NULL,'cd /var/www/vhosts/fetishmegastore.com/httpdocs && /opt/psa/admin/bin/php artisan video-convert','','','ignore','owner','','*','*','*','*','*',0),(43,'0xdb3ca068bdf114b4a24d239a339c2e71',1,NULL,'root',1,'exec',NULL,'cd /var/www/vhosts/fetishmegastore.com/httpdocs && /opt/psa/admin/bin/php artisan create-gif','','','ignore','owner','','*','*','*','*','*',0),(44,'0x0a7abdc4c907ce839abe35ad3ff78e0a',1,NULL,'root',1,'exec',NULL,'cd /var/www/vhosts/fetishmegastore.com/httpdocs && /opt/psa/admin/bin/php artisan check-and-remove','','','ignore','owner','','00','00','*','*','sun',604800),(45,'0x8287a6fec2435c086420989a87483be4',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/xovi/scripts/siteaudit-rescan.php\'','','Extension xovi','ignore','owner','','7','4','*','*','*',86400),(52,'0x0d930cdf34aaac8d83d983071c9ed02e',1,NULL,'root',1,'exec',NULL,'cd /var/www/vhosts/fetishmegastore.com/httpdocs && /opt/psa/admin/bin/php artisan move-to-bunny','','','ignore','owner','','*','*','*','*','*',0),(59,'0x7a0460c9ebe4a09b733950e33a6d52b6',1,NULL,'root',1,'exec',NULL,'cd /var/www/vhosts/fetishmegastore.com/httpdocs && /opt/psa/admin/bin/php artisan removepurchasedvideos','','','ignore','owner','','00','00','*','*','*',86400),(67,'0xd417b0334f6f924448d36d148bb8af71',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/xovi/scripts/seo-kpi.php\'','','Extension xovi','ignore','owner','','06,38','*','*','*','*',0),(68,'0x64eb80118e70aa0afc57310d4d4e50dc',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/revisium-antivirus/scripts/periodic-scan.php\'','','Extension revisium-antivirus','ignore','owner','','42','6','12','*','*',2592000),(69,'0x145089ffcc4e49a28704977cae9b1bda',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/revisium-antivirus/scripts/cleanup.php\'','','Extension revisium-antivirus','ignore','owner','','0','5','*','*','*',86400),(70,'0x6936c3811f35da1380debef698fa4e79',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/revisium-antivirus/scripts/tools_update.php\'','','Extension revisium-antivirus','ignore','owner','','17','6','*/2','*','*',0),(71,'0xf88ac08bae172a969f63844f8d1147d5',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/revisium-antivirus/scripts/ra_executor_run.php\'','','Extension revisium-antivirus','ignore','owner','','7,22,37,52','*','*','*','*',0),(72,'0xbaf28775b56c777dfbd0602f08689e9e',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/revisium-antivirus/scripts/send_stats.php\'','','Extension revisium-antivirus','ignore','owner','','31','8','*','*','2',604800),(73,'0x14313f821057331e25d7c3696851bafa',1,NULL,'psaadm',1,'exec',NULL,'/opt/psa/admin/bin/php -dauto_prepend_file=sdk.php \'/opt/psa/admin/plib/modules/log-browser/scripts/rotate-mail.php\'','','Extension log-browser','ignore','owner','','9','2','*','*','*',86400);
/*!40000 ALTER TABLE `ScheduledTasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SchemaVersions`
--

DROP TABLE IF EXISTS `SchemaVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SchemaVersions` (
  `version` varchar(14) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SchemaVersions`
--

LOCK TABLES `SchemaVersions` WRITE;
/*!40000 ALTER TABLE `SchemaVersions` DISABLE KEYS */;
INSERT INTO `SchemaVersions` VALUES ('20240808110032');
/*!40000 ALTER TABLE `SchemaVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SecretKeys`
--

DROP TABLE IF EXISTS `SecretKeys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SecretKeys` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `clientId` int(10) unsigned DEFAULT NULL,
  `hash` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `lookupId` varchar(8) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `clientId` (`clientId`),
  KEY `lookupId` (`lookupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SecretKeys`
--

LOCK TABLES `SecretKeys` WRITE;
/*!40000 ALTER TABLE `SecretKeys` DISABLE KEYS */;
/*!40000 ALTER TABLE `SecretKeys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SecretKeysIpAddresses`
--

DROP TABLE IF EXISTS `SecretKeysIpAddresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SecretKeysIpAddresses` (
  `keyId` int(10) unsigned NOT NULL,
  `ipAddress` varchar(39) NOT NULL,
  PRIMARY KEY (`ipAddress`,`keyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SecretKeysIpAddresses`
--

LOCK TABLES `SecretKeysIpAddresses` WRITE;
/*!40000 ALTER TABLE `SecretKeysIpAddresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `SecretKeysIpAddresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ServiceNodeCache`
--

DROP TABLE IF EXISTS `ServiceNodeCache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ServiceNodeCache` (
  `serviceNodeId` int(10) unsigned NOT NULL,
  `pathId` varchar(255) NOT NULL,
  `path` text DEFAULT NULL,
  `cache` text DEFAULT NULL,
  PRIMARY KEY (`serviceNodeId`,`pathId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ServiceNodeCache`
--

LOCK TABLES `ServiceNodeCache` WRITE;
/*!40000 ALTER TABLE `ServiceNodeCache` DISABLE KEYS */;
/*!40000 ALTER TABLE `ServiceNodeCache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ServiceNodeCertificates`
--

DROP TABLE IF EXISTS `ServiceNodeCertificates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ServiceNodeCertificates` (
  `serviceNodeId` int(10) unsigned NOT NULL,
  `certificateId` int(10) unsigned NOT NULL,
  `certFile` varchar(255) DEFAULT NULL,
  `caFile` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`serviceNodeId`,`certificateId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ServiceNodeCertificates`
--

LOCK TABLES `ServiceNodeCertificates` WRITE;
/*!40000 ALTER TABLE `ServiceNodeCertificates` DISABLE KEYS */;
/*!40000 ALTER TABLE `ServiceNodeCertificates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ServiceNodeConfiguration`
--

DROP TABLE IF EXISTS `ServiceNodeConfiguration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ServiceNodeConfiguration` (
  `serviceNodeId` int(10) unsigned NOT NULL,
  `section` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  PRIMARY KEY (`serviceNodeId`,`section`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ServiceNodeConfiguration`
--

LOCK TABLES `ServiceNodeConfiguration` WRITE;
/*!40000 ALTER TABLE `ServiceNodeConfiguration` DISABLE KEYS */;
INSERT INTO `ServiceNodeConfiguration` VALUES (1,'dnsConnector','plesk','true'),(1,'MailGate','allowUsers','false'),(1,'MailGate','host','127.0.0.1'),(1,'MailGate','login',''),(1,'MailGate','password','$AES-128-CBC$4dwNl1wXDJPfmMnsGfbPKg==$84/RBVCKGStfd8rndvbSaH80FCRHQI3dfeW8dWZdY70='),(1,'MailGate','port','24'),(1,'MailGate','protocol','smtp'),(1,'MailGate','tls','false'),(1,'mailServer','disable_pop_auth','1'),(1,'mailServer','disable_smtp_auth','0'),(1,'mailServer','dmarc_policy','true'),(1,'mailServer','domain_keys_sign','true'),(1,'mailServer','domain_keys_verify','true'),(1,'mailServer','email_subaddressing_enable','false'),(1,'mailServer','imap_max_connections','1024'),(1,'mailServer','imap_max_connections_per_ip','10'),(1,'mailServer','inbound_ssl','true'),(1,'mailServer','inbound_ssl_cert_id','2'),(1,'mailServer','outgoing_email_mode','domain-ip'),(1,'mailServer','outgoing_messages_domain_limit','50'),(1,'mailServer','outgoing_messages_enable_sendmail','true'),(1,'mailServer','outgoing_messages_filter_enabled','false'),(1,'mailServer','outgoing_messages_mbox_limit','10'),(1,'mailServer','outgoing_messages_notification_period','PT1H'),(1,'mailServer','outgoing_messages_report_period','P1W'),(1,'mailServer','outgoing_messages_subscription_limit','100'),(1,'mailServer','poplock_time','20'),(1,'mailServer','relay','auth'),(1,'mailServer','spamfilter_enabled','true'),(1,'mailServer','spamfilter_max_children','5'),(1,'mailServer','spamfilter_use_mailuser_prefs','true'),(1,'mailServer','spf_behavior','1'),(1,'mailServer','spf_dnserrignore','true'),(1,'mailServer','spf_enabled','true'),(1,'phphandlers','plesk-php82-cgi','<?xml version=\"1.0\"?>\n<handler-configuration><enabled>false</enabled></handler-configuration>\n'),(1,'phphandlers','plesk-php82-fastcgi','<?xml version=\"1.0\"?>\n<handler-configuration><enabled>true</enabled></handler-configuration>\n'),(1,'phphandlers','plesk-php82-fpm','<?xml version=\"1.0\"?>\n<handler-configuration><enabled>true</enabled></handler-configuration>\n'),(1,'phphandlers','plesk-php82-fpm-dedicated','<?xml version=\"1.0\"?>\n<handler-configuration><enabled>true</enabled></handler-configuration>\n'),(1,'phphandlers','plesk-php83-cgi','<?xml version=\"1.0\"?>\n<handler-configuration><enabled>false</enabled></handler-configuration>\n'),(1,'phphandlers','plesk-php83-fastcgi','<?xml version=\"1.0\"?>\n<handler-configuration><enabled>true</enabled></handler-configuration>\n'),(1,'phphandlers','plesk-php83-fpm','<?xml version=\"1.0\"?>\n<handler-configuration><enabled>true</enabled></handler-configuration>\n'),(1,'phphandlers','plesk-php83-fpm-dedicated','<?xml version=\"1.0\"?>\n<handler-configuration><enabled>true</enabled></handler-configuration>\n'),(1,'webProxy','enabled','true'),(1,'webProxy','frontendPort','80'),(1,'webProxy','http2Enabled','true'),(1,'webProxy','sslFrontendPort','443'),(1,'webServer','httpPort','7080'),(1,'webServer','httpsPort','7081'),(1,'webServer','webServerSettingsId','5');
/*!40000 ALTER TABLE `ServiceNodeConfiguration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ServiceNodeEnvironment`
--

DROP TABLE IF EXISTS `ServiceNodeEnvironment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ServiceNodeEnvironment` (
  `serviceNodeId` int(10) unsigned NOT NULL,
  `section` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  PRIMARY KEY (`serviceNodeId`,`section`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ServiceNodeEnvironment`
--

LOCK TABLES `ServiceNodeEnvironment` WRITE;
/*!40000 ALTER TABLE `ServiceNodeEnvironment` DISABLE KEYS */;
INSERT INTO `ServiceNodeEnvironment` VALUES (1,'componentsPackages','awstats','7.8-2ubuntu0.22.04.1'),(1,'componentsPackages','bind','1:9.18.28-0ubuntu0.22.04.1'),(1,'componentsPackages','curl','7.81.0-1ubuntu1.18'),(1,'componentsPackages','dovecot','2.3.21.1-v.ubuntu.22.04+p18.0.64.0+t240905.0717'),(1,'componentsPackages','dovecot-pigeonhole','0.5.21-v.ubuntu.22.04+p18.0.64.0+t240905.0717'),(1,'componentsPackages','fail2ban','1:1.1.0-v.ubuntu.22.04+p18.0.63.0+t240725.0655'),(1,'componentsPackages','httpd','2.4.52-1ubuntu4.12'),(1,'componentsPackages','modsecurity','1:2.9.7-v.ubuntu.22.04+p18.0.63.0+t240715.1009'),(1,'componentsPackages','msmtp',''),(1,'componentsPackages','mysql','1:10.6.18-0ubuntu0.22.04.1'),(1,'componentsPackages','nginx','1.26.2-v.ubuntu.22.04+p18.0.64.0+t240905.0717'),(1,'componentsPackages','nss','2:3.98-0ubuntu0.22.04.2'),(1,'componentsPackages','openssl','3.0.2-0ubuntu1.18'),(1,'componentsPackages','php82','8.2.24-ubuntu.22.04.240926.1951'),(1,'componentsPackages','php83','8.3.12-ubuntu.22.04.240926.1652'),(1,'componentsPackages','phpmyadmin','5.2.1-v.ubuntu.22.04+p18.0.63.0+t240716.1520'),(1,'componentsPackages','postfix','3.6.4-1ubuntu1.3'),(1,'componentsPackages','psa','18.0.64-v.ubuntu.22.04+p18.0.64.0+t240902.1413'),(1,'componentsPackages','psa-api-rpc','18.0-v.ubuntu.22.04+p18.0.64.0+t240911.1329'),(1,'componentsPackages','psa-autoinstaller','3.64.0-ubuntu.22.04.240819.0536'),(1,'componentsPackages','psa-backup-manager','18.0-v.ubuntu.22.04+p18.0.64.0+t240911.1329'),(1,'componentsPackages','psa-logrotate','3.22.0-v.ubuntu.22.04+p18.0.63.0+t240725.0655'),(1,'componentsPackages','psa-mod-fcgid-configurator','2.3.9.5-v.ubuntu.22.04+p18.0.63.0+t240715.1009'),(1,'componentsPackages','psa-proftpd','1.3.8b-v.ubuntu.22.04+p18.0.63.0+t240725.0655'),(1,'componentsPackages','roundcube','1.6.9-v.ubuntu.22.04+p18.0.64.0+t240901.2203'),(1,'componentsPackages','synced','1727763990'),(1,'componentsPackages','webalizer','2.23.08-3.2'),(1,'configuration','AWSTATS_BIN_D','/usr/lib/cgi-bin'),(1,'configuration','AWSTATS_DOC_D','/usr/share/awstats'),(1,'configuration','AWSTATS_ETC_D','/etc/awstats'),(1,'configuration','AWSTATS_TOOLS_D','/usr/share/awstats/tools'),(1,'configuration','CGI_GIT_BIN','/var/www/cgi-bin/cgi_wrapper/git_wrapper'),(1,'configuration','CGI_PHP_BIN','/var/www/cgi-bin/cgi_wrapper/cgi_wrapper'),(1,'configuration','ENV_TYPE','HW'),(1,'configuration','FULLHOSTNAME','s10860938.dedi.leaseweb.net'),(1,'configuration','HTTPD_BIN','/usr/sbin/apache2'),(1,'configuration','HTTPD_CONF_D','/etc/apache2'),(1,'configuration','HTTPD_INCLUDE_D','/etc/apache2/conf-enabled'),(1,'configuration','HTTPD_LOG_D','/var/log/apache2'),(1,'configuration','HTTPD_SERVICE','apache2'),(1,'configuration','HTTPD_VHOSTS_D','/var/www/vhosts'),(1,'configuration','LIB_CRYPTO_PATH','/lib/libcrypto.so'),(1,'configuration','LIB_SSL_PATH','/lib/libssl.so'),(1,'configuration','MYSQL_BIN_D','/usr/bin'),(1,'configuration','MYSQL_VAR_D','/var/lib/mysql'),(1,'configuration','NGINX_CONF_DIR','/etc/nginx'),(1,'configuration','NGINX_INCLUDE_D','/etc/nginx/conf.d'),(1,'configuration','OPENSSL_BIN','/usr/bin/openssl'),(1,'configuration','PRODUCT_RC_D','/etc/init.d'),(1,'configuration','PRODUCT_ROOT_D','/opt/psa'),(1,'configuration','PYTHON_BIN','/usr/bin/python2'),(1,'configuration','SNI_SUPPORT','true'),(1,'configuration','synced','1727763993'),(1,'configuration','TAR_BIN','/usr/lib/plesk-9.0/sw-tar'),(1,'configuration','WEB_STAT','/usr/bin/webalizer'),(1,'dns','caa_records','true'),(1,'dns','custom_configuration','true'),(1,'dns','DNSSEC','true'),(1,'dns','DNSSEC_ALGS','RSAMD5 | RSASHA1 | RSASHA256 | RSASHA512 | DSA | ECCGOST | ECDSAP256SHA256 | ECDSAP384SHA384 | NSEC3RSASHA1 | NSEC3DSA'),(1,'dns','DNS_Server','BIND'),(1,'dns','DNS_Server_package','bind'),(1,'dns','https_records','true'),(1,'dns','synced','1727763993'),(1,'fail2ban','status','on'),(1,'fail2ban','synced','1728086402'),(1,'ftpservice','FTP_Bandwidth','1'),(1,'ftpservice','FTP_DiskQuota','1'),(1,'ftpservice','FTP_ExplicitSSL','1'),(1,'ftpservice','FTP_PamFacility','proftpd'),(1,'ftpservice','FTP_Server','ProFTPd'),(1,'ftpservice','FTP_Server_package','proftpd'),(1,'ftpservice','synced','1727763990'),(1,'mail','AccountsFormat_Both','true'),(1,'mail','AccountsFormat_Compound','true'),(1,'mail','AccountsFormat_Set','true'),(1,'mail','AccountsFormat_Simple','false'),(1,'mail','Common_BadMail','true'),(1,'mail','Common_MaxLetterSize','true'),(1,'mail','Common_SetMaxLetterSize','true'),(1,'mail','Domain_Bounce','true'),(1,'mail','Domain_Catch','true'),(1,'mail','Domain_Enable','true'),(1,'mail','Domain_MaxMessagesPerHour','true'),(1,'mail','Domain_MaxMessagesPerHourSoft','false'),(1,'mail','Domain_Quota','true'),(1,'mail','Domain_Reject','true'),(1,'mail','Domain_SetBounce','true'),(1,'mail','Domain_SetCatch','true'),(1,'mail','Domain_SetCertificate','true'),(1,'mail','Domain_SetEnable','true'),(1,'mail','Domain_SetName','true'),(1,'mail','Domain_SetQuota','true'),(1,'mail','IMAP_POP3_Domain_SetCertificate','true'),(1,'mail','IMAP_POP3_Server','Dovecot'),(1,'mail','IMAP_POP3_Server_package','dovecot'),(1,'mail','MailName_Aliases','true'),(1,'mail','MailName_AutoResponder','true'),(1,'mail','MailName_Forward','true'),(1,'mail','MailName_MaxMessagesPerHour','true'),(1,'mail','MailName_MaxMessagesPerHourSoft','false'),(1,'mail','MailName_MultiForward','true'),(1,'mail','MailName_Password','true'),(1,'mail','MailName_Postbox','true'),(1,'mail','MailName_Quota','true'),(1,'mail','MailName_SetAutoResponder','true'),(1,'mail','MailName_SetDomain','true'),(1,'mail','MailName_SetForward','true'),(1,'mail','MailName_SetName','true'),(1,'mail','MailName_SetPassword','true'),(1,'mail','MailName_SetPostbox','true'),(1,'mail','MailName_SetQuota','true'),(1,'mail','MailName_Size','true'),(1,'mail','Mail_Attachments','true'),(1,'mail','Mail_Forward','true'),(1,'mail','Mail_Send','true'),(1,'mail','MapsProtection','true'),(1,'mail','Message_Submission','true'),(1,'mail','Message_Submission_all_IP','true'),(1,'mail','Message_Submission_Dedicated_IP','false'),(1,'mail','Relay','true'),(1,'mail','Relay_AuthorizationIsRequired','true'),(1,'mail','Relay_AuthType_None','true'),(1,'mail','Relay_AuthType_POP3','false'),(1,'mail','Relay_AuthType_POP3_SMTP','false'),(1,'mail','Relay_AuthType_SMTP','true'),(1,'mail','Relay_BlackList','true'),(1,'mail','Relay_Closed','true'),(1,'mail','Relay_Open','true'),(1,'mail','Relay_POP3_LockTime','false'),(1,'mail','Relay_Set','true'),(1,'mail','Relay_WhiteList','true'),(1,'mail','Relay_WhiteList_BlackList','true'),(1,'mail','Relay_WhiteList_Mask','true'),(1,'mail','SDD_Transport_Maps','true'),(1,'mail','SetMapsProtection','true'),(1,'mail','SMTP_Server','Postfix'),(1,'mail','SMTP_Server_package','postfix'),(1,'mail','Subaddressing','true'),(1,'mail','Subscription_MaxMessagesPerHour','true'),(1,'mail','Subscription_MaxMessagesPerHourSoft','false'),(1,'mail','synced','1727763993'),(1,'os','availableShells','a:12:{s:10:\"/bin/false\";a:3:{s:4:\"name\";s:9:\"Forbidden\";s:5:\"empty\";b:1;s:8:\"chrooted\";b:0;}s:7:\"/bin/sh\";a:3:{s:4:\"name\";s:7:\"/bin/sh\";s:5:\"empty\";b:0;s:8:\"chrooted\";b:0;}s:9:\"/bin/bash\";a:3:{s:4:\"name\";s:9:\"/bin/bash\";s:5:\"empty\";b:0;s:8:\"chrooted\";b:0;}s:13:\"/usr/bin/bash\";a:3:{s:4:\"name\";s:13:\"/usr/bin/bash\";s:5:\"empty\";b:0;s:8:\"chrooted\";b:0;}s:10:\"/bin/rbash\";a:3:{s:4:\"name\";s:10:\"/bin/rbash\";s:5:\"empty\";b:0;s:8:\"chrooted\";b:0;}s:14:\"/usr/bin/rbash\";a:3:{s:4:\"name\";s:14:\"/usr/bin/rbash\";s:5:\"empty\";b:0;s:8:\"chrooted\";b:0;}s:11:\"/usr/bin/sh\";a:3:{s:4:\"name\";s:11:\"/usr/bin/sh\";s:5:\"empty\";b:0;s:8:\"chrooted\";b:0;}s:9:\"/bin/dash\";a:3:{s:4:\"name\";s:9:\"/bin/dash\";s:5:\"empty\";b:0;s:8:\"chrooted\";b:0;}s:13:\"/usr/bin/dash\";a:3:{s:4:\"name\";s:13:\"/usr/bin/dash\";s:5:\"empty\";b:0;s:8:\"chrooted\";b:0;}s:13:\"/usr/bin/tmux\";a:3:{s:4:\"name\";s:13:\"/usr/bin/tmux\";s:5:\"empty\";b:0;s:8:\"chrooted\";b:0;}s:15:\"/usr/bin/screen\";a:3:{s:4:\"name\";s:15:\"/usr/bin/screen\";s:5:\"empty\";b:0;s:8:\"chrooted\";b:0;}s:21:\"/opt/psa/bin/chrootsh\";a:3:{s:4:\"name\";s:20:\"/bin/bash (chrooted)\";s:5:\"empty\";b:0;s:8:\"chrooted\";b:1;}}'),(1,'os','emptyShell','/bin/false'),(1,'os','isHardQuotaEnabled','false'),(1,'os','synced','1727763993'),(1,'phphandlers','plesk-php82-cgi','<?xml version=\"1.0\"?>\n<handler><id>plesk-php82-cgi</id><type>cgi</type><typeName>CGI application</typeName><version>8.2</version><fullVersion>8.2.24</fullVersion><displayname>8.2.24</displayname><path>/opt/plesk/php/8.2/bin/php-cgi</path><clipath>/opt/plesk/php/8.2/bin/php</clipath><phpini>/opt/plesk/php/8.2/etc/php.ini</phpini><custom>true</custom><registered>true</registered><service></service><poold></poold><byPlesk>true</byPlesk><outdated></outdated></handler>\n'),(1,'phphandlers','plesk-php82-fastcgi','<?xml version=\"1.0\"?>\n<handler><id>plesk-php82-fastcgi</id><type>fastcgi</type><typeName>FastCGI application</typeName><version>8.2</version><fullVersion>8.2.24</fullVersion><displayname>8.2.24</displayname><path>/opt/plesk/php/8.2/bin/php-cgi</path><clipath>/opt/plesk/php/8.2/bin/php</clipath><phpini>/opt/plesk/php/8.2/etc/php.ini</phpini><custom>true</custom><registered>true</registered><service></service><poold></poold><byPlesk>true</byPlesk><outdated></outdated></handler>\n'),(1,'phphandlers','plesk-php82-fpm','<?xml version=\"1.0\"?>\n<handler><id>plesk-php82-fpm</id><type>fpm</type><typeName>FPM application</typeName><version>8.2</version><fullVersion>8.2.24</fullVersion><displayname>8.2.24</displayname><path>/opt/plesk/php/8.2/sbin/php-fpm</path><clipath>/opt/plesk/php/8.2/bin/php</clipath><phpini>/opt/plesk/php/8.2/etc/php.ini</phpini><custom>true</custom><registered>true</registered><service>plesk-php82-fpm</service><poold>/opt/plesk/php/8.2/etc/php-fpm.d</poold><byPlesk>true</byPlesk><outdated></outdated></handler>\n'),(1,'phphandlers','plesk-php82-fpm-dedicated','<?xml version=\"1.0\"?>\n<handler><id>plesk-php82-fpm-dedicated</id><type>fpm</type><typeName>Dedicated FPM application</typeName><version>8.2</version><fullVersion>8.2.24</fullVersion><displayname>8.2.24</displayname><path>/opt/plesk/php/8.2/sbin/php-fpm</path><clipath>/opt/plesk/php/8.2/bin/php</clipath><phpini>/opt/plesk/php/8.2/etc/php.ini</phpini><custom>true</custom><registered>true</registered><service>plesk-php82-fpm</service><poold></poold><byPlesk>true</byPlesk><outdated></outdated></handler>\n'),(1,'phphandlers','plesk-php83-cgi','<?xml version=\"1.0\"?>\n<handler><id>plesk-php83-cgi</id><type>cgi</type><typeName>CGI application</typeName><version>8.3</version><fullVersion>8.3.12</fullVersion><displayname>8.3.12</displayname><path>/opt/plesk/php/8.3/bin/php-cgi</path><clipath>/opt/plesk/php/8.3/bin/php</clipath><phpini>/opt/plesk/php/8.3/etc/php.ini</phpini><custom>true</custom><registered>true</registered><service></service><poold></poold><byPlesk>true</byPlesk><outdated></outdated></handler>\n'),(1,'phphandlers','plesk-php83-fastcgi','<?xml version=\"1.0\"?>\n<handler><id>plesk-php83-fastcgi</id><type>fastcgi</type><typeName>FastCGI application</typeName><version>8.3</version><fullVersion>8.3.12</fullVersion><displayname>8.3.12</displayname><path>/opt/plesk/php/8.3/bin/php-cgi</path><clipath>/opt/plesk/php/8.3/bin/php</clipath><phpini>/opt/plesk/php/8.3/etc/php.ini</phpini><custom>true</custom><registered>true</registered><service></service><poold></poold><byPlesk>true</byPlesk><outdated></outdated></handler>\n'),(1,'phphandlers','plesk-php83-fpm','<?xml version=\"1.0\"?>\n<handler><id>plesk-php83-fpm</id><type>fpm</type><typeName>FPM application</typeName><version>8.3</version><fullVersion>8.3.12</fullVersion><displayname>8.3.12</displayname><path>/opt/plesk/php/8.3/sbin/php-fpm</path><clipath>/opt/plesk/php/8.3/bin/php</clipath><phpini>/opt/plesk/php/8.3/etc/php.ini</phpini><custom>true</custom><registered>true</registered><service>plesk-php83-fpm</service><poold>/opt/plesk/php/8.3/etc/php-fpm.d</poold><byPlesk>true</byPlesk><outdated></outdated></handler>\n'),(1,'phphandlers','plesk-php83-fpm-dedicated','<?xml version=\"1.0\"?>\n<handler><id>plesk-php83-fpm-dedicated</id><type>fpm</type><typeName>Dedicated FPM application</typeName><version>8.3</version><fullVersion>8.3.12</fullVersion><displayname>8.3.12</displayname><path>/opt/plesk/php/8.3/sbin/php-fpm</path><clipath>/opt/plesk/php/8.3/bin/php</clipath><phpini>/opt/plesk/php/8.3/etc/php.ini</phpini><custom>true</custom><registered>true</registered><service>plesk-php83-fpm</service><poold></poold><byPlesk>true</byPlesk><outdated></outdated></handler>\n'),(1,'phphandlers','synced','1727763993'),(1,'phpHandlersSettings','plesk-php82-cgi','<?xml version=\"1.0\"?>\n<handler><defaultValues><setting name=\"memory_limit\">128M</setting><setting name=\"post_max_size\">8M</setting><setting name=\"upload_max_filesize\">2M</setting><setting name=\"opcache.enable\">1</setting><setting name=\"wincache.ocenabled\"/><setting name=\"apc.enabled\"/><setting name=\"xcache.cacher\"/><setting name=\"disable_functions\"/><setting name=\"safe_mode\"/><setting name=\"safe_mode_include_dir\"/><setting name=\"safe_mode_exec_dir\"/><setting name=\"include_path\">.:/opt/plesk/php/8.2/share/pear</setting><setting name=\"session.save_path\">/var/lib/php/sessions</setting><setting name=\"mail.force_extra_parameters\"/><setting name=\"register_globals\"/><setting name=\"open_basedir\"/><setting name=\"error_reporting\">22527</setting><setting name=\"display_errors\"/><setting name=\"log_errors\">1</setting><setting name=\"allow_url_fopen\">1</setting><setting name=\"file_uploads\">1</setting><setting name=\"short_open_tag\"/><setting name=\"magic_quotes_gpc\"/><setting name=\"enableFastcgi\"/><setting name=\"maxInstances\"/><setting name=\"activityTimeout\"/><setting name=\"requestTimeout\"/><setting name=\"instanceMaxRequests\"/><setting name=\"queueLength\"/><setting name=\"rapidFailsPerMinute\"/><setting name=\"pm.max_children\"/><setting name=\"pm.max_requests\"/><setting name=\"pm\"/><setting name=\"pm.start_servers\"/><setting name=\"pm.min_spare_servers\"/><setting name=\"pm.max_spare_servers\"/><setting name=\"max_execution_time\">30</setting><setting name=\"max_input_time\">60</setting></defaultValues><modules><module name=\"bcmath\">1</module><module name=\"curl\">1</module><module name=\"dba\">1</module><module name=\"dom\">1</module><module name=\"enchant\">1</module><module name=\"fileinfo\">1</module><module name=\"gd\">1</module><module name=\"imagick\">1</module><module name=\"imap\">1</module><module name=\"intl\">1</module><module name=\"ldap\">1</module><module name=\"mbstring\">1</module><module name=\"mysqli\">1</module><module name=\"mysqlnd\">1</module><module name=\"odbc\">1</module><module name=\"opcache\">1</module><module name=\"pdo\">1</module><module name=\"pdo_mysql\">1</module><module name=\"pdo_odbc\">1</module><module name=\"pdo_pgsql\">1</module><module name=\"pdo_sqlite\">1</module><module name=\"pgsql\">1</module><module name=\"phar\">1</module><module name=\"posix\">1</module><module name=\"pspell\">1</module><module name=\"redis\">1</module><module name=\"snmp\"/><module name=\"soap\">1</module><module name=\"sodium\">1</module><module name=\"sqlite3\">1</module><module name=\"sysvmsg\">1</module><module name=\"sysvsem\">1</module><module name=\"sysvshm\">1</module><module name=\"tidy\">1</module><module name=\"xdebug\"/><module name=\"xmlreader\">1</module><module name=\"xmlwriter\">1</module><module name=\"xsl\">1</module><module name=\"zip\">1</module></modules></handler>\n'),(1,'phpHandlersSettings','plesk-php82-fastcgi','<?xml version=\"1.0\"?>\n<handler><defaultValues><setting name=\"memory_limit\">128M</setting><setting name=\"post_max_size\">8M</setting><setting name=\"upload_max_filesize\">2M</setting><setting name=\"opcache.enable\">1</setting><setting name=\"wincache.ocenabled\"/><setting name=\"apc.enabled\"/><setting name=\"xcache.cacher\"/><setting name=\"disable_functions\"/><setting name=\"safe_mode\"/><setting name=\"safe_mode_include_dir\"/><setting name=\"safe_mode_exec_dir\"/><setting name=\"include_path\">.:/opt/plesk/php/8.2/share/pear</setting><setting name=\"session.save_path\">/var/lib/php/sessions</setting><setting name=\"mail.force_extra_parameters\"/><setting name=\"register_globals\"/><setting name=\"open_basedir\"/><setting name=\"error_reporting\">22527</setting><setting name=\"display_errors\"/><setting name=\"log_errors\">1</setting><setting name=\"allow_url_fopen\">1</setting><setting name=\"file_uploads\">1</setting><setting name=\"short_open_tag\"/><setting name=\"magic_quotes_gpc\"/><setting name=\"enableFastcgi\"/><setting name=\"maxInstances\"/><setting name=\"activityTimeout\"/><setting name=\"requestTimeout\"/><setting name=\"instanceMaxRequests\"/><setting name=\"queueLength\"/><setting name=\"rapidFailsPerMinute\"/><setting name=\"pm.max_children\"/><setting name=\"pm.max_requests\"/><setting name=\"pm\"/><setting name=\"pm.start_servers\"/><setting name=\"pm.min_spare_servers\"/><setting name=\"pm.max_spare_servers\"/><setting name=\"max_execution_time\">30</setting><setting name=\"max_input_time\">60</setting></defaultValues><modules><module name=\"bcmath\">1</module><module name=\"curl\">1</module><module name=\"dba\">1</module><module name=\"dom\">1</module><module name=\"enchant\">1</module><module name=\"fileinfo\">1</module><module name=\"gd\">1</module><module name=\"imagick\">1</module><module name=\"imap\">1</module><module name=\"intl\">1</module><module name=\"ldap\">1</module><module name=\"mbstring\">1</module><module name=\"mysqli\">1</module><module name=\"mysqlnd\">1</module><module name=\"odbc\">1</module><module name=\"opcache\">1</module><module name=\"pdo\">1</module><module name=\"pdo_mysql\">1</module><module name=\"pdo_odbc\">1</module><module name=\"pdo_pgsql\">1</module><module name=\"pdo_sqlite\">1</module><module name=\"pgsql\">1</module><module name=\"phar\">1</module><module name=\"posix\">1</module><module name=\"pspell\">1</module><module name=\"redis\">1</module><module name=\"snmp\"/><module name=\"soap\">1</module><module name=\"sodium\">1</module><module name=\"sqlite3\">1</module><module name=\"sysvmsg\">1</module><module name=\"sysvsem\">1</module><module name=\"sysvshm\">1</module><module name=\"tidy\">1</module><module name=\"xdebug\"/><module name=\"xmlreader\">1</module><module name=\"xmlwriter\">1</module><module name=\"xsl\">1</module><module name=\"zip\">1</module></modules></handler>\n'),(1,'phpHandlersSettings','plesk-php82-fpm','<?xml version=\"1.0\"?>\n<handler><defaultValues><setting name=\"memory_limit\">128M</setting><setting name=\"post_max_size\">8M</setting><setting name=\"upload_max_filesize\">2M</setting><setting name=\"opcache.enable\">1</setting><setting name=\"wincache.ocenabled\"/><setting name=\"apc.enabled\"/><setting name=\"xcache.cacher\"/><setting name=\"disable_functions\"/><setting name=\"safe_mode\"/><setting name=\"safe_mode_include_dir\"/><setting name=\"safe_mode_exec_dir\"/><setting name=\"include_path\">.:/opt/plesk/php/8.2/share/pear</setting><setting name=\"session.save_path\">/var/lib/php/sessions</setting><setting name=\"mail.force_extra_parameters\"/><setting name=\"register_globals\"/><setting name=\"open_basedir\"/><setting name=\"error_reporting\">22527</setting><setting name=\"display_errors\"/><setting name=\"log_errors\">1</setting><setting name=\"allow_url_fopen\">1</setting><setting name=\"file_uploads\">1</setting><setting name=\"short_open_tag\"/><setting name=\"magic_quotes_gpc\"/><setting name=\"enableFastcgi\"/><setting name=\"maxInstances\"/><setting name=\"activityTimeout\"/><setting name=\"requestTimeout\"/><setting name=\"instanceMaxRequests\"/><setting name=\"queueLength\"/><setting name=\"rapidFailsPerMinute\"/><setting name=\"pm.max_children\"/><setting name=\"pm.max_requests\"/><setting name=\"pm\"/><setting name=\"pm.start_servers\"/><setting name=\"pm.min_spare_servers\"/><setting name=\"pm.max_spare_servers\"/><setting name=\"max_execution_time\">30</setting><setting name=\"max_input_time\">60</setting></defaultValues><modules><module name=\"bcmath\">1</module><module name=\"curl\">1</module><module name=\"dba\">1</module><module name=\"dom\">1</module><module name=\"enchant\">1</module><module name=\"fileinfo\">1</module><module name=\"gd\">1</module><module name=\"imagick\">1</module><module name=\"imap\">1</module><module name=\"intl\">1</module><module name=\"ldap\">1</module><module name=\"mbstring\">1</module><module name=\"mysqli\">1</module><module name=\"mysqlnd\">1</module><module name=\"odbc\">1</module><module name=\"opcache\">1</module><module name=\"pdo\">1</module><module name=\"pdo_mysql\">1</module><module name=\"pdo_odbc\">1</module><module name=\"pdo_pgsql\">1</module><module name=\"pdo_sqlite\">1</module><module name=\"pgsql\">1</module><module name=\"phar\">1</module><module name=\"posix\">1</module><module name=\"pspell\">1</module><module name=\"redis\">1</module><module name=\"snmp\"/><module name=\"soap\">1</module><module name=\"sodium\">1</module><module name=\"sqlite3\">1</module><module name=\"sysvmsg\">1</module><module name=\"sysvsem\">1</module><module name=\"sysvshm\">1</module><module name=\"tidy\">1</module><module name=\"xdebug\"/><module name=\"xmlreader\">1</module><module name=\"xmlwriter\">1</module><module name=\"xsl\">1</module><module name=\"zip\">1</module></modules></handler>\n'),(1,'phpHandlersSettings','plesk-php82-fpm-dedicated','<?xml version=\"1.0\"?>\n<handler><defaultValues><setting name=\"memory_limit\">128M</setting><setting name=\"post_max_size\">8M</setting><setting name=\"upload_max_filesize\">2M</setting><setting name=\"opcache.enable\">1</setting><setting name=\"wincache.ocenabled\"/><setting name=\"apc.enabled\"/><setting name=\"xcache.cacher\"/><setting name=\"disable_functions\"/><setting name=\"safe_mode\"/><setting name=\"safe_mode_include_dir\"/><setting name=\"safe_mode_exec_dir\"/><setting name=\"include_path\">.:/opt/plesk/php/8.2/share/pear</setting><setting name=\"session.save_path\">/var/lib/php/sessions</setting><setting name=\"mail.force_extra_parameters\"/><setting name=\"register_globals\"/><setting name=\"open_basedir\"/><setting name=\"error_reporting\">22527</setting><setting name=\"display_errors\"/><setting name=\"log_errors\">1</setting><setting name=\"allow_url_fopen\">1</setting><setting name=\"file_uploads\">1</setting><setting name=\"short_open_tag\"/><setting name=\"magic_quotes_gpc\"/><setting name=\"enableFastcgi\"/><setting name=\"maxInstances\"/><setting name=\"activityTimeout\"/><setting name=\"requestTimeout\"/><setting name=\"instanceMaxRequests\"/><setting name=\"queueLength\"/><setting name=\"rapidFailsPerMinute\"/><setting name=\"pm.max_children\"/><setting name=\"pm.max_requests\"/><setting name=\"pm\"/><setting name=\"pm.start_servers\"/><setting name=\"pm.min_spare_servers\"/><setting name=\"pm.max_spare_servers\"/><setting name=\"max_execution_time\">30</setting><setting name=\"max_input_time\">60</setting></defaultValues><modules><module name=\"bcmath\">1</module><module name=\"curl\">1</module><module name=\"dba\">1</module><module name=\"dom\">1</module><module name=\"enchant\">1</module><module name=\"fileinfo\">1</module><module name=\"gd\">1</module><module name=\"imagick\">1</module><module name=\"imap\">1</module><module name=\"intl\">1</module><module name=\"ldap\">1</module><module name=\"mbstring\">1</module><module name=\"mysqli\">1</module><module name=\"mysqlnd\">1</module><module name=\"odbc\">1</module><module name=\"opcache\">1</module><module name=\"pdo\">1</module><module name=\"pdo_mysql\">1</module><module name=\"pdo_odbc\">1</module><module name=\"pdo_pgsql\">1</module><module name=\"pdo_sqlite\">1</module><module name=\"pgsql\">1</module><module name=\"phar\">1</module><module name=\"posix\">1</module><module name=\"pspell\">1</module><module name=\"redis\">1</module><module name=\"snmp\"/><module name=\"soap\">1</module><module name=\"sodium\">1</module><module name=\"sqlite3\">1</module><module name=\"sysvmsg\">1</module><module name=\"sysvsem\">1</module><module name=\"sysvshm\">1</module><module name=\"tidy\">1</module><module name=\"xdebug\"/><module name=\"xmlreader\">1</module><module name=\"xmlwriter\">1</module><module name=\"xsl\">1</module><module name=\"zip\">1</module></modules></handler>\n'),(1,'phpHandlersSettings','plesk-php83-cgi','<?xml version=\"1.0\"?>\n<handler><defaultValues><setting name=\"memory_limit\">128M</setting><setting name=\"post_max_size\">8M</setting><setting name=\"upload_max_filesize\">2M</setting><setting name=\"opcache.enable\">1</setting><setting name=\"wincache.ocenabled\"/><setting name=\"apc.enabled\"/><setting name=\"xcache.cacher\"/><setting name=\"disable_functions\"/><setting name=\"safe_mode\"/><setting name=\"safe_mode_include_dir\"/><setting name=\"safe_mode_exec_dir\"/><setting name=\"include_path\">.:/opt/plesk/php/8.3/share/pear</setting><setting name=\"session.save_path\">/var/lib/php/sessions</setting><setting name=\"mail.force_extra_parameters\"/><setting name=\"register_globals\"/><setting name=\"open_basedir\"/><setting name=\"error_reporting\">22527</setting><setting name=\"display_errors\"/><setting name=\"log_errors\">1</setting><setting name=\"allow_url_fopen\">1</setting><setting name=\"file_uploads\">1</setting><setting name=\"short_open_tag\"/><setting name=\"magic_quotes_gpc\"/><setting name=\"enableFastcgi\"/><setting name=\"maxInstances\"/><setting name=\"activityTimeout\"/><setting name=\"requestTimeout\"/><setting name=\"instanceMaxRequests\"/><setting name=\"queueLength\"/><setting name=\"rapidFailsPerMinute\"/><setting name=\"pm.max_children\"/><setting name=\"pm.max_requests\"/><setting name=\"pm\"/><setting name=\"pm.start_servers\"/><setting name=\"pm.min_spare_servers\"/><setting name=\"pm.max_spare_servers\"/><setting name=\"max_execution_time\">30</setting><setting name=\"max_input_time\">60</setting></defaultValues><modules><module name=\"bcmath\">1</module><module name=\"curl\">1</module><module name=\"dba\">1</module><module name=\"dom\">1</module><module name=\"enchant\">1</module><module name=\"fileinfo\">1</module><module name=\"gd\">1</module><module name=\"imagick\">1</module><module name=\"imap\">1</module><module name=\"intl\">1</module><module name=\"ldap\">1</module><module name=\"mbstring\">1</module><module name=\"mysqli\">1</module><module name=\"mysqlnd\">1</module><module name=\"odbc\">1</module><module name=\"opcache\">1</module><module name=\"pdo\">1</module><module name=\"pdo_mysql\">1</module><module name=\"pdo_odbc\">1</module><module name=\"pdo_pgsql\">1</module><module name=\"pdo_sqlite\">1</module><module name=\"pgsql\">1</module><module name=\"phar\">1</module><module name=\"posix\">1</module><module name=\"pspell\">1</module><module name=\"redis\">1</module><module name=\"snmp\"/><module name=\"soap\">1</module><module name=\"sodium\">1</module><module name=\"sqlite3\">1</module><module name=\"sysvmsg\">1</module><module name=\"sysvsem\">1</module><module name=\"sysvshm\">1</module><module name=\"tidy\">1</module><module name=\"xdebug\"/><module name=\"xmlreader\">1</module><module name=\"xmlwriter\">1</module><module name=\"xsl\">1</module><module name=\"zip\">1</module></modules></handler>\n'),(1,'phpHandlersSettings','plesk-php83-fastcgi','<?xml version=\"1.0\"?>\n<handler><defaultValues><setting name=\"memory_limit\">128M</setting><setting name=\"post_max_size\">8M</setting><setting name=\"upload_max_filesize\">2M</setting><setting name=\"opcache.enable\">1</setting><setting name=\"wincache.ocenabled\"/><setting name=\"apc.enabled\"/><setting name=\"xcache.cacher\"/><setting name=\"disable_functions\"/><setting name=\"safe_mode\"/><setting name=\"safe_mode_include_dir\"/><setting name=\"safe_mode_exec_dir\"/><setting name=\"include_path\">.:/opt/plesk/php/8.3/share/pear</setting><setting name=\"session.save_path\">/var/lib/php/sessions</setting><setting name=\"mail.force_extra_parameters\"/><setting name=\"register_globals\"/><setting name=\"open_basedir\"/><setting name=\"error_reporting\">22527</setting><setting name=\"display_errors\"/><setting name=\"log_errors\">1</setting><setting name=\"allow_url_fopen\">1</setting><setting name=\"file_uploads\">1</setting><setting name=\"short_open_tag\"/><setting name=\"magic_quotes_gpc\"/><setting name=\"enableFastcgi\"/><setting name=\"maxInstances\"/><setting name=\"activityTimeout\"/><setting name=\"requestTimeout\"/><setting name=\"instanceMaxRequests\"/><setting name=\"queueLength\"/><setting name=\"rapidFailsPerMinute\"/><setting name=\"pm.max_children\"/><setting name=\"pm.max_requests\"/><setting name=\"pm\"/><setting name=\"pm.start_servers\"/><setting name=\"pm.min_spare_servers\"/><setting name=\"pm.max_spare_servers\"/><setting name=\"max_execution_time\">30</setting><setting name=\"max_input_time\">60</setting></defaultValues><modules><module name=\"bcmath\">1</module><module name=\"curl\">1</module><module name=\"dba\">1</module><module name=\"dom\">1</module><module name=\"enchant\">1</module><module name=\"fileinfo\">1</module><module name=\"gd\">1</module><module name=\"imagick\">1</module><module name=\"imap\">1</module><module name=\"intl\">1</module><module name=\"ldap\">1</module><module name=\"mbstring\">1</module><module name=\"mysqli\">1</module><module name=\"mysqlnd\">1</module><module name=\"odbc\">1</module><module name=\"opcache\">1</module><module name=\"pdo\">1</module><module name=\"pdo_mysql\">1</module><module name=\"pdo_odbc\">1</module><module name=\"pdo_pgsql\">1</module><module name=\"pdo_sqlite\">1</module><module name=\"pgsql\">1</module><module name=\"phar\">1</module><module name=\"posix\">1</module><module name=\"pspell\">1</module><module name=\"redis\">1</module><module name=\"snmp\"/><module name=\"soap\">1</module><module name=\"sodium\">1</module><module name=\"sqlite3\">1</module><module name=\"sysvmsg\">1</module><module name=\"sysvsem\">1</module><module name=\"sysvshm\">1</module><module name=\"tidy\">1</module><module name=\"xdebug\"/><module name=\"xmlreader\">1</module><module name=\"xmlwriter\">1</module><module name=\"xsl\">1</module><module name=\"zip\">1</module></modules></handler>\n'),(1,'phpHandlersSettings','plesk-php83-fpm','<?xml version=\"1.0\"?>\n<handler><defaultValues><setting name=\"memory_limit\">128M</setting><setting name=\"post_max_size\">8M</setting><setting name=\"upload_max_filesize\">2M</setting><setting name=\"opcache.enable\">1</setting><setting name=\"wincache.ocenabled\"/><setting name=\"apc.enabled\"/><setting name=\"xcache.cacher\"/><setting name=\"disable_functions\"/><setting name=\"safe_mode\"/><setting name=\"safe_mode_include_dir\"/><setting name=\"safe_mode_exec_dir\"/><setting name=\"include_path\">.:/opt/plesk/php/8.3/share/pear</setting><setting name=\"session.save_path\">/var/lib/php/sessions</setting><setting name=\"mail.force_extra_parameters\"/><setting name=\"register_globals\"/><setting name=\"open_basedir\"/><setting name=\"error_reporting\">22527</setting><setting name=\"display_errors\"/><setting name=\"log_errors\">1</setting><setting name=\"allow_url_fopen\">1</setting><setting name=\"file_uploads\">1</setting><setting name=\"short_open_tag\"/><setting name=\"magic_quotes_gpc\"/><setting name=\"enableFastcgi\"/><setting name=\"maxInstances\"/><setting name=\"activityTimeout\"/><setting name=\"requestTimeout\"/><setting name=\"instanceMaxRequests\"/><setting name=\"queueLength\"/><setting name=\"rapidFailsPerMinute\"/><setting name=\"pm.max_children\"/><setting name=\"pm.max_requests\"/><setting name=\"pm\"/><setting name=\"pm.start_servers\"/><setting name=\"pm.min_spare_servers\"/><setting name=\"pm.max_spare_servers\"/><setting name=\"max_execution_time\">30</setting><setting name=\"max_input_time\">60</setting></defaultValues><modules><module name=\"bcmath\">1</module><module name=\"curl\">1</module><module name=\"dba\">1</module><module name=\"dom\">1</module><module name=\"enchant\">1</module><module name=\"fileinfo\">1</module><module name=\"gd\">1</module><module name=\"imagick\">1</module><module name=\"imap\">1</module><module name=\"intl\">1</module><module name=\"ldap\">1</module><module name=\"mbstring\">1</module><module name=\"mysqli\">1</module><module name=\"mysqlnd\">1</module><module name=\"odbc\">1</module><module name=\"opcache\">1</module><module name=\"pdo\">1</module><module name=\"pdo_mysql\">1</module><module name=\"pdo_odbc\">1</module><module name=\"pdo_pgsql\">1</module><module name=\"pdo_sqlite\">1</module><module name=\"pgsql\">1</module><module name=\"phar\">1</module><module name=\"posix\">1</module><module name=\"pspell\">1</module><module name=\"redis\">1</module><module name=\"snmp\"/><module name=\"soap\">1</module><module name=\"sodium\">1</module><module name=\"sqlite3\">1</module><module name=\"sysvmsg\">1</module><module name=\"sysvsem\">1</module><module name=\"sysvshm\">1</module><module name=\"tidy\">1</module><module name=\"xdebug\"/><module name=\"xmlreader\">1</module><module name=\"xmlwriter\">1</module><module name=\"xsl\">1</module><module name=\"zip\">1</module></modules></handler>\n'),(1,'phpHandlersSettings','plesk-php83-fpm-dedicated','<?xml version=\"1.0\"?>\n<handler><defaultValues><setting name=\"memory_limit\">128M</setting><setting name=\"post_max_size\">8M</setting><setting name=\"upload_max_filesize\">2M</setting><setting name=\"opcache.enable\">1</setting><setting name=\"wincache.ocenabled\"/><setting name=\"apc.enabled\"/><setting name=\"xcache.cacher\"/><setting name=\"disable_functions\"/><setting name=\"safe_mode\"/><setting name=\"safe_mode_include_dir\"/><setting name=\"safe_mode_exec_dir\"/><setting name=\"include_path\">.:/opt/plesk/php/8.3/share/pear</setting><setting name=\"session.save_path\">/var/lib/php/sessions</setting><setting name=\"mail.force_extra_parameters\"/><setting name=\"register_globals\"/><setting name=\"open_basedir\"/><setting name=\"error_reporting\">22527</setting><setting name=\"display_errors\"/><setting name=\"log_errors\">1</setting><setting name=\"allow_url_fopen\">1</setting><setting name=\"file_uploads\">1</setting><setting name=\"short_open_tag\"/><setting name=\"magic_quotes_gpc\"/><setting name=\"enableFastcgi\"/><setting name=\"maxInstances\"/><setting name=\"activityTimeout\"/><setting name=\"requestTimeout\"/><setting name=\"instanceMaxRequests\"/><setting name=\"queueLength\"/><setting name=\"rapidFailsPerMinute\"/><setting name=\"pm.max_children\"/><setting name=\"pm.max_requests\"/><setting name=\"pm\"/><setting name=\"pm.start_servers\"/><setting name=\"pm.min_spare_servers\"/><setting name=\"pm.max_spare_servers\"/><setting name=\"max_execution_time\">30</setting><setting name=\"max_input_time\">60</setting></defaultValues><modules><module name=\"bcmath\">1</module><module name=\"curl\">1</module><module name=\"dba\">1</module><module name=\"dom\">1</module><module name=\"enchant\">1</module><module name=\"fileinfo\">1</module><module name=\"gd\">1</module><module name=\"imagick\">1</module><module name=\"imap\">1</module><module name=\"intl\">1</module><module name=\"ldap\">1</module><module name=\"mbstring\">1</module><module name=\"mysqli\">1</module><module name=\"mysqlnd\">1</module><module name=\"odbc\">1</module><module name=\"opcache\">1</module><module name=\"pdo\">1</module><module name=\"pdo_mysql\">1</module><module name=\"pdo_odbc\">1</module><module name=\"pdo_pgsql\">1</module><module name=\"pdo_sqlite\">1</module><module name=\"pgsql\">1</module><module name=\"phar\">1</module><module name=\"posix\">1</module><module name=\"pspell\">1</module><module name=\"redis\">1</module><module name=\"snmp\"/><module name=\"soap\">1</module><module name=\"sodium\">1</module><module name=\"sqlite3\">1</module><module name=\"sysvmsg\">1</module><module name=\"sysvsem\">1</module><module name=\"sysvshm\">1</module><module name=\"tidy\">1</module><module name=\"xdebug\"/><module name=\"xmlreader\">1</module><module name=\"xmlwriter\">1</module><module name=\"xsl\">1</module><module name=\"zip\">1</module></modules></handler>\n'),(1,'phpHandlersSettings','synced','1727763996'),(1,'pum','dbConsistent','true'),(1,'pum','lastChecked','1728023137'),(1,'pum','synced','1727763949'),(1,'webservice','apache_modules_list','{\"access_compat\":{\"name\":\"access_compat\",\"enabled\":true,\"deprecated\":false},\"allowmethods\":{\"name\":\"allowmethods\",\"enabled\":false,\"deprecated\":false},\"asis\":{\"name\":\"asis\",\"enabled\":false,\"deprecated\":false},\"auth_basic\":{\"name\":\"auth_basic\",\"enabled\":true,\"deprecated\":false},\"auth_digest\":{\"name\":\"auth_digest\",\"enabled\":false,\"deprecated\":false},\"auth_form\":{\"name\":\"auth_form\",\"enabled\":false,\"deprecated\":false},\"authn_anon\":{\"name\":\"authn_anon\",\"enabled\":false,\"deprecated\":false},\"authn_core\":{\"name\":\"authn_core\",\"enabled\":true,\"deprecated\":false},\"authn_dbd\":{\"name\":\"authn_dbd\",\"enabled\":false,\"deprecated\":false},\"authn_dbm\":{\"name\":\"authn_dbm\",\"enabled\":false,\"deprecated\":false},\"authn_socache\":{\"name\":\"authn_socache\",\"enabled\":false,\"deprecated\":false},\"authnz_fcgi\":{\"name\":\"authnz_fcgi\",\"enabled\":false,\"deprecated\":false},\"authnz_ldap\":{\"name\":\"authnz_ldap\",\"enabled\":false,\"deprecated\":false},\"authz_core\":{\"name\":\"authz_core\",\"enabled\":true,\"deprecated\":false},\"authz_dbd\":{\"name\":\"authz_dbd\",\"enabled\":false,\"deprecated\":false},\"authz_dbm\":{\"name\":\"authz_dbm\",\"enabled\":false,\"deprecated\":false},\"authz_groupfile\":{\"name\":\"authz_groupfile\",\"enabled\":false,\"deprecated\":false},\"authz_owner\":{\"name\":\"authz_owner\",\"enabled\":false,\"deprecated\":false},\"autoindex\":{\"name\":\"autoindex\",\"enabled\":true,\"deprecated\":false},\"brotli\":{\"name\":\"brotli\",\"enabled\":false,\"deprecated\":false},\"bucketeer\":{\"name\":\"bucketeer\",\"enabled\":false,\"deprecated\":false},\"buffer\":{\"name\":\"buffer\",\"enabled\":false,\"deprecated\":false},\"cache\":{\"name\":\"cache\",\"enabled\":false,\"deprecated\":false},\"cache_disk\":{\"name\":\"cache_disk\",\"enabled\":false,\"deprecated\":false},\"cache_socache\":{\"name\":\"cache_socache\",\"enabled\":false,\"deprecated\":false},\"cern_meta\":{\"name\":\"cern_meta\",\"enabled\":false,\"deprecated\":false},\"cgi\":{\"name\":\"cgi\",\"enabled\":false,\"deprecated\":false},\"cgid\":{\"name\":\"cgid\",\"enabled\":true,\"deprecated\":false},\"charset_lite\":{\"name\":\"charset_lite\",\"enabled\":false,\"deprecated\":false},\"data\":{\"name\":\"data\",\"enabled\":false,\"deprecated\":false},\"dav\":{\"name\":\"dav\",\"enabled\":false,\"deprecated\":false},\"dav_fs\":{\"name\":\"dav_fs\",\"enabled\":false,\"deprecated\":false},\"dav_lock\":{\"name\":\"dav_lock\",\"enabled\":false,\"deprecated\":false},\"dbd\":{\"name\":\"dbd\",\"enabled\":false,\"deprecated\":false},\"deflate\":{\"name\":\"deflate\",\"enabled\":true,\"deprecated\":false},\"dialup\":{\"name\":\"dialup\",\"enabled\":false,\"deprecated\":false},\"dir\":{\"name\":\"dir\",\"enabled\":true,\"deprecated\":false},\"dumpio\":{\"name\":\"dumpio\",\"enabled\":false,\"deprecated\":false},\"echo\":{\"name\":\"echo\",\"enabled\":false,\"deprecated\":false},\"expires\":{\"name\":\"expires\",\"enabled\":false,\"deprecated\":false},\"ext_filter\":{\"name\":\"ext_filter\",\"enabled\":false,\"deprecated\":false},\"fcgid\":{\"name\":\"fcgid\",\"enabled\":true,\"deprecated\":false},\"file_cache\":{\"name\":\"file_cache\",\"enabled\":false,\"deprecated\":false},\"filter\":{\"name\":\"filter\",\"enabled\":true,\"deprecated\":false},\"headers\":{\"name\":\"headers\",\"enabled\":true,\"deprecated\":false},\"heartbeat\":{\"name\":\"heartbeat\",\"enabled\":false,\"deprecated\":false},\"heartmonitor\":{\"name\":\"heartmonitor\",\"enabled\":false,\"deprecated\":false},\"http2\":{\"name\":\"http2\",\"enabled\":false,\"deprecated\":false},\"ident\":{\"name\":\"ident\",\"enabled\":false,\"deprecated\":false},\"imagemap\":{\"name\":\"imagemap\",\"enabled\":false,\"deprecated\":false},\"include\":{\"name\":\"include\",\"enabled\":true,\"deprecated\":false},\"info\":{\"name\":\"info\",\"enabled\":false,\"deprecated\":false},\"lbmethod_bybusyness\":{\"name\":\"lbmethod_bybusyness\",\"enabled\":false,\"deprecated\":false},\"lbmethod_byrequests\":{\"name\":\"lbmethod_byrequests\",\"enabled\":false,\"deprecated\":false},\"lbmethod_bytraffic\":{\"name\":\"lbmethod_bytraffic\",\"enabled\":false,\"deprecated\":false},\"lbmethod_heartbeat\":{\"name\":\"lbmethod_heartbeat\",\"enabled\":false,\"deprecated\":false},\"ldap\":{\"name\":\"ldap\",\"enabled\":false,\"deprecated\":false},\"log_debug\":{\"name\":\"log_debug\",\"enabled\":false,\"deprecated\":false},\"log_forensic\":{\"name\":\"log_forensic\",\"enabled\":false,\"deprecated\":false},\"lua\":{\"name\":\"lua\",\"enabled\":false,\"deprecated\":false},\"macro\":{\"name\":\"macro\",\"enabled\":false,\"deprecated\":false},\"md\":{\"name\":\"md\",\"enabled\":false,\"deprecated\":false},\"mpm_event\":{\"name\":\"mpm_event\",\"enabled\":true,\"deprecated\":false},\"mpm_prefork\":{\"name\":\"mpm_prefork\",\"enabled\":false,\"deprecated\":false},\"mpm_worker\":{\"name\":\"mpm_worker\",\"enabled\":false,\"deprecated\":false},\"negotiation\":{\"name\":\"negotiation\",\"enabled\":true,\"deprecated\":false},\"passenger\":{\"name\":\"passenger\",\"enabled\":true,\"deprecated\":false},\"proxy\":{\"name\":\"proxy\",\"enabled\":true,\"deprecated\":false},\"proxy_ajp\":{\"name\":\"proxy_ajp\",\"enabled\":false,\"deprecated\":false},\"proxy_balancer\":{\"name\":\"proxy_balancer\",\"enabled\":false,\"deprecated\":false},\"proxy_connect\":{\"name\":\"proxy_connect\",\"enabled\":false,\"deprecated\":false},\"proxy_express\":{\"name\":\"proxy_express\",\"enabled\":false,\"deprecated\":false},\"proxy_fcgi\":{\"name\":\"proxy_fcgi\",\"enabled\":true,\"deprecated\":false},\"proxy_fdpass\":{\"name\":\"proxy_fdpass\",\"enabled\":false,\"deprecated\":false},\"proxy_ftp\":{\"name\":\"proxy_ftp\",\"enabled\":false,\"deprecated\":false},\"proxy_hcheck\":{\"name\":\"proxy_hcheck\",\"enabled\":false,\"deprecated\":false},\"proxy_html\":{\"name\":\"proxy_html\",\"enabled\":false,\"deprecated\":false},\"proxy_http\":{\"name\":\"proxy_http\",\"enabled\":true,\"deprecated\":false},\"proxy_http2\":{\"name\":\"proxy_http2\",\"enabled\":false,\"deprecated\":false},\"proxy_scgi\":{\"name\":\"proxy_scgi\",\"enabled\":false,\"deprecated\":false},\"proxy_uwsgi\":{\"name\":\"proxy_uwsgi\",\"enabled\":false,\"deprecated\":false},\"proxy_wstunnel\":{\"name\":\"proxy_wstunnel\",\"enabled\":true,\"deprecated\":false},\"ratelimit\":{\"name\":\"ratelimit\",\"enabled\":false,\"deprecated\":false},\"reflector\":{\"name\":\"reflector\",\"enabled\":false,\"deprecated\":false},\"reqtimeout\":{\"name\":\"reqtimeout\",\"enabled\":true,\"deprecated\":false},\"request\":{\"name\":\"request\",\"enabled\":false,\"deprecated\":false},\"rewrite\":{\"name\":\"rewrite\",\"enabled\":true,\"deprecated\":false},\"sed\":{\"name\":\"sed\",\"enabled\":false,\"deprecated\":false},\"session\":{\"name\":\"session\",\"enabled\":false,\"deprecated\":false},\"session_cookie\":{\"name\":\"session_cookie\",\"enabled\":false,\"deprecated\":false},\"session_crypto\":{\"name\":\"session_crypto\",\"enabled\":false,\"deprecated\":false},\"session_dbd\":{\"name\":\"session_dbd\",\"enabled\":false,\"deprecated\":false},\"setenvif\":{\"name\":\"setenvif\",\"enabled\":true,\"deprecated\":false},\"slotmem_plain\":{\"name\":\"slotmem_plain\",\"enabled\":false,\"deprecated\":false},\"slotmem_shm\":{\"name\":\"slotmem_shm\",\"enabled\":false,\"deprecated\":false},\"socache_dbm\":{\"name\":\"socache_dbm\",\"enabled\":false,\"deprecated\":false},\"socache_memcache\":{\"name\":\"socache_memcache\",\"enabled\":false,\"deprecated\":false},\"socache_redis\":{\"name\":\"socache_redis\",\"enabled\":false,\"deprecated\":false},\"socache_shmcb\":{\"name\":\"socache_shmcb\",\"enabled\":true,\"deprecated\":false},\"speling\":{\"name\":\"speling\",\"enabled\":false,\"deprecated\":false},\"status\":{\"name\":\"status\",\"enabled\":true,\"deprecated\":false},\"substitute\":{\"name\":\"substitute\",\"enabled\":false,\"deprecated\":false},\"suexec\":{\"name\":\"suexec\",\"enabled\":true,\"deprecated\":false},\"sysenv\":{\"name\":\"sysenv\",\"enabled\":false,\"deprecated\":false},\"userdir\":{\"name\":\"userdir\",\"enabled\":true,\"deprecated\":false},\"usertrack\":{\"name\":\"usertrack\",\"enabled\":false,\"deprecated\":false},\"vhost_alias\":{\"name\":\"vhost_alias\",\"enabled\":false,\"deprecated\":false},\"xml2enc\":{\"name\":\"xml2enc\",\"enabled\":false,\"deprecated\":false}}'),(1,'webservice','synced','1727763993'),(1,'webservice','WEB_Apache_php4Module','mod_php4.c'),(1,'webservice','WEB_Apache_SniSupport','true'),(1,'webservice','WEB_Apache_TraceEnableCompliance','false'),(1,'webservice','WEB_nginx_safe_symlinks','true'),(1,'webservice','WEB_Server','Apache'),(1,'webservice','WEB_Server_package','httpd');
/*!40000 ALTER TABLE `ServiceNodeEnvironment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ServiceNodes`
--

DROP TABLE IF EXISTS `ServiceNodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ServiceNodes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ipAddress` varchar(255) NOT NULL DEFAULT 'local',
  `description` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'plesk',
  `accessKey` text DEFAULT NULL,
  `externalId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ipAddress` (`ipAddress`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ServiceNodes`
--

LOCK TABLES `ServiceNodes` WRITE;
/*!40000 ALTER TABLE `ServiceNodes` DISABLE KEYS */;
INSERT INTO `ServiceNodes` VALUES (1,'local','Local','plesk',NULL,NULL);
/*!40000 ALTER TABLE `ServiceNodes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SessionContexts`
--

DROP TABLE IF EXISTS `SessionContexts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SessionContexts` (
  `contextId` varchar(255) NOT NULL,
  `sessionId` varchar(33) DEFAULT NULL,
  `data` mediumtext DEFAULT NULL,
  PRIMARY KEY (`contextId`),
  KEY `sessionId` (`sessionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SessionContexts`
--

LOCK TABLES `SessionContexts` WRITE;
/*!40000 ALTER TABLE `SessionContexts` DISABLE KEYS */;
INSERT INTO `SessionContexts` VALUES ('982b005e66b6d4893cbf4b51db21b566','982b005e66b6d4893cbf4b51db21b566','a:6:{s:4:\"auth\";a:2:{s:4:\"type\";i:1;s:9:\"isSupport\";b:0;}s:5:\"panel\";a:17:{s:22:\"forgeryProtectionToken\";s:32:\"7f68a4e37ceae37a426c9b5c45a0e468\";s:8:\"messages\";a:0:{}s:6:\"locale\";s:5:\"en-US\";s:6:\"skinId\";i:1;s:7:\"baseUrl\";s:0:\"\";s:12:\"actionStatus\";a:2:{s:8:\"messages\";a:0:{}s:8:\"liveHops\";i:1;}s:19:\"Smb_View_List_Sites\";a:1:{s:19:\"dynamicListSearchId\";s:3:\"all\";}s:14:\"lastShownPanel\";s:7:\"hosting\";s:11:\"breadcrumbs\";a:1:{s:4:\"last\";a:3:{i:0;a:2:{s:4:\"href\";s:18:\"/smb/email-address\";s:5:\"title\";s:4:\"Mail\";}i:1;a:2:{s:4:\"href\";s:23:\"/smb/email-address/list\";s:5:\"title\";s:15:\"Email Addresses\";}i:2;a:2:{s:4:\"href\";s:28:\"/smb/email-address/edit/id/8\";s:5:\"title\";s:33:\"<b>office@fetishmegastore.com</b>\";}}}s:15:\"lastRequestUrls\";a:9:{i:0;s:13:\"/smb/web/view\";i:1;s:23:\"/smb/email-address/list\";i:2;s:25:\"/smb/email-address/create\";i:3;s:23:\"/smb/email-address/list\";i:4;s:25:\"/smb/email-address/create\";i:5;s:23:\"/smb/email-address/list\";i:6;s:25:\"/smb/email-address/create\";i:7;s:56:\"/modules/advisor/index.php/main/index?ignoreContext=true\";i:8;s:28:\"/smb/email-address/edit/id/8\";}s:10:\"showFrames\";b:1;s:17:\"navigationContext\";s:9:\"dashboard\";s:27:\"Smb_View_List_Subscriptions\";N;s:23:\"Smb_View_List_Databases\";N;s:12:\"outgoingMail\";a:1:{s:10:\"hasWarning\";b:0;}s:20:\"Smb_View_List_Emails\";N;s:26:\"Smb_View_List_MailSettings\";N;}s:7:\"license\";a:1:{s:7:\"isWrong\";b:0;}s:12:\"subscription\";a:2:{s:7:\"showAll\";b:1;s:9:\"currentId\";i:1;}s:8:\"rsession\";N;s:8:\"database\";a:5:{s:13:\"phpAdminLogin\";s:14:\"fetishme_mysql\";s:16:\"phpAdminPassword\";s:15:\"EvWZBtkRXEcHLOH\";s:12:\"phpAdminHost\";s:9:\"localhost\";s:12:\"phpAdminPort\";i:3306;s:12:\"phpAdminName\";s:17:\"fetishme_twitcher\";}}');
/*!40000 ALTER TABLE `SessionContexts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SiteAppsHitsStat`
--

DROP TABLE IF EXISTS `SiteAppsHitsStat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SiteAppsHitsStat` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `count` bigint(20) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SiteAppsHitsStat`
--

LOCK TABLES `SiteAppsHitsStat` WRITE;
/*!40000 ALTER TABLE `SiteAppsHitsStat` DISABLE KEYS */;
/*!40000 ALTER TABLE `SiteAppsHitsStat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SitePagesStat`
--

DROP TABLE IF EXISTS `SitePagesStat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SitePagesStat` (
  `date` date NOT NULL DEFAULT '1970-01-01',
  `hits` bigint(20) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SitePagesStat`
--

LOCK TABLES `SitePagesStat` WRITE;
/*!40000 ALTER TABLE `SitePagesStat` DISABLE KEYS */;
INSERT INTO `SitePagesStat` VALUES ('2024-09-14',126403),('2024-09-15',209361),('2024-09-16',206565),('2024-09-17',192173),('2024-09-18',180457),('2024-09-19',196771),('2024-09-20',216064),('2024-09-21',225189),('2024-09-22',202858),('2024-09-23',221463),('2024-09-24',202780),('2024-09-25',228410),('2024-09-26',200212),('2024-09-27',228194),('2024-09-28',232857),('2024-09-29',227225),('2024-09-30',213177),('2024-10-01',212219),('2024-10-02',242150),('2024-10-03',322131),('2024-10-04',59813);
/*!40000 ALTER TABLE `SitePagesStat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Skins`
--

DROP TABLE IF EXISTS `Skins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Skins` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `place` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `name` (`name`),
  KEY `place` (`place`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Skins`
--

LOCK TABLES `Skins` WRITE;
/*!40000 ALTER TABLE `Skins` DISABLE KEYS */;
INSERT INTO `Skins` VALUES (1,'Default','default');
/*!40000 ALTER TABLE `Skins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Smarthosts`
--

DROP TABLE IF EXISTS `Smarthosts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Smarthosts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ownerId` int(10) unsigned NOT NULL,
  `host` varchar(255) NOT NULL,
  `port` smallint(5) unsigned NOT NULL DEFAULT 0,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `encryption` enum('on','off','tls','ssl') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ownerId` (`ownerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Smarthosts`
--

LOCK TABLES `Smarthosts` WRITE;
/*!40000 ALTER TABLE `Smarthosts` DISABLE KEYS */;
/*!40000 ALTER TABLE `Smarthosts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SubscriptionOutgoingMessagesPeaks`
--

DROP TABLE IF EXISTS `SubscriptionOutgoingMessagesPeaks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SubscriptionOutgoingMessagesPeaks` (
  `subscriptionId` int(10) unsigned NOT NULL,
  `beginDate` datetime NOT NULL,
  `endDate` datetime DEFAULT NULL,
  `rejected` bigint(20) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`subscriptionId`,`beginDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SubscriptionOutgoingMessagesPeaks`
--

LOCK TABLES `SubscriptionOutgoingMessagesPeaks` WRITE;
/*!40000 ALTER TABLE `SubscriptionOutgoingMessagesPeaks` DISABLE KEYS */;
/*!40000 ALTER TABLE `SubscriptionOutgoingMessagesPeaks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SubscriptionOutgoingMessagesStats`
--

DROP TABLE IF EXISTS `SubscriptionOutgoingMessagesStats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SubscriptionOutgoingMessagesStats` (
  `subscriptionId` int(10) unsigned NOT NULL,
  `collectDate` datetime NOT NULL,
  `limitValue` bigint(20) NOT NULL DEFAULT -1,
  `passed` bigint(20) unsigned NOT NULL DEFAULT 0,
  `rejected` bigint(20) unsigned NOT NULL DEFAULT 0,
  `passed_fixed` bigint(20) unsigned NOT NULL DEFAULT 0,
  `rejected_verified` bigint(20) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`subscriptionId`,`collectDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SubscriptionOutgoingMessagesStats`
--

LOCK TABLES `SubscriptionOutgoingMessagesStats` WRITE;
/*!40000 ALTER TABLE `SubscriptionOutgoingMessagesStats` DISABLE KEYS */;
/*!40000 ALTER TABLE `SubscriptionOutgoingMessagesStats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SubscriptionProperties`
--

DROP TABLE IF EXISTS `SubscriptionProperties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SubscriptionProperties` (
  `subscription_id` int(10) unsigned NOT NULL DEFAULT 0,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`subscription_id`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SubscriptionProperties`
--

LOCK TABLES `SubscriptionProperties` WRITE;
/*!40000 ALTER TABLE `SubscriptionProperties` DISABLE KEYS */;
INSERT INTO `SubscriptionProperties` VALUES (1,'default_server_mysql','1'),(1,'limitsId','1'),(1,'outgoing_messages_domain_limit','default'),(1,'outgoing_messages_enable_sendmail','default'),(1,'outgoing_messages_mbox_limit','default'),(1,'outgoing_messages_overlimit_percent','0'),(1,'outgoing_messages_subscription_limit','default'),(1,'OveruseBlock','false'),(1,'OveruseNotify','false'),(1,'OveruseSuspend','false'),(1,'permissionsId','2'),(1,'phpSettingsId','1'),(1,'unpaid_website_status','suspended');
/*!40000 ALTER TABLE `SubscriptionProperties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Subscriptions`
--

DROP TABLE IF EXISTS `Subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Subscriptions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `object_id` int(10) unsigned NOT NULL,
  `object_type` enum('client','domain') NOT NULL,
  `locked` enum('false','true') NOT NULL DEFAULT 'false',
  `synchronized` enum('false','true') NOT NULL DEFAULT 'true',
  `custom` enum('false','true') NOT NULL DEFAULT 'false',
  `uuid` varchar(36) DEFAULT NULL,
  `external_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `object_id_and_type` (`object_id`,`object_type`),
  UNIQUE KEY `uuid` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Subscriptions`
--

LOCK TABLES `Subscriptions` WRITE;
/*!40000 ALTER TABLE `Subscriptions` DISABLE KEYS */;
INSERT INTO `Subscriptions` VALUES (1,1,'domain','true','true','false','cd957130-c549-06f0-cec8-fce7f4129b57',NULL);
/*!40000 ALTER TABLE `Subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Templates`
--

DROP TABLE IF EXISTS `Templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Templates` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `owner_id` int(10) unsigned NOT NULL,
  `type` enum('reseller','client','domain','domain_addon') NOT NULL,
  `uuid` varchar(36) NOT NULL,
  `external_id` varchar(255) DEFAULT NULL,
  `note_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `owner_id` (`owner_id`),
  KEY `note_id` (`note_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Templates`
--

LOCK TABLES `Templates` WRITE;
/*!40000 ALTER TABLE `Templates` DISABLE KEYS */;
INSERT INTO `Templates` VALUES (1,'Admin Simple',1,'domain','06c7ef01-c944-d979-17fb-2b570e4f75bc',NULL,NULL),(2,'Default Reseller',1,'reseller','7219d0dd-afe2-b4b7-3585-6dd9bf356c11',NULL,NULL),(3,'Default Domain',1,'domain','e7dca62b-37d8-fc5b-2f1c-86880a527e7d',NULL,NULL),(4,'Unlimited',1,'domain','549460f3-abef-b3a5-5b3b-e4ba193f16f0',NULL,NULL),(5,'Default Simple',1,'domain','ecb85ef9-6d76-2b6c-fb88-7ac91a2907f4',NULL,NULL);
/*!40000 ALTER TABLE `Templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TmplData`
--

DROP TABLE IF EXISTS `TmplData`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TmplData` (
  `tmpl_id` int(10) unsigned NOT NULL DEFAULT 0,
  `element` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`tmpl_id`,`element`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TmplData`
--

LOCK TABLES `TmplData` WRITE;
/*!40000 ALTER TABLE `TmplData` DISABLE KEYS */;
INSERT INTO `TmplData` VALUES (1,'access_appcatalog','true'),(1,'access_service_users','true'),(1,'allow_account_ftp_backups','false'),(1,'allow_account_local_backups','false'),(1,'allow_ftp_backups','false'),(1,'allow_insecure_sites','false'),(1,'allow_local_backups','false'),(1,'aps_bundle_filter_id','0'),(1,'asp','false'),(1,'bandwidth','-1'),(1,'bounce_mess','This address no longer accepts mail.'),(1,'catch_addr',''),(1,'cgi','false'),(1,'create_domains','true'),(1,'disk_space','-1'),(1,'disk_space_soft','-1'),(1,'dns_type','master'),(1,'errdocs','false'),(1,'excl_ipv6_num','0'),(1,'excl_ip_num','0'),(1,'expiration','-1'),(1,'fastcgi','true'),(1,'logrotation_id','1'),(1,'mailAutodiscovery','true'),(1,'maillists','false'),(1,'mailservice','true'),(1,'manage_anonftp','false'),(1,'manage_crontab','false'),(1,'manage_dns','false'),(1,'manage_domain_aliases','true'),(1,'manage_log','false'),(1,'manage_maillists','false'),(1,'manage_mail_autodiscover','true'),(1,'manage_mail_settings','false'),(1,'manage_not_chroot_shell','true'),(1,'manage_performance','false'),(1,'manage_phosting','false'),(1,'manage_phosting_cgi','true'),(1,'manage_phosting_errdocs','true'),(1,'manage_phosting_fastcgi','true'),(1,'manage_phosting_perl','true'),(1,'manage_phosting_php','true'),(1,'manage_phosting_python','true'),(1,'manage_phosting_ssi','true'),(1,'manage_phosting_ssl','true'),(1,'manage_phosting_webdeploy','true'),(1,'manage_php_settings','false'),(1,'manage_php_version','true'),(1,'manage_protected_dirs','false'),(1,'manage_quota','false'),(1,'manage_sh_access','false'),(1,'manage_spamfilter','false'),(1,'manage_subdomains','true'),(1,'manage_subftp','false'),(1,'manage_virusfilter','false'),(1,'manage_website_maintenance','false'),(1,'manage_webstat','true'),(1,'max_box','-1'),(1,'max_connections','-1'),(1,'max_db','-1'),(1,'max_dom_aliases','-1'),(1,'max_maillists','-1'),(1,'max_mn','-1'),(1,'max_site','-1'),(1,'max_site_builder','-1'),(1,'max_subdom','-1'),(1,'max_subftp_users','-1'),(1,'max_traffic','-1'),(1,'max_traffic_soft','-1'),(1,'max_wu','-1'),(1,'mbox_quota','-1'),(1,'nonexist_mail','reject'),(1,'outgoing_messages_domain_limit','default'),(1,'outgoing_messages_enable_sendmail','default'),(1,'outgoing_messages_mbox_limit','default'),(1,'outgoing_messages_subscription_limit','default'),(1,'oversell','true'),(1,'overuse_block','false'),(1,'overuse_notify','false'),(1,'overuse_suspend','false'),(1,'pdir_plesk_stat','true'),(1,'perl','false'),(1,'php','true'),(1,'php_handler_id','plesk-php83-fpm'),(1,'predefined_template','false'),(1,'python','false'),(1,'quota','-1'),(1,'remote_db_connection','false'),(1,'select_db_server','false'),(1,'shared_template','true'),(1,'shell','/bin/false'),(1,'ssi','false'),(1,'ssl','true'),(1,'sslRedirect','true'),(1,'stat_ttl','3'),(1,'tmpl_pool_id','0'),(1,'unpaid_website_status','suspended'),(1,'vh_type','physical'),(1,'webmail','roundcube'),(1,'webServerSettingsId','1'),(1,'webstat','webalizer'),(1,'wu_script','true'),(2,'access_appcatalog','true'),(2,'access_service_users','true'),(2,'allow_account_ftp_backups','false'),(2,'allow_account_local_backups','false'),(2,'allow_ftp_backups','true'),(2,'allow_insecure_sites','true'),(2,'allow_local_backups','true'),(2,'allow_oversell','true'),(2,'create_clients','true'),(2,'create_domains','true'),(2,'disk_space','-1'),(2,'disk_space_soft','-1'),(2,'excl_ipv6_num','0'),(2,'excl_ip_num','0'),(2,'manage_anonftp','false'),(2,'manage_crontab','false'),(2,'manage_dns','true'),(2,'manage_domain_aliases','true'),(2,'manage_log','true'),(2,'manage_maillists','true'),(2,'manage_mail_autodiscover','true'),(2,'manage_mail_settings','true'),(2,'manage_not_chroot_shell','false'),(2,'manage_performance','false'),(2,'manage_performance_bandwidth','true'),(2,'manage_performance_connections','true'),(2,'manage_phosting','true'),(2,'manage_phosting_asp','true'),(2,'manage_phosting_asp_dot_net','true'),(2,'manage_phosting_cgi','true'),(2,'manage_phosting_errdocs','true'),(2,'manage_phosting_fastcgi','true'),(2,'manage_phosting_perl','true'),(2,'manage_phosting_php','true'),(2,'manage_phosting_python','true'),(2,'manage_phosting_ssi','true'),(2,'manage_phosting_ssl','true'),(2,'manage_phosting_webdeploy','true'),(2,'manage_php_settings','true'),(2,'manage_php_version','true'),(2,'manage_protected_dirs','true'),(2,'manage_quota','true'),(2,'manage_sh_access','false'),(2,'manage_spamfilter','true'),(2,'manage_subdomains','true'),(2,'manage_subftp','true'),(2,'manage_virusfilter','true'),(2,'manage_website_maintenance','true'),(2,'manage_webstat','true'),(2,'max_box','-1'),(2,'max_cl','-1'),(2,'max_db','-1'),(2,'max_dom','-1'),(2,'max_dom_aliases','-1'),(2,'max_maillists','-1'),(2,'max_mn','-1'),(2,'max_subdom','-1'),(2,'max_subftp_users','-1'),(2,'max_traffic','-1'),(2,'max_traffic_soft','-1'),(2,'max_wu','-1'),(2,'mbox_quota','104857600'),(2,'oversell','true'),(2,'overuse_block','true'),(2,'overuse_notify','false'),(2,'overuse_suspend','false'),(2,'predefined_template','true'),(2,'remote_access_interface','true'),(2,'remote_db_connection','false'),(2,'select_db_server','true'),(2,'tmpl_pool_id','2'),(3,'access_appcatalog','true'),(3,'access_service_users','true'),(3,'allow_account_ftp_backups','false'),(3,'allow_account_local_backups','false'),(3,'allow_ftp_backups','true'),(3,'allow_insecure_sites','true'),(3,'allow_local_backups','true'),(3,'aps_bundle_filter_id','0'),(3,'bandwidth','-1'),(3,'bounce_mess','This address no longer accepts mail.'),(3,'catch_addr',''),(3,'cgi','false'),(3,'create_domains','true'),(3,'disk_space','10737418240'),(3,'disk_space_soft','-1'),(3,'dns_type','master'),(3,'errdocs','true'),(3,'excl_ipv6_num','0'),(3,'excl_ip_num','0'),(3,'expiration','-1'),(3,'fastcgi','true'),(3,'logrotation_id','2'),(3,'mailAutodiscovery','true'),(3,'maillists','false'),(3,'mailservice','true'),(3,'manage_anonftp','false'),(3,'manage_crontab','false'),(3,'manage_dns','true'),(3,'manage_domain_aliases','false'),(3,'manage_log','true'),(3,'manage_maillists','true'),(3,'manage_mail_autodiscover','true'),(3,'manage_mail_settings','true'),(3,'manage_not_chroot_shell','false'),(3,'manage_performance','false'),(3,'manage_phosting','false'),(3,'manage_phosting_cgi','true'),(3,'manage_phosting_errdocs','true'),(3,'manage_phosting_fastcgi','true'),(3,'manage_phosting_perl','true'),(3,'manage_phosting_php','true'),(3,'manage_phosting_python','true'),(3,'manage_phosting_ssi','true'),(3,'manage_phosting_ssl','true'),(3,'manage_phosting_webdeploy','true'),(3,'manage_php_settings','false'),(3,'manage_php_version','true'),(3,'manage_protected_dirs','true'),(3,'manage_quota','false'),(3,'manage_sh_access','false'),(3,'manage_spamfilter','true'),(3,'manage_subdomains','true'),(3,'manage_subftp','true'),(3,'manage_virusfilter','true'),(3,'manage_website_maintenance','true'),(3,'manage_webstat','true'),(3,'max_box','100'),(3,'max_connections','-1'),(3,'max_db','10'),(3,'max_dom_aliases','-1'),(3,'max_maillists','100'),(3,'max_mn','-1'),(3,'max_site','10'),(3,'max_subdom','-1'),(3,'max_subftp_users','-1'),(3,'max_traffic','107374182400'),(3,'max_traffic_soft','-1'),(3,'max_wu','-1'),(3,'mbox_quota','104857600'),(3,'nonexist_mail','reject'),(3,'outgoing_messages_domain_limit','default'),(3,'outgoing_messages_enable_sendmail','default'),(3,'outgoing_messages_mbox_limit','default'),(3,'outgoing_messages_subscription_limit','default'),(3,'oversell','true'),(3,'overuse_block','true'),(3,'overuse_notify','false'),(3,'overuse_suspend','false'),(3,'pdir_plesk_stat','true'),(3,'perl','false'),(3,'php','true'),(3,'php_handler_id','plesk-php83-fpm'),(3,'predefined_template','true'),(3,'python','false'),(3,'quota','-1'),(3,'remote_db_connection','false'),(3,'select_db_server','false'),(3,'shared_template','true'),(3,'shell','/bin/false'),(3,'ssi','false'),(3,'ssl','true'),(3,'sslRedirect','true'),(3,'stat_ttl','3'),(3,'tmpl_pool_id','0'),(3,'vh_type','physical'),(3,'webmail','roundcube'),(3,'webServerSettingsId','2'),(3,'webstat','webalizer'),(3,'wu_script','true'),(4,'access_appcatalog','true'),(4,'access_service_users','true'),(4,'allow_account_ftp_backups','true'),(4,'allow_account_local_backups','true'),(4,'allow_ftp_backups','true'),(4,'allow_insecure_sites','true'),(4,'allow_local_backups','true'),(4,'allow_oversell','true'),(4,'aps_bundle_filter_id','0'),(4,'asp','false'),(4,'bandwidth','-1'),(4,'bounce_mess','This address no longer accepts mail.'),(4,'catch_addr',''),(4,'cgi','false'),(4,'create_domains','true'),(4,'disk_space','-1'),(4,'disk_space_soft','-1'),(4,'dns_type','master'),(4,'errdocs','true'),(4,'excl_ipv6_num','0'),(4,'excl_ip_num','0'),(4,'expiration','-1'),(4,'fastcgi','true'),(4,'logrotation_id','3'),(4,'mailAutodiscovery','true'),(4,'maillists','false'),(4,'mailservice','true'),(4,'manage_anonftp','true'),(4,'manage_crontab','true'),(4,'manage_dns','true'),(4,'manage_domain_aliases','true'),(4,'manage_log','true'),(4,'manage_maillists','true'),(4,'manage_mail_autodiscover','true'),(4,'manage_mail_settings','true'),(4,'manage_not_chroot_shell','true'),(4,'manage_performance','true'),(4,'manage_phosting','true'),(4,'manage_phosting_cgi','true'),(4,'manage_phosting_errdocs','true'),(4,'manage_phosting_fastcgi','true'),(4,'manage_phosting_perl','true'),(4,'manage_phosting_php','true'),(4,'manage_phosting_python','true'),(4,'manage_phosting_ssi','true'),(4,'manage_phosting_ssl','true'),(4,'manage_phosting_webdeploy','true'),(4,'manage_php_settings','true'),(4,'manage_php_version','true'),(4,'manage_protected_dirs','true'),(4,'manage_quota','true'),(4,'manage_sh_access','true'),(4,'manage_spamfilter','true'),(4,'manage_subdomains','true'),(4,'manage_subftp','true'),(4,'manage_virusfilter','true'),(4,'manage_website_maintenance','true'),(4,'manage_webstat','true'),(4,'max_box','-1'),(4,'max_connections','-1'),(4,'max_db','-1'),(4,'max_dom_aliases','-1'),(4,'max_maillists','-1'),(4,'max_mn','-1'),(4,'max_site','-1'),(4,'max_site_builder','-1'),(4,'max_subdom','-1'),(4,'max_subftp_users','-1'),(4,'max_traffic','-1'),(4,'max_traffic_soft','-1'),(4,'max_wu','-1'),(4,'mbox_quota','-1'),(4,'nonexist_mail','reject'),(4,'outgoing_messages_domain_limit','default'),(4,'outgoing_messages_enable_sendmail','default'),(4,'outgoing_messages_mbox_limit','default'),(4,'outgoing_messages_subscription_limit','default'),(4,'oversell','true'),(4,'overuse_block','false'),(4,'overuse_notify','false'),(4,'overuse_suspend','false'),(4,'pdir_plesk_stat','true'),(4,'perl','false'),(4,'php','true'),(4,'php_handler_id','plesk-php83-fpm'),(4,'predefined_template','false'),(4,'python','false'),(4,'quota','-1'),(4,'remote_db_connection','true'),(4,'select_db_server','true'),(4,'shared_template','true'),(4,'shell','/bin/false'),(4,'ssi','false'),(4,'ssl','true'),(4,'sslRedirect','true'),(4,'stat_ttl','3'),(4,'tmpl_pool_id','0'),(4,'unpaid_website_status','suspended'),(4,'vh_type','physical'),(4,'webmail','roundcube'),(4,'webServerSettingsId','3'),(4,'webstat','awstats'),(4,'wu_script','true'),(5,'access_appcatalog','true'),(5,'access_service_users','true'),(5,'allow_account_ftp_backups','false'),(5,'allow_account_local_backups','false'),(5,'allow_ftp_backups','false'),(5,'allow_insecure_sites','false'),(5,'allow_local_backups','false'),(5,'aps_bundle_filter_id','0'),(5,'asp','false'),(5,'bandwidth','-1'),(5,'bounce_mess','This address no longer accepts mail.'),(5,'catch_addr',''),(5,'cgi','false'),(5,'create_domains','true'),(5,'disk_space','-1'),(5,'disk_space_soft','-1'),(5,'dns_type','master'),(5,'errdocs','false'),(5,'excl_ipv6_num','0'),(5,'excl_ip_num','0'),(5,'expiration','-1'),(5,'fastcgi','true'),(5,'logrotation_id','4'),(5,'mailAutodiscovery','true'),(5,'maillists','false'),(5,'mailservice','true'),(5,'manage_anonftp','false'),(5,'manage_crontab','false'),(5,'manage_dns','false'),(5,'manage_domain_aliases','true'),(5,'manage_log','false'),(5,'manage_maillists','false'),(5,'manage_mail_autodiscover','true'),(5,'manage_mail_settings','false'),(5,'manage_not_chroot_shell','true'),(5,'manage_performance','false'),(5,'manage_phosting','false'),(5,'manage_phosting_cgi','true'),(5,'manage_phosting_errdocs','true'),(5,'manage_phosting_fastcgi','true'),(5,'manage_phosting_perl','true'),(5,'manage_phosting_php','true'),(5,'manage_phosting_python','true'),(5,'manage_phosting_ssi','true'),(5,'manage_phosting_ssl','true'),(5,'manage_phosting_webdeploy','true'),(5,'manage_php_settings','false'),(5,'manage_php_version','true'),(5,'manage_protected_dirs','false'),(5,'manage_quota','false'),(5,'manage_sh_access','false'),(5,'manage_spamfilter','false'),(5,'manage_subdomains','true'),(5,'manage_subftp','false'),(5,'manage_virusfilter','false'),(5,'manage_website_maintenance','false'),(5,'manage_webstat','true'),(5,'max_box','-1'),(5,'max_connections','-1'),(5,'max_db','-1'),(5,'max_dom_aliases','-1'),(5,'max_maillists','-1'),(5,'max_mn','-1'),(5,'max_site','-1'),(5,'max_site_builder','-1'),(5,'max_subdom','-1'),(5,'max_subftp_users','-1'),(5,'max_traffic','-1'),(5,'max_traffic_soft','-1'),(5,'max_wu','-1'),(5,'mbox_quota','-1'),(5,'nonexist_mail','reject'),(5,'outgoing_messages_domain_limit','default'),(5,'outgoing_messages_enable_sendmail','default'),(5,'outgoing_messages_mbox_limit','default'),(5,'outgoing_messages_subscription_limit','default'),(5,'oversell','true'),(5,'overuse_block','false'),(5,'overuse_notify','false'),(5,'overuse_suspend','false'),(5,'pdir_plesk_stat','true'),(5,'perl','false'),(5,'php','true'),(5,'php_handler_id','plesk-php83-fpm'),(5,'predefined_template','false'),(5,'python','false'),(5,'quota','-1'),(5,'remote_db_connection','false'),(5,'select_db_server','false'),(5,'shared_template','true'),(5,'shell','/bin/false'),(5,'ssi','false'),(5,'ssl','true'),(5,'sslRedirect','true'),(5,'stat_ttl','3'),(5,'tmpl_pool_id','0'),(5,'unpaid_website_status','suspended'),(5,'vh_type','physical'),(5,'webmail','roundcube'),(5,'webServerSettingsId','4'),(5,'webstat','webalizer'),(5,'wu_script','true');
/*!40000 ALTER TABLE `TmplData` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TraceFailedRequestsProviderAreas`
--

DROP TABLE IF EXISTS `TraceFailedRequestsProviderAreas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TraceFailedRequestsProviderAreas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `providerId` int(10) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`providerId`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TraceFailedRequestsProviderAreas`
--

LOCK TABLES `TraceFailedRequestsProviderAreas` WRITE;
/*!40000 ALTER TABLE `TraceFailedRequestsProviderAreas` DISABLE KEYS */;
/*!40000 ALTER TABLE `TraceFailedRequestsProviderAreas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TraceFailedRequestsProviders`
--

DROP TABLE IF EXISTS `TraceFailedRequestsProviders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TraceFailedRequestsProviders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ruleId` int(10) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`ruleId`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TraceFailedRequestsProviders`
--

LOCK TABLES `TraceFailedRequestsProviders` WRITE;
/*!40000 ALTER TABLE `TraceFailedRequestsProviders` DISABLE KEYS */;
/*!40000 ALTER TABLE `TraceFailedRequestsProviders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TraceFailedRequestsRules`
--

DROP TABLE IF EXISTS `TraceFailedRequestsRules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TraceFailedRequestsRules` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `domainId` int(10) unsigned NOT NULL,
  `statusCodes` varchar(255) NOT NULL,
  `stopDate` datetime NOT NULL DEFAULT '1970-01-01 00:00:00',
  `isEnabled` int(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `isEnabled` (`isEnabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TraceFailedRequestsRules`
--

LOCK TABLES `TraceFailedRequestsRules` WRITE;
/*!40000 ALTER TABLE `TraceFailedRequestsRules` DISABLE KEYS */;
/*!40000 ALTER TABLE `TraceFailedRequestsRules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserSettings`
--

DROP TABLE IF EXISTS `UserSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserSettings` (
  `userId` int(10) unsigned NOT NULL,
  `param` varchar(255) NOT NULL,
  `val` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`userId`,`param`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserSettings`
--

LOCK TABLES `UserSettings` WRITE;
/*!40000 ALTER TABLE `UserSettings` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WebServerSettings`
--

DROP TABLE IF EXISTS `WebServerSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `WebServerSettings` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WebServerSettings`
--

LOCK TABLES `WebServerSettings` WRITE;
/*!40000 ALTER TABLE `WebServerSettings` DISABLE KEYS */;
INSERT INTO `WebServerSettings` VALUES (1),(2),(3),(4),(5),(6);
/*!40000 ALTER TABLE `WebServerSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WebServerSettingsParameters`
--

DROP TABLE IF EXISTS `WebServerSettingsParameters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `WebServerSettingsParameters` (
  `webServerSettingsId` int(10) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  PRIMARY KEY (`webServerSettingsId`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WebServerSettingsParameters`
--

LOCK TABLES `WebServerSettingsParameters` WRITE;
/*!40000 ALTER TABLE `WebServerSettingsParameters` DISABLE KEYS */;
INSERT INTO `WebServerSettingsParameters` VALUES (1,'nginxProxyMode','true'),(1,'restrictFollowSymLinks','true'),(2,'nginxProxyMode','true'),(2,'restrictFollowSymLinks','true'),(3,'nginxProxyMode','true'),(3,'restrictFollowSymLinks','true'),(4,'nginxProxyMode','true'),(4,'restrictFollowSymLinks','true'),(5,'configPreset','fast'),(5,'ruleEngine','On'),(5,'ruleSet','comodo_free'),(5,'ruleSetUpdate','daily'),(5,'wafWebServer','apache'),(6,'expiresStaticOnly','true'),(6,'nginxCacheBypassGetNocache','true'),(6,'nginxCacheBypassHeaderAuth','true'),(6,'nginxCacheBypassHeaderNocache','true'),(6,'nginxCacheEnabled','false'),(6,'nginxCacheKey','$scheme$request_method$host$request_uri'),(6,'nginxCacheSize','67108864'),(6,'nginxCacheTimeout','5'),(6,'nginxCacheUseStale4xx','false'),(6,'nginxCacheUseStale5xx','true'),(6,'nginxCacheUseStaleUpdating','true'),(6,'nginxClientMaxBodySize','137438953472'),(6,'nginxProxyMode','true'),(6,'nginxServePhp','false'),(6,'nginxServeStatic','false'),(6,'nginxTransparentMode','false'),(6,'restrictFollowSymLinks','true');
/*!40000 ALTER TABLE `WebServerSettingsParameters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Webmails`
--

DROP TABLE IF EXISTS `Webmails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Webmails` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `version` varchar(255) NOT NULL,
  `release` varchar(255) NOT NULL,
  `docroot` varchar(255) NOT NULL,
  `enabled` enum('false','true') NOT NULL DEFAULT 'false',
  `serviceNodeId` int(10) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_id` (`product_id`),
  UNIQUE KEY `docroot` (`docroot`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Webmails`
--

LOCK TABLES `Webmails` WRITE;
/*!40000 ALTER TABLE `Webmails` DISABLE KEYS */;
INSERT INTO `Webmails` VALUES (1,'roundcube','Roundcube','1.6.9','not-available','/usr/share/psa-roundcube','true',1);
/*!40000 ALTER TABLE `Webmails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WebsitesDiagnostic`
--

DROP TABLE IF EXISTS `WebsitesDiagnostic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `WebsitesDiagnostic` (
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('regular','manual') NOT NULL DEFAULT 'regular',
  `depth` int(11) unsigned NOT NULL DEFAULT 0,
  `duration` int(11) unsigned NOT NULL DEFAULT 0,
  `problems` mediumblob DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WebsitesDiagnostic`
--

LOCK TABLES `WebsitesDiagnostic` WRITE;
/*!40000 ALTER TABLE `WebsitesDiagnostic` DISABLE KEYS */;
/*!40000 ALTER TABLE `WebsitesDiagnostic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WebsitesDiagnosticDomains`
--

DROP TABLE IF EXISTS `WebsitesDiagnosticDomains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `WebsitesDiagnosticDomains` (
  `websitesDiagnosticId` int(10) unsigned NOT NULL,
  `domainId` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WebsitesDiagnosticDomains`
--

LOCK TABLES `WebsitesDiagnosticDomains` WRITE;
/*!40000 ALTER TABLE `WebsitesDiagnosticDomains` DISABLE KEYS */;
/*!40000 ALTER TABLE `WebsitesDiagnosticDomains` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(32) NOT NULL DEFAULT 'plain',
  `password` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,'sym','$AES-128-CBC$GVZYurAiU2qYmLmWHtoqdA==$RK//nNUjNbR+3QZFSyDzJw=='),(2,'sym','$AES-128-CBC$himKC0nIhYPHeKSnIdQ2lQ==$nmoT864moSMXc+rZlYtE1A=='),(3,'sym','$AES-128-CBC$tPtFGhIf7hfmoDIZPnsQqg==$MajIKmI9JC3N9DSpV1If9g=='),(11,'sym','$AES-128-CBC$KouzPgWtdYfOjZaldT/WBQ==$lhCaAs7/J188V5htneYoQg==');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `actions`
--

DROP TABLE IF EXISTS `actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actions` (
  `name` varchar(255) NOT NULL,
  `enabled` enum('false','true') NOT NULL DEFAULT 'true',
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actions`
--

LOCK TABLES `actions` WRITE;
/*!40000 ALTER TABLE `actions` DISABLE KEYS */;
/*!40000 ALTER TABLE `actions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_aliases`
--

DROP TABLE IF EXISTS `admin_aliases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_aliases` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `login` varchar(20) NOT NULL,
  `account_id` int(10) unsigned NOT NULL,
  `arealname` varchar(255) NOT NULL,
  `aemail` varchar(255) NOT NULL,
  `comments` varchar(255) NOT NULL,
  `status` bigint(20) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_aliases`
--

LOCK TABLES `admin_aliases` WRITE;
/*!40000 ALTER TABLE `admin_aliases` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_aliases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_aliases_param`
--

DROP TABLE IF EXISTS `admin_aliases_param`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_aliases_param` (
  `alias_id` int(10) unsigned NOT NULL DEFAULT 0,
  `param` varchar(245) NOT NULL,
  `val` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`alias_id`,`param`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_aliases_param`
--

LOCK TABLES `admin_aliases_param` WRITE;
/*!40000 ALTER TABLE `admin_aliases_param` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_aliases_param` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `anon_ftp`
--

DROP TABLE IF EXISTS `anon_ftp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `anon_ftp` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `dom_id` int(10) unsigned NOT NULL DEFAULT 0,
  `max_conn` int(10) unsigned DEFAULT NULL,
  `bandwidth` int(10) unsigned DEFAULT NULL,
  `incoming` enum('false','true') NOT NULL DEFAULT 'false',
  `incoming_readable` enum('false','true') NOT NULL DEFAULT 'false',
  `incoming_subdirs` enum('false','true') NOT NULL DEFAULT 'false',
  `status` enum('false','true') NOT NULL DEFAULT 'false',
  `quota` bigint(20) unsigned DEFAULT 1048576,
  `display_login` enum('false','true') NOT NULL DEFAULT 'false',
  `login_text` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dom_id` (`dom_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anon_ftp`
--

LOCK TABLES `anon_ftp` WRITE;
/*!40000 ALTER TABLE `anon_ftp` DISABLE KEYS */;
/*!40000 ALTER TABLE `anon_ftp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `apsContexts`
--

DROP TABLE IF EXISTS `apsContexts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `apsContexts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pleskType` varchar(255) NOT NULL,
  `pleskId` int(10) unsigned NOT NULL,
  `ssl` enum('false','true') NOT NULL DEFAULT 'false',
  `subscriptionId` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apsContexts`
--

LOCK TABLES `apsContexts` WRITE;
/*!40000 ALTER TABLE `apsContexts` DISABLE KEYS */;
/*!40000 ALTER TABLE `apsContexts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `apsContextsApplications`
--

DROP TABLE IF EXISTS `apsContextsApplications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `apsContextsApplications` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `apsContextId` int(10) unsigned NOT NULL,
  `registryApplicationId` varchar(36) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apsContextsApplications`
--

LOCK TABLES `apsContextsApplications` WRITE;
/*!40000 ALTER TABLE `apsContextsApplications` DISABLE KEYS */;
/*!40000 ALTER TABLE `apsContextsApplications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `apsInstancesParameters`
--

DROP TABLE IF EXISTS `apsInstancesParameters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `apsInstancesParameters` (
  `instanceId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`instanceId`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apsInstancesParameters`
--

LOCK TABLES `apsInstancesParameters` WRITE;
/*!40000 ALTER TABLE `apsInstancesParameters` DISABLE KEYS */;
/*!40000 ALTER TABLE `apsInstancesParameters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `apsResources`
--

DROP TABLE IF EXISTS `apsResources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `apsResources` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `registryId` varchar(36) NOT NULL,
  `pleskType` varchar(255) NOT NULL,
  `pleskId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apsResources`
--

LOCK TABLES `apsResources` WRITE;
/*!40000 ALTER TABLE `apsResources` DISABLE KEYS */;
/*!40000 ALTER TABLE `apsResources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `apsResourcesParameters`
--

DROP TABLE IF EXISTS `apsResourcesParameters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `apsResourcesParameters` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `apsResourceId` int(10) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apsResourcesParameters`
--

LOCK TABLES `apsResourcesParameters` WRITE;
/*!40000 ALTER TABLE `apsResourcesParameters` DISABLE KEYS */;
/*!40000 ALTER TABLE `apsResourcesParameters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `apscategories`
--

DROP TABLE IF EXISTS `apscategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `apscategories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) DEFAULT NULL,
  `parent_id` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apscategories`
--

LOCK TABLES `apscategories` WRITE;
/*!40000 ALTER TABLE `apscategories` DISABLE KEYS */;
/*!40000 ALTER TABLE `apscategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avstatistics`
--

DROP TABLE IF EXISTS `avstatistics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `avstatistics` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('summary','viruses','recipients','spam_summary','spam_recipients') NOT NULL DEFAULT 'summary',
  `date` date NOT NULL DEFAULT '1970-01-01',
  `name` varchar(255) NOT NULL,
  `val` bigint(20) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type` (`type`,`date`),
  KEY `date_type` (`type`,`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avstatistics`
--

LOCK TABLES `avstatistics` WRITE;
/*!40000 ALTER TABLE `avstatistics` DISABLE KEYS */;
/*!40000 ALTER TABLE `avstatistics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `badmailfrom`
--

DROP TABLE IF EXISTS `badmailfrom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `badmailfrom` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `domain` varchar(255) NOT NULL,
  `serviceNodeId` int(10) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `domain` (`domain`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `badmailfrom`
--

LOCK TABLES `badmailfrom` WRITE;
/*!40000 ALTER TABLE `badmailfrom` DISABLE KEYS */;
/*!40000 ALTER TABLE `badmailfrom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificates`
--

DROP TABLE IF EXISTS `certificates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `certificates` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `csr` blob DEFAULT NULL,
  `pvt_key` blob DEFAULT NULL,
  `cert` blob DEFAULT NULL,
  `cert_file` varchar(255) NOT NULL DEFAULT '',
  `ca_cert` blob DEFAULT NULL,
  `ca_file` varchar(255) NOT NULL DEFAULT '',
  `name` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificates`
--

LOCK TABLES `certificates` WRITE;
/*!40000 ALTER TABLE `certificates` DISABLE KEYS */;
INSERT INTO `certificates` VALUES (1,'','-----BEGIN RSA PRIVATE KEY-----\nMIICXgIBAAKBgQDhMDsty2agl6wpZA/qbNy58dDHeWieW18hKHKF8IcpQ950NuQz\nwGbRLEmBYpqLVrcbQKMHJr8noFL+Uegm3EpV1bz8hiMalsmcGlhelW3+Jn0ZRaY+\neFDQUNY0dYAGqgLoc2wxhhG/JXI04kSS6UxHRZKXUIsJoZS/bT4sxtjV8QIDAQAB\nAoGATY04tDq6a1AQwGhvesJm+bqntiq/ttms11SArFP7mGCBOfC1goUeY6cm4WI9\n6wLAKKiH/KyBZHo4WtGGa+utxWBYTlR4+08DQOCFhyg9z0itCknIDitxpg8Vqqup\nun4p3f+VjN+kJvGjQ+RNNtn2LZlEXK9BvPukj6zNTQCJjOkCQQD2xKsjRV7MfmPB\nWNAKhUO6NdgkqnAApRuaSBQ2nd4I/atza+W6Fvb83Mw2pGQTQd0Yu3ydyDhbPJy0\n4fl3ECAnAkEA6ZzjyUYh32g8RlLtgSqQvsHbFR2P9A31z4jSCRH0RfV4aw6Drdei\n3eb9SN2OML8JnIqiPtAy6v89rVjMxwKQJwJBAOtwONguF4SEEikm01c2TqgbN13E\nP5hd7zgEDUUO2gk5/ZriFwy1XHFlOHHp5pF5BbnTJ9JidWKXMexireErQYECQQDM\n1fwE57GbqlHvd5c4wpHYMTJf+WPXosX+CwHfYhbFoM7NUBS1wXXVDEzaLyoWI+vR\njt1kJjn/Q35ZGJu1g9HRAkEAhDu4yuh0G5eoP602Hf/uv7FbVfc/DEwA0xDqBNNH\ngXxFjdOB7bp3w0ARGeOqMne04yPconECrsYfm1vqFx9DMA==\n-----END RSA PRIVATE KEY-----','\n-----BEGIN RSA PUBLIC KEY-----\nMIGJAoGBAOEwOy3LZqCXrClkD+ps3Lnx0Md5aJ5bXyEocoXwhylD3nQ25DPAZtEs\nSYFimotWtxtAowcmvyegUv5R6CbcSlXVvPyGIxqWyZwaWF6Vbf4mfRlFpj54UNBQ\n1jR1gAaqAuhzbDGGEb8lcjTiRJLpTEdFkpdQiwmhlL9tPizG2NXxAgMBAAE=\n-----END RSA PUBLIC KEY-----\n','','','','Backup sign certificate'),(2,'','%2D%2D%2D%2D%2DBEGIN+PRIVATE+KEY%2D%2D%2D%2D%2D%0AMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDZlePqFhVvnU5D%0A18LBa%2FIXOWXXprtDlyoGnHUa3%2B6LBvIYgn%2Fnj%2Bdy%2B%2Bgdq2gQQ1HD%2FxG5sgDvlZZ8%0Ab1BdqTRO9CcywowZFc%2BUyDRe2FmHNSzotrzlrmJu376wPphQRvxFVgvvqyTbWUAZ%0As%2BC8DdX0ON8km6m5asX%2FhjrzVK669Jb34Re2aIWZQES%2BV%2B2j6dHdpr5oLTtuii%2F%2F%0AKGcxFj9UGPxjt9x88R0ABrhZkaxSyClFMOoD1unnigPHEqX9OtQc%2FBhuNeupmWSt%0ALgoclmT1BXFyryOR5q3oxNzMgzYYDuRNFTeF%2BeP3eEbtOJyA%2BeQKj3GacC%2BM4sLm%0AHl%2FNDKsPAgMBAAECggEAEzzr%2Fl3%2BfjRf36K7jwN%2Bz6vdA9CznPnIFvaNahdjjXpL%0APHyJV42DLsj0EG9%2Fz3RMTfKG%2FC6vY3%2BL4yuqZOWZgOOYdaX64hrqFCMRclNZsxky%0AA89oazxcaqYww399Uxe7pVvCyWmN5DEDeGJNnALzKFlA7Ykv2%2FuDTyDspGgX3OKq%0Ai4paf9%2BuZtWHh7phTPohO335gpK1zJOF4jfQGYFHGVeUoPahKMSytbHiVDHhos65%0AI1WQYRWUSPOK1EbGTM9jV%2BWlsew%2FXcuwDRlFC1DDuLQi%2BTiNIDjghEhaIYqQNKTC%0AknpcKC1vaC04s42%2FzGYYPSR%2FQ9nQgIFjzdlB0ucjjQKBgQD5moGtpblrL0FHBKxe%0AaouBtQdaBJzpFEsCTaWXbJrb%2FhRiBcel6shHu%2FdckNWb3b0Mn42P%2FTEmGDCMZ%2FvT%0AoytgNHXuqA%2BEG7%2BRQhHbRnGFO3V0hEJ0T3dSWciiEWjadNZyTOtR%2FoC%2Bsvvks6f1%0AKO6NbV8FA4T2p5ugmklGtx36rQKBgQDfKVVW7N5Gap4cWkSNjTPkJ9zHqKxhq5b3%0AL9tKLP6p7hleabkSQnckjSEYfqhpZ6nDmZy8wuZLmGW8Y2oH8CzTWKF7%2FVVJ4qx7%0AZkfCkfBXrKsP%2BqlItMAKotmS%2FBrgkMbkxPGPtU5D7GK4eUvwQZVk6vUSmhilRtTq%0AWqFEdpPQKwKBgQDZ%2Fv1%2FQZxdZpomgohgtcE9%2BXOARUMdtiGE03fqdmoR9SisK8wg%0AtptRO3NhHwXQ6aqxGbCzrzh7wuiz2CVyw7GghnDxjUpv4SRAo2mhDzcaW8HLj6%2FS%0AkYzvGYdHNNlU4nJgxZlItXSQGRYyuk3YqnUehAVXBandGqmrbNTOtCO0yQKBgQCv%0AlOncVsocRU7Zp%2FxAE1U8slB3lzLqNgO1wSWcmwJT2U6EhlJjF4B%2BdbwQdbc0F6fu%0AijJUIlToLaP%2BMYn%2FbO0X7KhB0fUFCSAEh1j2sbSUhvqgu%2BvtlKl0tOTTTSAoiEC1%0ARm95ToGh159k3aruAev1Vxgz5qJ1h%2BGF8oDoSRPLuQKBgQD1udK0WH224JHUQuH9%0Ayc9gdFVnnhfxZFe2vFdaHEg5QRVpIxrfPRxYkfQDILnHKjtH9n1NxD26dbE%2By%2Bn3%0Avosyj8wcFus7Yv1NzpxWPXaOb1%2FPnS1GbwaTy0tjkU5zncMtBdBdCb7o5NXP4ib%2F%0A%2Fbd4ajWlB8jHbzCJWW06n2HNtA%3D%3D%0A%2D%2D%2D%2D%2DEND+PRIVATE+KEY%2D%2D%2D%2D%2D%0A','%2D%2D%2D%2D%2DBEGIN+CERTIFICATE%2D%2D%2D%2D%2D%0AMIIDejCCAmKgAwIBAgIEZuFxqjANBgkqhkiG9w0BAQsFADBjMQswCQYDVQQGEwJD%0ASDEVMBMGA1UEBwwMU2NoYWZmaGF1c2VuMQ4wDAYDVQQKDAVQbGVzazEOMAwGA1UE%0AAwwFUGxlc2sxHTAbBgkqhkiG9w0BCQEWDmluZm9AcGxlc2suY29tMB4XDTI0MDkx%0AMTEwMzIxMFoXDTI1MDkxMTEwMzIxMFowYzELMAkGA1UEBhMCQ0gxFTATBgNVBAcM%0ADFNjaGFmZmhhdXNlbjEOMAwGA1UECgwFUGxlc2sxDjAMBgNVBAMMBVBsZXNrMR0w%0AGwYJKoZIhvcNAQkBFg5pbmZvQHBsZXNrLmNvbTCCASIwDQYJKoZIhvcNAQEBBQAD%0AggEPADCCAQoCggEBANmV4%2BoWFW%2BdTkPXwsFr8hc5Zdemu0OXKgacdRrf7osG8hiC%0Af%2BeP53L76B2raBBDUcP%2FEbmyAO%2BVlnxvUF2pNE70JzLCjBkVz5TINF7YWYc1LOi2%0AvOWuYm7fvrA%2BmFBG%2FEVWC%2B%2BrJNtZQBmz4LwN1fQ43ySbqblqxf%2BGOvNUrrr0lvfh%0AF7ZohZlARL5X7aPp0d2mvmgtO26KL%2F8oZzEWP1QY%2FGO33HzxHQAGuFmRrFLIKUUw%0A6gPW6eeKA8cSpf061Bz8GG4166mZZK0uChyWZPUFcXKvI5HmrejE3MyDNhgO5E0V%0AN4X54%2Fd4Ru04nID55AqPcZpwL4ziwuYeX80Mqw8CAwEAAaM2MDQwEwYDVR0lBAww%0ACgYIKwYBBQUHAwEwHQYDVR0OBBYEFNGunNrNoS7Pme7hoLC8m67BxQVvMA0GCSqG%0ASIb3DQEBCwUAA4IBAQC%2B4zfQqr0r1nEAaFVMgypMRfxFYGqMpuCkYC0RUl3Db0OC%0ACd2gvX4LFUIXIVD%2FBxfXB0AF2YWd%2BY0IHxF8ET7n71AwZ1DZGeavs%2FVWTmSHJUHz%0AzL%2BlVr20r1qUHXAHvRb8%2BUXIlwFqF%2BIozlPWAmb7Jrm%2BDWY7gi%2B%2FvP8PM%2B%2Fqv8%2FI%0AlhN8sERvVVTRxv2gAqG5Ck8a5BWGooiSSzKwG1egSjl7jfQJa6qcsF0fwwJy1pay%0ATwrpH7dlvQuWcOT9owHqp4ehdJOGZWlnz9KWpbFy23xpcdPPG%2FoK4Q%2B905B1LVPx%0AZiu8YMJe6ltVLoX8WKZpuRAweZUAODhCSm5KkFat%0A%2D%2D%2D%2D%2DEND+CERTIFICATE%2D%2D%2D%2D%2D%0A','cert3qHW4lf','','','default certificate'),(3,'-----BEGIN+CERTIFICATE+REQUEST-----%0AMIIC2jCCAcICAQAwHjEcMBoGA1UEAwwTZmV0aXNobWVnYXN0b3JlLmNvbTCCASIw%0ADQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJb7Pj9AykC0nhtktpgPVFdcPecQ%0A4aJvhb8pXCgW%2BkQnv3Qq6i%2BHsJfuG%2F14BRiCcxNDPtO13JcC0%2F8YIwm2gqroHROe%0Ati6lY80bZXz0ixcGjdToI9oyK6j%2BwHBc2QmODCdiTqBOlvkClHrL8tDq0Q%2FFJWvE%0A25KUnZMArOjHs2Y9YLhqYSZbRHEOHvJV0IOBNSadlJDyql7pgVbuLcRNKB%2FEc7Rk%0AesO9QnfwUb0Y7UEYCDndif1pgwGkOREpOQq2QBTAN6%2FS8WkPNcBj7yxwdji4%2BATJ%0AvnkIT%2FwAzj90QGRSnrSpe8DDz2G%2BUF1LTajmpJygLcr4U0YIhdfBuMXxg6UCAwEA%0AAaB3MHUGCSqGSIb3DQEJDjFoMGYwCQYDVR0TBAIwADALBgNVHQ8EBAMCBeAwTAYD%0AVR0RBEUwQ4ITZmV0aXNobWVnYXN0b3JlLmNvbYIVKi5mZXRpc2htZWdhc3RvcmUu%0AY29tghUqLmZldGlzaG1lZ2FzdG9yZS5jb20wDQYJKoZIhvcNAQELBQADggEBAIyp%0A7SnsbalA9AbwuCyS7ScCAdtBz90IvW0DBzWe6yJOJ5w4srshLKG4VTk%2FktruT7g%2F%0AGYKkEZnTge9yNksbp7RX1E6LCU5x2%2FCKYTSGH7Kqsl3TFr3Y9QNi5PzO1jROYqvg%0Ap%2FbNG4lm%2FGitNPSjVJqwr4DVQzL0q9ikRgF5wx2iFFY15XOQFqUpX8MXsFqoBonG%0ACYwBgjMCEZtn3RK1iGffBhBooijwkmxeUpcKV%2B8ixj13MylYCaRAzmwt45kD2wrI%0ArfdQ5%2B945QRDiE9qiK0fBs6Mb6URGqgKmZHlmk9NV04WLlu3oULulc%2B1Guj9cwnO%0AttlT10VTEPCtKQntRH4%3D%0A-----END+CERTIFICATE+REQUEST-----','-----BEGIN+PRIVATE+KEY-----%0AMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCW%2Bz4%2FQMpAtJ4b%0AZLaYD1RXXD3nEOGib4W%2FKVwoFvpEJ790Kuovh7CX7hv9eAUYgnMTQz7TtdyXAtP%2F%0AGCMJtoKq6B0TnrYupWPNG2V89IsXBo3U6CPaMiuo%2FsBwXNkJjgwnYk6gTpb5ApR6%0Ay%2FLQ6tEPxSVrxNuSlJ2TAKzox7NmPWC4amEmW0RxDh7yVdCDgTUmnZSQ8qpe6YFW%0A7i3ETSgfxHO0ZHrDvUJ38FG9GO1BGAg53Yn9aYMBpDkRKTkKtkAUwDev0vFpDzXA%0AY%2B8scHY4uPgEyb55CE%2F8AM4%2FdEBkUp60qXvAw89hvlBdS02o5qScoC3K%2BFNGCIXX%0AwbjF8YOlAgMBAAECggEAM%2BG9J65Dcg2%2FAQnQRxuJb4W2jeb6qj9pdeGoFeyjbnU8%0AMJaop9GYaPT9MFIkaiI1mgpzFfw6A7iIkfHA5I8PgtxFVZ8l2oyh6XL%2FInvEKhLp%0A%2FR4SZ%2BHyp9120oXNXR%2BvZH8%2FJo4rCgGNdU8NLyZp1eH4tHpOu6WPKltCj7FEIB7z%0AK0qt1viLm8oVFCHz7114w6VNzzExU%2FyIDktorqpAcmIXlesiQU14H88Nk9VIiibB%0AQX4gxzR9yGCjC24WBJ%2F4blI%2B3GRfQRml9PwiaawNuHuqLsyKTQcH0%2FqIb%2BGp5kBo%0Ah4TkunGUn1cnw74PeO5%2FT0HLwQGAGZaBtb92P9f%2BxwKBgQDJl5niy8qNr9LdkL%2Fr%0A4Zpi0VYoFFM5BfpNS6biS7W%2FiMLkYruFux6%2BwQSmoOHuNccN9WmiqarBFNRchTRq%0Avvu5tLi75MV2tT0mYWbFMCNwnkhJyQTIl6DAcDHbOMk6sHS0HSQe1%2Ftu8wnJIOeF%0Aa0LIG6MCUtF4qcK7l38pD%2B20vwKBgQC%2Futg%2BocoHC3bYTF4sxyAVYeyqs2Qaxtpv%0APeu2pGtV9nsJw1Ze8dSlobrNGCtrhMBJ15r29ZAg5Umiyb%2BCocHj7m1JwgY2v5Bv%0Abg%2BjIV7TEam4bjLKlj68fLPia1HaYGu6OW2RbzAGKiaa1aFZ9EODlzd8CztgalQh%0A4StpYdvsmwKBgBmjdUfZ4U350ZiqQy5tx%2BPPeeSpCRiUgQv5liTruha8%2FwRq5iyQ%0A6s0Z4UyL45AXONS2pJOyfmwGCSgnLM5ysbMhn%2BkNpGt%2Fi2JpOtfTUn6NMuZncXtN%0AhX1UB5M4%2BqbDMGSD3Ecr8udec50n2SonxRuMIEQ4Yjm1ZXXUQ7DmPLYjAoGAMQXg%0ARtttYbG%2FuHyGU%2BKyRGVecyMdRG916J2niHKv8zHrscpdajdhTNx2e%2FxjFcHCvN7B%0AA8Y0DQUzd8koC4m6nsIW9ZYDqrn%2Bf09f9jERItzQTZT3ra8O6XjlMc6JBlJDGUGX%0Az2jjmZ%2FrcQmQkQSQwrPGfxQMIZHuYx9Ez1QzPGMCgYAWsbaPqUyVdEclehe3QRk%2B%0AD0HBhhQVx3CXGhDGAxUYi7G21WB1VwUEaY1LRqSNKUHkLSim4aaLsbLftMug%2FWx%2F%0AJFjteh1Pm07xiuVW4JrscSXoGvPlbWRXuI9V5A2uBXTkkaXyHcASRchVDbQhZr2w%0AS0O0Qhs8VZuPyThvmWSSdg%3D%3D%0A-----END+PRIVATE+KEY-----','-----BEGIN+CERTIFICATE-----%0AMIIFDDCCA%2FSgAwIBAgISAzIEa7UGT5yoSr1%2FFedWWGLZMA0GCSqGSIb3DQEBCwUA%0AMDMxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1MZXQncyBFbmNyeXB0MQwwCgYDVQQD%0AEwNSMTAwHhcNMjQwOTE5MDUzNjQ5WhcNMjQxMjE4MDUzNjQ4WjAeMRwwGgYDVQQD%0AExNmZXRpc2htZWdhc3RvcmUuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB%0ACgKCAQEAlvs%2BP0DKQLSeG2S2mA9UV1w95xDhom%2BFvylcKBb6RCe%2FdCrqL4ewl%2B4b%0A%2FXgFGIJzE0M%2B07XclwLT%2FxgjCbaCqugdE562LqVjzRtlfPSLFwaN1Ogj2jIrqP7A%0AcFzZCY4MJ2JOoE6W%2BQKUesvy0OrRD8Ula8TbkpSdkwCs6MezZj1guGphJltEcQ4e%0A8lXQg4E1Jp2UkPKqXumBVu4txE0oH8RztGR6w71Cd%2FBRvRjtQRgIOd2J%2FWmDAaQ5%0AESk5CrZAFMA3r9LxaQ81wGPvLHB2OLj4BMm%2BeQhP%2FADOP3RAZFKetKl7wMPPYb5Q%0AXUtNqOaknKAtyvhTRgiF18G4xfGDpQIDAQABo4ICLTCCAikwDgYDVR0PAQH%2FBAQD%0AAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAMBgNVHRMBAf8EAjAA%0AMB0GA1UdDgQWBBRQEYhB%2FTcIN2QNzVn9sVk1SCeqjDAfBgNVHSMEGDAWgBS7vMNH%0ApeS8qcbDpHIMEI2iNeHI6DBXBggrBgEFBQcBAQRLMEkwIgYIKwYBBQUHMAGGFmh0%0AdHA6Ly9yMTAuby5sZW5jci5vcmcwIwYIKwYBBQUHMAKGF2h0dHA6Ly9yMTAuaS5s%0AZW5jci5vcmcvMDUGA1UdEQQuMCyCFSouZmV0aXNobWVnYXN0b3JlLmNvbYITZmV0%0AaXNobWVnYXN0b3JlLmNvbTATBgNVHSAEDDAKMAgGBmeBDAECATCCAQMGCisGAQQB%0A1nkCBAIEgfQEgfEA7wB2AD8XS0%2FXIkdYlB1lHIS%2BDRLtkDd%2FH4Vq68G%2FKIXs%2BGRu%0AAAABkgj%2BCvIAAAQDAEcwRQIhALbTn%2BZ4BOzNSHAlVStEubAWPRwWt8Oq2%2BcImP8R%0A5N5xAiB4oU%2FJaH7ZdXWuoJJsw4viskjNjtnuXUa8E%2Bg%2BdYNUXgB1ABmYEHEJ8NZS%0ALjCA0p4%2FZLuDbijM%2BQ9Sju7fzko%2FFrTKAAABkgj%2BCwMAAAQDAEYwRAIgWlm1A72j%0Al3c0lsmxcri1VIP6GZyhvw7lZqhlsOIUtp4CIDfiozd6FxEZYSNBeZJuRkB3TweJ%0AflHrCztS0733K3ZuMA0GCSqGSIb3DQEBCwUAA4IBAQAbtm5tZsPdyIvkK7tA97m6%0Ai2yUjClssO72lNSzx9S1dfE3ApasAO8a%2FCW08eMTkwmnfukTWwEbKaKVQ%2BiYK%2Flh%0AT0K5hRmdZIryPA1Z7WYf41FELPRADHRuSFP1S5PfzJLg%2BmXsDNPivadZ9oOk6oGc%0A2hJU5ZUGQX%2BhWtOderCPV%2FmQM6DFsXBjtk3OHSA5SDFyj6Qdqob0Op9szj1Zntsr%0ASZWZTw8O8oYeGjVzbqTFf4ePSwLcbevhA9Y9CSfSLhb8pBcxX%2B2N0v%2BKG3zwQLKN%0A4gHiZtaii50tOHwPyViUnEXadj7bQRhXo3Gy0NW%2FRU2JxxyEfxET4PQAdUvpYsE8%0A-----END+CERTIFICATE-----','scf42fDmW','-----BEGIN+CERTIFICATE-----%0AMIIFBTCCAu2gAwIBAgIQS6hSk%2FeaL6JzBkuoBI110DANBgkqhkiG9w0BAQsFADBP%0AMQswCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJuZXQgU2VjdXJpdHkgUmVzZWFy%0AY2ggR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBYMTAeFw0yNDAzMTMwMDAwMDBa%0AFw0yNzAzMTIyMzU5NTlaMDMxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1MZXQncyBF%0AbmNyeXB0MQwwCgYDVQQDEwNSMTAwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEK%0AAoIBAQDPV%2BXmxFQS7bRH%2FsknWHZGUCiMHT6I3wWd1bUYKb3dtVq%2F%2BvbOo76vACFL%0AYlpaPAEvxVgD9on%2FjhFD68G14BQHlo9vH9fnuoE5CXVlt8KvGFs3Jijno%2FQHK20a%0A%2F6tYvJWuQP%2Fpy1fEtVt%2FeA0YYbwX51TGu0mRzW4Y0YCF7qZlNrx06rxQTOr8IfM4%0AFpOUurDTazgGzRYSespSdcitdrLCnF2YRVxvYXvGLe48E1KGAdlX5jgc3421H5KR%0AmudKHMxFqHJV8LDmowfs%2FacbZp4%2FSItxhHFYyTr6717yW0QrPHTnj7JHwQdqzZq3%0ADZb3EoEmUVQK7GH29%2FXi8orIlQ2NAgMBAAGjgfgwgfUwDgYDVR0PAQH%2FBAQDAgGG%0AMB0GA1UdJQQWMBQGCCsGAQUFBwMCBggrBgEFBQcDATASBgNVHRMBAf8ECDAGAQH%2F%0AAgEAMB0GA1UdDgQWBBS7vMNHpeS8qcbDpHIMEI2iNeHI6DAfBgNVHSMEGDAWgBR5%0AtFnme7bl5AFzgAiIyBpY9umbbjAyBggrBgEFBQcBAQQmMCQwIgYIKwYBBQUHMAKG%0AFmh0dHA6Ly94MS5pLmxlbmNyLm9yZy8wEwYDVR0gBAwwCjAIBgZngQwBAgEwJwYD%0AVR0fBCAwHjAcoBqgGIYWaHR0cDovL3gxLmMubGVuY3Iub3JnLzANBgkqhkiG9w0B%0AAQsFAAOCAgEAkrHnQTfreZ2B5s3iJeE6IOmQRJWjgVzPw139vaBw1bGWKCIL0vIo%0Azwzn1OZDjCQiHcFCktEJr59L9MhwTyAWsVrdAfYf%2BB9haxQnsHKNY67u4s5Lzzfd%0Au6PUzeetUK29v%2BPsPmI2cJkxp%2BiN3epi4hKu9ZzUPSwMqtCceb7qPVxEbpYxY1p9%0A1n5PJKBLBX9eb9LU6l8zSxPWV7bK3lG4XaMJgnT9x3ies7msFtpKK5bDtotij%2Fl0%0AGaKeA97pb5uwD9KgWvaFXMIEt8jVTjLEvwRdvCn294GPDF08U8lAkIv7tghluaQh%0A1QnlE4SEN4LOECj8dsIGJXpGUk3aU3KkJz9icKy%2BaUgA%2B2cP21uh6NcDIS3XyfaZ%0AQjmDQ993ChII8SXWupQZVBiIpcWO4RqZk3lr7Bz5MUCwzDIA359e57SSq5CCkY0N%0A4B6Vulk7LktfwrdGNVI5BsC9qqxSwSKgRJeZ9wygIaehbHFHFhcBaMDKpiZlBHyz%0ArsnnlFXCb5s8HKn5LsUgGvB24L7sGNZP2CX7dhHov%2BYhD%2BjozLW2p9W4959Bz2Ei%0ARmqDtmiXLnzqTpXbI%2BsuyCsohKRg6Un0RC47%2BcpiVwHiXZAW%2Bcn8eiNIjqbVgXLx%0AKPpdzvvtTnOPlC7SQZSYmdunr3Bf9b77AiC%2FZidstK36dRILKz7OA54%3D%0A-----END+CERTIFICATE-----','scfTqWf1S','Lets Encrypt fetishmegastore.com');
/*!40000 ALTER TABLE `certificates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cl_param`
--

DROP TABLE IF EXISTS `cl_param`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cl_param` (
  `cl_id` int(10) unsigned NOT NULL DEFAULT 0,
  `param` varchar(245) NOT NULL,
  `val` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`cl_id`,`param`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cl_param`
--

LOCK TABLES `cl_param` WRITE;
/*!40000 ALTER TABLE `cl_param` DISABLE KEYS */;
INSERT INTO `cl_param` VALUES (1,'collapsedDomainSettings','false'),(1,'ext-xovi-ext-xovi-siteaudit-expire','1726374851'),(1,'Smb_View_List_MailSettings-sortDir','down'),(1,'Smb_View_List_MailSettings-sortField','webmail'),(1,'Smb_View_List_Sites-sortDir','down'),(1,'Smb_View_List_Sites-sortField','diskUsage');
/*!40000 ALTER TABLE `cl_param` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clients` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cr_date` date DEFAULT NULL,
  `cname` varchar(255) DEFAULT NULL,
  `pname` varchar(255) NOT NULL,
  `login` varchar(255) NOT NULL,
  `account_id` int(10) unsigned NOT NULL,
  `status` bigint(20) unsigned NOT NULL DEFAULT 0,
  `phone` varchar(255) DEFAULT NULL,
  `fax` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `pcode` varchar(10) DEFAULT NULL,
  `country` varchar(2) DEFAULT NULL,
  `locale` varchar(17) NOT NULL DEFAULT 'en-US',
  `description` varchar(255) DEFAULT NULL,
  `limits_id` int(10) unsigned DEFAULT 0,
  `params_id` int(10) unsigned NOT NULL DEFAULT 0,
  `perm_id` int(10) unsigned NOT NULL DEFAULT 0,
  `pool_id` int(10) unsigned NOT NULL DEFAULT 0,
  `logo_id` int(10) unsigned NOT NULL DEFAULT 0,
  `tmpl_id` int(10) unsigned NOT NULL DEFAULT 0,
  `sapp_pool_id` int(10) unsigned NOT NULL DEFAULT 0,
  `ownership` enum('false','true') NOT NULL DEFAULT 'true',
  `guid` varchar(36) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
  `parent_id` int(10) unsigned NOT NULL DEFAULT 0,
  `type` enum('admin','reseller','client') NOT NULL DEFAULT 'client',
  `overuse` enum('false','true') NOT NULL DEFAULT 'false',
  `vendor_id` int(10) unsigned DEFAULT NULL,
  `external_id` varchar(255) DEFAULT NULL,
  `passwd` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`login`),
  UNIQUE KEY `guid` (`guid`),
  KEY `pname` (`pname`),
  KEY `vendor_id` (`vendor_id`),
  KEY `type` (`type`),
  KEY `parent_id` (`parent_id`),
  KEY `account_id` (`account_id`),
  KEY `limits_id` (`limits_id`),
  KEY `params_id` (`params_id`),
  KEY `perm_id` (`perm_id`),
  KEY `pool_id` (`pool_id`),
  KEY `logo_id` (`logo_id`),
  KEY `tmpl_id` (`tmpl_id`),
  KEY `sapp_pool_id` (`sapp_pool_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,'2024-09-14',NULL,'Administrator','admin',0,0,NULL,NULL,'cyber-media@gmx.net',NULL,NULL,'','','XX','en-US',NULL,0,0,0,1,0,0,0,'true','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688',0,'admin','false',NULL,NULL,'');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cp_access`
--

DROP TABLE IF EXISTS `cp_access`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cp_access` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('allow','deny') NOT NULL DEFAULT 'allow',
  `netaddr` varchar(39) NOT NULL,
  `netmask` varchar(15) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cp_access`
--

LOCK TABLES `cp_access` WRITE;
/*!40000 ALTER TABLE `cp_access` DISABLE KEYS */;
/*!40000 ALTER TABLE `cp_access` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `custom_buttons`
--

DROP TABLE IF EXISTS `custom_buttons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `custom_buttons` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `sort_key` int(10) unsigned NOT NULL DEFAULT 100,
  `level` int(10) unsigned NOT NULL DEFAULT 0,
  `level_id` int(10) unsigned NOT NULL DEFAULT 0,
  `place` enum('domain','domain-properties','client','reseller','reseller-settings','admin','admin-settings','navigation') NOT NULL DEFAULT 'domain',
  `text` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `conhelp` text DEFAULT NULL,
  `options` int(10) unsigned NOT NULL DEFAULT 0,
  `file` varchar(245) NOT NULL,
  `plan_item_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `custom_buttons`
--

LOCK TABLES `custom_buttons` WRITE;
/*!40000 ALTER TABLE `custom_buttons` DISABLE KEYS */;
/*!40000 ALTER TABLE `custom_buttons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_bases`
--

DROP TABLE IF EXISTS `data_bases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `data_bases` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `type` enum('mysql','postgresql','mssql') NOT NULL DEFAULT 'mysql',
  `dom_id` int(10) unsigned NOT NULL DEFAULT 0,
  `db_server_id` int(10) unsigned NOT NULL,
  `default_user_id` int(10) unsigned DEFAULT NULL,
  `external_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_and_db_server_id` (`name`,`db_server_id`),
  KEY `dom_id` (`dom_id`),
  KEY `db_server_id` (`db_server_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_bases`
--

LOCK TABLES `data_bases` WRITE;
/*!40000 ALTER TABLE `data_bases` DISABLE KEYS */;
INSERT INTO `data_bases` VALUES (1,'fetishme_twitcher','mysql',1,1,1,NULL),(2,'fetish_bkp','mysql',1,1,NULL,NULL);
/*!40000 ALTER TABLE `data_bases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `db_users`
--

DROP TABLE IF EXISTS `db_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `db_users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `login` varchar(128) NOT NULL,
  `account_id` int(10) unsigned NOT NULL,
  `db_id` int(10) unsigned NOT NULL DEFAULT 0,
  `status` enum('normal','orphaned') NOT NULL DEFAULT 'normal',
  `dom_id` int(10) unsigned NOT NULL DEFAULT 0,
  `db_server_id` int(10) unsigned NOT NULL DEFAULT 0,
  `passwd` varchar(16) NOT NULL,
  `external_id` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'readWrite',
  PRIMARY KEY (`id`),
  UNIQUE KEY `db_server_id` (`db_server_id`,`db_id`,`login`),
  KEY `account_id` (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `db_users`
--

LOCK TABLES `db_users` WRITE;
/*!40000 ALTER TABLE `db_users` DISABLE KEYS */;
INSERT INTO `db_users` VALUES (1,'fetishme_mysql',3,0,'normal',1,1,'',NULL,'readWrite');
/*!40000 ALTER TABLE `db_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `disk_usage`
--

DROP TABLE IF EXISTS `disk_usage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `disk_usage` (
  `dom_id` int(10) unsigned NOT NULL DEFAULT 0,
  `httpdocs` bigint(20) unsigned DEFAULT 0,
  `httpsdocs` bigint(20) unsigned DEFAULT 0,
  `subdomains` bigint(20) unsigned DEFAULT 0,
  `web_users` bigint(20) unsigned DEFAULT 0,
  `anonftp` bigint(20) unsigned DEFAULT 0,
  `logs` bigint(20) unsigned DEFAULT 0,
  `mysql_dbases` bigint(20) unsigned NOT NULL DEFAULT 0,
  `mssql_dbases` bigint(20) unsigned NOT NULL DEFAULT 0,
  `pgsql_dbases` bigint(20) unsigned NOT NULL DEFAULT 0,
  `mailboxes` bigint(20) unsigned DEFAULT 0,
  `maillists` bigint(20) unsigned DEFAULT 0,
  `domaindumps` bigint(20) unsigned DEFAULT 0,
  `www_root` bigint(20) unsigned DEFAULT 0,
  `dbases` bigint(20) unsigned DEFAULT 0,
  `configs` bigint(20) unsigned DEFAULT 0,
  `chroot` bigint(20) unsigned DEFAULT 0,
  PRIMARY KEY (`dom_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `disk_usage`
--

LOCK TABLES `disk_usage` WRITE;
/*!40000 ALTER TABLE `disk_usage` DISABLE KEYS */;
INSERT INTO `disk_usage` VALUES (1,58480201728,0,0,0,0,133222400,0,0,0,102400,0,0,54816456704,73359360,8192,4096);
/*!40000 ALTER TABLE `disk_usage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dns_recs`
--

DROP TABLE IF EXISTS `dns_recs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dns_recs` (
  `time_stamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `dns_zone_id` int(10) unsigned DEFAULT NULL,
  `type` enum('NS','A','AAAA','CNAME','MX','PTR','TXT','AXFR','SRV','DS','CAA','TLSA','HTTPS','master','none') NOT NULL DEFAULT 'A',
  `host` varchar(255) NOT NULL,
  `displayHost` varchar(255) NOT NULL,
  `val` text NOT NULL,
  `displayVal` text NOT NULL,
  `opt` varchar(255) NOT NULL DEFAULT '',
  `external_id` varchar(255) DEFAULT NULL,
  `ttl` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `dns_zone_id` (`dns_zone_id`),
  KEY `type` (`type`),
  KEY `host` (`host`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dns_recs`
--

LOCK TABLES `dns_recs` WRITE;
/*!40000 ALTER TABLE `dns_recs` DISABLE KEYS */;
INSERT INTO `dns_recs` VALUES ('2024-09-14 04:34:09',14,1,'TXT','default._domainkey.fetishmegastore.com.','default._domainkey.fetishmegastore.com.','v=DKIM1; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvNcR3Gp33cP8onJLAEoL75fSrrGTgl8Z3ze44dQr8uufQnXW3Bu3E6N7mD95fIY+noCbpeovFMN6EDI1G2L5/gv0ePSMQJrudwTH/Luazk6J0U2bXELN5cJRTm9fnQwXvaSpYhrqhHced0S6vTme+QNLWeBaG2xBs9nzJ0WLTkKePwrVZlenHSAOrNPKvDv7OOgx5QEPPa7weuKDffUMLeTzi3KKwxLicTydpMfhmlWEEbQbF13XDHb7j7Z/oWlkcY/F6yNmw3Jh6fjuQhL6vFK9Te/AOg3lAFBdibqQJAYUxXebmVlhtVruGp/BMSlDYg1G6kJlRgek22Wz7DiovwIDAQAB;','v=DKIM1; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvNcR3Gp33cP8onJLAEoL75fSrrGTgl8Z3ze44dQr8uufQnXW3Bu3E6N7mD95fIY+noCbpeovFMN6EDI1G2L5/gv0ePSMQJrudwTH/Luazk6J0U2bXELN5cJRTm9fnQwXvaSpYhrqhHced0S6vTme+QNLWeBaG2xBs9nzJ0WLTkKePwrVZlenHSAOrNPKvDv7OOgx5QEPPa7weuKDffUMLeTzi3KKwxLicTydpMfhmlWEEbQbF13XDHb7j7Z/oWlkcY/F6yNmw3Jh6fjuQhL6vFK9Te/AOg3lAFBdibqQJAYUxXebmVlhtVruGp/BMSlDYg1G6kJlRgek22Wz7DiovwIDAQAB;','','',NULL),('2024-09-14 04:34:09',15,1,'TXT','_domainkey.fetishmegastore.com.','_domainkey.fetishmegastore.com.','o=-','o=-','','',NULL),('2024-09-14 04:34:09',16,1,'SRV','_imaps._tcp.fetishmegastore.com.','_imaps._tcp.fetishmegastore.com.','fetishmegastore.com.','fetishmegastore.com.','0 0 993','',NULL),('2024-09-14 04:34:09',17,1,'SRV','_pop3s._tcp.fetishmegastore.com.','_pop3s._tcp.fetishmegastore.com.','fetishmegastore.com.','fetishmegastore.com.','0 0 995','',NULL),('2024-09-14 04:34:09',18,1,'SRV','_smtps._tcp.fetishmegastore.com.','_smtps._tcp.fetishmegastore.com.','fetishmegastore.com.','fetishmegastore.com.','0 0 465','',NULL),('2024-09-11 10:31:17',19,1,'CNAME','www.fetishmegastore.com.','www.fetishmegastore.com.','fetishmegastore.com.','fetishmegastore.com.','','',NULL),('2024-09-11 10:31:17',20,1,'TXT','_dmarc.fetishmegastore.com.','_dmarc.fetishmegastore.com.','v=DMARC1; p=quarantine; adkim=s; aspf=s','v=DMARC1; p=quarantine; adkim=s; aspf=s','','',NULL),('2024-09-11 10:31:17',21,1,'TXT','fetishmegastore.com.','fetishmegastore.com.','v=spf1 +a +mx +a:s10860938.dedi.leaseweb.net -all','v=spf1 +a +mx +a:s10860938.dedi.leaseweb.net -all','','',NULL),('2024-09-11 10:31:17',22,1,'CNAME','ftp.fetishmegastore.com.','ftp.fetishmegastore.com.','fetishmegastore.com.','fetishmegastore.com.','','',NULL),('2024-09-11 10:31:17',23,1,'A','ipv4.fetishmegastore.com.','ipv4.fetishmegastore.com.','95.211.107.87','95.211.107.87','','',NULL),('2024-09-11 10:31:17',24,1,'A','mail.fetishmegastore.com.','mail.fetishmegastore.com.','95.211.107.87','95.211.107.87','','',NULL),('2024-09-11 10:31:17',25,1,'MX','fetishmegastore.com.','fetishmegastore.com.','mail.fetishmegastore.com.','mail.fetishmegastore.com.','10','',NULL),('2024-09-11 10:31:17',26,1,'A','webmail.fetishmegastore.com.','webmail.fetishmegastore.com.','95.211.107.87','95.211.107.87','','',NULL),('2024-09-11 10:31:17',27,1,'A','fetishmegastore.com.','fetishmegastore.com.','95.211.107.87','95.211.107.87','','',NULL),('2024-09-11 10:31:17',28,1,'A','ns2.fetishmegastore.com.','ns2.fetishmegastore.com.','95.211.107.87','95.211.107.87','','',NULL),('2024-09-11 10:31:17',29,1,'NS','fetishmegastore.com.','fetishmegastore.com.','ns2.fetishmegastore.com.','ns2.fetishmegastore.com.','','',NULL),('2024-09-11 10:31:17',30,1,'A','ns1.fetishmegastore.com.','ns1.fetishmegastore.com.','95.211.107.87','95.211.107.87','','',NULL),('2024-09-11 10:31:17',31,1,'NS','fetishmegastore.com.','fetishmegastore.com.','ns1.fetishmegastore.com.','ns1.fetishmegastore.com.','','',NULL),('2024-09-16 04:22:28',32,1,'CNAME','storage.fetishmegastore.com.','storage.fetishmegastore.com.','fetishmegatore.b-cdn.net.','fetishmegatore.b-cdn.net.','','',NULL),('2024-09-19 06:35:07',33,1,'TXT','_acme-challenge.fetishmegastore.com.','_acme-challenge.fetishmegastore.com.','0k-JfgjuAI9GZGJfXR6YOpFVe2CYlGHCfe9rWlm34F8','0k-JfgjuAI9GZGJfXR6YOpFVe2CYlGHCfe9rWlm34F8','','',NULL);
/*!40000 ALTER TABLE `dns_recs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dns_recs_t`
--

DROP TABLE IF EXISTS `dns_recs_t`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dns_recs_t` (
  `time_stamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('NS','A','AAAA','CNAME','MX','PTR','SOA','TXT','AXFR','SRV','CAA','TLSA','none') NOT NULL DEFAULT 'A',
  `host` varchar(255) NOT NULL,
  `displayHost` varchar(255) NOT NULL,
  `val` text NOT NULL,
  `displayVal` text NOT NULL,
  `opt` varchar(255) NOT NULL DEFAULT '',
  `uid` varchar(255) DEFAULT NULL,
  `ttl` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dns_recs_t`
--

LOCK TABLES `dns_recs_t` WRITE;
/*!40000 ALTER TABLE `dns_recs_t` DISABLE KEYS */;
INSERT INTO `dns_recs_t` VALUES ('2024-09-11 10:31:17',1,'NS','<domain>.','<domain>.','ns1.<domain>.','ns1.<domain>.','',NULL,NULL),('2024-09-11 10:31:17',2,'A','ns1.<domain>.','ns1.<domain>.','<ip>','<ip>','',NULL,NULL),('2024-09-11 10:31:17',3,'AAAA','ns1.<domain>.','ns1.<domain>.','<ipv6>','<ipv6>','',NULL,NULL),('2024-09-11 10:31:17',4,'NS','<domain>.','<domain>.','ns2.<domain>.','ns2.<domain>.','',NULL,NULL),('2024-09-11 10:31:17',5,'A','ns2.<domain>.','ns2.<domain>.','<ip>','<ip>','',NULL,NULL),('2024-09-11 10:31:17',6,'AAAA','ns2.<domain>.','ns2.<domain>.','<ipv6>','<ipv6>','',NULL,NULL),('2024-09-11 10:31:17',7,'A','<domain>.','<domain>.','<ip>','<ip>','',NULL,NULL),('2024-09-11 10:31:17',8,'AAAA','<domain>.','<domain>.','<ipv6>','<ipv6>','',NULL,NULL),('2024-09-11 10:31:17',9,'A','webmail.<domain>.','webmail.<domain>.','<ip>','<ip>','',NULL,NULL),('2024-09-11 10:31:17',10,'AAAA','webmail.<domain>.','webmail.<domain>.','<ipv6>','<ipv6>','',NULL,NULL),('2024-09-11 10:31:17',13,'MX','<domain>.','<domain>.','mail.<domain>.','mail.<domain>.','10',NULL,NULL),('2024-09-11 10:31:17',14,'A','mail.<domain>.','mail.<domain>.','<ip>','<ip>','',NULL,NULL),('2024-09-11 10:31:17',15,'AAAA','mail.<domain>.','mail.<domain>.','<ipv6>','<ipv6>','',NULL,NULL),('2024-09-11 10:31:17',16,'A','ipv4.<domain>.','ipv4.<domain>.','<ip>','<ip>','',NULL,NULL),('2024-09-11 10:31:17',17,'AAAA','ipv6.<domain>.','ipv6.<domain>.','<ipv6>','<ipv6>','',NULL,NULL),('2024-09-11 10:31:17',18,'CNAME','ftp.<domain>.','ftp.<domain>.','<domain>.','<domain>.','',NULL,NULL),('2024-09-11 10:31:17',19,'TXT','<domain>.','<domain>.','v=spf1 +a +mx +a:<hostname> -all','v=spf1 +a +mx +a:<hostname> -all','',NULL,NULL),('2024-09-11 10:31:17',20,'TXT','_dmarc.<domain>.','_dmarc.<domain>.','v=DMARC1; p=quarantine; adkim=s; aspf=s','v=DMARC1; p=quarantine; adkim=s; aspf=s','',NULL,NULL),('2024-09-11 10:31:17',21,'CNAME','www.<domain>.','www.<domain>.','<domain>.','<domain>.','',NULL,NULL);
/*!40000 ALTER TABLE `dns_recs_t` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dns_refs`
--

DROP TABLE IF EXISTS `dns_refs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dns_refs` (
  `uid` varchar(255) NOT NULL,
  `zoneId` int(10) unsigned NOT NULL,
  `zoneRecordId` int(10) unsigned DEFAULT NULL,
  `templateRecordId` int(10) unsigned DEFAULT NULL,
  `status` enum('syn','mod','del') NOT NULL DEFAULT 'syn',
  PRIMARY KEY (`uid`),
  KEY `zoneId` (`zoneId`),
  KEY `zoneRecordId` (`zoneRecordId`),
  KEY `templateRecordId` (`templateRecordId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dns_refs`
--

LOCK TABLES `dns_refs` WRITE;
/*!40000 ALTER TABLE `dns_refs` DISABLE KEYS */;
INSERT INTO `dns_refs` VALUES ('286d8070-7c9f-46f1-a37a-0840239a4de5',1,19,21,'syn'),('37e9666e-259f-497d-be25-c6b0f03ac206',1,21,19,'syn'),('3e65fe4e-96a4-404e-9011-8d7e486a7e79',1,26,9,'syn'),('7371ef8d-180d-4444-a36d-73764353252c',1,22,18,'syn'),('88039c2b-38b6-4890-a483-cb6c4c3651ff',1,31,1,'syn'),('990ef4ee-92f2-4822-842c-3e698377db49',1,30,2,'syn'),('9ed2ad95-235b-48c4-a987-aad0f1f919f5',1,28,5,'syn'),('a2e09bc2-96f5-4170-89e6-1f5656a99062',1,29,4,'syn'),('a8f7734e-c4a8-4c30-8fd8-b70646cd3961',1,27,7,'syn'),('bd541a32-570d-4cf4-957d-d89690151de6',1,25,13,'syn'),('c9eacff8-223c-4e51-806b-5ac7f8be0f10',1,24,14,'syn'),('f851fbd8-c315-41e9-ac8f-8a2d3b1e13d1',1,20,20,'syn'),('fe716651-60b8-4b25-9f93-56f27449b2dc',1,23,16,'syn');
/*!40000 ALTER TABLE `dns_refs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dns_zone`
--

DROP TABLE IF EXISTS `dns_zone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dns_zone` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `displayName` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `status` int(10) unsigned NOT NULL DEFAULT 0,
  `type` enum('slave','master') NOT NULL DEFAULT 'master',
  `ttl` int(10) unsigned NOT NULL DEFAULT 86400,
  `ttl_unit` int(10) unsigned NOT NULL DEFAULT 1,
  `refresh` int(10) unsigned NOT NULL DEFAULT 10800,
  `refresh_unit` int(10) unsigned NOT NULL DEFAULT 1,
  `retry` int(10) unsigned NOT NULL DEFAULT 3600,
  `retry_unit` int(10) unsigned NOT NULL DEFAULT 1,
  `expire` int(10) unsigned NOT NULL DEFAULT 604800,
  `expire_unit` int(10) unsigned NOT NULL DEFAULT 1,
  `minimum` int(10) unsigned NOT NULL DEFAULT 10800,
  `minimum_unit` int(10) unsigned NOT NULL DEFAULT 1,
  `serial_format` enum('UNIXTIMESTAMP','YYYYMMDDNN') NOT NULL DEFAULT 'UNIXTIMESTAMP',
  `serial` varchar(12) NOT NULL DEFAULT '0',
  `external_id` varchar(255) DEFAULT NULL,
  `syncSoa` enum('true','false','skip') NOT NULL DEFAULT 'skip',
  `syncRecords` enum('true','false','skip') NOT NULL DEFAULT 'skip',
  `rnameType` enum('owner','domain','external') NOT NULL DEFAULT 'owner',
  `mname` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dns_zone`
--

LOCK TABLES `dns_zone` WRITE;
/*!40000 ALTER TABLE `dns_zone` DISABLE KEYS */;
INSERT INTO `dns_zone` VALUES (1,'fetishmegastore.com','fetishmegastore.com','cyber-media@gmx.net',0,'master',86400,86400,10800,3600,3600,3600,1209600,604800,10800,3600,'YYYYMMDDNN','2024100401','','true','skip','owner','');
/*!40000 ALTER TABLE `dns_zone` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dom_param`
--

DROP TABLE IF EXISTS `dom_param`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dom_param` (
  `dom_id` int(10) unsigned NOT NULL DEFAULT 0,
  `param` varchar(245) NOT NULL,
  `val` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`dom_id`,`param`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dom_param`
--

LOCK TABLES `dom_param` WRITE;
/*!40000 ALTER TABLE `dom_param` DISABLE KEYS */;
INSERT INTO `dom_param` VALUES (1,'apacheErrorDocs','true'),(1,'cgi_bin_mode','www-root'),(1,'ext-kolab-permission','free'),(1,'ext-kolab-troubleshooter','[\"tls\",\"webmail_tls\",\"premium_but_no_license\"]'),(1,'ext-letsencrypt-lastReportDatetimeSite','1726757101'),(1,'ext-letsencrypt-registrationEmail','cyber-media@gmx.net'),(1,'ext-nodejs-enabled','false'),(1,'ext-nodejs-handlerPath','/opt/plesk/node/22/bin/node'),(1,'ext-sslit-httpsRedirect.configuration','{\"applyToWebMail\":true}'),(1,'ext-xovi-site_audit_stamp','1728101222'),(1,'ext-xovi-site_audit_state','not_started'),(1,'getStartedTabClosed','true'),(1,'gl_filter','on'),(1,'ip_addr_id','1'),(1,'is_resolved','true'),(1,'lastDatabaseSelectedId','1'),(1,'lastVisitTime','2024-09-19T06:22:49+00:00'),(1,'logrotation_id','5'),(1,'seoRedirect','none'),(1,'stat_ttl','3'),(1,'vhost_id','330ee0ba-7deb-4bd5-90bc-d7a1edeb3dd7'),(1,'wapp','laravel'),(1,'wapp-version','9.52.4'),(1,'webmail','kolab_ppe'),(1,'webServerSettingsId','6'),(1,'wu_script','true');
/*!40000 ALTER TABLE `dom_param` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domain_aliases`
--

DROP TABLE IF EXISTS `domain_aliases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domain_aliases` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `dom_id` int(10) unsigned NOT NULL DEFAULT 0,
  `name` varchar(255) NOT NULL,
  `displayName` varchar(255) NOT NULL,
  `dns_zone_id` int(10) unsigned DEFAULT NULL,
  `status` bigint(20) unsigned NOT NULL DEFAULT 0,
  `mail` enum('true','false') NOT NULL DEFAULT 'false',
  `web` enum('true','false') NOT NULL DEFAULT 'false',
  `dns` enum('true','false') NOT NULL DEFAULT 'false',
  `tomcat` enum('true','false') NOT NULL DEFAULT 'false',
  `seoRedirect` enum('false','true') NOT NULL DEFAULT 'false',
  `external_id` varchar(255) DEFAULT NULL,
  `icpStatus` int(1) NOT NULL DEFAULT 0,
  `icpPermit` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `displayName` (`displayName`),
  KEY `dom_id` (`dom_id`),
  KEY `dns_zone_id` (`dns_zone_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domain_aliases`
--

LOCK TABLES `domain_aliases` WRITE;
/*!40000 ALTER TABLE `domain_aliases` DISABLE KEYS */;
/*!40000 ALTER TABLE `domain_aliases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domains`
--

DROP TABLE IF EXISTS `domains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domains` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cr_date` date DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `displayName` varchar(255) NOT NULL,
  `dns_zone_id` int(10) unsigned DEFAULT NULL,
  `status` bigint(20) unsigned NOT NULL DEFAULT 0,
  `htype` enum('none','vrt_hst','std_fwd','frm_fwd') NOT NULL DEFAULT 'none',
  `real_size` bigint(20) unsigned DEFAULT 0,
  `cl_id` int(10) unsigned NOT NULL DEFAULT 0,
  `cert_rep_id` int(10) unsigned DEFAULT 0,
  `limits_id` int(10) unsigned NOT NULL DEFAULT 0,
  `params_id` int(10) unsigned NOT NULL DEFAULT 0,
  `guid` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
  `overuse` enum('false','true') NOT NULL DEFAULT 'false',
  `vendor_id` int(10) unsigned NOT NULL DEFAULT 0,
  `webspace_id` int(10) unsigned NOT NULL DEFAULT 0,
  `parentDomainId` int(10) unsigned NOT NULL DEFAULT 0,
  `webspace_status` bigint(20) unsigned NOT NULL DEFAULT 0,
  `permissions_id` int(10) unsigned NOT NULL DEFAULT 0,
  `external_id` varchar(255) DEFAULT NULL,
  `adminDescription` varchar(255) DEFAULT NULL,
  `resellerDescription` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `gl_filter` enum('on','off') NOT NULL DEFAULT 'on',
  `icpStatus` int(1) NOT NULL DEFAULT 0,
  `icpPermit` varchar(255) DEFAULT NULL,
  `monthlyTraffic` bigint(20) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `guid` (`guid`),
  KEY `displayName` (`displayName`),
  KEY `cl_id` (`cl_id`),
  KEY `dns_zone_id` (`dns_zone_id`),
  KEY `vendor_id` (`vendor_id`),
  KEY `webspace_id` (`webspace_id`),
  KEY `parentDomainId` (`parentDomainId`),
  KEY `permissions_id` (`permissions_id`),
  KEY `external_id` (`external_id`),
  KEY `cert_rep_id` (`cert_rep_id`),
  KEY `limits_id` (`limits_id`),
  KEY `params_id` (`params_id`),
  KEY `monthlyTraffic` (`monthlyTraffic`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domains`
--

LOCK TABLES `domains` WRITE;
/*!40000 ALTER TABLE `domains` DISABLE KEYS */;
INSERT INTO `domains` VALUES (1,'2024-09-14','fetishmegastore.com','fetishmegastore.com',1,0,'vrt_hst',58686898176,1,2,0,0,'e9e0d35b-fd79-4f15-bb6f-8184b592508e','false',1,0,0,0,0,'','','','','on',0,NULL,62562380291);
/*!40000 ALTER TABLE `domains` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dsn`
--

DROP TABLE IF EXISTS `dsn`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dsn` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `dom_id` int(10) unsigned DEFAULT NULL,
  `serviceNodeId` int(10) unsigned NOT NULL DEFAULT 1,
  `name` varchar(255) NOT NULL,
  `driver` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `configured` enum('false','true') NOT NULL DEFAULT 'false',
  `cstring` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`,`serviceNodeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dsn`
--

LOCK TABLES `dsn` WRITE;
/*!40000 ALTER TABLE `dsn` DISABLE KEYS */;
/*!40000 ALTER TABLE `dsn` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_handlers`
--

DROP TABLE IF EXISTS `event_handlers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_handlers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `priority` int(10) unsigned NOT NULL DEFAULT 0,
  `user` varchar(255) NOT NULL DEFAULT 'nobody',
  `command` text DEFAULT NULL,
  `action_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `action_name` (`action_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_handlers`
--

LOCK TABLES `event_handlers` WRITE;
/*!40000 ALTER TABLE `event_handlers` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_handlers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exp_event`
--

DROP TABLE IF EXISTS `exp_event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exp_event` (
  `event_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `id` bigint(10) unsigned NOT NULL AUTO_INCREMENT,
  `source` enum('pa','plesk') DEFAULT NULL,
  `event_type` enum('started','stopped','created','updated','deleted','status_changed','terminated','flushed','installed','uninstalled','siteapp_added','siteapp_removed','expired','exceeded','guid_changed') NOT NULL DEFAULT 'started',
  `obj_class` varchar(255) NOT NULL DEFAULT 'license',
  `obj_id` varchar(255) NOT NULL,
  `host` varchar(255) NOT NULL,
  `user` varchar(255) NOT NULL,
  `flushed` enum('true','false') NOT NULL DEFAULT 'false',
  PRIMARY KEY (`id`),
  KEY `source` (`source`,`event_type`),
  KEY `source_2` (`source`,`event_type`,`obj_class`),
  KEY `source_3` (`source`,`event_time`,`event_type`,`obj_class`),
  KEY `flushed` (`flushed`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exp_event`
--

LOCK TABLES `exp_event` WRITE;
/*!40000 ALTER TABLE `exp_event` DISABLE KEYS */;
INSERT INTO `exp_event` VALUES ('2024-09-11 10:32:58',1,'plesk','guid_changed','client','admin','127.0.0.1','admin','false'),('2024-09-11 10:33:17',2,'plesk','updated','admin_info','admin','127.0.0.1','admin','false'),('2024-09-11 10:33:50',3,'plesk','updated','db_server','1','127.0.0.1','admin','false'),('2024-09-11 10:33:50',4,'plesk','created','ip_address','95.211.107.87','127.0.0.1','admin','false'),('2024-09-14 04:31:33',5,'plesk','updated','admin_info','admin','103.250.149.43','admin','false'),('2024-09-14 04:31:33',6,'plesk','updated','admin_info','admin','103.250.149.43','admin','false'),('2024-09-14 04:31:33',7,'plesk','status_changed','client','admin','103.250.149.43','admin','false'),('2024-09-14 04:31:33',8,'plesk','guid_changed','client','admin','103.250.149.43','admin','false'),('2024-09-14 04:34:07',9,'plesk','updated','dns_zone','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-14 04:34:08',10,'plesk','updated','dns_zone','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-14 04:34:08',11,'plesk','updated','dns_zone','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-14 04:34:08',12,'plesk','updated','domain_limits','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-14 04:34:08',13,'plesk','updated','domain_limits','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-14 04:34:09',14,'plesk','updated','dns_zone','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-14 04:34:09',15,'plesk','updated','dns_zone','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-14 04:34:09',16,'plesk','updated','dns_zone','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-14 04:34:10',17,'plesk','updated','dns_zone','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-14 04:34:10',18,'plesk','created','domain','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-14 04:34:10',19,'plesk','created','phosting','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-14 04:37:28',20,'plesk','created','db','fetishme_twitcher','103.250.149.43','admin','false'),('2024-09-14 04:37:28',21,'plesk','updated','db_server','1','103.250.149.43','admin','false'),('2024-09-14 04:37:28',22,'plesk','created','db_user','fetishme_mysql','103.250.149.43','admin','false'),('2024-09-14 04:50:06',23,'plesk','updated','phosting','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-14 07:46:12',24,'plesk','updated','phosting','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-16 04:22:28',25,'plesk','updated','dns_zone','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-16 04:58:49',26,'plesk','updated','phosting','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-16 05:00:32',27,'plesk','updated','phosting','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-19 04:13:23',28,'plesk','updated','plesk_component','curl','127.0.0.1','','false'),('2024-09-19 04:33:22',29,'plesk','deleted','mailname','info@fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-19 05:55:14',30,'plesk','updated','session_preferences','login_timeout','103.250.149.43','admin','false'),('2024-09-19 06:34:08',31,'pa','updated','domain','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-19 06:34:08',32,'plesk','updated','phosting','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-19 06:34:18',33,'plesk','updated','phosting','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-19 06:35:07',34,'plesk','updated','dns_zone','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-19 06:35:07',35,'plesk','updated','dns_zone','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-19 06:35:21',36,'plesk','updated','phosting','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-19 06:35:21',37,'plesk','updated','dns_zone','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-19 06:35:31',38,'pa','updated','domain','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-19 06:35:31',39,'plesk','updated','phosting','fetishmegastore.com','103.250.149.43','admin','false'),('2024-09-23 05:07:26',40,'plesk','created','db','fetish_bkp','103.250.149.43','admin','false'),('2024-09-23 05:07:26',41,'plesk','updated','db_server','1','103.250.149.43','admin','false'),('2024-09-23 11:17:52',42,'plesk','updated','plesk_component','dovecot','127.0.0.1','admin','false'),('2024-09-23 11:17:52',43,'plesk','updated','plesk_component','dovecot-pigeonhole','127.0.0.1','admin','false'),('2024-09-23 11:17:52',44,'plesk','updated','plesk_component','nginx','127.0.0.1','admin','false'),('2024-09-23 11:17:52',45,'plesk','updated','plesk_component','psa','127.0.0.1','admin','false'),('2024-09-23 11:17:52',46,'plesk','updated','plesk_component','psa-api-rpc','127.0.0.1','admin','false'),('2024-09-23 11:17:52',47,'plesk','updated','plesk_component','psa-autoinstaller','127.0.0.1','admin','false'),('2024-09-23 11:17:52',48,'plesk','updated','plesk_component','psa-backup-manager','127.0.0.1','admin','false'),('2024-09-23 11:17:52',49,'plesk','updated','plesk_component','roundcube','127.0.0.1','admin','false'),('2024-09-23 11:17:59',50,'plesk','installed','update','18.0.64.0','127.0.0.1','','false'),('2024-10-01 06:25:43',51,'plesk','updated','plesk_component','php82','127.0.0.1','admin','false'),('2024-10-01 06:25:45',52,'plesk','updated','plesk_component','php83','127.0.0.1','admin','false'),('2024-10-04 12:24:10',53,'plesk','deleted','mailname','office@fetishmegastore.com','103.250.149.43','admin','false'),('2024-10-04 12:32:49',54,'plesk','updated','dns_zone','fetishmegastore.com','103.250.149.43','admin','false'),('2024-10-05 05:03:26',55,'plesk','deleted','mailname','help@fetishmegastore.com','103.250.149.43','admin','false'),('2024-10-05 05:03:26',56,'plesk','deleted','mailname','info@fetishmegastore.com','103.250.149.43','admin','false'),('2024-10-05 05:03:27',57,'plesk','deleted','mailname','office@fetishmegastore.com','103.250.149.43','admin','false'),('2024-10-05 05:05:51',58,'plesk','deleted','mailname','office@fetishmegastore.com','103.250.149.43','admin','false'),('2024-10-05 05:06:24',59,'plesk','deleted','mailname','office@fetishmegastore.com','103.250.149.43','admin','false');
/*!40000 ALTER TABLE `exp_event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `externalWebmails`
--

DROP TABLE IF EXISTS `externalWebmails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `externalWebmails` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `enabled` int(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `externalWebmails`
--

LOCK TABLES `externalWebmails` WRITE;
/*!40000 ALTER TABLE `externalWebmails` DISABLE KEYS */;
/*!40000 ALTER TABLE `externalWebmails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forwarding`
--

DROP TABLE IF EXISTS `forwarding`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `forwarding` (
  `dom_id` int(10) unsigned NOT NULL DEFAULT 0,
  `redirect` varchar(255) DEFAULT NULL,
  `http_code` int(10) unsigned NOT NULL DEFAULT 301,
  `ssl` enum('true','false') NOT NULL DEFAULT 'false',
  `sslRedirect` enum('true','false') NOT NULL DEFAULT 'false',
  `certificate_id` int(10) unsigned DEFAULT 0,
  PRIMARY KEY (`dom_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forwarding`
--

LOCK TABLES `forwarding` WRITE;
/*!40000 ALTER TABLE `forwarding` DISABLE KEYS */;
/*!40000 ALTER TABLE `forwarding` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ftp_users`
--

DROP TABLE IF EXISTS `ftp_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ftp_users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `dom_id` int(10) unsigned NOT NULL DEFAULT 0,
  `sys_user_id` int(10) unsigned NOT NULL DEFAULT 0,
  `permission` bigint(20) unsigned NOT NULL DEFAULT 0,
  `external_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sys_user_id` (`sys_user_id`),
  KEY `dom_id` (`dom_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ftp_users`
--

LOCK TABLES `ftp_users` WRITE;
/*!40000 ALTER TABLE `ftp_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `ftp_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hosting`
--

DROP TABLE IF EXISTS `hosting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hosting` (
  `dom_id` int(10) unsigned NOT NULL DEFAULT 0,
  `sys_user_id` int(10) unsigned NOT NULL DEFAULT 0,
  `real_traffic` bigint(20) unsigned DEFAULT 0,
  `ssi` enum('false','true') NOT NULL DEFAULT 'false',
  `ssi_html` enum('false','true') NOT NULL DEFAULT 'false',
  `php` enum('false','true') NOT NULL DEFAULT 'false',
  `php_isapi` enum('false','true') NOT NULL DEFAULT 'false',
  `php_handler_id` varchar(255) DEFAULT NULL,
  `cgi` enum('false','true') NOT NULL DEFAULT 'false',
  `perl` enum('false','true') NOT NULL DEFAULT 'false',
  `python` enum('false','true') NOT NULL DEFAULT 'false',
  `asp` enum('false','true') NOT NULL DEFAULT 'false',
  `asp_dot_net` enum('false','true') NOT NULL DEFAULT 'false',
  `managed_runtime_version` varchar(255) NOT NULL DEFAULT '',
  `ssl` enum('false','true') NOT NULL DEFAULT 'false',
  `webstat` varchar(20) NOT NULL DEFAULT 'none',
  `at_domains` enum('false','true') NOT NULL DEFAULT 'false',
  `write_modify` varchar(255) DEFAULT NULL,
  `www_root` text NOT NULL,
  `webdeploy` enum('false','true') NOT NULL DEFAULT 'false',
  `certificate_id` int(10) unsigned DEFAULT 0,
  `traffic_bandwidth` int(11) DEFAULT -1,
  `max_connection` int(11) DEFAULT -1,
  `fastcgi` enum('false','true') NOT NULL DEFAULT 'false',
  `same_ssl` enum('false','true') NOT NULL DEFAULT 'true',
  `sslRedirect` enum('true','false') NOT NULL DEFAULT 'false',
  PRIMARY KEY (`dom_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hosting`
--

LOCK TABLES `hosting` WRITE;
/*!40000 ALTER TABLE `hosting` DISABLE KEYS */;
INSERT INTO `hosting` VALUES (1,1,0,'false','false','true','false','plesk-php83-fpm','false','false','false','false','false','','true','awstats','false',NULL,'/var/www/vhosts/fetishmegastore.com/httpdocs/public','false',3,-1,-1,'true','true','true');
/*!40000 ALTER TABLE `hosting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotlink_friends`
--

DROP TABLE IF EXISTS `hotlink_friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hotlink_friends` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `dom_id` int(10) unsigned NOT NULL,
  `friend_dom` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `dom_id` (`dom_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotlink_friends`
--

LOCK TABLES `hotlink_friends` WRITE;
/*!40000 ALTER TABLE `hotlink_friends` DISABLE KEYS */;
/*!40000 ALTER TABLE `hotlink_friends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotlink_prot`
--

DROP TABLE IF EXISTS `hotlink_prot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hotlink_prot` (
  `dom_id` int(10) unsigned NOT NULL,
  `enabled` enum('false','true') NOT NULL DEFAULT 'false',
  `extensions` varchar(255) NOT NULL,
  PRIMARY KEY (`dom_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotlink_prot`
--

LOCK TABLES `hotlink_prot` WRITE;
/*!40000 ALTER TABLE `hotlink_prot` DISABLE KEYS */;
/*!40000 ALTER TABLE `hotlink_prot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ip_pool`
--

DROP TABLE IF EXISTS `ip_pool`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ip_pool` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ip_address_id` int(10) unsigned NOT NULL,
  `type` enum('shared','exclusive') NOT NULL DEFAULT 'shared',
  PRIMARY KEY (`id`,`ip_address_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ip_pool`
--

LOCK TABLES `ip_pool` WRITE;
/*!40000 ALTER TABLE `ip_pool` DISABLE KEYS */;
INSERT INTO `ip_pool` VALUES (1,1,'shared'),(2,1,'shared');
/*!40000 ALTER TABLE `ip_pool` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `key_history`
--

DROP TABLE IF EXISTS `key_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `key_history` (
  `register_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `plesk_key_id` varchar(63) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `update_disabled` enum('false','true') NOT NULL DEFAULT 'false',
  `options` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `key_history`
--

LOCK TABLES `key_history` WRITE;
/*!40000 ALTER TABLE `key_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `key_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `key_history_params`
--

DROP TABLE IF EXISTS `key_history_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `key_history_params` (
  `key_id` int(10) unsigned NOT NULL DEFAULT 0,
  `param` varchar(63) NOT NULL,
  `val` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`key_id`,`param`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `key_history_params`
--

LOCK TABLES `key_history_params` WRITE;
/*!40000 ALTER TABLE `key_history_params` DISABLE KEYS */;
/*!40000 ALTER TABLE `key_history_params` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locales`
--

DROP TABLE IF EXISTS `locales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locales` (
  `id` varchar(17) NOT NULL,
  `active` enum('false','true') NOT NULL DEFAULT 'true',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locales`
--

LOCK TABLES `locales` WRITE;
/*!40000 ALTER TABLE `locales` DISABLE KEYS */;
INSERT INTO `locales` VALUES ('ar','true'),('ca-ES','true'),('cs-CZ','true'),('da-DK','true'),('de-DE','true'),('el-GR','true'),('en-US','true'),('es-ES','true'),('fi-FI','true'),('fr-FR','true'),('he-IL','true'),('hu-HU','true'),('id-ID','true'),('it-IT','true'),('ja-JP','true'),('ko-KR','true'),('ms-MY','true'),('nb-NO','true'),('nl-NL','true'),('pl-PL','true'),('pt-BR','true'),('pt-PT','true'),('ro-RO','true'),('ru-RU','true'),('sv-SE','true'),('th-TH','true'),('tl-PH','true'),('tr-TR','true'),('uk-UA','true'),('vi-VN','true'),('zh-CN','true'),('zh-TW','true');
/*!40000 ALTER TABLE `locales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_actions`
--

DROP TABLE IF EXISTS `log_actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `log_actions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `date` datetime(3) DEFAULT NULL,
  `ip_address` varchar(39) NOT NULL,
  `user` varchar(255) NOT NULL,
  `object_id` int(10) unsigned NOT NULL DEFAULT 0,
  `action_name` varchar(255) NOT NULL,
  `owner_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `action_name` (`action_name`),
  KEY `date` (`date`),
  KEY `owner_id_date` (`owner_id`,`date`)
) ENGINE=InnoDB AUTO_INCREMENT=245 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_actions`
--

LOCK TABLES `log_actions` WRITE;
/*!40000 ALTER TABLE `log_actions` DISABLE KEYS */;
INSERT INTO `log_actions` VALUES (1,'2024-09-11 10:32:57.773','127.0.0.1','admin',0,'plesk_component_install',NULL),(2,'2024-09-11 10:32:57.787','127.0.0.1','admin',0,'plesk_component_install',NULL),(3,'2024-09-11 10:32:57.789','127.0.0.1','admin',0,'plesk_component_install',NULL),(4,'2024-09-11 10:32:57.790','127.0.0.1','admin',0,'plesk_component_install',NULL),(5,'2024-09-11 10:32:57.790','127.0.0.1','admin',0,'plesk_component_install',NULL),(6,'2024-09-11 10:32:57.791','127.0.0.1','admin',0,'plesk_component_install',NULL),(7,'2024-09-11 10:32:58.368','127.0.0.1','admin',0,'plesk_component_install',NULL),(8,'2024-09-11 10:32:58.370','127.0.0.1','admin',0,'plesk_component_install',NULL),(9,'2024-09-11 10:32:58.371','127.0.0.1','admin',0,'plesk_component_install',NULL),(10,'2024-09-11 10:32:58.372','127.0.0.1','admin',0,'plesk_component_install',NULL),(11,'2024-09-11 10:32:58.372','127.0.0.1','admin',0,'plesk_component_install',NULL),(12,'2024-09-11 10:32:58.373','127.0.0.1','admin',0,'plesk_component_install',NULL),(13,'2024-09-11 10:32:58.373','127.0.0.1','admin',0,'plesk_component_install',NULL),(14,'2024-09-11 10:32:58.374','127.0.0.1','admin',0,'plesk_component_install',NULL),(15,'2024-09-11 10:32:58.375','127.0.0.1','admin',0,'plesk_component_install',NULL),(16,'2024-09-11 10:32:58.376','127.0.0.1','admin',0,'plesk_component_install',NULL),(17,'2024-09-11 10:32:58.376','127.0.0.1','admin',0,'plesk_component_install',NULL),(18,'2024-09-11 10:32:58.377','127.0.0.1','admin',0,'plesk_component_install',NULL),(19,'2024-09-11 10:32:58.378','127.0.0.1','admin',0,'plesk_component_install',NULL),(20,'2024-09-11 10:32:58.378','127.0.0.1','admin',0,'plesk_component_install',NULL),(21,'2024-09-11 10:32:58.379','127.0.0.1','admin',0,'plesk_component_install',NULL),(22,'2024-09-11 10:32:58.379','127.0.0.1','admin',0,'plesk_component_install',NULL),(23,'2024-09-11 10:32:58.380','127.0.0.1','admin',0,'plesk_component_install',NULL),(24,'2024-09-11 10:32:58.381','127.0.0.1','admin',0,'plesk_component_install',NULL),(25,'2024-09-11 10:32:58.381','127.0.0.1','admin',0,'plesk_component_install',NULL),(26,'2024-09-11 10:32:57.498','127.0.0.1','admin',1,'client_guid_update',NULL),(27,'2024-09-11 10:33:17.583','127.0.0.1','admin',0,'admin_update',NULL),(28,'2024-09-11 10:33:20.008','127.0.0.1','admin',1,'template_admin_create',NULL),(29,'2024-09-11 10:33:20.044','127.0.0.1','admin',1,'admin_update',NULL),(30,'2024-09-11 10:33:20.052','127.0.0.1','admin',1,'admin_update',NULL),(31,'2024-09-11 10:33:20.052','127.0.0.1','admin',1,'client_status_update',NULL),(32,'2024-09-11 10:33:20.052','127.0.0.1','admin',1,'client_guid_update',NULL),(33,'2024-09-11 10:33:20.069','127.0.0.1','admin',2,'template_reseller_create',NULL),(34,'2024-09-11 10:33:20.078','127.0.0.1','admin',2,'template_reseller_update',NULL),(35,'2024-09-11 10:33:20.086','127.0.0.1','admin',3,'template_admin_create',NULL),(36,'2024-09-11 10:33:20.100','127.0.0.1','admin',4,'template_admin_create',NULL),(37,'2024-09-11 10:33:20.115','127.0.0.1','admin',5,'template_admin_create',NULL),(38,'2024-09-11 10:33:22.027','127.0.0.1','admin',2,'extension_install',NULL),(39,'2024-09-11 10:33:32.267','127.0.0.1','admin',3,'extension_install',NULL),(40,'2024-09-11 10:33:43.057','127.0.0.1','admin',4,'extension_install',NULL),(41,'2024-09-11 10:33:43.809','127.0.0.1','admin',5,'extension_install',NULL),(42,'2024-09-11 10:33:44.405','127.0.0.1','admin',6,'extension_install',NULL),(43,'2024-09-11 10:33:45.030','127.0.0.1','admin',7,'extension_install',NULL),(44,'2024-09-11 10:33:49.999','127.0.0.1','admin',1,'database_server_update',NULL),(45,'2024-09-11 10:33:50.425','127.0.0.1','admin',1,'ip_address_create',NULL),(46,'2024-09-11 10:33:50.845','127.0.0.1','admin',0,'hostname_changed',NULL),(47,'2024-09-11 10:33:51.634','127.0.0.1','admin',1,'smb_user_update',NULL),(48,'2024-09-11 10:35:25.891','127.0.0.1','admin',8,'extension_install',NULL),(49,'2024-09-11 10:35:30.390','127.0.0.1','admin',9,'extension_install',NULL),(50,'2024-09-11 10:35:52.819','127.0.0.1','admin',10,'extension_install',NULL),(51,'2024-09-11 10:35:54.271','127.0.0.1','admin',11,'extension_install',NULL),(52,'2024-09-11 10:35:55.369','127.0.0.1','admin',12,'extension_install',NULL),(53,'2024-09-11 10:35:56.525','127.0.0.1','admin',13,'extension_install',NULL),(54,'2024-09-11 10:35:57.756','127.0.0.1','admin',14,'extension_install',NULL),(55,'2024-09-11 10:36:02.405','127.0.0.1','admin',15,'extension_install',NULL),(56,'2024-09-11 10:36:07.062','127.0.0.1','admin',16,'extension_install',NULL),(57,'2024-09-11 10:36:08.317','127.0.0.1','admin',17,'extension_install',NULL),(58,'2024-09-11 10:36:10.085','127.0.0.1','admin',18,'extension_install',NULL),(59,'2024-09-11 10:36:11.066','127.0.0.1','admin',19,'extension_install',NULL),(60,'2024-09-11 10:36:13.215','127.0.0.1','admin',20,'extension_install',NULL),(61,'2024-09-11 10:36:23.958','127.0.0.1','admin',21,'extension_install',NULL),(62,'2024-09-11 10:36:24.699','127.0.0.1','admin',22,'extension_install',NULL),(63,'2024-09-11 10:36:25.513','127.0.0.1','admin',23,'extension_install',NULL),(64,'2024-09-11 10:38:27.199','95.211.107.87','admin',0,'cp_user_login',NULL),(65,'2024-09-12 04:39:09.232','103.176.18.122','',0,'cp_user_login_failed',NULL),(66,'2024-09-12 04:39:38.897','103.176.18.122','admin',0,'cp_user_login',NULL),(67,'2024-09-12 04:44:48.691','103.176.18.122','',0,'cp_user_login_failed',NULL),(68,'2024-09-12 04:47:30.415','103.176.18.122','admin',0,'cp_user_login',NULL),(69,'2024-09-12 04:47:46.761','103.176.18.122','admin',0,'cp_user_logout',NULL),(70,'2024-09-12 06:26:17.239','127.0.0.1','admin',9,'extension_upgrade',NULL),(71,'2024-09-12 06:39:01.767','127.0.0.1','',24,'extension_install',NULL),(72,'2024-09-12 06:39:02.453','127.0.0.1','',25,'extension_install',NULL),(73,'2024-09-12 08:17:43.892','103.250.149.43','',0,'cp_user_login_failed',NULL),(74,'2024-09-12 08:18:24.711','103.250.149.43','admin',0,'cp_user_login',NULL),(75,'2024-09-12 08:20:08.545','103.250.149.43','admin',0,'cp_user_logout',NULL),(76,'2024-09-13 06:27:38.355','127.0.0.1','admin',19,'extension_upgrade',NULL),(77,'2024-09-13 09:30:35.848','103.250.149.43','admin',0,'cp_user_login',NULL),(78,'2024-09-14 04:30:46.650','103.250.149.43','admin',0,'cp_user_login',NULL),(79,'2024-09-14 04:31:33.350','103.250.149.43','admin',0,'admin_update',NULL),(80,'2024-09-14 04:31:33.838','103.250.149.43','admin',1,'smb_user_update',NULL),(81,'2024-09-14 04:31:33.378','103.250.149.43','admin',1,'admin_update',NULL),(82,'2024-09-14 04:31:33.378','103.250.149.43','admin',1,'client_status_update',NULL),(83,'2024-09-14 04:31:33.378','103.250.149.43','admin',1,'client_guid_update',NULL),(84,'2024-09-14 04:32:03.515','103.250.149.43','admin',0,'ssl_mail_binding_update',NULL),(85,'2024-09-14 04:34:07.700','103.250.149.43','admin',1,'domain_dns_update',NULL),(86,'2024-09-14 04:34:08.000','103.250.149.43','admin',1,'domain_dns_update',NULL),(87,'2024-09-14 04:34:08.003','103.250.149.43','admin',1,'dns_zone_turn_on',NULL),(88,'2024-09-14 04:34:08.028','103.250.149.43','admin',1,'dns_record_create',NULL),(89,'2024-09-14 04:34:08.029','103.250.149.43','admin',1,'dns_record_create',NULL),(90,'2024-09-14 04:34:08.031','103.250.149.43','admin',1,'dns_record_create',NULL),(91,'2024-09-14 04:34:08.032','103.250.149.43','admin',1,'dns_record_create',NULL),(92,'2024-09-14 04:34:08.033','103.250.149.43','admin',1,'dns_record_create',NULL),(93,'2024-09-14 04:34:08.035','103.250.149.43','admin',1,'dns_record_create',NULL),(94,'2024-09-14 04:34:08.036','103.250.149.43','admin',1,'dns_record_create',NULL),(95,'2024-09-14 04:34:08.038','103.250.149.43','admin',1,'dns_record_create',NULL),(96,'2024-09-14 04:34:08.039','103.250.149.43','admin',1,'dns_record_create',NULL),(97,'2024-09-14 04:34:08.041','103.250.149.43','admin',1,'dns_record_create',NULL),(98,'2024-09-14 04:34:08.042','103.250.149.43','admin',1,'dns_record_create',NULL),(99,'2024-09-14 04:34:08.044','103.250.149.43','admin',1,'dns_record_create',NULL),(100,'2024-09-14 04:34:08.045','103.250.149.43','admin',1,'dns_record_create',NULL),(101,'2024-09-14 04:34:08.047','103.250.149.43','admin',1,'dns_zone_soa_record_update',NULL),(102,'2024-09-14 04:34:08.048','103.250.149.43','admin',1,'domain_dns_update',NULL),(103,'2024-09-14 04:34:08.054','103.250.149.43','admin',1,'domain_limits_update',NULL),(104,'2024-09-14 04:34:08.063','103.250.149.43','admin',1,'dns_zone_turn_on',NULL),(105,'2024-09-14 04:34:08.068','103.250.149.43','admin',1,'domain_limits_update',NULL),(106,'2024-09-14 04:34:09.930','103.250.149.43','admin',1,'dns_record_create',NULL),(107,'2024-09-14 04:34:09.933','103.250.149.43','admin',1,'dns_record_create',NULL),(108,'2024-09-14 04:34:09.935','103.250.149.43','admin',1,'domain_dns_update',NULL),(109,'2024-09-14 04:34:09.954','103.250.149.43','admin',1,'dns_record_create',NULL),(110,'2024-09-14 04:34:09.956','103.250.149.43','admin',1,'dns_record_create',NULL),(111,'2024-09-14 04:34:09.958','103.250.149.43','admin',1,'dns_record_create',NULL),(112,'2024-09-14 04:34:09.960','103.250.149.43','admin',1,'domain_dns_update',NULL),(113,'2024-09-14 04:34:09.966','103.250.149.43','admin',1,'domain_dns_update',NULL),(114,'2024-09-14 04:34:10.024','103.250.149.43','admin',1,'dns_record_update',NULL),(115,'2024-09-14 04:34:10.027','103.250.149.43','admin',1,'dns_record_update',NULL),(116,'2024-09-14 04:34:10.029','103.250.149.43','admin',1,'dns_record_update',NULL),(117,'2024-09-14 04:34:10.031','103.250.149.43','admin',1,'dns_record_update',NULL),(118,'2024-09-14 04:34:10.033','103.250.149.43','admin',1,'dns_record_update',NULL),(119,'2024-09-14 04:34:10.034','103.250.149.43','admin',1,'dns_record_update',NULL),(120,'2024-09-14 04:34:10.035','103.250.149.43','admin',1,'dns_record_update',NULL),(121,'2024-09-14 04:34:10.037','103.250.149.43','admin',1,'dns_record_update',NULL),(122,'2024-09-14 04:34:10.038','103.250.149.43','admin',1,'dns_record_update',NULL),(123,'2024-09-14 04:34:10.040','103.250.149.43','admin',1,'dns_record_update',NULL),(124,'2024-09-14 04:34:10.041','103.250.149.43','admin',1,'dns_record_update',NULL),(125,'2024-09-14 04:34:10.043','103.250.149.43','admin',1,'dns_record_update',NULL),(126,'2024-09-14 04:34:10.044','103.250.149.43','admin',1,'dns_record_update',NULL),(127,'2024-09-14 04:34:10.046','103.250.149.43','admin',1,'dns_record_create',NULL),(128,'2024-09-14 04:34:10.047','103.250.149.43','admin',1,'dns_record_create',NULL),(129,'2024-09-14 04:34:10.049','103.250.149.43','admin',1,'dns_record_create',NULL),(130,'2024-09-14 04:34:10.050','103.250.149.43','admin',1,'dns_record_create',NULL),(131,'2024-09-14 04:34:10.053','103.250.149.43','admin',1,'dns_record_create',NULL),(132,'2024-09-14 04:34:10.054','103.250.149.43','admin',1,'dns_record_create',NULL),(133,'2024-09-14 04:34:10.056','103.250.149.43','admin',1,'dns_record_create',NULL),(134,'2024-09-14 04:34:10.057','103.250.149.43','admin',1,'dns_record_create',NULL),(135,'2024-09-14 04:34:10.058','103.250.149.43','admin',1,'dns_record_create',NULL),(136,'2024-09-14 04:34:10.060','103.250.149.43','admin',1,'dns_record_create',NULL),(137,'2024-09-14 04:34:10.061','103.250.149.43','admin',1,'dns_record_create',NULL),(138,'2024-09-14 04:34:10.063','103.250.149.43','admin',1,'dns_record_create',NULL),(139,'2024-09-14 04:34:10.064','103.250.149.43','admin',1,'dns_record_create',NULL),(140,'2024-09-14 04:34:10.065','103.250.149.43','admin',1,'domain_dns_update',NULL),(141,'2024-09-14 04:34:08.021','103.250.149.43','admin',1,'domain_create',NULL),(142,'2024-09-14 04:34:09.337','103.250.149.43','admin',1,'phys_hosting_create',NULL),(143,'2024-09-14 04:37:28.202','103.250.149.43','admin',1,'database_create',NULL),(144,'2024-09-14 04:37:28.212','103.250.149.43','admin',1,'database_server_update',NULL),(145,'2024-09-14 04:37:28.218','103.250.149.43','admin',1,'database_user_create',NULL),(146,'2024-09-14 04:50:05.697','103.250.149.43','admin',1,'phys_hosting_update',NULL),(147,'2024-09-14 05:28:03.800','85.17.130.200','',0,'cp_user_login_failed',NULL),(148,'2024-09-14 06:31:40.537','103.250.149.43','',0,'cp_user_login_failed',NULL),(149,'2024-09-14 06:32:27.361','103.250.149.43','admin',0,'cp_user_login',NULL),(150,'2024-09-14 06:33:51.890','103.250.149.43','admin',26,'extension_install',NULL),(151,'2024-09-14 07:12:08.707','103.250.149.43','admin',0,'cp_user_logout',NULL),(152,'2024-09-14 07:12:13.087','103.250.149.43','admin',0,'cp_user_login',NULL),(153,'2024-09-14 07:44:34.822','103.250.149.43','admin',0,'cp_user_login',NULL),(154,'2024-09-14 07:46:12.764','103.250.149.43','admin',1,'ssl_web_binding_update',NULL),(155,'2024-09-14 07:46:12.846','103.250.149.43','admin',1,'phys_hosting_update',NULL),(156,'2024-09-16 03:53:57.204','103.250.149.43','admin',0,'cp_user_login',NULL),(157,'2024-09-16 04:22:28.106','103.250.149.43','admin',1,'dns_record_create',NULL),(158,'2024-09-16 04:22:28.115','103.250.149.43','admin',1,'domain_dns_update',NULL),(159,'2024-09-16 04:58:49.651','103.250.149.43','admin',1,'phys_hosting_update',NULL),(160,'2024-09-16 05:00:32.935','103.250.149.43','admin',1,'phys_hosting_update',NULL),(161,'2024-09-17 06:34:15.161','127.0.0.1','admin',12,'extension_upgrade',NULL),(162,'2024-09-17 06:34:17.570','127.0.0.1','admin',13,'extension_upgrade',NULL),(163,'2024-09-17 06:34:18.263','127.0.0.1','admin',18,'extension_upgrade',NULL),(164,'2024-09-17 06:34:19.009','127.0.0.1','admin',7,'extension_upgrade',NULL),(165,'2024-09-18 06:32:02.347','127.0.0.1','admin',13,'extension_upgrade',NULL),(166,'2024-09-19 03:53:57.482','103.250.149.43','admin',0,'cp_user_login',NULL),(167,'2024-09-19 04:13:23.579','127.0.0.1','',0,'plesk_component_install',NULL),(168,'2024-09-19 04:13:23.617','127.0.0.1','',0,'plesk_component_upgrade',NULL),(169,'2024-09-19 04:13:23.619','127.0.0.1','',0,'plesk_component_uninstall',NULL),(170,'2024-09-19 04:13:23.624','127.0.0.1','',0,'plesk_component_uninstall',NULL),(171,'2024-09-19 04:13:23.627','127.0.0.1','',0,'plesk_component_uninstall',NULL),(172,'2024-09-19 04:18:23.617','103.250.149.43','admin',27,'extension_install',NULL),(173,'2024-09-19 04:20:56.221','103.250.149.43','admin',1,'ext_kolab_custom_domain_limits_update',NULL),(174,'2024-09-19 04:20:56.221','103.250.149.43','admin',1,'ext_kolab_custom_domain_limits_update',NULL),(175,'2024-09-19 04:27:30.606','127.0.0.1','',0,'plesk_component_install',NULL),(176,'2024-09-19 04:27:30.641','127.0.0.1','',0,'plesk_component_install',NULL),(177,'2024-09-19 04:27:30.643','127.0.0.1','',0,'plesk_component_uninstall',NULL),(178,'2024-09-19 04:27:30.646','127.0.0.1','',0,'plesk_component_install',NULL),(179,'2024-09-19 04:33:22.880','103.250.149.43','admin',2,'mailname_delete',NULL),(180,'2024-09-19 05:21:26.526','103.250.149.43','admin',0,'cp_user_login',NULL),(181,'2024-09-19 05:41:14.566','85.17.130.220','',0,'cp_user_login_failed',NULL),(182,'2024-09-19 05:41:32.898','85.17.130.220','',0,'cp_user_login_failed',NULL),(183,'2024-09-19 05:54:58.569','103.250.149.43','admin',0,'cp_user_login',NULL),(184,'2024-09-19 05:55:14.617','103.250.149.43','admin',0,'session_preferences_update',NULL),(185,'2024-09-19 06:12:23.767','103.186.234.3','admin',0,'cp_user_login',NULL),(186,'2024-09-19 06:34:08.289','103.250.149.43','admin',1,'phys_hosting_update',NULL),(187,'2024-09-19 06:34:09.240','127.0.0.1','admin',1,'ext_kolab_custom_domain_limits_update',NULL),(188,'2024-09-19 06:34:15.789','103.250.149.43','admin',1,'ssl_web_binding_update',NULL),(189,'2024-09-19 06:34:18.325','103.250.149.43','admin',1,'phys_hosting_update',NULL),(190,'2024-09-19 06:35:07.759','103.250.149.43','admin',1,'dns_record_create',NULL),(191,'2024-09-19 06:35:07.769','103.250.149.43','admin',1,'domain_dns_update',NULL),(192,'2024-09-19 06:35:07.775','103.250.149.43','admin',1,'domain_dns_update',NULL),(193,'2024-09-19 06:35:21.062','103.250.149.43','admin',1,'ssl_web_binding_update',NULL),(194,'2024-09-19 06:35:21.145','103.250.149.43','admin',1,'phys_hosting_update',NULL),(195,'2024-09-19 06:35:21.202','103.250.149.43','admin',1,'ssl_web_mail_binding_update',NULL),(196,'2024-09-19 06:35:21.661','103.250.149.43','admin',1,'domain_dns_update',NULL),(197,'2024-09-19 06:35:31.149','103.250.149.43','admin',1,'phys_hosting_update',NULL),(198,'2024-09-20 04:30:26.380','103.250.149.43','admin',0,'cp_user_login',NULL),(199,'2024-09-20 06:32:59.169','127.0.0.1','admin',27,'extension_upgrade',NULL),(200,'2024-09-20 06:33:00.465','127.0.0.1','admin',6,'extension_upgrade',NULL),(201,'2024-09-21 04:51:24.569','103.250.149.43','admin',0,'cp_user_login',NULL),(202,'2024-09-23 03:55:02.462','103.250.149.43','admin',0,'cp_user_login',NULL),(203,'2024-09-23 05:07:26.332','103.250.149.43','admin',2,'database_create',NULL),(204,'2024-09-23 05:07:26.342','103.250.149.43','admin',1,'database_server_update',NULL),(205,'2024-09-23 11:17:52.660','127.0.0.1','admin',0,'plesk_component_upgrade',NULL),(206,'2024-09-23 11:17:52.758','127.0.0.1','admin',0,'plesk_component_upgrade',NULL),(207,'2024-09-23 11:17:52.761','127.0.0.1','admin',0,'plesk_component_upgrade',NULL),(208,'2024-09-23 11:17:52.763','127.0.0.1','admin',0,'plesk_component_upgrade',NULL),(209,'2024-09-23 11:17:52.766','127.0.0.1','admin',0,'plesk_component_upgrade',NULL),(210,'2024-09-23 11:17:52.769','127.0.0.1','admin',0,'plesk_component_upgrade',NULL),(211,'2024-09-23 11:17:52.775','127.0.0.1','admin',0,'plesk_component_upgrade',NULL),(212,'2024-09-23 11:17:52.779','127.0.0.1','admin',0,'plesk_component_upgrade',NULL),(213,'2024-09-23 11:17:59.801','127.0.0.1','',0,'patch_installed',NULL),(214,'2024-09-24 04:31:33.525','103.250.149.43','admin',0,'cp_user_login',NULL),(215,'2024-09-24 08:10:15.632','103.250.149.43','admin',0,'cp_user_login',NULL),(216,'2024-09-24 11:19:54.585','103.250.149.43','admin',0,'cp_user_login',NULL),(217,'2024-09-25 08:22:58.649','103.250.149.43','admin',0,'cp_user_login',NULL),(218,'2024-09-26 10:26:09.617','103.250.149.43','admin',0,'cp_user_login',NULL),(219,'2024-09-27 08:20:42.810','103.250.149.43','admin',0,'cp_user_login',NULL),(220,'2024-09-27 11:37:45.673','103.250.149.43','admin',0,'cp_user_login',NULL),(221,'2024-09-28 06:28:19.586','127.0.0.1','admin',27,'extension_upgrade',NULL),(222,'2024-09-28 06:28:21.160','127.0.0.1','admin',12,'extension_upgrade',NULL),(223,'2024-09-30 03:47:47.115','103.250.149.43','admin',0,'cp_user_login',NULL),(224,'2024-09-30 07:04:13.368','103.250.149.43','admin',0,'cp_user_login',NULL),(225,'2024-10-01 06:25:43.697','127.0.0.1','admin',0,'plesk_component_upgrade',NULL),(226,'2024-10-01 06:25:45.375','127.0.0.1','admin',0,'plesk_component_upgrade',NULL),(227,'2024-10-01 08:21:27.237','103.250.149.43','admin',0,'cp_user_login',NULL),(228,'2024-10-02 04:15:51.592','103.250.149.43','admin',0,'cp_user_login',NULL),(229,'2024-10-02 10:07:48.218','103.250.149.43','admin',0,'cp_user_login',NULL),(230,'2024-10-03 04:02:44.276','103.250.149.43','admin',0,'cp_user_login',NULL),(231,'2024-10-03 08:32:04.048','103.250.149.43','admin',0,'cp_user_login',NULL),(232,'2024-10-04 06:32:18.673','127.0.0.1','admin',12,'extension_upgrade',NULL),(233,'2024-10-04 06:32:21.064','127.0.0.1','admin',18,'extension_upgrade',NULL),(234,'2024-10-04 08:23:31.684','103.250.149.43','admin',0,'cp_user_login',NULL),(235,'2024-10-04 12:21:32.581','103.250.149.43','admin',0,'cp_user_login',NULL),(236,'2024-10-04 12:24:10.779','103.250.149.43','admin',1,'mailname_delete',NULL),(237,'2024-10-04 12:32:49.651','103.250.149.43','admin',1,'ssl_web_mail_binding_update',NULL),(238,'2024-10-04 12:32:49.672','103.250.149.43','admin',1,'domain_dns_update',NULL),(239,'2024-10-05 03:44:59.163','103.250.149.43','admin',0,'cp_user_login',NULL),(240,'2024-10-05 05:03:26.833','103.250.149.43','admin',4,'mailname_delete',NULL),(241,'2024-10-05 05:03:26.963','103.250.149.43','admin',3,'mailname_delete',NULL),(242,'2024-10-05 05:03:27.081','103.250.149.43','admin',5,'mailname_delete',NULL),(243,'2024-10-05 05:05:51.125','103.250.149.43','admin',6,'mailname_delete',NULL),(244,'2024-10-05 05:06:24.802','103.250.149.43','admin',7,'mailname_delete',NULL);
/*!40000 ALTER TABLE `log_actions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_components`
--

DROP TABLE IF EXISTS `log_components`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `log_components` (
  `action_id` int(10) unsigned NOT NULL DEFAULT 0,
  `component` varchar(255) NOT NULL,
  `old_value` varchar(255) NOT NULL,
  `new_value` varchar(255) NOT NULL,
  PRIMARY KEY (`action_id`,`component`),
  KEY `action_id` (`action_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_components`
--

LOCK TABLES `log_components` WRITE;
/*!40000 ALTER TABLE `log_components` DISABLE KEYS */;
INSERT INTO `log_components` VALUES (1,'COMP_SERVICE_NODE','1','1'),(1,'Plesk component name','awstats','awstats'),(2,'COMP_SERVICE_NODE','1','1'),(2,'Plesk component name','bind','bind'),(3,'COMP_SERVICE_NODE','1','1'),(3,'Plesk component name','curl','curl'),(4,'COMP_SERVICE_NODE','1','1'),(4,'Plesk component name','dovecot','dovecot'),(5,'COMP_SERVICE_NODE','1','1'),(5,'Plesk component name','dovecot-pigeonhole','dovecot-pigeonhole'),(6,'COMP_SERVICE_NODE','1','1'),(6,'Plesk component name','fail2ban','fail2ban'),(7,'COMP_SERVICE_NODE','1','1'),(7,'Plesk component name','httpd','httpd'),(8,'COMP_SERVICE_NODE','1','1'),(8,'Plesk component name','modsecurity','modsecurity'),(9,'COMP_SERVICE_NODE','1','1'),(9,'Plesk component name','mysql','mysql'),(10,'COMP_SERVICE_NODE','1','1'),(10,'Plesk component name','nginx','nginx'),(11,'COMP_SERVICE_NODE','1','1'),(11,'Plesk component name','nss','nss'),(12,'COMP_SERVICE_NODE','1','1'),(12,'Plesk component name','openssl','openssl'),(13,'COMP_SERVICE_NODE','1','1'),(13,'Plesk component name','php82','php82'),(14,'COMP_SERVICE_NODE','1','1'),(14,'Plesk component name','php83','php83'),(15,'COMP_SERVICE_NODE','1','1'),(15,'Plesk component name','phpmyadmin','phpmyadmin'),(16,'COMP_SERVICE_NODE','1','1'),(16,'Plesk component name','postfix','postfix'),(17,'COMP_SERVICE_NODE','1','1'),(17,'Plesk component name','psa','psa'),(18,'COMP_SERVICE_NODE','1','1'),(18,'Plesk component name','psa-api-rpc','psa-api-rpc'),(19,'COMP_SERVICE_NODE','1','1'),(19,'Plesk component name','psa-autoinstaller','psa-autoinstaller'),(20,'COMP_SERVICE_NODE','1','1'),(20,'Plesk component name','psa-backup-manager','psa-backup-manager'),(21,'COMP_SERVICE_NODE','1','1'),(21,'Plesk component name','psa-logrotate','psa-logrotate'),(22,'COMP_SERVICE_NODE','1','1'),(22,'Plesk component name','psa-mod-fcgid-configurator','psa-mod-fcgid-configurator'),(23,'COMP_SERVICE_NODE','1','1'),(23,'Plesk component name','psa-proftpd','psa-proftpd'),(24,'COMP_SERVICE_NODE','1','1'),(24,'Plesk component name','roundcube','roundcube'),(25,'COMP_SERVICE_NODE','1','1'),(25,'Plesk component name','webalizer','webalizer'),(26,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(26,'Client Type','admin','admin'),(26,'Contact Name','Administrator','Administrator'),(26,'GUID','00000000-0000-0000-0000-000000000000','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(26,'Login Name','admin','admin'),(27,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(27,'Login Name','admin','admin'),(27,'Password','++++++','++++++'),(28,'Admin template','','1'),(29,'Ability to access the applications catalog','false','true'),(29,'Ability to access user accounts','false','true'),(29,'Ability to manage hosting performance','false','true'),(29,'Ability to manage spamfilter','false','true'),(29,'Ability to manage virusfilter','false','true'),(29,'Ability to select the database server','false','true'),(29,'Ability to set insecure hosting options','false','true'),(29,'Ability to use remote XML interface','false','true'),(29,'Access to tools for website copying, maintenance and staging','false','true'),(29,'Additional FTP accounts management','false','true'),(29,'Anonymous FTP management','false','true'),(29,'Backup/restore functions use FTP repository','false','true'),(29,'Backup/restore functions use local repository','false','true'),(29,'Client creation','false','true'),(29,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(29,'Client Type','admin','admin'),(29,'Common PHP settings management','false','true'),(29,'COMP_PERM_ALLOW_ACCOUNT_FTP_BACKUPS','false','true'),(29,'COMP_PERM_ALLOW_ACCOUNT_LOCAL_BACKUPS','false','true'),(29,'COMP_PERM_MANAGE_MAIL_AUTODISCOVER','false','true'),(29,'COMP_PERM_MANAGE_PERFORMANCE_BANDWIDTH','false','true'),(29,'COMP_PERM_MANAGE_PERFORMANCE_CONNECTIONS','false','true'),(29,'COMP_PERM_MANAGE_PHOSTING_ASP','false','true'),(29,'COMP_PERM_MANAGE_PHOSTING_ASP_DOT_NET','false','true'),(29,'COMP_PERM_MANAGE_PHOSTING_CGI','false','true'),(29,'COMP_PERM_MANAGE_PHOSTING_ERRDOCS','false','true'),(29,'COMP_PERM_MANAGE_PHOSTING_FASTCGI','false','true'),(29,'COMP_PERM_MANAGE_PHOSTING_PERL','false','true'),(29,'COMP_PERM_MANAGE_PHOSTING_PHP','false','true'),(29,'COMP_PERM_MANAGE_PHOSTING_PYTHON','false','true'),(29,'COMP_PERM_MANAGE_PHOSTING_SSI','false','true'),(29,'COMP_PERM_MANAGE_PHOSTING_SSL','false','true'),(29,'COMP_PERM_MANAGE_PHOSTING_WEBDEPLOY','false','true'),(29,'COMP_PERM_MANAGE_PHP_VERSION','false','true'),(29,'COMP_PERM_MANAGE_SECURE_PASSWORDS','false','true'),(29,'COMP_PERM_MANAGE_SERVER_ACTIONLOG','false','true'),(29,'COMP_PERM_MANAGE_SERVER_ADMIN_ACCESS','false','true'),(29,'COMP_PERM_MANAGE_SERVER_APP_VAULT','false','true'),(29,'COMP_PERM_MANAGE_SERVER_BACKUP','false','true'),(29,'COMP_PERM_MANAGE_SERVER_BRANDING','false','true'),(29,'COMP_PERM_MANAGE_SERVER_COMPONENTS','false','true'),(29,'COMP_PERM_MANAGE_SERVER_CRONTAB','false','true'),(29,'COMP_PERM_MANAGE_SERVER_CUSTOM_BUTTONS','false','true'),(29,'COMP_PERM_MANAGE_SERVER_DB','false','true'),(29,'COMP_PERM_MANAGE_SERVER_DB_MANAGEMENT','false','true'),(29,'COMP_PERM_MANAGE_SERVER_DNS_TEMPLATE','false','true'),(29,'COMP_PERM_MANAGE_SERVER_DOMAIN_TRAFFIC_REPORT','false','true'),(29,'COMP_PERM_MANAGE_SERVER_EVENTS','false','true'),(29,'COMP_PERM_MANAGE_SERVER_FIREWALL','false','true'),(29,'COMP_PERM_MANAGE_SERVER_GOOGLE_SERVICES','false','true'),(29,'COMP_PERM_MANAGE_SERVER_INFO','false','true'),(29,'COMP_PERM_MANAGE_SERVER_IP_ADDRESSES','false','true'),(29,'COMP_PERM_MANAGE_SERVER_LANGUAGES','false','true'),(29,'COMP_PERM_MANAGE_SERVER_LICENSE','false','true'),(29,'COMP_PERM_MANAGE_SERVER_MAIL','false','true'),(29,'COMP_PERM_MANAGE_SERVER_MAILGATE','false','true'),(29,'COMP_PERM_MANAGE_SERVER_MAILLIST','false','true'),(29,'COMP_PERM_MANAGE_SERVER_MAIL_AUTODISCOVER','false','true'),(29,'COMP_PERM_MANAGE_SERVER_MAIL_BLACK_WHITE_LISTS','false','true'),(29,'COMP_PERM_MANAGE_SERVER_MASS_EMAIL','false','true'),(29,'COMP_PERM_MANAGE_SERVER_MODULES','false','true'),(29,'COMP_PERM_MANAGE_SERVER_NOTIFICATIONS','false','true'),(29,'COMP_PERM_MANAGE_SERVER_OPTIMIZATION','false','true'),(29,'COMP_PERM_MANAGE_SERVER_PHP','false','true'),(29,'COMP_PERM_MANAGE_SERVER_PREVIEW_DOMAIN','false','true'),(29,'COMP_PERM_MANAGE_SERVER_REBOOT','false','true'),(29,'COMP_PERM_MANAGE_SERVER_SERVICES','false','true'),(29,'COMP_PERM_MANAGE_SERVER_SESSIONS','false','true'),(29,'COMP_PERM_MANAGE_SERVER_SETTINGS','false','true'),(29,'COMP_PERM_MANAGE_SERVER_SHUTDOWN','false','true'),(29,'COMP_PERM_MANAGE_SERVER_SKELETON','false','true'),(29,'COMP_PERM_MANAGE_SERVER_SPAM_FILTER','false','true'),(29,'COMP_PERM_MANAGE_SERVER_SSL_CERTIFICATES','false','true'),(29,'COMP_PERM_MANAGE_SERVER_SUMMARY_REPORT','false','true'),(29,'COMP_PERM_MANAGE_SERVER_SUPPORT','false','true'),(29,'COMP_PERM_MANAGE_SERVER_TIME','false','true'),(29,'COMP_PERM_MANAGE_SERVER_TROUBLESHOOTING_ENABLE','false','true'),(29,'COMP_PERM_MANAGE_SERVER_UI','false','true'),(29,'COMP_PERM_MANAGE_SERVER_UPDATES','false','true'),(29,'COMP_PERM_MANAGE_SERVER_VIRUS_PROTECTION','false','true'),(29,'COMP_PERM_MANAGE_SERVER_WEBMAIL','false','true'),(29,'COMP_PERM_REMOTE_DB_CONNECTION','false','true'),(29,'Crontab management','false','true'),(29,'DNS zone management','false','true'),(29,'Domain aliases management','false','true'),(29,'Domain creation','false','true'),(29,'Hard disk quota assignment','false','true'),(29,'Log rotation management','false','true'),(29,'Login Name','admin','admin'),(29,'Mail settings management','false','true'),(29,'Mailing lists management','false','true'),(29,'Non-chrooted shell management','false','true'),(29,'Oversell management','false','true'),(29,'Password-protected directories management','false','true'),(29,'Physical hosting management','false','true'),(29,'Subdomains management','false','true'),(29,'System access management','false','true'),(29,'Web statistics management','false','true'),(30,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(30,'Contact Name','Administrator','Administrator'),(30,'Login Name','admin','admin'),(31,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(31,'Client Type','admin','admin'),(31,'Contact Name','Administrator','Administrator'),(31,'Login Name','admin','admin'),(32,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(32,'Client Type','admin','admin'),(32,'Login Name','admin','admin'),(33,'Reseller template','','2'),(34,'Reseller template','2','2'),(35,'Admin template','','3'),(36,'Admin template','','4'),(37,'Admin template','','5'),(38,'Extension Id','','rest-api'),(38,'Extension Name','','Plesk RESTful API'),(38,'Extension Release','','3560'),(38,'Extension Version','','2.3.0'),(39,'Extension Id','','catalog'),(39,'Extension Name','','Extensions Catalog'),(39,'Extension Release','','1375'),(39,'Extension Version','','1.17.10'),(40,'Extension Id','','notifier'),(40,'Extension Name','','Notifier'),(40,'Extension Release','','3614'),(40,'Extension Version','','1.6.17'),(41,'Extension Id','','galileo'),(41,'Extension Name','','Galileo'),(41,'Extension Release','','3736'),(41,'Extension Version','','1.5.17'),(42,'Extension Id','','platform360'),(42,'Extension Name','','Platform360'),(42,'Extension Release','','1345'),(42,'Extension Version','','1.10.2'),(43,'Extension Id','','performance-booster'),(43,'Extension Name','','Performance Booster'),(43,'Extension Release','','3778'),(43,'Extension Version','','1.1.11'),(44,'Database server','1','1'),(44,'Database server host','localhost','localhost'),(44,'Database server port','3306','3306'),(45,'Interface','','eno1'),(45,'IP Address','','95.211.107.87'),(45,'IP Mask','','255.255.255.240'),(46,'Server Hostname','hostname.local','s10860938.dedi.leaseweb.net'),(47,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(47,'Login Name','admin','admin'),(48,'Extension Id','','git'),(48,'Extension Name','','Git'),(48,'Extension Release','','26'),(48,'Extension Version','','2.5.3'),(49,'Extension Id','','wp-toolkit'),(49,'Extension Name','','WP Toolkit'),(49,'Extension Release','','8712'),(49,'Extension Version','','6.5.2'),(50,'Extension Id','','advisor'),(50,'Extension Name','','Advisor'),(50,'Extension Release','','1443'),(50,'Extension Version','','1.10.1'),(51,'Extension Id','','xovi'),(51,'Extension Name','','SEO Toolkit'),(51,'Extension Release','','3727'),(51,'Extension Version','','1.1.21'),(52,'Extension Id','','revisium-antivirus'),(52,'Extension Name','','ImunifyAV'),(52,'Extension Release','','1'),(52,'Extension Version','','2.12.1'),(53,'Extension Id','','sslit'),(53,'Extension Name','','SSL It!'),(53,'Extension Release','','3574'),(53,'Extension Version','','1.15.3'),(54,'Extension Id','','letsencrypt'),(54,'Extension Name','','Let\\\'s Encrypt'),(54,'Extension Release','','3078'),(54,'Extension Version','','3.2.8'),(55,'Extension Id','','repair-kit'),(55,'Extension Name','','Repair Kit'),(55,'Extension Release','','3238'),(55,'Extension Version','','1.3.8'),(56,'Extension Id','','composer'),(56,'Extension Name','','PHP Composer'),(56,'Extension Release','','3051'),(56,'Extension Version','','1.3.1'),(57,'Extension Id','','monitoring'),(57,'Extension Name','','Monitoring'),(57,'Extension Release','','1399'),(57,'Extension Version','','2.9.8'),(58,'Extension Id','','log-browser'),(58,'Extension Name','','Log Browser'),(58,'Extension Release','','1489'),(58,'Extension Version','','1.9.2'),(59,'Extension Id','','ssh-terminal'),(59,'Extension Name','','SSH Terminal'),(59,'Extension Release','','108'),(59,'Extension Version','','1.3.7'),(60,'Extension Id','','site-import'),(60,'Extension Name','','Site Import'),(60,'Extension Release','','1525'),(60,'Extension Version','','1.8.9'),(61,'Extension Id','','plesk-sitejet'),(61,'Extension Name','','Sitejet Builder'),(61,'Extension Release','','3764'),(61,'Extension Version','','1.1.3'),(62,'Extension Id','','ntp-timesync'),(62,'Extension Name','','NTP Timesync'),(62,'Extension Release','','656'),(62,'Extension Version','','1.3.2'),(63,'Extension Id','','mfa'),(63,'Extension Name','','Multi-Factor Authentication (MFA)'),(63,'Extension Release','','937'),(63,'Extension Version','','1.0.3'),(64,'Contact Name','','Administrator'),(65,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688',''),(65,'Login Name','admin',''),(66,'Contact Name','','Administrator'),(67,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688',''),(67,'Login Name','admin',''),(68,'Contact Name','','Administrator'),(69,'Contact Name','Administrator',''),(70,'Extension Id','wp-toolkit','wp-toolkit'),(70,'Extension Name','WP Toolkit','WP Toolkit'),(70,'Extension Release','8712','8751'),(70,'Extension Version','6.5.2','6.5.3'),(71,'Extension Id','','laravel'),(71,'Extension Name','','Laravel Toolkit'),(71,'Extension Release','','699'),(71,'Extension Version','','1.4.11'),(72,'Extension Id','','nodejs'),(72,'Extension Name','','Node.js Toolkit'),(72,'Extension Release','','3990'),(72,'Extension Version','','2.3.15'),(73,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688',''),(73,'Login Name','admin',''),(74,'Contact Name','','Administrator'),(75,'Contact Name','Administrator',''),(76,'Extension Id','ssh-terminal','ssh-terminal'),(76,'Extension Name','SSH Terminal','SSH Terminal'),(76,'Extension Release','108','111'),(76,'Extension Version','1.3.7','1.3.8'),(77,'Contact Name','','Administrator'),(78,'Contact Name','','Administrator'),(79,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(79,'Login Name','admin','admin'),(79,'Password','++++++','++++++'),(80,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(80,'Login Name','admin','admin'),(81,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(81,'Contact Name','Administrator','Administrator'),(81,'Country','','XX'),(81,'E-mail','','cyber-media@gmx.net'),(81,'Login Name','admin','admin'),(82,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(82,'Client Type','admin','admin'),(82,'Contact Name','Administrator','Administrator'),(82,'Login Name','admin','admin'),(83,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(83,'Client Type','admin','admin'),(83,'Login Name','admin','admin'),(84,'SSL Certificate Binding Type','MAIL','MAIL'),(84,'SSL Certificate File','','cert3qHW4lf'),(84,'SSL Certificate Id','','2'),(84,'SSL Certificate Name','','default certificate'),(85,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(85,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(85,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(86,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(86,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(86,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(87,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(87,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(87,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(88,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(88,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(88,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(88,'Hostname','fetishmegastore.com.','fetishmegastore.com.'),(88,'Type','NS','NS'),(88,'Value','ns1.fetishmegastore.com.','ns1.fetishmegastore.com.'),(89,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(89,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(89,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(89,'Hostname','ns1.fetishmegastore.com.','ns1.fetishmegastore.com.'),(89,'Type','A','A'),(89,'Value','95.211.107.87','95.211.107.87'),(90,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(90,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(90,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(90,'Hostname','fetishmegastore.com.','fetishmegastore.com.'),(90,'Type','NS','NS'),(90,'Value','ns2.fetishmegastore.com.','ns2.fetishmegastore.com.'),(91,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(91,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(91,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(91,'Hostname','ns2.fetishmegastore.com.','ns2.fetishmegastore.com.'),(91,'Type','A','A'),(91,'Value','95.211.107.87','95.211.107.87'),(92,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(92,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(92,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(92,'Hostname','fetishmegastore.com.','fetishmegastore.com.'),(92,'Type','A','A'),(92,'Value','95.211.107.87','95.211.107.87'),(93,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(93,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(93,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(93,'Hostname','webmail.fetishmegastore.com.','webmail.fetishmegastore.com.'),(93,'Type','A','A'),(93,'Value','95.211.107.87','95.211.107.87'),(94,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(94,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(94,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(94,'Hostname','fetishmegastore.com.','fetishmegastore.com.'),(94,'Opt','10','10'),(94,'Type','MX','MX'),(94,'Value','mail.fetishmegastore.com.','mail.fetishmegastore.com.'),(95,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(95,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(95,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(95,'Hostname','mail.fetishmegastore.com.','mail.fetishmegastore.com.'),(95,'Type','A','A'),(95,'Value','95.211.107.87','95.211.107.87'),(96,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(96,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(96,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(96,'Hostname','ipv4.fetishmegastore.com.','ipv4.fetishmegastore.com.'),(96,'Type','A','A'),(96,'Value','95.211.107.87','95.211.107.87'),(97,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(97,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(97,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(97,'Hostname','ftp.fetishmegastore.com.','ftp.fetishmegastore.com.'),(97,'Type','CNAME','CNAME'),(97,'Value','fetishmegastore.com.','fetishmegastore.com.'),(98,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(98,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(98,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(98,'Hostname','fetishmegastore.com.','fetishmegastore.com.'),(98,'Type','TXT','TXT'),(98,'Value','v=spf1 +a +mx +a:s10860938.dedi.leaseweb.net -all','v=spf1 +a +mx +a:s10860938.dedi.leaseweb.net -all'),(99,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(99,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(99,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(99,'Hostname','_dmarc.fetishmegastore.com.','_dmarc.fetishmegastore.com.'),(99,'Type','TXT','TXT'),(99,'Value','v=DMARC1; p=quarantine; adkim=s; aspf=s','v=DMARC1; p=quarantine; adkim=s; aspf=s'),(100,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(100,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(100,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(100,'Hostname','www.fetishmegastore.com.','www.fetishmegastore.com.'),(100,'Type','CNAME','CNAME'),(100,'Value','fetishmegastore.com.','fetishmegastore.com.'),(101,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(101,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(101,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(101,'Expire','7 days','2 weeks'),(102,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(102,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(102,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(102,'Serial Number format','UNIXTIMESTAMP','YYYYMMDDNN'),(103,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(103,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(103,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(104,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(104,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(104,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(105,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(105,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(105,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(106,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(106,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(106,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(106,'Hostname','default._domainkey.fetishmegastore.com.','default._domainkey.fetishmegastore.com.'),(106,'Type','TXT','TXT'),(106,'Value','v=DKIM1; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvNcR3Gp33cP8onJLAEoL75fSrrGTgl8Z3ze44dQr8uufQnXW3Bu3E6N7mD95fIY+noCbpeovFMN6EDI1G2L5/gv0ePSMQJrudwTH/Luazk6J0U2bXELN5cJRTm9fnQwXvaSpYhrqhHced0S6vTme+QNLWeBaG2xBs9nzJ0WLTkKePwrVZlenHSAOrNPKvDv7OOgx5QEP','v=DKIM1; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvNcR3Gp33cP8onJLAEoL75fSrrGTgl8Z3ze44dQr8uufQnXW3Bu3E6N7mD95fIY+noCbpeovFMN6EDI1G2L5/gv0ePSMQJrudwTH/Luazk6J0U2bXELN5cJRTm9fnQwXvaSpYhrqhHced0S6vTme+QNLWeBaG2xBs9nzJ0WLTkKePwrVZlenHSAOrNPKvDv7OOgx5QEP'),(107,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(107,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(107,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(107,'Hostname','_domainkey.fetishmegastore.com.','_domainkey.fetishmegastore.com.'),(107,'Type','TXT','TXT'),(107,'Value','o=-','o=-'),(108,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(108,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(108,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(109,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(109,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(109,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(109,'Hostname','_imaps._tcp.fetishmegastore.com.','_imaps._tcp.fetishmegastore.com.'),(109,'Opt','0 0 993','0 0 993'),(109,'Type','SRV','SRV'),(109,'Value','fetishmegastore.com.','fetishmegastore.com.'),(110,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(110,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(110,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(110,'Hostname','_pop3s._tcp.fetishmegastore.com.','_pop3s._tcp.fetishmegastore.com.'),(110,'Opt','0 0 995','0 0 995'),(110,'Type','SRV','SRV'),(110,'Value','fetishmegastore.com.','fetishmegastore.com.'),(111,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(111,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(111,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(111,'Hostname','_smtps._tcp.fetishmegastore.com.','_smtps._tcp.fetishmegastore.com.'),(111,'Opt','0 0 465','0 0 465'),(111,'Type','SRV','SRV'),(111,'Value','fetishmegastore.com.','fetishmegastore.com.'),(112,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(112,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(112,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(113,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(113,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(113,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(114,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(114,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(114,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(114,'Hostname','','fetishmegastore.com.'),(114,'Type','A','NS'),(114,'Value','','ns1.fetishmegastore.com.'),(115,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(115,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(115,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(115,'Hostname','','ns1.fetishmegastore.com.'),(115,'Type','A','A'),(115,'Value','','95.211.107.87'),(116,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(116,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(116,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(116,'Hostname','','fetishmegastore.com.'),(116,'Type','A','NS'),(116,'Value','','ns2.fetishmegastore.com.'),(117,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(117,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(117,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(117,'Hostname','','ns2.fetishmegastore.com.'),(117,'Type','A','A'),(117,'Value','','95.211.107.87'),(118,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(118,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(118,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(118,'Hostname','','fetishmegastore.com.'),(118,'Type','A','A'),(118,'Value','','95.211.107.87'),(119,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(119,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(119,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(119,'Hostname','','webmail.fetishmegastore.com.'),(119,'Type','A','A'),(119,'Value','','95.211.107.87'),(120,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(120,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(120,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(120,'Hostname','','fetishmegastore.com.'),(120,'Opt','','10'),(120,'Type','A','MX'),(120,'Value','','mail.fetishmegastore.com.'),(121,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(121,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(121,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(121,'Hostname','','mail.fetishmegastore.com.'),(121,'Type','A','A'),(121,'Value','','95.211.107.87'),(122,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(122,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(122,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(122,'Hostname','','ipv4.fetishmegastore.com.'),(122,'Type','A','A'),(122,'Value','','95.211.107.87'),(123,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(123,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(123,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(123,'Hostname','','ftp.fetishmegastore.com.'),(123,'Type','A','CNAME'),(123,'Value','','fetishmegastore.com.'),(124,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(124,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(124,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(124,'Hostname','','fetishmegastore.com.'),(124,'Type','A','TXT'),(124,'Value','','v=spf1 +a +mx +a:s10860938.dedi.leaseweb.net -all'),(125,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(125,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(125,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(125,'Hostname','','_dmarc.fetishmegastore.com.'),(125,'Type','A','TXT'),(125,'Value','','v=DMARC1; p=quarantine; adkim=s; aspf=s'),(126,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(126,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(126,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(126,'Hostname','','www.fetishmegastore.com.'),(126,'Type','A','CNAME'),(126,'Value','','fetishmegastore.com.'),(127,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(127,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(127,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(127,'Hostname','www.fetishmegastore.com.','www.fetishmegastore.com.'),(127,'Type','CNAME','CNAME'),(127,'Value','fetishmegastore.com.','fetishmegastore.com.'),(128,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(128,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(128,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(128,'Hostname','_dmarc.fetishmegastore.com.','_dmarc.fetishmegastore.com.'),(128,'Type','TXT','TXT'),(128,'Value','v=DMARC1; p=quarantine; adkim=s; aspf=s','v=DMARC1; p=quarantine; adkim=s; aspf=s'),(129,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(129,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(129,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(129,'Hostname','fetishmegastore.com.','fetishmegastore.com.'),(129,'Type','TXT','TXT'),(129,'Value','v=spf1 +a +mx +a:s10860938.dedi.leaseweb.net -all','v=spf1 +a +mx +a:s10860938.dedi.leaseweb.net -all'),(130,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(130,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(130,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(130,'Hostname','ftp.fetishmegastore.com.','ftp.fetishmegastore.com.'),(130,'Type','CNAME','CNAME'),(130,'Value','fetishmegastore.com.','fetishmegastore.com.'),(131,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(131,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(131,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(131,'Hostname','ipv4.fetishmegastore.com.','ipv4.fetishmegastore.com.'),(131,'Type','A','A'),(131,'Value','95.211.107.87','95.211.107.87'),(132,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(132,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(132,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(132,'Hostname','mail.fetishmegastore.com.','mail.fetishmegastore.com.'),(132,'Type','A','A'),(132,'Value','95.211.107.87','95.211.107.87'),(133,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(133,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(133,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(133,'Hostname','fetishmegastore.com.','fetishmegastore.com.'),(133,'Opt','10','10'),(133,'Type','MX','MX'),(133,'Value','mail.fetishmegastore.com.','mail.fetishmegastore.com.'),(134,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(134,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(134,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(134,'Hostname','webmail.fetishmegastore.com.','webmail.fetishmegastore.com.'),(134,'Type','A','A'),(134,'Value','95.211.107.87','95.211.107.87'),(135,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(135,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(135,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(135,'Hostname','fetishmegastore.com.','fetishmegastore.com.'),(135,'Type','A','A'),(135,'Value','95.211.107.87','95.211.107.87'),(136,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(136,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(136,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(136,'Hostname','ns2.fetishmegastore.com.','ns2.fetishmegastore.com.'),(136,'Type','A','A'),(136,'Value','95.211.107.87','95.211.107.87'),(137,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(137,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(137,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(137,'Hostname','fetishmegastore.com.','fetishmegastore.com.'),(137,'Type','NS','NS'),(137,'Value','ns2.fetishmegastore.com.','ns2.fetishmegastore.com.'),(138,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(138,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(138,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(138,'Hostname','ns1.fetishmegastore.com.','ns1.fetishmegastore.com.'),(138,'Type','A','A'),(138,'Value','95.211.107.87','95.211.107.87'),(139,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(139,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(139,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(139,'Hostname','fetishmegastore.com.','fetishmegastore.com.'),(139,'Type','NS','NS'),(139,'Value','ns1.fetishmegastore.com.','ns1.fetishmegastore.com.'),(140,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(140,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(140,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(141,'Client GUID','','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(141,'Domain GUID','','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(141,'Domain Name','','fetishmegastore.com'),(141,'IP Address','','95.211.107.87'),(141,'IPv6 Address','',''),(142,'Apache Error Documents','false','true'),(142,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(142,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(142,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(142,'IP Address','','95.211.107.87'),(142,'Mod FastCGI Support','false','true'),(142,'PHP Support','false','true'),(142,'System Shell','','/bin/false'),(142,'System User','','y5ek633qcts'),(142,'System User Password','++++++','xxxxxx'),(142,'Web Statistics','none','awstats'),(143,'Client GUID','','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(143,'Database id','','1'),(143,'Database name','','fetishme_twitcher'),(143,'Database server','','1'),(143,'Database server host','','localhost'),(143,'Database server port','','3306'),(143,'Database server type','','mysql'),(143,'Domain GUID','','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(143,'Domain Id','','1'),(144,'Database server','1','1'),(144,'Database server host','localhost','localhost'),(144,'Database server port','3306','3306'),(145,'Client GUID','','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(145,'Database id','','0'),(145,'Database server','','1'),(145,'Database server host','','localhost'),(145,'Database server port','','3306'),(145,'Database user name','','fetishme_mysql'),(145,'Database user password','++++++','xxxxxx'),(145,'Domain GUID','','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(145,'Domain Id','','1'),(146,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(146,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(146,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(146,'Relative WWW Root','httpdocs','httpdocs/public'),(146,'WWW Root','/var/www/vhosts/fetishmegastore.com/httpdocs','/var/www/vhosts/fetishmegastore.com/httpdocs/public'),(147,'Login Name','y5ek633qcts',''),(148,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688',''),(148,'Login Name','admin',''),(149,'Contact Name','','Administrator'),(150,'Extension Id','','ssh-keys'),(150,'Extension Name','','SSH Keys Manager'),(150,'Extension Release','','10'),(150,'Extension Version','','1.2.2'),(151,'Contact Name','Administrator',''),(152,'Contact Name','','Administrator'),(153,'Contact Name','','Administrator'),(154,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(154,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(154,'Domain Id','1','1'),(154,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(154,'SSL Certificate Binding Type','WEB','WEB'),(154,'SSL Certificate File','','scf42fDmW'),(154,'SSL Certificate Id','','3'),(154,'SSL Certificate Name','','Lets Encrypt fetishmegastore.com'),(155,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(155,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(155,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(156,'Contact Name','','Administrator'),(157,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(157,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(157,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(157,'Hostname','storage.fetishmegastore.com.','storage.fetishmegastore.com.'),(157,'Type','CNAME','CNAME'),(157,'Value','fetishmegatore.b-cdn.net.','fetishmegatore.b-cdn.net.'),(158,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(158,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(158,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(159,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(159,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(159,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(160,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(160,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(160,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(161,'Extension Id','revisium-antivirus','revisium-antivirus'),(161,'Extension Name','ImunifyAV','ImunifyAV'),(161,'Extension Release','1','1'),(161,'Extension Version','2.12.1','2.13.1'),(162,'Extension Id','sslit','sslit'),(162,'Extension Name','SSL It!','SSL It!'),(162,'Extension Release','3574','4059'),(162,'Extension Version','1.15.3','1.15.4'),(163,'Extension Id','log-browser','log-browser'),(163,'Extension Name','Log Browser','Log Browser'),(163,'Extension Release','1489','1554'),(163,'Extension Version','1.9.2','1.9.3'),(164,'Extension Id','performance-booster','performance-booster'),(164,'Extension Name','Performance Booster','Performance Booster'),(164,'Extension Release','3778','4050'),(164,'Extension Version','1.1.11','1.1.12'),(165,'Extension Id','sslit','sslit'),(165,'Extension Name','SSL It!','SSL It!'),(165,'Extension Release','4059','4063'),(165,'Extension Version','1.15.4','1.15.5'),(166,'Contact Name','','Administrator'),(167,'COMP_SERVICE_NODE','1','1'),(167,'Plesk component name','msmtp','msmtp'),(168,'COMP_SERVICE_NODE','1','1'),(168,'Plesk component name','curl','curl'),(169,'COMP_SERVICE_NODE','1','1'),(169,'Plesk component name','dovecot','dovecot'),(170,'COMP_SERVICE_NODE','1','1'),(170,'Plesk component name','dovecot-pigeonhole','dovecot-pigeonhole'),(171,'COMP_SERVICE_NODE','1','1'),(171,'Plesk component name','postfix','postfix'),(172,'Extension Id','','kolab'),(172,'Extension Name','','Plesk Premium Email, powered by Kolab'),(172,'Extension Release','','3'),(172,'Extension Version','','16.15.6'),(173,'Domain GUID','','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(174,'Domain GUID','','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(175,'COMP_SERVICE_NODE','1','1'),(175,'Plesk component name','dovecot','dovecot'),(176,'COMP_SERVICE_NODE','1','1'),(176,'Plesk component name','dovecot-pigeonhole','dovecot-pigeonhole'),(177,'COMP_SERVICE_NODE','1','1'),(177,'Plesk component name','msmtp','msmtp'),(178,'COMP_SERVICE_NODE','1','1'),(178,'Plesk component name','postfix','postfix'),(179,'Antivirus','none',''),(179,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(179,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(179,'Mailname','info@fetishmegastore.com',''),(180,'Contact Name','','Administrator'),(181,'Login Name','root',''),(182,'Login Name','root',''),(183,'Contact Name','','Administrator'),(184,'Session idle time','30','180'),(185,'Contact Name','','Administrator'),(186,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(186,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(186,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(186,'Permanent SEO-safe 301 redirect from HTTP to HTTPS','1',''),(187,'Domain GUID','','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(188,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(188,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(188,'Domain Id','1','1'),(188,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(188,'SSL Certificate Binding Type','WEB','WEB'),(188,'SSL Certificate File','scf42fDmW',''),(188,'SSL Certificate Id','3',''),(188,'SSL Certificate Name','Lets Encrypt fetishmegastore.com',''),(189,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(189,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(189,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(190,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(190,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(190,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(190,'Hostname','_acme-challenge.fetishmegastore.com.','_acme-challenge.fetishmegastore.com.'),(190,'Type','TXT','TXT'),(190,'Value','0k-JfgjuAI9GZGJfXR6YOpFVe2CYlGHCfe9rWlm34F8','0k-JfgjuAI9GZGJfXR6YOpFVe2CYlGHCfe9rWlm34F8'),(191,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(191,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(191,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(192,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(192,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(192,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(193,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(193,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(193,'Domain Id','1','1'),(193,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(193,'SSL Certificate Binding Type','WEB','WEB'),(193,'SSL Certificate File','','scf42fDmW'),(193,'SSL Certificate Id','','3'),(193,'SSL Certificate Name','','Lets Encrypt fetishmegastore.com'),(194,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(194,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(194,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(195,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(195,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(195,'Domain Id','1','1'),(195,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(195,'SSL Certificate Binding Type','WEB_MAIL','WEB_MAIL'),(195,'SSL Certificate File','','scf42fDmW'),(195,'SSL Certificate Id','','3'),(195,'SSL Certificate Name','','Lets Encrypt fetishmegastore.com'),(196,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(196,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(196,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(197,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(197,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(197,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(197,'Permanent SEO-safe 301 redirect from HTTP to HTTPS','','1'),(198,'Contact Name','','Administrator'),(199,'Extension Id','kolab','kolab'),(199,'Extension Name','Plesk Premium Email, powered by Kolab','Plesk Premium Email, powered by Kolab'),(199,'Extension Release','3','3'),(199,'Extension Version','16.15.6','16.15.7'),(200,'Extension Id','platform360','platform360'),(200,'Extension Name','Platform360','Platform360'),(200,'Extension Release','1345','1564'),(200,'Extension Version','1.10.2','1.10.3'),(201,'Contact Name','','Administrator'),(202,'Contact Name','','Administrator'),(203,'Client GUID','','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(203,'Database id','','2'),(203,'Database name','','fetish_bkp'),(203,'Database server','','1'),(203,'Database server host','','localhost'),(203,'Database server port','','3306'),(203,'Database server type','','mysql'),(203,'Domain GUID','','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(203,'Domain Id','','1'),(204,'Database server','1','1'),(204,'Database server host','localhost','localhost'),(204,'Database server port','3306','3306'),(205,'COMP_SERVICE_NODE','1','1'),(205,'Plesk component name','dovecot','dovecot'),(206,'COMP_SERVICE_NODE','1','1'),(206,'Plesk component name','dovecot-pigeonhole','dovecot-pigeonhole'),(207,'COMP_SERVICE_NODE','1','1'),(207,'Plesk component name','nginx','nginx'),(208,'COMP_SERVICE_NODE','1','1'),(208,'Plesk component name','psa','psa'),(209,'COMP_SERVICE_NODE','1','1'),(209,'Plesk component name','psa-api-rpc','psa-api-rpc'),(210,'COMP_SERVICE_NODE','1','1'),(210,'Plesk component name','psa-autoinstaller','psa-autoinstaller'),(211,'COMP_SERVICE_NODE','1','1'),(211,'Plesk component name','psa-backup-manager','psa-backup-manager'),(212,'COMP_SERVICE_NODE','1','1'),(212,'Plesk component name','roundcube','roundcube'),(213,'Update version','18.0.63.4','18.0.64.0'),(214,'Contact Name','','Administrator'),(215,'Contact Name','','Administrator'),(216,'Contact Name','','Administrator'),(217,'Contact Name','','Administrator'),(218,'Contact Name','','Administrator'),(219,'Contact Name','','Administrator'),(220,'Contact Name','','Administrator'),(221,'Extension Id','kolab','kolab'),(221,'Extension Name','Plesk Premium Email, powered by Kolab','Plesk Premium Email, powered by Kolab'),(221,'Extension Release','3',''),(221,'Extension Version','16.15.7','16.15.8'),(222,'Extension Id','revisium-antivirus','revisium-antivirus'),(222,'Extension Name','ImunifyAV','ImunifyAV'),(222,'Extension Release','1','1'),(222,'Extension Version','2.13.1','2.13.2'),(223,'Contact Name','','Administrator'),(224,'Contact Name','','Administrator'),(225,'COMP_SERVICE_NODE','1','1'),(225,'Plesk component name','php82','php82'),(226,'COMP_SERVICE_NODE','1','1'),(226,'Plesk component name','php83','php83'),(227,'Contact Name','','Administrator'),(228,'Contact Name','','Administrator'),(229,'Contact Name','','Administrator'),(230,'Contact Name','','Administrator'),(231,'Contact Name','','Administrator'),(232,'Extension Id','revisium-antivirus','revisium-antivirus'),(232,'Extension Name','ImunifyAV','ImunifyAV'),(232,'Extension Release','1','1'),(232,'Extension Version','2.13.2','2.13.3'),(233,'Extension Id','log-browser','log-browser'),(233,'Extension Name','Log Browser','Log Browser'),(233,'Extension Release','1554','1637'),(233,'Extension Version','1.9.3','1.9.4'),(234,'Contact Name','','Administrator'),(235,'Contact Name','','Administrator'),(236,'Antivirus','none',''),(236,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(236,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(236,'Mailname','office@fetishmegastore.com',''),(237,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(237,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(237,'Domain Id','1','1'),(237,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(237,'SSL Certificate Binding Type','WEB_MAIL','WEB_MAIL'),(237,'SSL Certificate File','scf42fDmW',''),(237,'SSL Certificate Id','3',''),(237,'SSL Certificate Name','Lets Encrypt fetishmegastore.com',''),(238,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(238,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(238,'Domain Name','fetishmegastore.com','fetishmegastore.com'),(239,'Contact Name','','Administrator'),(240,'Antivirus','none',''),(240,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(240,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(240,'Mailname','help@fetishmegastore.com',''),(241,'Antivirus','none',''),(241,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(241,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(241,'Mailname','info@fetishmegastore.com',''),(242,'Antivirus','none',''),(242,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(242,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(242,'Mailname','office@fetishmegastore.com',''),(243,'Antivirus','none',''),(243,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(243,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(243,'Mailname','office@fetishmegastore.com',''),(244,'Antivirus','none',''),(244,'Client GUID','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688','3422d86c-9cd0-4ecb-a3c7-a1f516c5c688'),(244,'Domain GUID','e9e0d35b-fd79-4f15-bb6f-8184b592508e','e9e0d35b-fd79-4f15-bb6f-8184b592508e'),(244,'Mailname','office@fetishmegastore.com','');
/*!40000 ALTER TABLE `log_components` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_rotation`
--

DROP TABLE IF EXISTS `log_rotation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `log_rotation` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `period_type` enum('by_time','by_size') NOT NULL DEFAULT 'by_time',
  `period` varchar(50) DEFAULT NULL,
  `max_number_of_logfiles` bigint(20) unsigned DEFAULT 0,
  `compress_enable` enum('false','true') NOT NULL DEFAULT 'false',
  `email` varchar(255) DEFAULT NULL,
  `turned_on` enum('false','true') NOT NULL DEFAULT 'false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_rotation`
--

LOCK TABLES `log_rotation` WRITE;
/*!40000 ALTER TABLE `log_rotation` DISABLE KEYS */;
INSERT INTO `log_rotation` VALUES (1,'by_size','10485760',10,'true','','true'),(2,'by_size','10485760',10,'true','','true'),(3,'by_size','10485760',10,'true','','true'),(4,'by_size','10485760',10,'true','','true'),(5,'by_size','10485760',10,'true','','true');
/*!40000 ALTER TABLE `log_rotation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `longtaskparams`
--

DROP TABLE IF EXISTS `longtaskparams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `longtaskparams` (
  `task_id` int(10) unsigned NOT NULL,
  `param` varchar(255) NOT NULL,
  `val` mediumtext DEFAULT NULL,
  PRIMARY KEY (`task_id`,`param`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `longtaskparams`
--

LOCK TABLES `longtaskparams` WRITE;
/*!40000 ALTER TABLE `longtaskparams` DISABLE KEYS */;
INSERT INTO `longtaskparams` VALUES (587,'authRealUserLogin','N;'),(587,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(587,'rotateMail','b:1;'),(587,'runTaskUnderLogin','N;'),(588,'authRealUserLogin','N;'),(588,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(588,'rotateMail','b:1;'),(588,'runTaskUnderLogin','N;'),(589,'authRealUserLogin','N;'),(589,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(589,'rotateMail','b:1;'),(589,'runTaskUnderLogin','N;'),(590,'authRealUserLogin','N;'),(590,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(590,'rotateMail','b:1;'),(590,'runTaskUnderLogin','N;'),(591,'authRealUserLogin','N;'),(591,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(591,'rotateMail','b:1;'),(591,'runTaskUnderLogin','N;'),(592,'authRealUserLogin','N;'),(592,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(592,'rotateMail','b:1;'),(592,'runTaskUnderLogin','N;'),(593,'authRealUserLogin','N;'),(593,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(593,'rotateMail','b:1;'),(593,'runTaskUnderLogin','N;'),(594,'authRealUserLogin','N;'),(594,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(594,'rotateMail','b:1;'),(594,'runTaskUnderLogin','N;'),(595,'authRealUserLogin','N;'),(595,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(595,'rotateMail','b:1;'),(595,'runTaskUnderLogin','N;'),(596,'authRealUserLogin','N;'),(596,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(596,'rotateMail','b:1;'),(596,'runTaskUnderLogin','N;'),(597,'authRealUserLogin','N;'),(597,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(597,'rotateMail','b:1;'),(597,'runTaskUnderLogin','N;'),(598,'authRealUserLogin','N;'),(598,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(598,'rotateMail','b:1;'),(598,'runTaskUnderLogin','N;'),(599,'authRealUserLogin','N;'),(599,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(599,'rotateMail','b:1;'),(599,'runTaskUnderLogin','N;'),(600,'authRealUserLogin','N;'),(600,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(600,'rotateMail','b:1;'),(600,'runTaskUnderLogin','N;'),(601,'authRealUserLogin','N;'),(601,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(601,'rotateMail','b:1;'),(601,'runTaskUnderLogin','N;'),(602,'authRealUserLogin','N;'),(602,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(602,'rotateMail','b:1;'),(602,'runTaskUnderLogin','N;'),(603,'authRealUserLogin','N;'),(603,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(603,'rotateMail','b:1;'),(603,'runTaskUnderLogin','N;'),(604,'authRealUserLogin','N;'),(604,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(604,'rotateMail','b:1;'),(604,'runTaskUnderLogin','N;'),(605,'authRealUserLogin','N;'),(605,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(605,'rotateMail','b:1;'),(605,'runTaskUnderLogin','N;'),(606,'authRealUserLogin','N;'),(606,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(606,'rotateMail','b:1;'),(606,'runTaskUnderLogin','N;'),(607,'authRealUserLogin','N;'),(607,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(607,'rotateMail','b:1;'),(607,'runTaskUnderLogin','N;'),(608,'authRealUserLogin','N;'),(608,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(608,'rotateMail','b:1;'),(608,'runTaskUnderLogin','N;'),(609,'authRealUserLogin','N;'),(609,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(609,'rotateMail','b:1;'),(609,'runTaskUnderLogin','N;'),(610,'authRealUserLogin','N;'),(610,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(610,'rotateMail','b:1;'),(610,'runTaskUnderLogin','N;'),(611,'authRealUserLogin','N;'),(611,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(611,'runTaskUnderLogin','s:5:\"admin\";'),(611,'sites','a:1:{i:0;i:1;}'),(612,'authRealUserLogin','N;'),(612,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(612,'runTaskUnderLogin','s:5:\"admin\";'),(613,'authRealUserLogin','N;'),(613,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(613,'rotateMail','b:1;'),(613,'runTaskUnderLogin','N;'),(614,'authRealUserLogin','N;'),(614,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(614,'rotateMail','b:1;'),(614,'runTaskUnderLogin','N;'),(615,'authRealUserLogin','N;'),(615,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(615,'rotateMail','b:1;'),(615,'runTaskUnderLogin','N;'),(616,'authRealUserLogin','N;'),(616,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(616,'rotateMail','b:1;'),(616,'runTaskUnderLogin','N;'),(617,'authRealUserLogin','N;'),(617,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(617,'rotateMail','b:1;'),(617,'runTaskUnderLogin','N;'),(618,'authRealUserLogin','N;'),(618,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(618,'rotateMail','b:1;'),(618,'runTaskUnderLogin','N;'),(619,'authRealUserLogin','N;'),(619,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(619,'rotateMail','b:1;'),(619,'runTaskUnderLogin','N;'),(620,'authRealUserLogin','N;'),(620,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(620,'rotateMail','b:1;'),(620,'runTaskUnderLogin','N;'),(621,'authRealUserLogin','N;'),(621,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(621,'rotateMail','b:1;'),(621,'runTaskUnderLogin','N;'),(622,'authRealUserLogin','N;'),(622,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(622,'rotateMail','b:1;'),(622,'runTaskUnderLogin','N;'),(623,'authRealUserLogin','N;'),(623,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(623,'rotateMail','b:1;'),(623,'runTaskUnderLogin','N;'),(624,'authRealUserLogin','N;'),(624,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(624,'rotateMail','b:1;'),(624,'runTaskUnderLogin','N;'),(625,'authRealUserLogin','N;'),(625,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(625,'rotateMail','b:1;'),(625,'runTaskUnderLogin','N;'),(626,'authRealUserLogin','N;'),(626,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(626,'rotateMail','b:1;'),(626,'runTaskUnderLogin','N;'),(627,'authRealUserLogin','N;'),(627,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(627,'rotateMail','b:1;'),(627,'runTaskUnderLogin','N;'),(628,'authRealUserLogin','N;'),(628,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(628,'rotateMail','b:1;'),(628,'runTaskUnderLogin','N;'),(629,'authRealUserLogin','N;'),(629,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(629,'rotateMail','b:1;'),(629,'runTaskUnderLogin','N;'),(630,'authRealUserLogin','N;'),(630,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(630,'rotateMail','b:1;'),(630,'runTaskUnderLogin','N;'),(631,'authRealUserLogin','N;'),(631,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(631,'rotateMail','b:1;'),(631,'runTaskUnderLogin','N;'),(632,'authRealUserLogin','N;'),(632,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(632,'rotateMail','b:1;'),(632,'runTaskUnderLogin','N;'),(633,'authRealUserLogin','N;'),(633,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(633,'rotateMail','b:1;'),(633,'runTaskUnderLogin','N;'),(634,'authRealUserLogin','N;'),(634,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(634,'rotateMail','b:1;'),(634,'runTaskUnderLogin','N;'),(635,'authRealUserLogin','N;'),(635,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(635,'rotateMail','b:1;'),(635,'runTaskUnderLogin','N;'),(636,'authRealUserLogin','N;'),(636,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(636,'rotateMail','b:1;'),(636,'runTaskUnderLogin','N;'),(637,'authRealUserLogin','N;'),(637,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(637,'runTaskUnderLogin','s:5:\"admin\";'),(637,'sites','a:1:{i:0;i:1;}'),(638,'authRealUserLogin','N;'),(638,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(638,'runTaskUnderLogin','s:5:\"admin\";'),(639,'authRealUserLogin','N;'),(639,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(639,'rotateMail','b:1;'),(639,'runTaskUnderLogin','N;'),(640,'authRealUserLogin','N;'),(640,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(640,'rotateMail','b:1;'),(640,'runTaskUnderLogin','N;'),(641,'authRealUserLogin','N;'),(641,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(641,'rotateMail','b:1;'),(641,'runTaskUnderLogin','N;'),(642,'authRealUserLogin','N;'),(642,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(642,'rotateMail','b:1;'),(642,'runTaskUnderLogin','N;'),(643,'authRealUserLogin','N;'),(643,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(643,'rotateMail','b:1;'),(643,'runTaskUnderLogin','N;'),(644,'authRealUserLogin','N;'),(644,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(644,'rotateMail','b:1;'),(644,'runTaskUnderLogin','N;'),(645,'authRealUserLogin','N;'),(645,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(645,'rotateMail','b:1;'),(645,'runTaskUnderLogin','N;'),(646,'authRealUserLogin','N;'),(646,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(646,'rotateMail','b:1;'),(646,'runTaskUnderLogin','N;'),(647,'authRealUserLogin','N;'),(647,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(647,'rotateMail','b:1;'),(647,'runTaskUnderLogin','N;'),(648,'authRealUserLogin','N;'),(648,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(648,'rotateMail','b:1;'),(648,'runTaskUnderLogin','N;'),(649,'authRealUserLogin','N;'),(649,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(649,'rotateMail','b:1;'),(649,'runTaskUnderLogin','N;'),(650,'authRealUserLogin','N;'),(650,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(650,'rotateMail','b:1;'),(650,'runTaskUnderLogin','N;'),(651,'authRealUserLogin','N;'),(651,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(651,'rotateMail','b:1;'),(651,'runTaskUnderLogin','N;'),(652,'authRealUserLogin','N;'),(652,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(652,'rotateMail','b:1;'),(652,'runTaskUnderLogin','N;'),(653,'authRealUserLogin','N;'),(653,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(653,'rotateMail','b:1;'),(653,'runTaskUnderLogin','N;'),(654,'authRealUserLogin','N;'),(654,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(654,'rotateMail','b:1;'),(654,'runTaskUnderLogin','N;'),(655,'authRealUserLogin','N;'),(655,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(655,'rotateMail','b:1;'),(655,'runTaskUnderLogin','N;'),(656,'authRealUserLogin','N;'),(656,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(656,'rotateMail','b:1;'),(656,'runTaskUnderLogin','N;'),(657,'authRealUserLogin','N;'),(657,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(657,'rotateMail','b:1;'),(657,'runTaskUnderLogin','N;'),(658,'authRealUserLogin','N;'),(658,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(658,'runTaskUnderLogin','N;'),(659,'authRealUserLogin','N;'),(659,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(659,'rotateMail','b:1;'),(659,'runTaskUnderLogin','N;'),(660,'authRealUserLogin','N;'),(660,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(660,'rotateMail','b:1;'),(660,'runTaskUnderLogin','N;'),(661,'authRealUserLogin','N;'),(661,'clientRemoteAddr','s:9:\"127.0.0.1\";'),(661,'rotateMail','b:1;'),(661,'runTaskUnderLogin','N;');
/*!40000 ALTER TABLE `longtaskparams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `longtasks`
--

DROP TABLE IF EXISTS `longtasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `longtasks` (
  `startTime` timestamp NOT NULL DEFAULT current_timestamp(),
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'not_started',
  `statusProcessed` int(10) unsigned NOT NULL DEFAULT 0,
  `context` varchar(255) DEFAULT NULL,
  `progressStatus` varchar(255) NOT NULL DEFAULT 'queue',
  `progressParams` blob DEFAULT NULL,
  `progressMax` int(10) unsigned NOT NULL DEFAULT 1,
  `progressValue` int(10) unsigned NOT NULL DEFAULT 0,
  `finishTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `pid` int(10) unsigned NOT NULL DEFAULT 0,
  `externalId` varchar(255) DEFAULT NULL,
  `updateTime` datetime NOT NULL DEFAULT '1970-01-01 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=662 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `longtasks`
--

LOCK TABLES `longtasks` WRITE;
/*!40000 ALTER TABLE `longtasks` DISABLE KEYS */;
INSERT INTO `longtasks` VALUES ('2024-10-02 07:13:01',587,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-02 07:13:04',76434,'4089','2024-10-02 07:13:04'),('2024-10-02 08:13:01',588,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-02 08:13:04',113968,'4095','2024-10-02 08:13:04'),('2024-10-02 09:13:01',589,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-02 09:13:04',151428,'4101','2024-10-02 09:13:04'),('2024-10-02 10:13:01',590,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-02 10:13:03',188577,'4109','2024-10-02 10:13:03'),('2024-10-02 11:13:01',591,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-02 11:13:04',226333,'4115','2024-10-02 11:13:04'),('2024-10-02 12:13:01',592,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-02 12:13:03',264655,'4121','2024-10-02 12:13:03'),('2024-10-02 13:13:01',593,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-02 13:13:04',303837,'4127','2024-10-02 13:13:04'),('2024-10-02 14:13:01',594,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-02 14:13:03',344430,'4133','2024-10-02 14:13:03'),('2024-10-02 15:13:01',595,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-02 15:13:03',384246,'4139','2024-10-02 15:13:03'),('2024-10-02 16:13:01',596,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-02 16:13:04',423364,'4145','2024-10-02 16:13:04'),('2024-10-02 17:13:01',597,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-02 17:13:04',462486,'4151','2024-10-02 17:13:04'),('2024-10-02 18:13:00',598,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-02 18:13:02',502652,'4157','2024-10-02 18:13:02'),('2024-10-02 19:13:01',599,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-02 19:13:04',541666,'4163','2024-10-02 19:13:04'),('2024-10-02 20:13:01',600,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-02 20:13:03',582189,'4169','2024-10-02 20:13:03'),('2024-10-02 21:13:01',601,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-02 21:13:04',623943,'4175','2024-10-02 21:13:04'),('2024-10-02 22:13:01',602,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-02 22:13:03',663655,'4181','2024-10-02 22:13:03'),('2024-10-02 23:13:01',603,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-02 23:13:04',703993,'4187','2024-10-02 23:13:04'),('2024-10-03 00:13:01',604,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-03 00:13:04',754241,'4193','2024-10-03 00:13:04'),('2024-10-03 01:13:01',605,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-03 01:13:03',794403,'4199','2024-10-03 01:13:03'),('2024-10-03 02:13:01',606,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-03 02:13:03',834693,'4205','2024-10-03 02:13:03'),('2024-10-03 03:13:02',607,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-03 03:13:04',873694,'4211','2024-10-03 03:13:04'),('2024-10-03 04:13:01',608,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-03 04:13:03',913093,'4219','2024-10-03 04:13:03'),('2024-10-03 05:13:01',609,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-03 05:13:04',954196,'4225','2024-10-03 05:13:04'),('2024-10-03 06:13:01',610,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-03 06:13:04',993002,'4231','2024-10-03 06:13:04'),('2024-10-03 06:28:00',611,'trash-rotate','done',0,NULL,'done',NULL,100,100,'2024-10-03 06:28:00',1006832,'4271','2024-10-03 06:28:00'),('2024-10-03 06:28:02',612,'aps-cache','done',0,NULL,'done',NULL,100,100,'2024-10-03 06:28:02',1006974,'4272','2024-10-03 06:28:02'),('2024-10-03 07:13:01',613,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-03 07:13:04',1037594,'4273','2024-10-03 07:13:04'),('2024-10-03 08:13:01',614,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-03 08:13:04',1077367,'4279','2024-10-03 08:13:04'),('2024-10-03 09:13:01',615,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-03 09:13:04',1118214,'4287','2024-10-03 09:13:04'),('2024-10-03 10:13:01',616,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-03 10:13:04',1159249,'4293','2024-10-03 10:13:04'),('2024-10-03 11:13:01',617,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-03 11:13:04',1198178,'4299','2024-10-03 11:13:04'),('2024-10-03 12:13:01',618,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-03 12:13:04',1237104,'4305','2024-10-03 12:13:04'),('2024-10-03 13:13:01',619,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-03 13:13:04',1276660,'4311','2024-10-03 13:13:04'),('2024-10-03 14:13:01',620,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-03 14:13:04',1315684,'4317','2024-10-03 14:13:04'),('2024-10-03 15:13:01',621,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-03 15:13:03',1354360,'4323','2024-10-03 15:13:03'),('2024-10-03 16:13:01',622,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-03 16:13:03',1393224,'4329','2024-10-03 16:13:03'),('2024-10-03 17:13:01',623,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-03 17:13:04',1432294,'4335','2024-10-03 17:13:04'),('2024-10-03 18:13:01',624,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-03 18:13:04',1471668,'4341','2024-10-03 18:13:04'),('2024-10-03 19:13:01',625,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-03 19:13:04',1510616,'4347','2024-10-03 19:13:04'),('2024-10-03 20:13:01',626,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-03 20:13:04',1549450,'4353','2024-10-03 20:13:04'),('2024-10-03 21:13:01',627,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-03 21:13:04',1588699,'4359','2024-10-03 21:13:04'),('2024-10-03 22:13:01',628,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-03 22:13:04',1627450,'4365','2024-10-03 22:13:04'),('2024-10-03 23:13:01',629,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-03 23:13:04',1666841,'4371','2024-10-03 23:13:04'),('2024-10-04 00:13:01',630,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-04 00:13:04',1717330,'4377','2024-10-04 00:13:04'),('2024-10-04 01:13:01',631,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-04 01:13:04',1756307,'4383','2024-10-04 01:13:04'),('2024-10-04 02:13:02',632,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-04 02:13:05',1795223,'4389','2024-10-04 02:13:05'),('2024-10-04 03:13:01',633,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-04 03:13:04',1835434,'4395','2024-10-04 03:13:04'),('2024-10-04 04:13:01',634,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-04 04:13:04',1874949,'4401','2024-10-04 04:13:04'),('2024-10-04 05:13:01',635,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-04 05:13:04',1913881,'4407','2024-10-04 05:13:04'),('2024-10-04 06:13:02',636,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-04 06:13:04',1952993,'4413','2024-10-04 06:13:04'),('2024-10-04 06:32:16',637,'trash-rotate','done',0,NULL,'done',NULL,100,100,'2024-10-04 06:32:16',1969624,'4453','2024-10-04 06:32:16'),('2024-10-04 06:32:17',638,'aps-cache','done',0,NULL,'done',NULL,100,100,'2024-10-04 06:32:17',1969753,'4454','2024-10-04 06:32:17'),('2024-10-04 07:13:01',639,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-04 07:13:04',1998413,'4459','2024-10-04 07:13:04'),('2024-10-04 08:13:01',640,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-04 08:13:04',2037843,'4465','2024-10-04 08:13:04'),('2024-10-04 09:13:01',641,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-04 09:13:04',2076687,'4473','2024-10-04 09:13:04'),('2024-10-04 10:13:01',642,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-04 10:13:04',2117368,'4479','2024-10-04 10:13:04'),('2024-10-04 11:13:01',643,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-04 11:13:04',2156853,'4485','2024-10-04 11:13:04'),('2024-10-04 12:13:01',644,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-04 12:13:04',2196108,'4491','2024-10-04 12:13:04'),('2024-10-04 13:13:00',645,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-04 13:13:03',2235939,'4503','2024-10-04 13:13:03'),('2024-10-04 14:13:01',646,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-04 14:13:04',2274925,'4509','2024-10-04 14:13:04'),('2024-10-04 15:13:02',647,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-04 15:13:04',2314467,'4515','2024-10-04 15:13:04'),('2024-10-04 16:13:01',648,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-04 16:13:04',2353861,'4521','2024-10-04 16:13:04'),('2024-10-04 17:13:01',649,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-04 17:13:04',2393315,'4527','2024-10-04 17:13:04'),('2024-10-04 18:13:01',650,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-04 18:13:04',2432255,'4533','2024-10-04 18:13:04'),('2024-10-04 19:13:01',651,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-04 19:13:04',2470893,'4539','2024-10-04 19:13:04'),('2024-10-04 20:13:01',652,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-04 20:13:04',2509702,'4545','2024-10-04 20:13:04'),('2024-10-04 21:13:01',653,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-04 21:13:04',2549093,'4551','2024-10-04 21:13:04'),('2024-10-04 22:13:01',654,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-04 22:13:04',2588483,'4557','2024-10-04 22:13:04'),('2024-10-04 23:13:02',655,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-04 23:13:05',2627414,'4563','2024-10-04 23:13:05'),('2024-10-05 00:13:01',656,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-05 00:13:04',2676958,'4569','2024-10-05 00:13:04'),('2024-10-05 01:13:01',657,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-05 01:13:04',2717618,'4575','2024-10-05 01:13:04'),('2024-10-05 02:09:01',658,'ext-log-browser-rotate-mail','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-05 02:09:04',2754134,'4581','2024-10-05 02:09:04'),('2024-10-05 02:13:01',659,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-05 02:13:04',2756761,'4582','2024-10-05 02:13:04'),('2024-10-05 03:13:01',660,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-05 03:13:04',2795605,'4588','2024-10-05 03:13:04'),('2024-10-05 04:13:01',661,'ext-log-browser-parse-maillog','done',0,'89fa4f6fa52824b6740eac3a8ebef95f','done',NULL,100,100,'2024-10-05 04:13:04',2837889,'4596','2024-10-05 04:13:04');
/*!40000 ALTER TABLE `longtasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mail`
--

DROP TABLE IF EXISTS `mail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mail` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned DEFAULT NULL,
  `mail_name` varchar(245) NOT NULL,
  `postbox` enum('false','true') NOT NULL DEFAULT 'false',
  `delivery` enum('false','true') NOT NULL DEFAULT 'true',
  `account_id` int(10) unsigned NOT NULL DEFAULT 0,
  `mail_group` enum('false','true') NOT NULL DEFAULT 'false',
  `autoresponder` enum('false','true') NOT NULL DEFAULT 'false',
  `mbox_quota` bigint(20) NOT NULL DEFAULT -1,
  `description` varchar(255) DEFAULT NULL,
  `dom_id` int(10) unsigned NOT NULL DEFAULT 0,
  `disk_usage` bigint(20) unsigned NOT NULL DEFAULT 0,
  `perm_id` int(10) unsigned NOT NULL DEFAULT 0,
  `spamfilter` enum('false','true') NOT NULL DEFAULT 'true',
  `virusfilter` enum('none','incoming','outgoing','any') NOT NULL DEFAULT 'none',
  `externalEmail` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dom_id` (`dom_id`,`mail_name`),
  KEY `account_id` (`account_id`),
  KEY `perm_id` (`perm_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mail`
--

LOCK TABLES `mail` WRITE;
/*!40000 ALTER TABLE `mail` DISABLE KEYS */;
INSERT INTO `mail` VALUES (8,0,'office','false','true',11,'false','false',-1,'',1,0,0,'false','none','fetishmegastore@gmail.com');
/*!40000 ALTER TABLE `mail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mail_aliases`
--

DROP TABLE IF EXISTS `mail_aliases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mail_aliases` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `mn_id` int(10) unsigned NOT NULL DEFAULT 0,
  `alias` varchar(245) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mn_id` (`mn_id`,`alias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mail_aliases`
--

LOCK TABLES `mail_aliases` WRITE;
/*!40000 ALTER TABLE `mail_aliases` DISABLE KEYS */;
/*!40000 ALTER TABLE `mail_aliases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mail_redir`
--

DROP TABLE IF EXISTS `mail_redir`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mail_redir` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `mn_id` int(10) unsigned NOT NULL DEFAULT 0,
  `address` varchar(245) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mail_redir`
--

LOCK TABLES `mail_redir` WRITE;
/*!40000 ALTER TABLE `mail_redir` DISABLE KEYS */;
/*!40000 ALTER TABLE `mail_redir` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mail_resp`
--

DROP TABLE IF EXISTS `mail_resp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mail_resp` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `mn_id` int(10) unsigned NOT NULL DEFAULT 0,
  `resp_name` varchar(245) NOT NULL,
  `keystr` varchar(255) DEFAULT NULL,
  `key_where` enum('subj','body','no') NOT NULL DEFAULT 'no',
  `subject` varchar(255) DEFAULT NULL,
  `reply_to` varchar(255) DEFAULT NULL,
  `text` mediumtext DEFAULT NULL,
  `resp_on` enum('false','true') NOT NULL DEFAULT 'false',
  `ans_freq` int(11) DEFAULT 10,
  `mem_limit` int(11) DEFAULT 1000,
  `content_type` varchar(245) NOT NULL DEFAULT 'text/plain',
  `charset` varchar(245) NOT NULL DEFAULT 'UTF-8',
  `endDate` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mn_id_resp_name` (`mn_id`,`resp_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mail_resp`
--

LOCK TABLES `mail_resp` WRITE;
/*!40000 ALTER TABLE `mail_resp` DISABLE KEYS */;
/*!40000 ALTER TABLE `mail_resp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mass_mail`
--

DROP TABLE IF EXISTS `mass_mail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mass_mail` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `from_email` varchar(255) NOT NULL,
  `to_admin` enum('false','true') NOT NULL DEFAULT 'false',
  `to_resellers` enum('false','true') NOT NULL DEFAULT 'false',
  `to_resellers_mode` enum('all','select','except') NOT NULL DEFAULT 'all',
  `to_clients` enum('false','true') NOT NULL DEFAULT 'false',
  `to_clients_mode` enum('all','select','except') NOT NULL DEFAULT 'all',
  `to_domains` enum('false','true') NOT NULL DEFAULT 'false',
  `to_domains_mode` enum('all','select','except') NOT NULL DEFAULT 'all',
  `subject` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `cdate` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mass_mail`
--

LOCK TABLES `mass_mail` WRITE;
/*!40000 ALTER TABLE `mass_mail` DISABLE KEYS */;
/*!40000 ALTER TABLE `mass_mail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mass_mail_clients`
--

DROP TABLE IF EXISTS `mass_mail_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mass_mail_clients` (
  `mm_id` int(10) unsigned NOT NULL,
  `cl_id` int(10) unsigned NOT NULL,
  UNIQUE KEY `mm_cl` (`mm_id`,`cl_id`),
  KEY `mm_id` (`mm_id`),
  KEY `cl_id` (`cl_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mass_mail_clients`
--

LOCK TABLES `mass_mail_clients` WRITE;
/*!40000 ALTER TABLE `mass_mail_clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `mass_mail_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mass_mail_domains`
--

DROP TABLE IF EXISTS `mass_mail_domains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mass_mail_domains` (
  `mm_id` int(10) unsigned NOT NULL,
  `dom_id` int(10) unsigned NOT NULL,
  UNIQUE KEY `mm_dom` (`mm_id`,`dom_id`),
  KEY `mm_id` (`mm_id`),
  KEY `dom_id` (`dom_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mass_mail_domains`
--

LOCK TABLES `mass_mail_domains` WRITE;
/*!40000 ALTER TABLE `mass_mail_domains` DISABLE KEYS */;
/*!40000 ALTER TABLE `mass_mail_domains` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `misc`
--

DROP TABLE IF EXISTS `misc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `misc` (
  `param` varchar(255) NOT NULL,
  `val` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`param`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `misc`
--

LOCK TABLES `misc` WRITE;
/*!40000 ALTER TABLE `misc` DISABLE KEYS */;
INSERT INTO `misc` VALUES ('access-domain-enabled','true'),('access-domain-name',''),('actionlog_rot_num_periods','30'),('actionlog_rot_num_records','3000'),('actionlog_rot_period','day'),('actionlog_rot_type','by_period'),('admin_address',NULL),('admin_city',NULL),('admin_cname',NULL),('admin_country','XX'),('admin_email','cyber-media@gmx.net'),('admin_fax',NULL),('admin_locale','en-US'),('admin_password_encrypted','true'),('admin_pcode',''),('admin_phone',NULL),('admin_pname','Administrator'),('admin_skin_id','1'),('admin_state',''),('allow_short_pop3_names','disabled'),('apacheListenLocalhost','true'),('aps_database','apsc'),('aps_host','localhost'),('aps_login','apsc'),('aps_password','$AES-128-CBC$T7z0pbFvDva09RanGP5rcw==$1MUNWKco5L1OfAkLqOF9iw=='),('aps_port','3306'),('aps_secure_passwords','true'),('automaticSystemPackageUpdates','true'),('autoupdater_last_run_date','2024-10-04T06:25:15+00:00'),('backup_suggest_encrypt_backups','list_only'),('bu_cert_id','1'),('cert_rep_id','1'),('daily_maintenance_last_run_date','2024-10-04T06:25:01+00:00'),('default_certificate_id','2'),('default_server_mysql','1'),('def_locale','en-US'),('def_skin_id','1'),('disable_check_session_ip','false'),('disable_updater','false'),('dns_recursion','localnets'),('dns_zone_synchronized','true'),('eula_accept_date','2024-09-14'),('FullHostName','s10860938.dedi.leaseweb.net'),('hourly_maintenance_last_run_date','2024-10-05T04:17:01+00:00'),('include_databases','true'),('include_domaindumps','true'),('include_logs','true'),('include_mailboxes','true'),('include_maillists','true'),('include_remote_databases','true'),('installation_arguments','\"/var/cache/parallels_installer/parallels_installer_Ubuntu_22.04_x86_64_3.63.0\" \"--select-product-id\" \"plesk\" \"--select-release-latest\" \"--tier\" \"release,stable\" \"--installation-type\" \"Typical\" '),('installation_finish','1726050986'),('installation_mode','ONE_CLICK'),('installation_preset','plesk:Typical'),('installerProxyMode','true'),('last_admin_login_date','2024-10-05 03:44:59'),('last_login_date','1970-01-01 00:00:00'),('leika_last_run_date','2024-10-04T23:17:05+00:00'),('login_timeout','180'),('mail_autodiscovery','true'),('max_bu_proc_number','10'),('message_upgrade_dns_sync_skip','false'),('monthly_maintenance_last_run_date','2024-10-01T06:52:02+00:00'),('multiply_login','true'),('not_showLicense','true'),('pleskHttpHost','95.211.107.87'),('power_user_panel','true'),('psa_configured','true'),('restart_apache_gracefully','true'),('roller_last_run_date','2024-10-04T11:17:01+00:00'),('secure_passwords','true'),('seo_serps','{\"success\":true,\"message\":\"\",\"id\":28768066305688001,\"dir\":20241005,\"project\":1,\"rows\":[{\"hash\":\"1\",\"url\":\"https:\\/\\/www.google.de\\/search?q=ingram+dd+srebrenik&as_rights=&num=100&start=0&pws=0&hl=de&near=Deutschland&uule=w+CAIQICIHR2VybWFueQ&gws_rd=cr&gl=DE&glp=1\"},{\"hash\":\"2\",\"url\":\"https:\\/\\/www.google.de\\/search?q=ingram+digital+group&as_rights=&num=100&start=0&pws=0&hl=de&near=Deutschland&uule=w+CAIQICIHR2VybWFueQ&gws_rd=cr&gl=DE&glp=1\"},{\"hash\":\"3\",\"url\":\"https:\\/\\/www.google.de\\/search?q=ingram+djs+delight&as_rights=&num=100&start=0&pws=0&hl=de&near=Deutschland&uule=w+CAIQICIHR2VybWFueQ&gws_rd=cr&gl=DE&glp=1\"},{\"hash\":\"4\",\"url\":\"https:\\/\\/www.google.de\\/search?q=ingram+digital+ebook+collection&as_rights=&num=100&start=0&pws=0&hl=de&near=Deutschland&uule=w+CAIQICIHR2VybWFueQ&gws_rd=cr&gl=DE&glp=1\"},{\"hash\":\"5\",\"url\":\"https:\\/\\/www.google.de\\/search?q=ingram+dubai&as_rights=&num=100&start=0&pws=0&hl=de&near=Deutschland&uule=w+CAIQICIHR2VybWFueQ&gws_rd=cr&gl=DE&glp=1\"}],\"schedule\":{\"minute\":\"06,38\",\"hour\":\"*\",\"dom\":\"*\",\"month\":\"*\",\"dow\":\"*\"},\"globals\":{\"useragent\":\"Mozilla\\/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/67.0.3396.87 Safari\\/537.36\",\"method\":\"GET\",\"options\":{\"headers\":{\"Accept-Language\":\"en-US,en;q=0.9\",\"Accept-Charset\":\"UTF-8\"}},\"call_user_func\":{\"preg_replace\":[\"@<script[^>]*>.*?<\\/script>|<style[^>]*>.*?<\\/style>@i\",\" \",\"_BODY_\"],\"base64_encode\":[\"_BODY_\"]}},\"pkgSentTime\":1728099481,\"data\":[],\"pkgStartTime\":1728099481}'),('size_count_type','block'),('soa_serial_format','YYYYMMDDNN'),('stats_begin_time','1726122390'),('upgrader_config_continue_from',''),('upgrader_config_current_timestamp','20240814180000'),('upgrader_config_failed_actions_list',''),('upgrader_config_latest_timestamp','20240814180000'),('version','018000000'),('weekly_maintenance_last_run_date','2024-09-29T06:47:01+00:00'),('ws-token','spohOJQDlufkd1IlBuB61KmaG5P119XrBRRi5FA/3IY=');
/*!40000 ALTER TABLE `misc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mn_param`
--

DROP TABLE IF EXISTS `mn_param`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mn_param` (
  `mn_id` int(10) unsigned NOT NULL DEFAULT 0,
  `param` varchar(245) NOT NULL,
  `val` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`mn_id`,`param`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mn_param`
--

LOCK TABLES `mn_param` WRITE;
/*!40000 ALTER TABLE `mn_param` DISABLE KEYS */;
/*!40000 ALTER TABLE `mn_param` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_secrets`
--

DROP TABLE IF EXISTS `password_secrets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_secrets` (
  `secret` varchar(255) NOT NULL,
  `type` int(10) unsigned NOT NULL,
  `id` int(10) unsigned NOT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`secret`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_secrets`
--

LOCK TABLES `password_secrets` WRITE;
/*!40000 ALTER TABLE `password_secrets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_secrets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pd_users`
--

DROP TABLE IF EXISTS `pd_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pd_users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `login` varchar(32) NOT NULL,
  `account_id` int(10) unsigned NOT NULL DEFAULT 0,
  `pd_id` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pd_id` (`pd_id`,`login`),
  KEY `account_id` (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pd_users`
--

LOCK TABLES `pd_users` WRITE;
/*!40000 ALTER TABLE `pd_users` DISABLE KEYS */;
INSERT INTO `pd_users` VALUES (1,'y5ek633qcts',2,1);
/*!40000 ALTER TABLE `pd_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `protected_dirs`
--

DROP TABLE IF EXISTS `protected_dirs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `protected_dirs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `non_ssl` enum('false','true') NOT NULL DEFAULT 'false',
  `ssl` enum('false','true') NOT NULL DEFAULT 'false',
  `realm` varchar(255) DEFAULT NULL,
  `path` varchar(245) NOT NULL,
  `dom_id` int(10) unsigned NOT NULL DEFAULT 0,
  `dom_type` enum('domain','subdomain') NOT NULL DEFAULT 'domain',
  `cgi_bin` enum('false','true') NOT NULL DEFAULT 'false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `dom_id` (`dom_id`,`path`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `protected_dirs`
--

LOCK TABLES `protected_dirs` WRITE;
/*!40000 ALTER TABLE `protected_dirs` DISABLE KEYS */;
INSERT INTO `protected_dirs` VALUES (1,'true','false','Domain statistics','plesk-stat',1,'domain','false');
/*!40000 ALTER TABLE `protected_dirs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report`
--

DROP TABLE IF EXISTS `report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `report` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` int(10) unsigned NOT NULL DEFAULT 0,
  `user_id` int(10) unsigned NOT NULL DEFAULT 0,
  `user_type` int(10) unsigned NOT NULL DEFAULT 0,
  `name` varchar(255) DEFAULT NULL,
  `is_default` enum('false','true') NOT NULL DEFAULT 'false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report`
--

LOCK TABLES `report` WRITE;
/*!40000 ALTER TABLE `report` DISABLE KEYS */;
/*!40000 ALTER TABLE `report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_auto`
--

DROP TABLE IF EXISTS `report_auto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `report_auto` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `report_id` int(10) unsigned NOT NULL DEFAULT 0,
  `auto` int(10) unsigned NOT NULL DEFAULT 0,
  `last` datetime DEFAULT NULL,
  `recipient` int(10) unsigned NOT NULL DEFAULT 0,
  `email` varchar(254) NOT NULL,
  `client` int(10) unsigned DEFAULT 0,
  `domain` int(10) unsigned DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `report_id` (`report_id`),
  KEY `client` (`client`),
  KEY `domain` (`domain`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_auto`
--

LOCK TABLES `report_auto` WRITE;
/*!40000 ALTER TABLE `report_auto` DISABLE KEYS */;
/*!40000 ALTER TABLE `report_auto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_section`
--

DROP TABLE IF EXISTS `report_section`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `report_section` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `report_id` int(10) unsigned NOT NULL DEFAULT 0,
  `name` varchar(255) NOT NULL,
  `type` enum('none','summary','full') NOT NULL DEFAULT 'summary',
  PRIMARY KEY (`id`),
  KEY `report_id` (`report_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_section`
--

LOCK TABLES `report_section` WRITE;
/*!40000 ALTER TABLE `report_section` DISABLE KEYS */;
/*!40000 ALTER TABLE `report_section` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resp_attach`
--

DROP TABLE IF EXISTS `resp_attach`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `resp_attach` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rn_id` int(10) unsigned NOT NULL DEFAULT 0,
  `filename` varchar(245) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rn_id` (`rn_id`,`filename`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resp_attach`
--

LOCK TABLES `resp_attach` WRITE;
/*!40000 ALTER TABLE `resp_attach` DISABLE KEYS */;
/*!40000 ALTER TABLE `resp_attach` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resp_forward`
--

DROP TABLE IF EXISTS `resp_forward`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `resp_forward` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rn_id` int(10) unsigned NOT NULL DEFAULT 0,
  `address` varchar(245) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resp_forward`
--

LOCK TABLES `resp_forward` WRITE;
/*!40000 ALTER TABLE `resp_forward` DISABLE KEYS */;
/*!40000 ALTER TABLE `resp_forward` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resp_freq`
--

DROP TABLE IF EXISTS `resp_freq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `resp_freq` (
  `time_resp` timestamp NOT NULL DEFAULT current_timestamp(),
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rn_id` int(10) unsigned NOT NULL DEFAULT 0,
  `email` varchar(245) NOT NULL,
  `num` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rn_id` (`rn_id`,`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resp_freq`
--

LOCK TABLES `resp_freq` WRITE;
/*!40000 ALTER TABLE `resp_freq` DISABLE KEYS */;
/*!40000 ALTER TABLE `resp_freq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `secret_keys`
--

DROP TABLE IF EXISTS `secret_keys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `secret_keys` (
  `key_id` varchar(255) NOT NULL,
  `ip_address` varchar(39) NOT NULL,
  `description` varchar(255) NOT NULL,
  `client_id` int(10) unsigned DEFAULT NULL,
  `lookup_id` varchar(255) DEFAULT NULL,
  KEY `key_id` (`key_id`),
  KEY `client_id` (`client_id`),
  KEY `lookup_id` (`lookup_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `secret_keys`
--

LOCK TABLES `secret_keys` WRITE;
/*!40000 ALTER TABLE `secret_keys` DISABLE KEYS */;
/*!40000 ALTER TABLE `secret_keys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `sess_id` varchar(33) NOT NULL,
  `type` smallint(5) unsigned NOT NULL DEFAULT 0,
  `login` varchar(255) DEFAULT NULL,
  `ip_address` varchar(39) DEFAULT NULL,
  `ip_dual_stack` varchar(39) DEFAULT NULL,
  `login_time` int(10) unsigned DEFAULT NULL,
  `modified` int(10) unsigned DEFAULT NULL,
  `lifetime` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`sess_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('982b005e66b6d4893cbf4b51db21b566',1,'admin','103.250.149.43',NULL,1728099899,1728104848,10800);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_apsBundleFilterItems`
--

DROP TABLE IF EXISTS `smb_apsBundleFilterItems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_apsBundleFilterItems` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `filterId` int(10) unsigned NOT NULL DEFAULT 0,
  `propertyName` varchar(255) DEFAULT NULL,
  `propertyValue` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `filterId_idx` (`filterId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_apsBundleFilterItems`
--

LOCK TABLES `smb_apsBundleFilterItems` WRITE;
/*!40000 ALTER TABLE `smb_apsBundleFilterItems` DISABLE KEYS */;
/*!40000 ALTER TABLE `smb_apsBundleFilterItems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_apsBundleFilters`
--

DROP TABLE IF EXISTS `smb_apsBundleFilters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_apsBundleFilters` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('white','black') NOT NULL DEFAULT 'black',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_apsBundleFilters`
--

LOCK TABLES `smb_apsBundleFilters` WRITE;
/*!40000 ALTER TABLE `smb_apsBundleFilters` DISABLE KEYS */;
/*!40000 ALTER TABLE `smb_apsBundleFilters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_apsCategories`
--

DROP TABLE IF EXISTS `smb_apsCategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_apsCategories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_apsCategories`
--

LOCK TABLES `smb_apsCategories` WRITE;
/*!40000 ALTER TABLE `smb_apsCategories` DISABLE KEYS */;
/*!40000 ALTER TABLE `smb_apsCategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_apsContexts`
--

DROP TABLE IF EXISTS `smb_apsContexts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_apsContexts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contextType` int(11) DEFAULT 0,
  `packageId` int(11) NOT NULL,
  `requirementContextClass` varchar(255) DEFAULT NULL,
  `requirementContextId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_apsContexts`
--

LOCK TABLES `smb_apsContexts` WRITE;
/*!40000 ALTER TABLE `smb_apsContexts` DISABLE KEYS */;
/*!40000 ALTER TABLE `smb_apsContexts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_apsInstanceErrors`
--

DROP TABLE IF EXISTS `smb_apsInstanceErrors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_apsInstanceErrors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `instanceId` int(11) NOT NULL,
  `creationDate` varchar(25) NOT NULL,
  `text` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_apsInstanceErrors`
--

LOCK TABLES `smb_apsInstanceErrors` WRITE;
/*!40000 ALTER TABLE `smb_apsInstanceErrors` DISABLE KEYS */;
/*!40000 ALTER TABLE `smb_apsInstanceErrors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_apsInstances`
--

DROP TABLE IF EXISTS `smb_apsInstances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_apsInstances` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parentContextId` int(11) NOT NULL,
  `contextId` int(11) NOT NULL,
  `metaId` int(11) NOT NULL,
  `uuid` varchar(255) DEFAULT NULL,
  `registryResourceId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_apsInstances`
--

LOCK TABLES `smb_apsInstances` WRITE;
/*!40000 ALTER TABLE `smb_apsInstances` DISABLE KEYS */;
/*!40000 ALTER TABLE `smb_apsInstances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_apsMetas`
--

DROP TABLE IF EXISTS `smb_apsMetas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_apsMetas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `serviceId` varchar(255) DEFAULT NULL,
  `xpath` varchar(255) DEFAULT NULL,
  `class` varchar(255) DEFAULT NULL,
  `contextId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_apsMetas`
--

LOCK TABLES `smb_apsMetas` WRITE;
/*!40000 ALTER TABLE `smb_apsMetas` DISABLE KEYS */;
/*!40000 ALTER TABLE `smb_apsMetas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_apsPackageUpdates`
--

DROP TABLE IF EXISTS `smb_apsPackageUpdates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_apsPackageUpdates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `packageId` int(11) NOT NULL,
  `updatePackageId` int(11) DEFAULT NULL,
  `catalog` varchar(255) DEFAULT NULL,
  `version` varchar(255) DEFAULT NULL,
  `release` varchar(255) DEFAULT NULL,
  `packager` varchar(255) DEFAULT NULL,
  `severity` varchar(255) DEFAULT NULL,
  `level` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_apsPackageUpdates`
--

LOCK TABLES `smb_apsPackageUpdates` WRITE;
/*!40000 ALTER TABLE `smb_apsPackageUpdates` DISABLE KEYS */;
/*!40000 ALTER TABLE `smb_apsPackageUpdates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_apsPackages`
--

DROP TABLE IF EXISTS `smb_apsPackages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_apsPackages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `version` varchar(255) DEFAULT NULL,
  `release` varchar(255) DEFAULT NULL,
  `vendor` varchar(255) DEFAULT NULL,
  `vendorHomePage` varchar(255) DEFAULT NULL,
  `packager` varchar(255) DEFAULT NULL,
  `packagerHomePage` varchar(255) DEFAULT NULL,
  `cacheId` varchar(255) NOT NULL,
  `installed` varchar(26) DEFAULT NULL,
  `isUploaded` int(11) DEFAULT 0,
  `isVisible` int(11) DEFAULT 0,
  `globalSettingsNotSet` int(11) DEFAULT 0,
  `registryUid` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cacheId` (`cacheId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_apsPackages`
--

LOCK TABLES `smb_apsPackages` WRITE;
/*!40000 ALTER TABLE `smb_apsPackages` DISABLE KEYS */;
/*!40000 ALTER TABLE `smb_apsPackages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_apsPackagesCategories`
--

DROP TABLE IF EXISTS `smb_apsPackagesCategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_apsPackagesCategories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categoryId` int(11) DEFAULT NULL,
  `packageId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `categoryId_idx` (`categoryId`),
  KEY `packageId_idx` (`packageId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_apsPackagesCategories`
--

LOCK TABLES `smb_apsPackagesCategories` WRITE;
/*!40000 ALTER TABLE `smb_apsPackagesCategories` DISABLE KEYS */;
/*!40000 ALTER TABLE `smb_apsPackagesCategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_apsProvisionEnvironments`
--

DROP TABLE IF EXISTS `smb_apsProvisionEnvironments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_apsProvisionEnvironments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `provisionId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_apsProvisionEnvironments`
--

LOCK TABLES `smb_apsProvisionEnvironments` WRITE;
/*!40000 ALTER TABLE `smb_apsProvisionEnvironments` DISABLE KEYS */;
/*!40000 ALTER TABLE `smb_apsProvisionEnvironments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_apsProvisions`
--

DROP TABLE IF EXISTS `smb_apsProvisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_apsProvisions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `class` varchar(255) NOT NULL,
  `contextId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_apsProvisions`
--

LOCK TABLES `smb_apsProvisions` WRITE;
/*!40000 ALTER TABLE `smb_apsProvisions` DISABLE KEYS */;
/*!40000 ALTER TABLE `smb_apsProvisions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_apsResourceParameters`
--

DROP TABLE IF EXISTS `smb_apsResourceParameters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_apsResourceParameters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `resourceId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_apsResourceParameters`
--

LOCK TABLES `smb_apsResourceParameters` WRITE;
/*!40000 ALTER TABLE `smb_apsResourceParameters` DISABLE KEYS */;
/*!40000 ALTER TABLE `smb_apsResourceParameters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_apsResources`
--

DROP TABLE IF EXISTS `smb_apsResources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_apsResources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `class` varchar(255) NOT NULL,
  `contextId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_apsResources`
--

LOCK TABLES `smb_apsResources` WRITE;
/*!40000 ALTER TABLE `smb_apsResources` DISABLE KEYS */;
/*!40000 ALTER TABLE `smb_apsResources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_apsSettings`
--

DROP TABLE IF EXISTS `smb_apsSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_apsSettings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  `contextId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_apsSettings`
--

LOCK TABLES `smb_apsSettings` WRITE;
/*!40000 ALTER TABLE `smb_apsSettings` DISABLE KEYS */;
/*!40000 ALTER TABLE `smb_apsSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_componentUpdates`
--

DROP TABLE IF EXISTS `smb_componentUpdates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_componentUpdates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `componentName` varchar(255) DEFAULT NULL,
  `version` varchar(255) DEFAULT NULL,
  `build` varchar(255) DEFAULT NULL,
  `shown` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_componentUpdates`
--

LOCK TABLES `smb_componentUpdates` WRITE;
/*!40000 ALTER TABLE `smb_componentUpdates` DISABLE KEYS */;
/*!40000 ALTER TABLE `smb_componentUpdates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_generalPermissions`
--

DROP TABLE IF EXISTS `smb_generalPermissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_generalPermissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_generalPermissions`
--

LOCK TABLES `smb_generalPermissions` WRITE;
/*!40000 ALTER TABLE `smb_generalPermissions` DISABLE KEYS */;
INSERT INTO `smb_generalPermissions` VALUES (1,'userManagement'),(2,'webSitesAndDomainsManagement'),(3,'logRotationManagement'),(4,'anonymousFtpManagement'),(5,'scheduledTasksManagement'),(6,'spamfilterManagement'),(7,'antivirusManagement'),(8,'databasesManagement'),(9,'backupRestoreManagement'),(10,'browseStats'),(11,'applicationsManagement'),(12,'sitebuilderManagement'),(13,'filesManagement'),(14,'ftpAccountsManagement'),(15,'dnsManagement'),(17,'mailManagement'),(18,'mailListsManagement');
/*!40000 ALTER TABLE `smb_generalPermissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_locales`
--

DROP TABLE IF EXISTS `smb_locales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_locales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `isActive` int(11) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_locales`
--

LOCK TABLES `smb_locales` WRITE;
/*!40000 ALTER TABLE `smb_locales` DISABLE KEYS */;
INSERT INTO `smb_locales` VALUES (1,'en-US','ENGLISH (United States)',1);
/*!40000 ALTER TABLE `smb_locales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_productUpgrades`
--

DROP TABLE IF EXISTS `smb_productUpgrades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_productUpgrades` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `releaseId` varchar(255) DEFAULT NULL,
  `version` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `shown` int(11) DEFAULT 0,
  `codename` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_productUpgrades`
--

LOCK TABLES `smb_productUpgrades` WRITE;
/*!40000 ALTER TABLE `smb_productUpgrades` DISABLE KEYS */;
/*!40000 ALTER TABLE `smb_productUpgrades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_roleGeneralPermissions`
--

DROP TABLE IF EXISTS `smb_roleGeneralPermissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_roleGeneralPermissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleId` int(11) NOT NULL,
  `generalPermissionId` int(11) NOT NULL,
  `isAllowed` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `roleId_idx` (`roleId`)
) ENGINE=InnoDB AUTO_INCREMENT=135 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_roleGeneralPermissions`
--

LOCK TABLES `smb_roleGeneralPermissions` WRITE;
/*!40000 ALTER TABLE `smb_roleGeneralPermissions` DISABLE KEYS */;
INSERT INTO `smb_roleGeneralPermissions` VALUES (101,1,1,1),(102,1,2,1),(103,1,3,1),(104,1,4,1),(105,1,5,1),(106,1,6,1),(107,1,7,1),(108,1,8,1),(109,1,9,1),(110,1,10,1),(111,1,11,1),(112,1,12,1),(113,1,13,1),(114,1,14,1),(115,1,15,1),(117,1,17,1),(118,1,18,1),(119,2,2,1),(120,2,3,1),(121,2,4,1),(122,2,5,1),(123,2,6,1),(124,2,7,1),(125,2,8,1),(126,2,9,1),(127,2,10,1),(128,2,11,1),(129,2,12,1),(130,2,13,1),(131,2,14,1),(132,2,15,1),(133,2,17,1),(134,2,18,1);
/*!40000 ALTER TABLE `smb_roleGeneralPermissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_roleServicePermissions`
--

DROP TABLE IF EXISTS `smb_roleServicePermissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_roleServicePermissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleId` int(11) NOT NULL,
  `servicePermissionId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_roleServicePermissions`
--

LOCK TABLES `smb_roleServicePermissions` WRITE;
/*!40000 ALTER TABLE `smb_roleServicePermissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `smb_roleServicePermissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_roles`
--

DROP TABLE IF EXISTS `smb_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `isBuiltIn` int(11) DEFAULT 0,
  `ownerId` int(11) DEFAULT NULL,
  `isActivationRequired` int(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `ownerId_idx` (`ownerId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_roles`
--

LOCK TABLES `smb_roles` WRITE;
/*!40000 ALTER TABLE `smb_roles` DISABLE KEYS */;
INSERT INTO `smb_roles` VALUES (1,'Admin',1,1,0),(2,'WebMaster',0,1,0),(3,'Application User',0,1,0),(4,'Accountant',1,1,0);
/*!40000 ALTER TABLE `smb_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_serviceEntryPoints`
--

DROP TABLE IF EXISTS `smb_serviceEntryPoints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_serviceEntryPoints` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `servicePermissionId` int(11) NOT NULL,
  `externalId` varchar(255) DEFAULT NULL,
  `label` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `redirectUrl` varchar(255) DEFAULT NULL,
  `hidden` int(11) DEFAULT 0,
  `http` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_serviceEntryPoints`
--

LOCK TABLES `smb_serviceEntryPoints` WRITE;
/*!40000 ALTER TABLE `smb_serviceEntryPoints` DISABLE KEYS */;
/*!40000 ALTER TABLE `smb_serviceEntryPoints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_serviceInstances`
--

DROP TABLE IF EXISTS `smb_serviceInstances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_serviceInstances` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `serviceProviderId` int(11) NOT NULL,
  `externalId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_serviceInstances`
--

LOCK TABLES `smb_serviceInstances` WRITE;
/*!40000 ALTER TABLE `smb_serviceInstances` DISABLE KEYS */;
/*!40000 ALTER TABLE `smb_serviceInstances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_servicePermissionAccounts`
--

DROP TABLE IF EXISTS `smb_servicePermissionAccounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_servicePermissionAccounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `servicePermissionId` int(11) NOT NULL,
  `externalId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_servicePermissionAccounts`
--

LOCK TABLES `smb_servicePermissionAccounts` WRITE;
/*!40000 ALTER TABLE `smb_servicePermissionAccounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `smb_servicePermissionAccounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_servicePermissions`
--

DROP TABLE IF EXISTS `smb_servicePermissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_servicePermissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `serviceInstanceId` int(11) NOT NULL,
  `serviceProviderId` int(11) NOT NULL,
  `permissionCode` varchar(255) DEFAULT NULL,
  `class` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_servicePermissions`
--

LOCK TABLES `smb_servicePermissions` WRITE;
/*!40000 ALTER TABLE `smb_servicePermissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `smb_servicePermissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_serviceProviders`
--

DROP TABLE IF EXISTS `smb_serviceProviders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_serviceProviders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classname` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_serviceProviders`
--

LOCK TABLES `smb_serviceProviders` WRITE;
/*!40000 ALTER TABLE `smb_serviceProviders` DISABLE KEYS */;
INSERT INTO `smb_serviceProviders` VALUES (1,'Smb_Service_Provider_Aps');
/*!40000 ALTER TABLE `smb_serviceProviders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_settings`
--

DROP TABLE IF EXISTS `smb_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `value` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_settings`
--

LOCK TABLES `smb_settings` WRITE;
/*!40000 ALTER TABLE `smb_settings` DISABLE KEYS */;
INSERT INTO `smb_settings` VALUES (1,'locale','en-US'),(3,'product-logo',''),(4,'product-logo-url','http://www.parallels.com'),(5,'mailNonExistPolicy','discard'),(6,'mailBounceMessage','This address no longer accepts mail.'),(7,'mailForwardAddress',''),(8,'mailRedirectIp',''),(9,'mailMaxLetterSize','10000'),(10,'mailCheckForViruses','false'),(11,'mailWebmail',''),(24,'automaticUpdates','true'),(25,'spamAction','text'),(26,'spamActionText','***SPAM***');
/*!40000 ALTER TABLE `smb_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_userServicePermissions`
--

DROP TABLE IF EXISTS `smb_userServicePermissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_userServicePermissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `servicePermissionId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_userServicePermissions`
--

LOCK TABLES `smb_userServicePermissions` WRITE;
/*!40000 ALTER TABLE `smb_userServicePermissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `smb_userServicePermissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smb_users`
--

DROP TABLE IF EXISTS `smb_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smb_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `contactName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `companyName` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `fax` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zip` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `creationDate` varchar(25) NOT NULL,
  `isBuiltIn` int(11) DEFAULT 0,
  `isDomainAdmin` int(11) DEFAULT 0,
  `roleId` int(11) NOT NULL,
  `uuid` varchar(36) NOT NULL,
  `isLocked` int(11) DEFAULT 0,
  `externalId` varchar(255) DEFAULT NULL,
  `ownerId` int(11) DEFAULT NULL,
  `additionalInfo` text DEFAULT NULL,
  `imNumber` varchar(255) DEFAULT NULL,
  `imType` int(11) DEFAULT NULL,
  `isLegacyUser` int(11) DEFAULT 0,
  `subscriptionDomainId` int(11) DEFAULT 0,
  `locale` varchar(17) DEFAULT NULL,
  `externalEmail` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `login` (`login`),
  KEY `subscriptionDomainId_idx` (`subscriptionDomainId`),
  KEY `isBuiltIn_idx` (`isBuiltIn`),
  KEY `ownerId_idx` (`ownerId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smb_users`
--

LOCK TABLES `smb_users` WRITE;
/*!40000 ALTER TABLE `smb_users` DISABLE KEYS */;
INSERT INTO `smb_users` VALUES (1,'admin','','Administrator','cyber-media@gmx.net',NULL,NULL,NULL,NULL,NULL,'','','XX','2024-09-11T10:33:51+00:00',1,0,1,'03f656bc-75e6-738c-62e1-1bc4d1db04fb',0,NULL,1,NULL,NULL,NULL,0,0,'en-US','cyber-media@gmx.net');
/*!40000 ALTER TABLE `smb_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smtp_poplocks`
--

DROP TABLE IF EXISTS `smtp_poplocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smtp_poplocks` (
  `ip_address` varchar(39) NOT NULL,
  `ip_mask` int(10) unsigned NOT NULL DEFAULT 32,
  `lock_time` datetime DEFAULT NULL,
  `serviceNodeId` int(10) unsigned NOT NULL DEFAULT 1,
  KEY `ip_address` (`ip_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smtp_poplocks`
--

LOCK TABLES `smtp_poplocks` WRITE;
/*!40000 ALTER TABLE `smtp_poplocks` DISABLE KEYS */;
/*!40000 ALTER TABLE `smtp_poplocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `spamfilter`
--

DROP TABLE IF EXISTS `spamfilter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `spamfilter` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(128) NOT NULL,
  `serviceNodeId` int(10) unsigned NOT NULL DEFAULT 1,
  `preferences` enum('false','true') NOT NULL DEFAULT 'false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `spamfilter_username_serviceNodeId` (`username`,`serviceNodeId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spamfilter`
--

LOCK TABLES `spamfilter` WRITE;
/*!40000 ALTER TABLE `spamfilter` DISABLE KEYS */;
INSERT INTO `spamfilter` VALUES (1,'*@*',1,'true');
/*!40000 ALTER TABLE `spamfilter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `spamfilter_preferences`
--

DROP TABLE IF EXISTS `spamfilter_preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `spamfilter_preferences` (
  `prefid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `spamfilter_id` int(10) unsigned NOT NULL,
  `preference` varchar(30) NOT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`prefid`),
  KEY `spamfilter_id` (`spamfilter_id`,`preference`,`value`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spamfilter_preferences`
--

LOCK TABLES `spamfilter_preferences` WRITE;
/*!40000 ALTER TABLE `spamfilter_preferences` DISABLE KEYS */;
INSERT INTO `spamfilter_preferences` VALUES (1,1,'required_score','7.00'),(2,1,'rewrite_header','subject *****SPAM*****');
/*!40000 ALTER TABLE `spamfilter_preferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stat`
--

DROP TABLE IF EXISTS `stat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stat` (
  `dom_id` int(10) unsigned NOT NULL DEFAULT 0,
  `date` date NOT NULL DEFAULT '1970-01-01',
  `transfer` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`dom_id`,`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stat`
--

LOCK TABLES `stat` WRITE;
/*!40000 ALTER TABLE `stat` DISABLE KEYS */;
/*!40000 ALTER TABLE `stat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subdomains`
--

DROP TABLE IF EXISTS `subdomains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subdomains` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `dom_id` int(10) unsigned NOT NULL DEFAULT 0,
  `name` varchar(255) NOT NULL,
  `displayName` varchar(255) NOT NULL,
  `sys_user_id` int(10) unsigned NOT NULL DEFAULT 0,
  `ssi` enum('false','true') NOT NULL DEFAULT 'false',
  `php` enum('false','true') NOT NULL DEFAULT 'false',
  `php_handler_type` enum('cgi','fastcgi','module','isapi') NOT NULL DEFAULT 'module',
  `cgi` enum('false','true') NOT NULL DEFAULT 'false',
  `perl` enum('false','true') NOT NULL DEFAULT 'false',
  `python` enum('false','true') NOT NULL DEFAULT 'false',
  `coldfusion` enum('false','true') NOT NULL DEFAULT 'false',
  `asp` enum('false','true') NOT NULL DEFAULT 'false',
  `asp_dot_net` enum('false','true') NOT NULL DEFAULT 'false',
  `ssl` enum('false','true') NOT NULL DEFAULT 'false',
  `www_root` varchar(255) NOT NULL DEFAULT 'httpdocs',
  `maintenance_mode` enum('false','true') NOT NULL DEFAULT 'false',
  `certificate_id` int(10) unsigned DEFAULT 0,
  `fastcgi` enum('false','true') NOT NULL DEFAULT 'false',
  `same_ssl` enum('false','true') NOT NULL DEFAULT 'true',
  PRIMARY KEY (`id`),
  UNIQUE KEY `dom_id` (`dom_id`,`name`),
  KEY `dom_id_displayName` (`dom_id`,`displayName`),
  KEY `sys_user_id` (`sys_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subdomains`
--

LOCK TABLES `subdomains` WRITE;
/*!40000 ALTER TABLE `subdomains` DISABLE KEYS */;
/*!40000 ALTER TABLE `subdomains` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suspend_handler_history`
--

DROP TABLE IF EXISTS `suspend_handler_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `suspend_handler_history` (
  `dom_id` int(10) unsigned NOT NULL,
  `session_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suspend_handler_history`
--

LOCK TABLES `suspend_handler_history` WRITE;
/*!40000 ALTER TABLE `suspend_handler_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `suspend_handler_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_users`
--

DROP TABLE IF EXISTS `sys_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `serviceNodeId` int(10) unsigned NOT NULL DEFAULT 0,
  `login` varchar(32) NOT NULL,
  `account_id` int(10) unsigned NOT NULL DEFAULT 0,
  `home` varchar(255) NOT NULL,
  `shell` varchar(255) NOT NULL,
  `quota` bigint(20) unsigned NOT NULL DEFAULT 0,
  `mapped_to` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`serviceNodeId`,`login`),
  KEY `account_id` (`account_id`),
  KEY `mapped_to` (`mapped_to`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_users`
--

LOCK TABLES `sys_users` WRITE;
/*!40000 ALTER TABLE `sys_users` DISABLE KEYS */;
INSERT INTO `sys_users` VALUES (1,1,'y5ek633qcts',1,'/var/www/vhosts/fetishmegastore.com','/bin/false',0,NULL);
/*!40000 ALTER TABLE `sys_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `upgrade_history`
--

DROP TABLE IF EXISTS `upgrade_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `upgrade_history` (
  `upgrade_date` datetime NOT NULL DEFAULT '1970-01-01 00:00:00',
  `version_info` varchar(50) DEFAULT NULL,
  `db_version` varchar(50) DEFAULT NULL,
  `os` varchar(255) DEFAULT NULL,
  `mu` varchar(255) DEFAULT NULL,
  `update_ticket` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`upgrade_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `upgrade_history`
--

LOCK TABLES `upgrade_history` WRITE;
/*!40000 ALTER TABLE `upgrade_history` DISABLE KEYS */;
INSERT INTO `upgrade_history` VALUES ('2024-09-11 10:34:09','18.0.63',NULL,'Ubuntu 22.04','4',''),('2024-09-23 11:17:57','18.0.64',NULL,'Ubuntu 22.04','0','873f02a8-71b0-42b5-b5bb-d906e744a81c');
/*!40000 ALTER TABLE `upgrade_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `web_users`
--

DROP TABLE IF EXISTS `web_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `web_users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `dom_id` int(10) unsigned NOT NULL DEFAULT 0,
  `sys_user_id` int(10) unsigned NOT NULL DEFAULT 0,
  `ssi` enum('false','true') NOT NULL DEFAULT 'false',
  `ssi_html` enum('false','true') NOT NULL DEFAULT 'false',
  `php` enum('false','true') NOT NULL DEFAULT 'false',
  `php_isapi` enum('false','true') NOT NULL DEFAULT 'false',
  `cgi` enum('false','true') NOT NULL DEFAULT 'false',
  `perl` enum('false','true') NOT NULL DEFAULT 'false',
  `python` enum('false','true') NOT NULL DEFAULT 'false',
  `asp` enum('false','true') NOT NULL DEFAULT 'false',
  `asp_dot_net` enum('false','true') NOT NULL DEFAULT 'false',
  `managed_runtime_version` varchar(255) NOT NULL DEFAULT '1.1',
  `write_modify` varchar(255) DEFAULT NULL,
  `fastcgi` enum('false','true') NOT NULL DEFAULT 'false',
  PRIMARY KEY (`id`),
  UNIQUE KEY `sys_user_id` (`sys_user_id`),
  KEY `dom_id` (`dom_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `web_users`
--

LOCK TABLES `web_users` WRITE;
/*!40000 ALTER TABLE `web_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `web_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `webalizer_group_referrer`
--

DROP TABLE IF EXISTS `webalizer_group_referrer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `webalizer_group_referrer` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `dom_id` int(10) unsigned NOT NULL,
  `group_name` varchar(255) NOT NULL,
  `referrer` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `dom_id` (`dom_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `webalizer_group_referrer`
--

LOCK TABLES `webalizer_group_referrer` WRITE;
/*!40000 ALTER TABLE `webalizer_group_referrer` DISABLE KEYS */;
/*!40000 ALTER TABLE `webalizer_group_referrer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `webalizer_hidden_referrer`
--

DROP TABLE IF EXISTS `webalizer_hidden_referrer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `webalizer_hidden_referrer` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `dom_id` int(10) unsigned NOT NULL,
  `referrer` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `dom_id` (`dom_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `webalizer_hidden_referrer`
--

LOCK TABLES `webalizer_hidden_referrer` WRITE;
/*!40000 ALTER TABLE `webalizer_hidden_referrer` DISABLE KEYS */;
/*!40000 ALTER TABLE `webalizer_hidden_referrer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Current Database: `apsc`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `apsc` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `apsc`;

--
-- Table structure for table `aps_application`
--

DROP TABLE IF EXISTS `aps_application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aps_application` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `registry_object_id` int(10) unsigned NOT NULL,
  `master_app_id` int(10) unsigned DEFAULT NULL,
  `package_config_id` int(10) unsigned NOT NULL,
  `package_id` int(10) unsigned NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_aps_application_aps_package` (`package_id`),
  KEY `FK_aps_application_aps_package_configuration` (`package_config_id`),
  KEY `FK_aps_application_aps_registry_object` (`registry_object_id`),
  CONSTRAINT `FK_aps_application_aps_package` FOREIGN KEY (`package_id`) REFERENCES `aps_package` (`id`),
  CONSTRAINT `FK_aps_application_aps_package_configuration` FOREIGN KEY (`package_config_id`) REFERENCES `aps_package_configuration` (`id`),
  CONSTRAINT `FK_aps_application_aps_registry_object` FOREIGN KEY (`registry_object_id`) REFERENCES `aps_registry_object` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aps_application`
--

LOCK TABLES `aps_application` WRITE;
/*!40000 ALTER TABLE `aps_application` DISABLE KEYS */;
/*!40000 ALTER TABLE `aps_application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aps_application_backup`
--

DROP TABLE IF EXISTS `aps_application_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aps_application_backup` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `registry_object_id` int(10) unsigned NOT NULL,
  `app_uid` char(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `package_id` int(10) unsigned NOT NULL,
  `ext_backup_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_aps_application_backup_aps_package` (`package_id`),
  KEY `FK_aps_application_backup_aps_registry_object` (`registry_object_id`),
  CONSTRAINT `FK_aps_application_backup_aps_package` FOREIGN KEY (`package_id`) REFERENCES `aps_package` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_aps_application_backup_aps_registry_object` FOREIGN KEY (`registry_object_id`) REFERENCES `aps_registry_object` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aps_application_backup`
--

LOCK TABLES `aps_application_backup` WRITE;
/*!40000 ALTER TABLE `aps_application_backup` DISABLE KEYS */;
/*!40000 ALTER TABLE `aps_application_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aps_log_param`
--

DROP TABLE IF EXISTS `aps_log_param`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aps_log_param` (
  `resource_log_id` int(10) unsigned NOT NULL,
  `name` varchar(64) NOT NULL,
  `value` varchar(4000) NOT NULL,
  PRIMARY KEY (`resource_log_id`,`name`),
  CONSTRAINT `FK_aps_log_param_resource_log_id` FOREIGN KEY (`resource_log_id`) REFERENCES `aps_resource_log` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aps_log_param`
--

LOCK TABLES `aps_log_param` WRITE;
/*!40000 ALTER TABLE `aps_log_param` DISABLE KEYS */;
/*!40000 ALTER TABLE `aps_log_param` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aps_package`
--

DROP TABLE IF EXISTS `aps_package`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aps_package` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `registry_object_id` int(10) unsigned NOT NULL,
  `series_id` int(10) unsigned NOT NULL,
  `master_series_id` int(10) unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `version` varchar(16) NOT NULL,
  `archive_uri` varchar(255) NOT NULL,
  `metafile_uri` varchar(255) NOT NULL,
  `source_uri` varchar(255) DEFAULT NULL,
  `is_addon` char(1) NOT NULL DEFAULT 'n',
  `master_match` varchar(255) NOT NULL DEFAULT '',
  `master_package_id` varchar(255) NOT NULL DEFAULT '',
  `release` varchar(16) NOT NULL,
  `content_root_uri` varchar(255) NOT NULL,
  `spec_version` varchar(16) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IX_aps_package_series_version` (`series_id`,`version`,`release`),
  KEY `FK_aps_package_aps_registry_object` (`registry_object_id`),
  CONSTRAINT `FK_aps_package_aps_package_series` FOREIGN KEY (`series_id`) REFERENCES `aps_package_series` (`id`),
  CONSTRAINT `FK_aps_package_aps_registry_object` FOREIGN KEY (`registry_object_id`) REFERENCES `aps_registry_object` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aps_package`
--

LOCK TABLES `aps_package` WRITE;
/*!40000 ALTER TABLE `aps_package` DISABLE KEYS */;
/*!40000 ALTER TABLE `aps_package` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aps_package_configuration`
--

DROP TABLE IF EXISTS `aps_package_configuration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aps_package_configuration` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` varchar(36) NOT NULL,
  `series_id` int(10) unsigned NOT NULL,
  `is_primary` char(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'n',
  PRIMARY KEY (`id`,`series_id`),
  UNIQUE KEY `IX_aps_package_configuration_uid` (`uid`),
  KEY `FK_aps_package_configuration_aps_package_series` (`series_id`),
  CONSTRAINT `FK_aps_package_configuration_aps_package_series` FOREIGN KEY (`series_id`) REFERENCES `aps_package_series` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aps_package_configuration`
--

LOCK TABLES `aps_package_configuration` WRITE;
/*!40000 ALTER TABLE `aps_package_configuration` DISABLE KEYS */;
/*!40000 ALTER TABLE `aps_package_configuration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aps_package_global_setting`
--

DROP TABLE IF EXISTS `aps_package_global_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aps_package_global_setting` (
  `name` varchar(64) NOT NULL,
  `value` text NOT NULL,
  `order_num` int(10) unsigned NOT NULL,
  `package_config_id` int(10) unsigned NOT NULL,
  KEY `FK_aps_package_global_setting_aps_package_configuration` (`package_config_id`),
  KEY `IX_aps_package_global_setting` (`name`,`order_num`,`package_config_id`) USING BTREE,
  CONSTRAINT `FK_aps_package_global_setting_aps_package_configuration` FOREIGN KEY (`package_config_id`) REFERENCES `aps_package_configuration` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aps_package_global_setting`
--

LOCK TABLES `aps_package_global_setting` WRITE;
/*!40000 ALTER TABLE `aps_package_global_setting` DISABLE KEYS */;
/*!40000 ALTER TABLE `aps_package_global_setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aps_package_resource_configuration`
--

DROP TABLE IF EXISTS `aps_package_resource_configuration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aps_package_resource_configuration` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `package_config_id` int(10) unsigned NOT NULL,
  `service_id` varchar(64) NOT NULL,
  `resource_type` varchar(256) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IX_aps_package_resource_configuration` (`package_config_id`,`service_id`) USING BTREE,
  CONSTRAINT `FK_aps_package_resource_configuration_aps_package_configuration` FOREIGN KEY (`package_config_id`) REFERENCES `aps_package_configuration` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aps_package_resource_configuration`
--

LOCK TABLES `aps_package_resource_configuration` WRITE;
/*!40000 ALTER TABLE `aps_package_resource_configuration` DISABLE KEYS */;
/*!40000 ALTER TABLE `aps_package_resource_configuration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aps_package_resource_setting`
--

DROP TABLE IF EXISTS `aps_package_resource_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aps_package_resource_setting` (
  `name` varchar(64) NOT NULL,
  `value` text NOT NULL,
  `order_num` int(10) unsigned NOT NULL,
  `resource_config_id` int(10) unsigned NOT NULL,
  UNIQUE KEY `IX_aps_package_resource_setting` (`name`,`order_num`,`resource_config_id`) USING BTREE,
  KEY `FK_aps_package_resource_setting_aps_package_resource_configurat` (`resource_config_id`),
  CONSTRAINT `FK_aps_package_resource_setting_aps_package_resource_configurat` FOREIGN KEY (`resource_config_id`) REFERENCES `aps_package_resource_configuration` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aps_package_resource_setting`
--

LOCK TABLES `aps_package_resource_setting` WRITE;
/*!40000 ALTER TABLE `aps_package_resource_setting` DISABLE KEYS */;
/*!40000 ALTER TABLE `aps_package_resource_setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aps_package_series`
--

DROP TABLE IF EXISTS `aps_package_series`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aps_package_series` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `aps_package_id` varchar(255) NOT NULL,
  `aps10_name` varchar(255) NOT NULL,
  `commercial_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IX_aps_package_series_aps_package_id` (`aps_package_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aps_package_series`
--

LOCK TABLES `aps_package_series` WRITE;
/*!40000 ALTER TABLE `aps_package_series` DISABLE KEYS */;
/*!40000 ALTER TABLE `aps_package_series` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aps_package_service`
--

DROP TABLE IF EXISTS `aps_package_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aps_package_service` (
  `package_id` int(10) unsigned NOT NULL,
  `service_id` varchar(64) NOT NULL,
  `resource_type` varchar(256) NOT NULL,
  `service_class` varchar(64) NOT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `FK_aps_package_service_aps_package` (`package_id`),
  CONSTRAINT `FK_aps_package_service_aps_package` FOREIGN KEY (`package_id`) REFERENCES `aps_package` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aps_package_service`
--

LOCK TABLES `aps_package_service` WRITE;
/*!40000 ALTER TABLE `aps_package_service` DISABLE KEYS */;
/*!40000 ALTER TABLE `aps_package_service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aps_registry_object`
--

DROP TABLE IF EXISTS `aps_registry_object`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aps_registry_object` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` varchar(36) NOT NULL,
  `type` varchar(256) NOT NULL,
  `creation_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `enabled` char(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'y',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IX_aps_registry_object_uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aps_registry_object`
--

LOCK TABLES `aps_registry_object` WRITE;
/*!40000 ALTER TABLE `aps_registry_object` DISABLE KEYS */;
/*!40000 ALTER TABLE `aps_registry_object` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aps_registry_object_setting`
--

DROP TABLE IF EXISTS `aps_registry_object_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aps_registry_object_setting` (
  `name` varchar(64) NOT NULL,
  `value` text NOT NULL,
  `order_num` int(10) unsigned NOT NULL,
  `uuid` varchar(255) DEFAULT NULL,
  `registry_object_id` int(10) unsigned NOT NULL,
  UNIQUE KEY `IX_aps_registry_object_setting` (`name`,`order_num`,`registry_object_id`) USING BTREE,
  KEY `FK_aps_registry_object_setting_aps_registry_object` (`registry_object_id`),
  CONSTRAINT `FK_aps_registry_object_setting_aps_registry_object` FOREIGN KEY (`registry_object_id`) REFERENCES `aps_registry_object` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aps_registry_object_setting`
--

LOCK TABLES `aps_registry_object_setting` WRITE;
/*!40000 ALTER TABLE `aps_registry_object_setting` DISABLE KEYS */;
/*!40000 ALTER TABLE `aps_registry_object_setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aps_registry_object_tag`
--

DROP TABLE IF EXISTS `aps_registry_object_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aps_registry_object_tag` (
  `registry_object_id` int(10) unsigned NOT NULL,
  `name` varchar(64) NOT NULL,
  `value` varchar(255) NOT NULL DEFAULT '',
  KEY `FK_aps_registry_object_tag_aps_registry_object` (`registry_object_id`),
  CONSTRAINT `FK_aps_registry_object_tag_aps_registry_object` FOREIGN KEY (`registry_object_id`) REFERENCES `aps_registry_object` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aps_registry_object_tag`
--

LOCK TABLES `aps_registry_object_tag` WRITE;
/*!40000 ALTER TABLE `aps_registry_object_tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `aps_registry_object_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aps_resource`
--

DROP TABLE IF EXISTS `aps_resource`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aps_resource` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `registry_object_id` int(10) unsigned NOT NULL,
  `parent_resource_id` int(10) unsigned DEFAULT NULL,
  `service_id` varchar(64) NOT NULL,
  `resource_type` varchar(256) NOT NULL,
  `app_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_aps_resource_aps_registry_object` (`registry_object_id`),
  KEY `FK_aps_resource_aps_application` (`app_id`),
  CONSTRAINT `FK_aps_resource_aps_application` FOREIGN KEY (`app_id`) REFERENCES `aps_application` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_aps_resource_aps_registry_object` FOREIGN KEY (`registry_object_id`) REFERENCES `aps_registry_object` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aps_resource`
--

LOCK TABLES `aps_resource` WRITE;
/*!40000 ALTER TABLE `aps_resource` DISABLE KEYS */;
/*!40000 ALTER TABLE `aps_resource` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aps_resource_adjacency_list`
--

DROP TABLE IF EXISTS `aps_resource_adjacency_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aps_resource_adjacency_list` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `base_resource_id` int(10) unsigned NOT NULL,
  `dependent_resource_id` int(10) unsigned NOT NULL,
  `relation` char(1) NOT NULL DEFAULT 'e',
  `uniqueness_scope` varchar(255) DEFAULT NULL,
  `branch` varchar(255) DEFAULT NULL,
  `requirement_id` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IX_aps_resource_adjacency_list_unique_link` (`base_resource_id`,`dependent_resource_id`),
  KEY `FK_aps_resource_adjacency_list_base` (`base_resource_id`),
  KEY `FK_aps_resource_adjacency_list_dependent` (`dependent_resource_id`),
  CONSTRAINT `FK_aps_resource_adjacency_list_base` FOREIGN KEY (`base_resource_id`) REFERENCES `aps_resource` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_aps_resource_adjacency_list_dependent` FOREIGN KEY (`dependent_resource_id`) REFERENCES `aps_resource` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aps_resource_adjacency_list`
--

LOCK TABLES `aps_resource_adjacency_list` WRITE;
/*!40000 ALTER TABLE `aps_resource_adjacency_list` DISABLE KEYS */;
/*!40000 ALTER TABLE `aps_resource_adjacency_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aps_resource_backup`
--

DROP TABLE IF EXISTS `aps_resource_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aps_resource_backup` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `registry_object_id` int(10) unsigned NOT NULL,
  `app_backup_id` int(10) unsigned DEFAULT NULL,
  `resource_uid` char(36) NOT NULL,
  `ext_backup_id` varchar(255) DEFAULT NULL,
  `parent_resource_backup_id` int(10) unsigned DEFAULT NULL,
  `parent_resource_uid` char(36) DEFAULT NULL,
  `service_id` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IX_aps_resource_backup_application_backup` (`app_backup_id`,`resource_uid`),
  KEY `FK_aps_resource_backup_aps_registry_object` (`registry_object_id`),
  KEY `FK_aps_resource_backup_aps_resource_backup` (`parent_resource_backup_id`),
  CONSTRAINT `FK_aps_resource_backup_aps_application_backup` FOREIGN KEY (`app_backup_id`) REFERENCES `aps_application_backup` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_aps_resource_backup_aps_registry_object` FOREIGN KEY (`registry_object_id`) REFERENCES `aps_registry_object` (`id`),
  CONSTRAINT `FK_aps_resource_backup_aps_resource_backup` FOREIGN KEY (`parent_resource_backup_id`) REFERENCES `aps_resource_backup` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aps_resource_backup`
--

LOCK TABLES `aps_resource_backup` WRITE;
/*!40000 ALTER TABLE `aps_resource_backup` DISABLE KEYS */;
/*!40000 ALTER TABLE `aps_resource_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aps_resource_log`
--

DROP TABLE IF EXISTS `aps_resource_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aps_resource_log` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `resource_id` int(10) unsigned NOT NULL,
  `uid` varchar(36) NOT NULL,
  `severity` int(10) unsigned NOT NULL,
  `content` varchar(4000) NOT NULL,
  `log_time` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_aps_resource_log_resource_id` (`resource_id`),
  CONSTRAINT `FK_aps_resource_log_resource_id` FOREIGN KEY (`resource_id`) REFERENCES `aps_resource` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aps_resource_log`
--

LOCK TABLES `aps_resource_log` WRITE;
/*!40000 ALTER TABLE `aps_resource_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `aps_resource_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aps_resource_requirement`
--

DROP TABLE IF EXISTS `aps_resource_requirement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aps_resource_requirement` (
  `uid` varchar(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `resource_id` int(10) unsigned NOT NULL,
  `requirement_id` varchar(255) NOT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `branch` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_aps_resource_requirement_aps_resource` (`resource_id`),
  CONSTRAINT `FK_aps_resource_requirement_aps_resource` FOREIGN KEY (`resource_id`) REFERENCES `aps_resource` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aps_resource_requirement`
--

LOCK TABLES `aps_resource_requirement` WRITE;
/*!40000 ALTER TABLE `aps_resource_requirement` DISABLE KEYS */;
/*!40000 ALTER TABLE `aps_resource_requirement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aps_resource_requirement_backup`
--

DROP TABLE IF EXISTS `aps_resource_requirement_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aps_resource_requirement_backup` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `resource_backup_id` int(10) unsigned NOT NULL,
  `uid` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `requirement_id` varchar(255) NOT NULL,
  `ext_backup_id` varchar(255) DEFAULT NULL,
  `branch` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_aps_resource_requirement_backup_aps_resource_backup` (`resource_backup_id`),
  CONSTRAINT `FK_aps_resource_requirement_backup_aps_resource_backup` FOREIGN KEY (`resource_backup_id`) REFERENCES `aps_resource_backup` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aps_resource_requirement_backup`
--

LOCK TABLES `aps_resource_requirement_backup` WRITE;
/*!40000 ALTER TABLE `aps_resource_requirement_backup` DISABLE KEYS */;
/*!40000 ALTER TABLE `aps_resource_requirement_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aps_resource_usage_counter`
--

DROP TABLE IF EXISTS `aps_resource_usage_counter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aps_resource_usage_counter` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `report_id` int(10) unsigned NOT NULL,
  `counter_id` varchar(64) NOT NULL,
  `unit` varchar(32) NOT NULL,
  `value` int(10) unsigned NOT NULL DEFAULT 0,
  `limit_value` bigint(20) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IX_aps_resource_usage_counter_report` (`report_id`,`counter_id`),
  CONSTRAINT `FK_aps_resource_usage_counter_aps_resource_usage_report` FOREIGN KEY (`report_id`) REFERENCES `aps_resource_usage_report` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aps_resource_usage_counter`
--

LOCK TABLES `aps_resource_usage_counter` WRITE;
/*!40000 ALTER TABLE `aps_resource_usage_counter` DISABLE KEYS */;
/*!40000 ALTER TABLE `aps_resource_usage_counter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aps_resource_usage_report`
--

DROP TABLE IF EXISTS `aps_resource_usage_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aps_resource_usage_report` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `resource_id` int(10) unsigned NOT NULL,
  `last_update_timestamp` bigint(20) unsigned NOT NULL,
  `poll_interval` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IX_aps_resource_usage_report_resource` (`resource_id`),
  CONSTRAINT `FK_aps_resource_usage_report_aps_resource` FOREIGN KEY (`resource_id`) REFERENCES `aps_resource` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aps_resource_usage_report`
--

LOCK TABLES `aps_resource_usage_report` WRITE;
/*!40000 ALTER TABLE `aps_resource_usage_report` DISABLE KEYS */;
/*!40000 ALTER TABLE `aps_resource_usage_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aps_settings_sequenses`
--

DROP TABLE IF EXISTS `aps_settings_sequenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aps_settings_sequenses` (
  `sequence_id` varchar(255) NOT NULL,
  `counter` int(10) unsigned NOT NULL,
  PRIMARY KEY (`sequence_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aps_settings_sequenses`
--

LOCK TABLES `aps_settings_sequenses` WRITE;
/*!40000 ALTER TABLE `aps_settings_sequenses` DISABLE KEYS */;
/*!40000 ALTER TABLE `aps_settings_sequenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meta_info`
--

DROP TABLE IF EXISTS `meta_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `meta_info` (
  `param` varchar(255) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `value` varbinary(2000) NOT NULL,
  PRIMARY KEY (`param`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meta_info`
--

LOCK TABLES `meta_info` WRITE;
/*!40000 ALTER TABLE `meta_info` DISABLE KEYS */;
INSERT INTO `meta_info` VALUES ('db_version','017009013');
/*!40000 ALTER TABLE `meta_info` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-05  5:08:34
