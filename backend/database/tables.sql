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
	course						varchar(256),
	birthday					date NOT NULL,
	role						enum('Student', 'Instructor') NOT NULL,
	college						enum('CA','CAS','CDC','CEAT','CEM','CFNR','CHE','CPAf','CVM','SESAM','GS'),
	UNIQUE						(username),
	UNIQUE						(email),
	PRIMARY KEY					(user_id)
);

DROP TABLE IF EXISTS course;
CREATE TABLE course (
	course_id						int NOT NULL AUTO_INCREMENT,
	course_title					varchar(256) NOT NULL,
	course_description				varchar(256) NOT NULL,
	user_id							int NOT NULL,
	PRIMARY KEY						(course_id),
	CONSTRAINT						`fk_course_user`
		FOREIGN KEY (user_id) REFERENCES user (user_id)
		ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS course_code;
CREATE TABLE course_code (
	course_code						varchar(256),
	time_start						date NOT NULL,
	time_end						date NOT NULL,
	course_id						int NOT NULL,
	PRIMARY KEY						(course_code),
	CONSTRAINT						`fk_course_code_course`
		FOREIGN KEY (course_id) REFERENCES course (course_id)
		ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS course_user;
CREATE TABLE course_user (
	course_user_id					int NOT NULL AUTO_INCREMENT,
	course_id						int NOT NULL,
	user_id							int NOT NULL,
	PRIMARY KEY						(course_user_id),
	CONSTRAINT						`fk_course_user_course`
		FOREIGN KEY (course_id) REFERENCES course (course_id)
		ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT						`fk_course_user_user`
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

DROP TABLE IF EXISTS answers;
CREATE TABLE answers (
	answer_id						int NOT NULL AUTO_INCREMENT,
	question_id						int NOT NULL,
	choices							varchar(256) NOT NULL,
	is_right						enum("Yes", "No") NOT NULL,
	PRIMARY KEY						(answer_id),
	CONSTRAINT						`fk_answers_questions`
		FOREIGN KEY (question_id) REFERENCES questions (question_id)
		ON UPDATE CASCADE ON DELETE CASCADE
);

delimiter |

CREATE TRIGGER tr_course_course_code AFTER INSERT ON `course` 
	FOR EACH ROW
	BEGIN
		INSERT INTO course_code VALUES (SUBSTRING(MD5(RAND()) FROM 1 FOR 6), NOW(), DATE_ADD(NOW(), INTERVAL 31 DAY), NEW.course_id);
	END;|  
delimiter ;
