-- MySQL dump 10.13  Distrib 5.7.17, for Linux (x86_64)
--
-- Host: mysql.cohi5vfxnofi.us-west-2.rds.amazonaws.com    Database: AMIPACES
-- ------------------------------------------------------
-- Server version	5.6.27-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `items` (
  `type` int(10) unsigned NOT NULL,
  `item` int(10) unsigned NOT NULL,
  `itimeout` double DEFAULT NULL,
  `etimeout` double DEFAULT NULL,
  `mtimeout` double DEFAULT NULL,
  `itext` varchar(1024) DEFAULT NULL,
  `screen` varchar(1024) DEFAULT NULL,
  `audio` varchar(1024) DEFAULT NULL,
  `video` varchar(1024) DEFAULT NULL,
  `initargs` varchar(1024) DEFAULT NULL,
  `activenext` varchar(8) DEFAULT NULL,
  `difficulty` double DEFAULT NULL,
  `subtype` int(10) unsigned DEFAULT NULL,
  `audiotext` varchar(1024) DEFAULT NULL,
  `enabled` varchar(8) DEFAULT 'YES',
  `flag` int(11) DEFAULT NULL,
  `xrinfo` varchar(1024) DEFAULT NULL,
  UNIQUE KEY `type` (`type`,`item`),
  KEY `items_type` (`type`),
  KEY `items_item` (`item`),
  CONSTRAINT `items_ibfk_1` FOREIGN KEY (`type`) REFERENCES `types` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (2000,1,0,0,0,'Hear this?','Details on how to jack up the volume...','2000.1.mp3','','SpeakerCheck','',0,0,'If you can hear this clearly, tap NEXT.','',0,''),(2000,2,10,2,12,'Name and Place','','2000.2.mp3','','MicrophoneCheck:2000.2.OK.mp3:2000.2.Low.mp3:2000.2.Noise.mp3:EnableInterviewAccess.mp3:2000.2.MoreSpeech.mp3','',0,0,'Please say your full name and the location where you are right now.','',0,''),(2000,3,0,0,120,'','','2000.3.mp3','','CameraPreview','',0,0,'','',0,''),(2023,1,0,0,8,'','','2023.mp3:2023.1.mp3:2023.2.mp3','PurseSnatchSquareShorter.mp4','3.5:1.5:21.5','',0,0,'Purse Snatch Square VIDEO','',0,'Speaking in Sync'),(2023,2,0,0,8,'','','2023.mp3:2023.2.mp3:2023.1.mp3','TrainTicket_Cropped_v01aiP5.mov','3.5:1.5:21.5','',0,0,'Train Ticket VIDEO','',0,'Speaking in Sync'),(2023,3,0,0,8,'','','2023.mp3:2023.2.mp3:2023.3.mp3','HotdogSquare.mp4','3.5:1.5:21.5','',0,0,'Hot Dog VIDEO','',0,'Speaking in Sync'),(2023,5,0,0,8,'','','2023.mp3:2023.5.mp3:2023.2.mp3','WalletFallSquareShort.mp4','3.5:1.5:21.5','',0,0,'Wallet Fall VIDEO','',0,'Speaking in Sync'),(2032,1,1,0.7,30,'','','2032.1.mp3','','TTarget_Off.png:TTarget_Off.png:TTarget_Off.png:0:0:550:550:NO:MovingTarget:NO:NO:YES:5','',0,0,'','',0,''),(2040,4,8,1.5,45,'','','2040.4.mp3:2040.4V.mp3:2040.POST.mp3:2040.4.a.mp3','','','',0,0,'Listen to this story about a HOMEWORK ASSIGNMENT and remember it.:Remember the HOMEWORK ASSIGNMENT story, so you can re-tell it again later.:HOMEWORK ASSIGNMENT. Susana ran down the hallway, excited to turn in the assignment that she had worked on all week. She stopped to read it one last time before school started. She looked for it in her backpack, but couldnâ€™t find it. She was walking into class frustrated and empty handed, when her teacher said that her assignment was amazing. Her mom had brought it in before class started. She was overcome with joy and relief.','',0,''),(2040,7,8,1.5,45,'','','2040.7.mp3:2040.7V.mp3:2040.POST.mp3:2040.7.a.mp3','','','',0,0,'Listen to this story about a CROSSWALK and remember it.:Remember the CROSSWALK story, so you can re-tell it again later.:CROSSWALK. When the elderly woman finished shopping, she had to go across the street to wait for her daughter. The woman tried to get across the street, but no cars where stopping to let her cross. A tall, thin young man was passing by and noticed the woman. He walked over and offered to help her. Once she got to the other side, her daughter arrived to pick her up.','',0,''),(2040,9,8,1.5,45,'','','2040.9.mp3:2040.9V.mp3:2040.POST.mp3:2040.9.a.mp3','','','',0,0,'Listen to this story about DRIVING and remember it.:Remember the DRIVING story, so you can re-tell it again later.:DRIVING. Learning how to drive a car was nerve wracking. Maria was doing well, but she felt like she was going to crash into everything. Her father was teaching her and one day he started singing a lullaby to her, which seemed to calm her down. Soothing music really relaxed her. On the day of her driverâ€™s test, she hummed all the way through the test and she passed with ease.','',0,'Immediate Retelling'),(2040,10,8,1.5,45,'','','2040.10.mp3:2040.10V.mp3:2040.POST.mp3:2040.10.a.mp3','','','',0,0,'Listen to this story about SISTERS and remember it.:Remember the SISTERS story, so you can re-tell it again later.:SISTERS. One cold morning, two sisters were walking to school when the little sister realized that sheâ€™d forgotten to bring along her lunch from home. The big sister said that sheâ€™d be willing to go back and get it for her â€“ she could run faster and take a shortcut, so she probably wouldnâ€™t be late. The younger girl agreed and soon found her big sister there at school waiting for her, lunch in hand.','',0,''),(2041,4,8,1.5,45,'','','2041.4.mp3','','','',0,0,'Re-tell the HOMEWORK ASSIGNMENT story again now. Put in all the details you can remember.','',0,''),(2041,7,8,1.5,45,'','','2041.7.mp3','','','',0,0,'Re-tell the CROSSWALK story again now. Put in all the details you can remember.','',0,''),(2041,9,8,1.5,45,'','','2041.9.mp3','','','',0,0,'Re-tell the DRIVING story again now. Put in all the details you can remember.','',0,'Delayed Retelling'),(2041,10,8,1.5,45,'','','2041.10.mp3','','','',0,0,'Re-tell the SISTERS story again now. Put in all the details you can remember.','',0,''),(2044,0,0,0,0,'','','','','','',0,0,'','',0,''),(2044,1,5,1.5,10,'','','2044.1.mp3','','','',0,0,'Everything we did to help went for nothing.','',0,'Verbatim Repetition'),(2044,2,5,1.5,10,'','','2044.2.mp3','','','',0,0,'How\'s the technical team holding up these days?','',0,'Verbatim Repetition'),(2044,3,5,1.5,10,'','','2044.3.mp3','','','',0,0,'I wish he hadn\'t made that happen that way.','',0,'Verbatim Repetition'),(2044,4,5,1.5,10,'','','2044.4.mp3','','','',0,0,'It\'s all unaccountably strange the way they do it.','',0,'Verbatim Repetition'),(2044,5,5,1.5,10,'','','2044.5.mp3','','','',0,0,'She was a friend and a support to everyone there.','',0,'Verbatim Repetition'),(2044,6,5,1.5,10,'','','2044.6.mp3','','','',0,0,'Well the facts were right, but he didn\'t explain it.','',0,'Verbatim Repetition'),(2044,7,5,1.5,10,'','','2044.7.mp3','','','',0,0,'Tom was puzzled, but he kept studying the problem anyway.','',0,'Verbatim Repetition'),(2044,8,5,1.5,10,'','','2044.8.mp3','','','',0,0,'He cleared everybody out of the building except the supervisors.','',0,'Verbatim Repetition'),(2044,9,5,1.5,10,'','','2044.9.mp3','','','',0,0,'Not until the car was out of sight could she relax.','',0,'Verbatim Repetition'),(2044,10,5,1.5,10,'','','2044.10.mp3','','','',0,0,'From my spot in the corner I could see every agent.','',0,'Verbatim Repetition'),(2044,11,5,1.5,10,'','','2044.11.mp3','','','',0,0,'Did they overhear what was said in the room that day?','',0,'Verbatim Repetition'),(2044,12,5,1.5,10,'','','2044.12.mp3','','','',0,0,'Her voice would deliver sales just by the welcome in it.','',0,'Verbatim Repetition'),(2044,13,5,1.5,10,'','','2044.13.mp3','','','',0,0,'There was no answer and nobody came out of the building.','',0,'Verbatim Repetition'),(2044,14,5,1.5,10,'','','2044.14.mp3','','','',0,0,'The darkness came and I went on working the front counter.','',0,'Verbatim Repetition'),(2044,15,5,1.5,10,'','','2044.15.mp3','','','',0,0,'We advertized a lot, but it\'s so specialized that nobody bought.','',0,'Verbatim Repetition'),(2044,16,5,1.5,10,'','','2044.16.mp3','','','',0,0,'Then Wilson tilted up that beautiful display and looked underneath it.','',0,'Verbatim Repetition'),(2044,17,5,1.5,10,'','','2044.17.mp3','','','',0,0,'I drove down here for good reason and I don\'t regret it.','',0,'Verbatim Repetition'),(2044,18,5,1.5,10,'','','2044.18.mp3','','','',0,0,'You really want him to take a closer look at your accounts?','',0,'Verbatim Repetition'),(2044,19,5,1.5,10,'','','2044.19.mp3','','','',0,0,'They would either look at the document or know why they couldn\'t.','',0,'Verbatim Repetition'),(2044,20,5,1.5,10,'','','2044.20.mp3','','','',0,0,'Said to myself something\'s up; she never gets so many commissions.','',0,'Verbatim Repetition'),(2044,21,5,1.5,10,'','','2044.21.mp3','','','',0,0,'Even if it\'s not there, how are you going to get around it?','',0,'Verbatim Repetition'),(2044,22,5,1.5,10,'','','2044.22.mp3','','','',0,0,'I can tell you why he did it, since he won\'t explain himself.','',0,'Verbatim Repetition'),(2044,23,5,1.5,10,'','','2044.23.mp3','','','',0,0,'It opened into a great big room that we used as a meeting room.','',0,'Verbatim Repetition'),(2044,24,5,1.5,10,'','','2044.24.mp3','','','',0,0,'She was in the warehouse and probably asking if there was a machine in there.','',0,'Verbatim Repetition'),(2062,0,0,0,0,'','','','','','',0,0,'','',0,''),(2062,1,6,0.5,8,'','','2062.1.mp3:2062.2.mp3','','2:6:0:2:30','',0,0,'','',0,''),(2062,2,8,0.5,12,'','','2062.1.mp3:2062.2.mp3','','4:8:0:3:30','',0,0,'','',0,''),(2064,1,0,1,3,'','','2064.mp3:2064.i.mp3','','4:1-4:2','',0,0,'','',0,''),(2064,2,0,1,3,'','','2064.p2.mp3:2064.i.mp3','','6:2-6:3','',0,0,'','',0,''),(2064,3,0,1,3,'','','2064.p3.mp3:2064.i.mp3','','6:4-9:3','',0,0,'','',0,''),(2066,0,0,0,0,'','','','','','',0,0,'','',0,''),(2066,1,5,0.5,40,'','','2066.1.mp3:2066.probe.mp3','','','',0,0,'You\'re working the floor at a small clothing store. A customer comes, looks over the shirts, picks one up, and asks if you have the same one in blue. What do you say?','',0,'Verbatim Repetition'),(2067,0,0,0,0,'','','','','','',0,0,'','',0,''),(2067,1,10,1.5,75,'','','2067.1.mp3','','','',0,0,'Some people say â€œfailure is good for you.â€ Explain a failure that you were involved with. What caused it and what can be learned from it?','',0,'Some people say â€œfailure is good for you.â€ Explain a failure that you were involved with. What caused it and what can be learned from it?'),(2067,2,10,1.5,75,'','','2067.2.mp3','','','',0,0,'Access to the Internet has changed how people live and work. Explain how the Internet has changed family life, for the better or for the worse.','',0,'Access to the Internet has changed how people live and work. Explain how the Internet has changed family life, for the better or for the worse.'),(2067,3,10,1.5,75,'','','2067.3.mp3','','','',0,0,'Explain how a person should shop for food. How should a person decide what to buy and what not to buy? What are common mistakes people make in food shopping?','',0,'Explain how a person should shop for food. How should a person decide what to buy and what not to buy? What are common mistakes people make in food shopping?'),(2067,4,10,1.5,75,'','','2067.4.mp3','','','',0,0,'How does a driver know what other cars are likely to do? Why is it important to anticipate what other cars will do?','',0,'How does a driver know what other cars are likely to do? Why is it important to anticipate what other cars will do?'),(2068,0,0,0,0,'','','','','','',0,0,'','',0,''),(2068,4,5,0.5,20,'','','2068.4.mp3','','','',0,0,'','',0,''),(2069,0,0,0,0,'','','','','','',0,0,'','',0,''),(2069,2,5,0.5,20,'','','2069.2.mp3','','','',0,0,'','',0,''),(2070,0,0,0,0,'','','','','','',0,0,'What are your thoughts?','',0,''),(2070,1,10,1.5,75,'','','2070.1.mp3','','','',0,0,'What do you think you\'ll be doing five years from now? How will it be different from now?','',0,''),(2070,2,10,1.5,75,'','','2070.2.mp3','','','',0,0,'In what ways has the country changed over the last four or five years? How important are these changes? Have they been good or bad?','',0,''),(2070,3,10,1.5,75,'','','2070.3.mp3','','','',0,0,'How do you see the future of work and how people will use their free time in the next 10 years? What will be diffenent?','',0,''),(2070,4,10,1.5,75,'','','2070.4.mp3','','','',0,0,'Has education changed in the past 10 years? If so, how has it changed? If not, how should education change in the future?','',0,''),(2071,1,10,1.5,30,'','','2071.1.mp3','','','',0,0,'How are you feeling about this interview?','',0,''),(2071,3,15,1.5,120,'','','2071.3.mp3','','','',0,0,'Why are you interested in a new job.','',0,''),(2072,1,10,1.5,120,'','','2072.1.mp3:2072.1a.mp3','','45','',0,0,'','',0,''),(2073,1,10,1.5,120,'','','2073.1.mp3:2073.1a.mp3','','45','',0,0,'Now tell me about your work experience, including your current job.','',0,''),(2073,4,10,1.5,90,'','','2073.4.mp3','','','',0,0,'Beyond education and work, speak about yourself.  Who are you and what do you do?','',0,''),(2074,0,0,0,0,'','','','','','',0,0,'','',0,''),(2074,1,8,1.5,40,'','','2074.1.mp3','','','',0,0,'A contractor built a fence with a metal gate to enclose your parking lot. The gate operates, but the paint is uneven, the welded joints look crude, and the design isn\'t the exactly the same as the design shown in their bid. You want the gate to reflect well on your business. What do you say to the contractor?','',0,''),(2074,2,8,1.5,40,'','','2074.2.mp3','','','',0,0,'You are working on a complicated and difficult task. A group of people have gathered around behind you talking and joking loudly, unaware that they might interfere with your work. What would you say to them?','',0,''),(2074,3,8,1.5,40,'','','2074.3.mp3','','','',0,0,'Your company pays by direct deposit, but now it\'s Monday and Friday\'s payment hasn\'t shown up yet in your account. What do you say your supervisor at work?','',0,''),(2074,4,8,1.5,40,'','','2074.4.mp3','','','',0,0,'You having trouble with a computer-based survey questionaire thatyour company sent out to everyone. You have a co-worker who is a computer wizard and you want to ask her for help. What do you say to her?','',0,''),(2074,5,8,1.5,40,'','','2074.5.mp3','','','',0,0,'A guy at work asks if you can drive him home today because his car is at the shop. You have to go to a doctor\'s appointment immediately after work, so you can\'t drive him home today. What do you say to him?','',0,''),(2074,6,8,1.5,40,'','','2074.6.mp3','','','',0,0,'Your boss invites everyone to a baseball game on Saturday. You\'ll be at a wedding then. When the boss asks you if you\'re coming to the game, what do you say?','',0,''),(2074,7,8,1.5,40,'','','2074.7.mp3','','','',0,0,'You have an appointment for a job interview, but your car won\'t start. You call the company\'s office to reschedule. What do you say?','',0,''),(2074,8,8,1.5,40,'','','2074.8.mp3','','','',0,0,'You borrowed a video from a friend at work, but you lost it somewhere. You\'re having coffee with your friend and she says she needs the video back \'cause she\'s promised to lend it to her cousin. What do you say to her?','',0,''),(2090,0,0,0,0,'','','','','','',0,0,'','',0,''),(2091,0,0,0,0,'','','','','','',0,0,'','',0,''),(2093,0,0,0,0,'','','','','','',0,0,'','',0,''),(2094,0,0,0,0,'','','','','','',0,0,'','',0,''),(2095,0,0,0,0,'','','','','','',0,0,'','',0,''),(2096,0,0,0,0,'','','','','','',0,0,'','',0,''),(2097,0,0,0,0,'','','','','','',0,0,'','',0,''),(2098,0,0,0,0,'','','','','','',0,0,'','',0,''),(2100,3,8,1.5,60,'','','2100.3.mp3','','','',0,2,'Do you have any suggestions for us?','',0,''),(2100,4,8,1.5,60,'','','2100.4.mp3','','','',0,2,'Do you have any suggestions to improve this App?','',0,''),(2100,5,8,1.5,60,'','','2100.5.mp3','','','',0,2,'What would make this App better?','',0,''),(2100,6,8,1.5,60,'','','2100.6.mp3','','','',0,2,'What don\'t you like about this App?','',0,''),(2100,7,8,1.5,60,'','','2100.7.mp3','','','',0,2,'What\'s wrong with this App?','',0,'');
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `names`
--

DROP TABLE IF EXISTS `names`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `names` (
  `name` varchar(64) NOT NULL,
  `gender` varchar(1) DEFAULT 'F',
  `nameset` int(10) unsigned NOT NULL,
  KEY `names_name` (`name`),
  KEY `names_gender` (`gender`),
  KEY `names_nameset` (`nameset`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `names`
--

LOCK TABLES `names` WRITE;
/*!40000 ALTER TABLE `names` DISABLE KEYS */;
INSERT INTO `names` VALUES ('Sarah','F',1),('Nicole','F',1),('Kimberly','F',1),('Andrea','F',1),('Christina','F',2),('Amy','F',2),('Lisa','F',2),('Jessica','F',2),('Rebecca','F',3),('Mary','F',3),('Elizabeth','F',3),('April','F',3),('Amanda','F',4),('Rachel','F',4),('Laura','F',4),('Heather','F',4),('Tim','M',5),('Robert','M',5),('Matt','M',5),('Eric','M',5),('Bill','M',6),('Daniel','M',6),('Patrick','M',6),('Mark','M',6),('Steve','M',7),('JosÃ©','M',7),('Brian','M',7),('Mike','M',7),('Ryan','M',8),('Mark','M',8),('John','M',8),('Charles','M',8);
/*!40000 ALTER TABLE `names` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `photoes`
--

DROP TABLE IF EXISTS `photoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `photoes` (
  `subjectid` int(11) NOT NULL,
  `filename` varchar(1024) NOT NULL,
  `feeling` varchar(1024) NOT NULL,
  KEY `subjectid` (`subjectid`),
  KEY `photoes_filename` (`filename`(767)),
  KEY `photoes_feeling` (`feeling`(767)),
  CONSTRAINT `photoes_ibfk_1` FOREIGN KEY (`subjectid`) REFERENCES `photos` (`subjectid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photoes`
--

LOCK TABLES `photoes` WRITE;
/*!40000 ALTER TABLE `photoes` DISABLE KEYS */;
INSERT INTO `photoes` VALUES (1,'FE1_D.jpg','D'),(1,'FE1_H.jpg','H'),(1,'FE1_HH.jpg','HH'),(1,'FE1_S.jpg','S'),(2,'FE2_S.jpg','S'),(2,'FE2_C.jpg','C'),(2,'FE2_H.jpg','H'),(2,'FE2_I.jpg','I'),(3,'FE3_Angry.jpg','Angry'),(3,'FE3_C.jpg','C'),(3,'FE3_H.jpg','H'),(3,'FE3_I.jpg','I'),(4,'FE4_A.jpg','A'),(4,'FE4_H.jpg','H'),(4,'FE4_I.jpg','I'),(4,'FE4_S.jpg','S'),(5,'MA1_C.jpg','C'),(5,'MA1_D.jpg','D'),(5,'MA1_H.jpg','H'),(5,'MA1_I.jpg','I'),(6,'MA2_C.jpg','C'),(6,'MA2_D.jpg','D'),(6,'MA2_H.jpg','H'),(6,'MA2_HH.jpg','HH'),(7,'MA3_D.jpg','D'),(7,'MA3_H.jpg','H'),(7,'MA3_Q.jpg','Q'),(7,'MA3_T.jpg','T'),(8,'MA4_A.jpg','A'),(8,'MA4_Alert.jpg','Alert'),(8,'MA4_H.jpg','H'),(8,'MA4_I.jpg','I');
/*!40000 ALTER TABLE `photoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `photos`
--

DROP TABLE IF EXISTS `photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `photos` (
  `subjectid` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(1024) NOT NULL,
  `gender` varchar(1) DEFAULT 'F',
  `photoset` int(10) unsigned NOT NULL,
  PRIMARY KEY (`subjectid`),
  KEY `photos_filename` (`filename`(767)),
  KEY `photos_gender` (`gender`),
  KEY `photos_photoset` (`photoset`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photos`
--

LOCK TABLES `photos` WRITE;
/*!40000 ALTER TABLE `photos` DISABLE KEYS */;
INSERT INTO `photos` VALUES (1,'FE1_Neutral.jpg','F',1),(2,'FE2_Neutral.jpg','F',1),(3,'FE3_Neutral.jpg','F',1),(4,'FE4_Neutral.jpg','F',1),(5,'MA1_Neutral.jpg','M',2),(6,'MA2_Neutral.jpg','M',2),(7,'MA3_Neutral.jpg','M',2),(8,'MA4_Neutral.jpg','M',2);
/*!40000 ALTER TABLE `photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quicklits`
--

DROP TABLE IF EXISTS `quicklits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quicklits` (
  `string` varchar(64) NOT NULL,
  `word` varchar(1) DEFAULT 'N',
  `level` int(11) DEFAULT '0',
  `used` varchar(1) DEFAULT 'N',
  UNIQUE KEY `string` (`string`),
  KEY `quicklits_string` (`string`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quicklits`
--

LOCK TABLES `quicklits` WRITE;
/*!40000 ALTER TABLE `quicklits` DISABLE KEYS */;
INSERT INTO `quicklits` VALUES ('ACCESSORIES','Y',5,'N'),('ACCORDED','Y',7,'N'),('ADDICTION','Y',4,'N'),('ALMOST','Y',1,'N'),('ALPHA','Y',4,'N'),('ALTERNATE','Y',5,'N'),('AMERA','N',2,'N'),('AMOUNT','Y',2,'N'),('ANSWER','Y',2,'N'),('APPROACHES','Y',4,'N'),('APPULIST','N',3,'N'),('ARMOR','Y',5,'N'),('AROUND','Y',1,'N'),('ASTONISHING','Y',5,'N'),('AWAKENED','Y',6,'N'),('AWESOME','Y',4,'N'),('BATTENING','Y',9,'N'),('BECLUDE','N',2,'N'),('BEFORE','Y',1,'N'),('BELOW','Y',3,'N'),('BIZARRE','Y',4,'N'),('BOARDS','Y',3,'N'),('BRENDOUSLY','N',6,'N'),('BROCHURE','Y',6,'N'),('BUFFETED','Y',8,'N'),('BUILD','Y',2,'N'),('CALCULATED','Y',6,'N'),('CALISTRATED','N',6,'N'),('CAPITULATION','Y',8,'N'),('CARGO','Y',4,'N'),('CAUSED','Y',3,'N'),('CELLMARM','N',6,'N'),('CENTENER','N',4,'N'),('CERTENARY','N',8,'N'),('CHAKES','N',4,'N'),('CHAMERBILITY','N',5,'N'),('CHARRUL','N',9,'N'),('CHLORINATED','Y',9,'N'),('CLEVERAGE','N',5,'N'),('COINSURANCE','Y',9,'N'),('COMES','Y',1,'N'),('COMMISSIONS','Y',5,'N'),('COMPOSER','Y',5,'N'),('COMPREHEND','Y',5,'N'),('COMPULSION','Y',7,'N'),('CONFISCATE','Y',8,'N'),('CONFRONTED','Y',4,'N'),('CONSCEND','N',3,'N'),('CONSISTENT','Y',3,'N'),('CONSISTFULLY','N',4,'N'),('CONSTITUTED','Y',6,'N'),('CONTINSHIP','N',4,'N'),('CRITERION','Y',4,'N'),('CRUDELISTIC','N',8,'N'),('CRUSTACEANS','Y',8,'N'),('CULTURE','Y',2,'N'),('CYLINDER','Y',7,'N'),('DARM','N',3,'N'),('DEAFENING','Y',7,'N'),('DEBRIEFING','Y',8,'N'),('DECIDE','Y',3,'N'),('DECISE','N',3,'N'),('DEDUCES','Y',9,'N'),('DELAY','Y',5,'N'),('DELINEATED','Y',8,'N'),('DEMUTE','N',6,'N'),('DEVELOPS','Y',5,'N'),('DIDDLING','Y',9,'N'),('DIGHT','N',2,'N'),('DISCOVERY','Y',3,'N'),('DISCURSIVE','Y',7,'N'),('DISSECTING','Y',8,'N'),('DISTROBINGLY','N',8,'N'),('DORS','N',1,'N'),('DOUBLING','Y',7,'N'),('DOUBTED','Y',6,'N'),('DREAM','Y',3,'N'),('DRUPS','N',1,'N'),('DUTILIZATION','N',7,'N'),('DYED','Y',8,'N'),('EDITORIALS','Y',7,'N'),('ELIMINATED','Y',6,'N'),('EMPTY','Y',3,'N'),('ENCOURAGED','Y',4,'N'),('ENTRACE','N',4,'N'),('ERGONOMIC','Y',8,'N'),('ESSENTIAL','Y',3,'N'),('EVEN','Y',1,'N'),('EVERYTHING','Y',1,'N'),('EXPECTED','Y',2,'N'),('EXPLOSIVE','Y',4,'N'),('EXPLUNE','N',2,'N'),('FAHRENHEIT','Y',7,'N'),('FANTER','N',1,'N'),('FEACH','N',1,'N'),('FEATURES','Y',3,'N'),('FECELLATIONS','N',8,'N'),('FLITHER','N',4,'N'),('FORBIDDEN','Y',5,'N'),('FORGET','Y',3,'N'),('FRANCTUAL','N',5,'N'),('FULFILLMENT','Y',5,'N'),('FUNDRAISING','Y',6,'N'),('GESPIRT','N',9,'N'),('GLASTRILOGY','N',8,'N'),('GLORCE','N',2,'N'),('GUITARIST','Y',6,'N'),('HAPPENED','Y',2,'N'),('HAWKISH','Y',8,'N'),('HEAVY','Y',2,'N'),('HOMLICATION','N',7,'N'),('HYDRIMIC','N',6,'N'),('ILLFRESSED','N',6,'N'),('ILLUSTRATED','Y',6,'N'),('IMMORTALITY','Y',7,'N'),('IMPOSED','Y',4,'N'),('INDESCRIBABLY','Y',8,'N'),('INFLAMED','Y',8,'N'),('INSENSUAL','N',7,'N'),('INSULTED','Y',8,'N'),('INSURE','Y',6,'N'),('INTERCLEVERIST','N',8,'N'),('INTERMINGLED','Y',9,'N'),('INTERSWINES','N',9,'N'),('IRONCLAD','Y',8,'N'),('IRRESCENDING','N',7,'N'),('JILER','N',2,'N'),('KNIBBENS','N',5,'N'),('KNOWLEDGE','Y',2,'N'),('LADRIMACITY','N',9,'N'),('LAVISH','Y',6,'N'),('LEAST','Y',1,'N'),('LEPOCATION','N',3,'N'),('LITIGATION','Y',4,'N'),('LORVENTION','N',7,'N'),('LOSING','Y',3,'N'),('MARTIAN','Y',6,'N'),('MEASURES','Y',5,'N'),('MERCIFYING','N',8,'N'),('MICROPHONES','Y',7,'N'),('MICROSTRUCTURES','Y',9,'N'),('MINIMALLY','Y',7,'N'),('MOTORCYCLE','Y',5,'N'),('NESSURE','N',6,'N'),('NONGO','N',3,'N'),('NONRESSIMILATED','N',9,'N'),('NOTORIETY','Y',7,'N'),('NUTTIER','Y',9,'N'),('OBSERVATORY','Y',4,'N'),('OBSTRUCTED','Y',8,'N'),('OCCUPIED','Y',4,'N'),('OFFDALE','N',4,'N'),('OFFICIALS','Y',1,'N'),('OMEGA','Y',7,'N'),('OVERQUATED','N',7,'N'),('PACKLE','N',5,'N'),('PAMPHLETS','Y',7,'N'),('PERFISCATE','N',8,'N'),('PINEAPPLE','Y',6,'N'),('PLAGUED','Y',6,'N'),('POLICE','Y',1,'N'),('PONICY','N',1,'N'),('POSTDURABLE','N',9,'N'),('PRACTIMONIA','N',6,'N'),('PRECEDENT','Y',5,'N'),('PREEXISTENT','Y',9,'N'),('PREMIUMS','Y',5,'N'),('PRESTRACTED','N',5,'N'),('PRETOLOGY','N',4,'N'),('PREVERSIFY','N',7,'N'),('PRISHED','N',5,'N'),('PROGRAM','Y',1,'N'),('PROMISING','Y',3,'N'),('PRONCHABLE','N',9,'N'),('PROUSTLY','N',4,'N'),('PROVEN','Y',4,'N'),('PURSPETTE','N',6,'N'),('QUITE','Y',1,'N'),('REFENDMENT','N',3,'N'),('REFESTEN','N',4,'N'),('REFORALIZATION ','N',7,'N'),('REGULATION','Y',3,'N'),('RELECTING','N',5,'N'),('RELIES','Y',5,'N'),('REMOCITY','N',6,'N'),('REPOWERMENT','N',5,'N'),('RESPECTABLE','Y',5,'N'),('RESPITE','Y',7,'N'),('RESTORTICAL','N',8,'N'),('RIGHTS','Y',2,'N'),('ROMANCED','Y',9,'N'),('ROOSTED','Y',9,'N'),('ROUSED','Y',8,'N'),('SANDBLAST','Y',9,'N'),('SANDBLEDER','N',9,'N'),('SCAFT','N',2,'N'),('SCORPLESS','N',9,'N'),('SEDDED','N',3,'N'),('SHORTAGE','Y',4,'N'),('SMETHER','N',4,'N'),('SOLDIERS','Y',2,'N'),('SOOCKED','N',1,'N'),('STAMINA','Y',7,'N'),('STECTURE','N',8,'N'),('STENETICS','N',5,'N'),('STINGLESS','Y',9,'N'),('STODGY','Y',8,'N'),('STOM','N',1,'N'),('STONTER','N',1,'N'),('STOPPILY','N',3,'N'),('STRESTURE','N',2,'N'),('STRICTEST','Y',8,'N'),('STYLISHNESS','Y',9,'N'),('SUBMINIFY','N',8,'N'),('SULFATE','Y',8,'N'),('SUPERSEUM','N',7,'N'),('TABLEMATES','Y',9,'N'),('TECHNICAL','Y',3,'N'),('TELGENCE','N',2,'N'),('TERREMISS','N',6,'N'),('TERRIBLY','Y',4,'N'),('THANKS','Y',2,'N'),('TOMENTIAL','N',3,'N'),('TOWELS','Y',5,'N'),('TRANKLING','N',5,'N'),('ULTRAVIOLET','Y',6,'N'),('UNDECIDABLE','Y',9,'N'),('UNDERCOUNTING','Y',9,'N'),('UNDERWIRE','Y',9,'N'),('UNGANNED','N',7,'N'),('UNLESTANCY','N',5,'N'),('UNMISTAKABLE','Y',6,'N'),('UNRELOANABLE','N',9,'N'),('UNREMANCHIBLE','N',8,'N'),('UNSTAMIBLE','N',7,'N'),('URACEPTORS','N',7,'N'),('UTTERLY','Y',4,'N'),('VIBRIMARILY','N',6,'N'),('VISUALIZED','Y',9,'N'),('WELCOME','Y',3,'N'),('WELCOMING','Y',6,'N'),('WERCOMB','N',3,'N'),('WITHERED','Y',8,'N'),('WORMED','Y',9,'N'),('WORRIED','Y',3,'N'),('WRESTIVAILED','N',7,'N'),('WRISTEN','N',4,'N'),('YOUR','Y',1,'N');
/*!40000 ALTER TABLE `quicklits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `sessionId` varchar(31) NOT NULL,
  `userId` varchar(63) NOT NULL,
  `email` varchar(127) NOT NULL,
  `starttime` datetime NOT NULL,
  `endtime` datetime DEFAULT NULL,
  `testId` int(11) NOT NULL,
  PRIMARY KEY (`sessionId`),
  KEY `testId` (`testId`),
  KEY `sessions_userId` (`userId`),
  KEY `sessions_email` (`email`),
  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`testId`) REFERENCES `tests` (`test`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessionstates`
--

DROP TABLE IF EXISTS `sessionstates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessionstates` (
  `sessionId` varchar(31) NOT NULL,
  `testId` int(11) NOT NULL,
  `type` int(10) unsigned NOT NULL,
  `item` int(10) unsigned NOT NULL,
  `seq` int(10) unsigned NOT NULL,
  `itemType` varchar(31) NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `afilename` varchar(255) NOT NULL,
  `score` int(11) DEFAULT NULL,
  `status` varchar(31) NOT NULL,
  `subResponses` blob,
  `snrDB` blob,
  UNIQUE KEY `sessionId` (`sessionId`,`testId`,`type`,`item`),
  KEY `sessionstates_sessionId` (`sessionId`),
  CONSTRAINT `sessionstates_ibfk_1` FOREIGN KEY (`sessionId`) REFERENCES `sessions` (`sessionId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessionstates`
--

LOCK TABLES `sessionstates` WRITE;
/*!40000 ALTER TABLE `sessionstates` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessionstates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessionstates_camerapicture`
--

DROP TABLE IF EXISTS `sessionstates_camerapicture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessionstates_camerapicture` (
  `sessionId` varchar(31) NOT NULL,
  `takenTime` datetime DEFAULT NULL,
  `elapseTime` float DEFAULT NULL,
  `takenType` int(11) DEFAULT NULL,
  `takenItem` int(11) DEFAULT NULL,
  `pngFileName` varchar(255) DEFAULT NULL,
  KEY `sessionstates_camerapicture_sessionId` (`sessionId`),
  CONSTRAINT `sessionstates_camerapicture_ibfk_1` FOREIGN KEY (`sessionId`) REFERENCES `sessions` (`sessionId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessionstates_camerapicture`
--

LOCK TABLES `sessionstates_camerapicture` WRITE;
/*!40000 ALTER TABLE `sessionstates_camerapicture` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessionstates_camerapicture` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessionstates_quicklit`
--

DROP TABLE IF EXISTS `sessionstates_quicklit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessionstates_quicklit` (
  `sessionId` varchar(31) NOT NULL,
  `testId` int(11) NOT NULL,
  `type` int(10) unsigned NOT NULL,
  `item` int(10) unsigned NOT NULL,
  `word` varchar(31) NOT NULL,
  `isWord` varchar(1) NOT NULL,
  `isUsed` varchar(1) NOT NULL,
  `level` int(11) NOT NULL,
  `duration` float NOT NULL,
  `isTouched` varchar(1) NOT NULL,
  `touchTimeStamp` datetime DEFAULT NULL,
  `wordIndex` int(11) DEFAULT NULL,
  `isCorrect` varchar(1) DEFAULT NULL,
  UNIQUE KEY `sessionId` (`sessionId`,`testId`,`type`,`item`,`word`),
  KEY `sessionstates_quicklit_sessionId` (`sessionId`),
  CONSTRAINT `sessionstates_quicklit_ibfk_1` FOREIGN KEY (`sessionId`) REFERENCES `sessions` (`sessionId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessionstates_quicklit`
--

LOCK TABLES `sessionstates_quicklit` WRITE;
/*!40000 ALTER TABLE `sessionstates_quicklit` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessionstates_quicklit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessionstates_tracktap`
--

DROP TABLE IF EXISTS `sessionstates_tracktap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessionstates_tracktap` (
  `sessionId` varchar(31) NOT NULL,
  `latency` float DEFAULT NULL,
  `distance` float DEFAULT NULL,
  KEY `sessionstates_tracktap_sessionId` (`sessionId`),
  CONSTRAINT `sessionstates_tracktap_ibfk_1` FOREIGN KEY (`sessionId`) REFERENCES `sessions` (`sessionId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessionstates_tracktap`
--

LOCK TABLES `sessionstates_tracktap` WRITE;
/*!40000 ALTER TABLE `sessionstates_tracktap` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessionstates_tracktap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testitems`
--

DROP TABLE IF EXISTS `testitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `testitems` (
  `test` int(11) NOT NULL,
  `type` int(10) unsigned NOT NULL,
  `item` int(10) unsigned NOT NULL,
  `seq` int(10) unsigned NOT NULL,
  UNIQUE KEY `test` (`test`,`type`,`item`),
  KEY `type` (`type`,`item`),
  KEY `testitems_type` (`type`),
  KEY `testitems_item` (`item`),
  KEY `testitems_seq` (`seq`),
  CONSTRAINT `testitems_ibfk_1` FOREIGN KEY (`test`) REFERENCES `tests` (`test`),
  CONSTRAINT `testitems_ibfk_2` FOREIGN KEY (`type`) REFERENCES `types` (`type`),
  CONSTRAINT `testitems_ibfk_3` FOREIGN KEY (`type`, `item`) REFERENCES `items` (`type`, `item`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testitems`
--

LOCK TABLES `testitems` WRITE;
/*!40000 ALTER TABLE `testitems` DISABLE KEYS */;
INSERT INTO `testitems` VALUES (5,2000,1,1),(1,2000,1,2),(2,2000,1,2),(3,2000,1,2),(4,2000,1,2),(5,2000,2,2),(1,2000,2,3),(2,2000,2,3),(3,2000,2,3),(4,2000,2,3),(5,2000,3,3),(1,2000,3,4),(2,2000,3,4),(3,2000,3,4),(4,2000,3,4),(5,2071,1,4),(1,2071,1,5),(2,2071,1,5),(3,2071,1,5),(4,2071,1,5),(5,2072,1,5),(1,2071,3,6),(2,2071,3,6),(3,2071,3,6),(4,2071,3,6),(5,2073,1,6),(1,2072,1,7),(2,2072,1,7),(3,2072,1,7),(4,2072,1,7),(5,2040,9,7),(1,2073,1,8),(2,2073,1,8),(3,2073,1,8),(4,2073,1,8),(5,2066,0,8),(1,2073,4,9),(2,2073,4,9),(3,2073,4,9),(4,2073,4,9),(5,2066,1,9),(1,2091,0,10),(2,2091,0,10),(3,2091,0,10),(4,2091,0,10),(5,2062,0,10),(1,2040,4,11),(2,2040,7,11),(3,2040,9,11),(4,2040,10,11),(5,2062,1,11),(1,2070,0,12),(2,2070,0,12),(3,2070,0,12),(4,2070,0,12),(5,2093,0,12),(1,2070,1,13),(2,2070,2,13),(3,2070,3,13),(4,2070,4,13),(5,2062,2,13),(1,2062,0,14),(2,2062,0,14),(3,2062,0,14),(4,2062,0,14),(5,2064,1,14),(1,2062,1,15),(2,2062,1,15),(3,2062,1,15),(4,2062,1,15),(5,2064,2,15),(1,2095,0,16),(2,2095,0,16),(3,2095,0,16),(4,2095,0,16),(5,2064,3,16),(1,2062,2,17),(2,2062,2,17),(3,2062,2,17),(4,2062,2,17),(5,2032,1,17),(1,2064,1,18),(2,2064,1,18),(3,2064,1,18),(4,2064,1,18),(5,2094,0,18),(1,2064,2,19),(2,2064,2,19),(3,2064,2,19),(4,2064,2,19),(5,2023,2,19),(1,2064,3,20),(2,2064,3,20),(3,2064,3,20),(4,2064,3,20),(5,2067,0,20),(1,2098,0,21),(2,2098,0,21),(3,2098,0,21),(4,2098,0,21),(5,2067,2,21),(1,2032,1,22),(2,2032,1,22),(3,2032,1,22),(4,2032,1,22),(5,2074,0,22),(1,2094,0,23),(2,2094,0,23),(3,2094,0,23),(4,2094,0,23),(5,2074,2,23),(1,2023,1,24),(2,2023,2,24),(3,2023,3,24),(4,2023,5,24),(5,2041,9,24),(1,2067,0,25),(2,2067,0,25),(3,2067,0,25),(4,2067,0,25),(5,2100,4,25),(1,2067,1,26),(2,2067,2,26),(3,2067,3,26),(4,2067,4,26),(5,2096,0,26),(1,2044,0,27),(2,2044,0,27),(3,2044,0,27),(4,2044,0,27),(1,2044,1,28),(2,2044,2,28),(3,2044,3,28),(4,2044,4,28),(1,2044,5,29),(2,2044,6,29),(3,2044,7,29),(4,2044,8,29),(1,2044,9,30),(2,2044,10,30),(3,2044,11,30),(4,2044,12,30),(1,2044,13,31),(2,2044,14,31),(3,2044,15,31),(4,2044,16,31),(1,2044,17,32),(2,2044,18,32),(3,2044,19,32),(4,2044,20,32),(1,2074,0,33),(2,2074,0,33),(3,2074,0,33),(4,2074,0,33),(1,2074,1,34),(2,2074,2,34),(3,2074,3,34),(4,2074,4,34),(1,2074,5,35),(2,2074,6,35),(3,2074,7,35),(4,2074,8,35),(1,2041,4,36),(2,2041,7,36),(3,2041,9,36),(4,2041,10,36),(1,2097,0,37),(2,2097,0,37),(3,2097,0,37),(4,2097,0,37),(1,2100,4,38),(2,2100,4,38),(3,2100,4,38),(4,2100,4,38),(1,2096,0,39),(2,2096,0,39),(3,2096,0,39),(4,2096,0,39);
/*!40000 ALTER TABLE `testitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tests`
--

DROP TABLE IF EXISTS `tests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tests` (
  `test` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(1024) DEFAULT NULL,
  `note` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`test`),
  KEY `tests_name` (`name`(767))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tests`
--

LOCK TABLES `tests` WRITE;
/*!40000 ALTER TABLE `tests` DISABLE KEYS */;
INSERT INTO `tests` VALUES (1,'MinProduct','First DataCollection or H/M product'),(2,'Form2','Form 2'),(3,'Form3','Form 3'),(4,'Form4','Form 4'),(5,'DataCollection','First DataCollection or H/M product');
/*!40000 ALTER TABLE `tests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `types`
--

DROP TABLE IF EXISTS `types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `types` (
  `type` int(10) unsigned NOT NULL,
  `format` varchar(255) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `itext` varchar(64) NOT NULL,
  `audio` varchar(255) NOT NULL,
  `video` varchar(255) DEFAULT NULL,
  `timeout` double DEFAULT NULL,
  `replay` int(11) DEFAULT '0',
  `addition` varchar(1024) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`type`),
  KEY `types_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `types`
--

LOCK TABLES `types` WRITE;
/*!40000 ALTER TABLE `types` DISABLE KEYS */;
INSERT INTO `types` VALUES (2000,'xml','Audio_Video_Settings','A/V Settings','','',0,0,'',''),(2001,'audio','Candidate_Info','Candidate Info','','',0,0,'',''),(2023,'audio','Describe_Video','Describe Video','','',0,0,'',''),(2032,'xml','Track_Tap','Tap Target','','',0,0,'',''),(2040,'audio','Retell_Passage','Passage Retell','','',0,0,'',''),(2041,'audio','Re_Retell_Passage','Passage Re-retell','','',0,0,'',''),(2044,'audio','Repeat_Sentence','Repeat Sentence','2044.mp3','',0,0,'EMPTY-50ms.wav',''),(2050,'audio','Control_Attention','Attention Control','2050.mp3','',0,0,'',''),(2062,'audio','Name_Face','Names  Faces','2062.mp3','',0,0,'',''),(2064,'audio','Quick_Lit','Quick Literacy','','',0,0,'',''),(2065,'audio','Double_Request','Double Request','2065.mp3','',0,0,'EMPTY-50ms.wav',''),(2066,'audio','Encounter_Narrative','Encounter Narrative','2066.mp3','',0,0,'',''),(2067,'audio','Explanation','Explanation','2067.mp3','',0,0,'',''),(2068,'audio','Supervision','Supervision','2068.mp3','',0,0,'',''),(2069,'audio','Cooperation','Cooperation','2069.mp3','',0,0,'',''),(2070,'audio','Opinion','Opinion','2070.mp3','',0,0,'',''),(2071,'audio','Anticipate_Feelings','Anticipate Feelings','','',0,0,'',''),(2072,'audio','Education','Education','','',0,0,'',''),(2073,'audio','Work_Experience','Work Experience','','',0,0,'',''),(2074,'audio','Polite_Request','Polite Request','2074.mp3','',0,0,'',''),(2080,'xml','Interpret_Information','Interpret Info.','2080.mp3','',0,0,'',''),(2081,'xml','Find_Errors','Find Errs In Text','2081.mp3','',0,0,'',''),(2082,'xml','Calculation','Calculation','2082.mp3','',0,0,'',''),(2090,'','Transfer1','Transfer','EMPTY-50ms.wav','',0,0,'EMPTY-50ms.wav',''),(2091,'','Transfer2','Transfer','GoodNowSomethingDiff.mp3','',0,0,'',''),(2093,'','Transfer3','Transfer','alright-how-about-this.mp3','',0,0,'',''),(2094,'','Transfer4','Transfer','half-way-through-continue.mp3','',0,0,'',''),(2095,'','Transfer5','Transfer','HeresAnotherOne.mp3','',0,0,'',''),(2096,'','Transfer6','Transfer','thankyou-we-are-done.mp3','',0,0,'',''),(2097,'','Transfer7','Transfer','OKNowThis.mp3','',0,0,'',''),(2098,'','Transfer8','Transfer','GoodNowSomethingDiff.mp3','',0,0,'',''),(2100,'audio','Feedback_Suggestion','Feedback','','',0,0,'','');
/*!40000 ALTER TABLE `types` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-02-13 22:22:39
