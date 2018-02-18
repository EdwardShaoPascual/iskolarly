DROP USER IF EXISTS 'CMSC190'@'localhost';
CREATE USER 'CMSC190'@'localhost' IDENTIFIED BY 'specialprob';
DROP DATABASE IF EXISTS iskolarly;
CREATE DATABASE iskolarly;
GRANT SUPER ON *.* TO 'CMSC190'@'localhost';
GRANT ALL PRIVILEGES ON iskolarly.* TO 'CMSC190'@'localhost' WITH GRANT OPTION;

USE iskolarly;

DROP TABLE IF EXISTS user;
CREATE TABLE user (
	user_id						int NOT NULL AUTO_INCREMENT,
	firstname					varchar(256) NOT NULL,
	middlename					varchar(256) NOT NULL,
	lastname					varchar(256) NOT NULL,
	email						varchar(256) NOT NULL,
	username					varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
	password					varchar(256) NOT NULL,
	course						varchar(256) NOT NULL,
	birthday					date NOT NULL,
	college						enum('CA','CAS','CDC','CEAT','CEM','CFNR','CHE','CPAf','CVM','SESAM','GS') NOT NULL,
	UNIQUE						(username),
	PRIMARY KEY					(user_id)
);

DROP TABLE IF EXISTS course;
CREATE TABLE course (
	course_id						int NOT NULL AUTO_INCREMENT,
	course_title					varchar(256),
	course_description				varchar(256),
	user_id							int NOT NULL,
	PRIMARY KEY						(course_id),
	CONSTRAINT						`fk_course_user`
		FOREIGN KEY (user_id) REFERENCES user (user_id)
		ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS activity;
CREATE TABLE activity (
	activity_id 						int NOT NULL AUTO_INCREMENT,
	activity_title						varchar(256),
	activity_description				varchar(256),
	user_id								int NOT NULL,
	course_id 							int NOT NULL,
	PRIMARY KEY							(activity_id),
	CONSTRAINT							`fk_activity_user`
		FOREIGN KEY (user_id) REFERENCES user (user_id)
		ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT							`fk_activity_course`
		FOREIGN KEY (course_id) REFERENCES course (course_id)
		ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS attachment;
CREATE TABLE attachment (
	attachment_id					int NOT NULL AUTO_INCREMENT,
	file_format						varchar(256),
	type							enum('Handout','Task','Sample','Exercise') NOT NULL,
	activity_id						int NOT NULL,
	PRIMARY KEY						(attachment_id),
	CONSTRAINT						`fk_attachment_activity`
		FOREIGN KEY (activity_id) REFERENCES activity (activity_id)
		ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS record;
CREATE TABLE record (
	record_id						int NOT NULL AUTO_INCREMENT,
	activity_id						int NOT NULL,
	attachment_id					int NOT NULL,
	PRIMARY KEY						(record_id),
	CONSTRAINT						`fk_record_activity`
		FOREIGN KEY (activity_id) REFERENCES activity (activity_id)
		ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT						`fk_record_attachment`
		FOREIGN KEY (attachment_id) REFERENCES attachment (attachment_id)
		ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS questionnaires;
CREATE TABLE questionnaires (
	questionnaire_id				int NOT NULL AUTO_INCREMENT,
	questionnaire_name				varchar(256) NOT NULL,
	questionnaire_desc				varchar(256) NOT NULL,
	questionnaire_no				int NOT NULL,
	PRIMARY KEY						(questionnaire_id)
);

DROP TABLE IF EXISTS questions;
CREATE TABLE questions (
	question_id						int NOT NULL AUTO_INCREMENT,
	questionnaire_id				int NOT NULL,
	question_desc					varchar(256) NOT NULL,
	PRIMARY KEY						(question_id),
	CONSTRAINT						`fk_questions_questionnaires`
		FOREIGN KEY (questionnaire_id) REFERENCES questionnaires (questionnaire_id)
		ON UPDATE CASCADE ON DELETE CASCADE
);