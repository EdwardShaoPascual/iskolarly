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
	student_num					int,
	email						varchar(256) NOT NULL,
	username					varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
	password					varchar(256) NOT NULL,
	course						varchar(256),
	birthday					date NOT NULL,
	role						enum('Student', 'Instructor') NOT NULL,
	college						enum('CA','CAS','CDC','CEAT','CEM','CFNR','CHE','CPAf','CVM','SESAM','GS'),
	UNIQUE						(username),
	UNIQUE						(email),
	UNIQUE						(student_num),
	PRIMARY KEY					(user_id)
);

DROP TABLE IF EXISTS course;
CREATE TABLE course (
	course_id						int NOT NULL AUTO_INCREMENT,
	course_title					varchar(256) NOT NULL,
	course_section					varchar(256) NOT NULL,
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
	attachment_name					varchar(256) NOT NULL,
	url								text NOT NULL,								
	type							enum('Handout','Task','Sample','Exercise') NOT NULL,
	PRIMARY KEY						(attachment_id)
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
	course_id						int NOT NULL,
	questionnaire_name				varchar(256) NOT NULL,
	questionnaire_desc				varchar(256) NOT NULL,
	items							int NOT NULL,
	datetime_start					datetime NOT NULL,
	datetime_end					datetime NOT NULL,
	published						boolean NOT NULL DEFAULT 0,
	PRIMARY KEY						(questionnaire_id),
	CONSTRAINT						`fk_questionnaires_course`
		FOREIGN KEY (course_id) REFERENCES course (course_id)
		ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS questions;
CREATE TABLE questions (
	question_id						int NOT NULL AUTO_INCREMENT,
	questionnaire_id				int NOT NULL,
	question_desc					varchar(256) NOT NULL,
	type							enum("Text", "Image") NOT NULL,
	PRIMARY KEY						(question_id),
	CONSTRAINT						`fk_questions_questionnaires`
		FOREIGN KEY (questionnaire_id) REFERENCES questionnaires (questionnaire_id)
		ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS questions_quiz;
CREATE TABLE questions_quiz (
	questionnaire_id				int NOT NULL,
	question_no						int NOT NULL,
	attempts						int NOT NULL,
	CONSTRAINT						`fk_questions_quiz_questionnaires`
		FOREIGN KEY (questionnaire_id) REFERENCES questionnaires (questionnaire_id)
		ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS quiz;
CREATE TABLE quiz (
	quiz_id								int NOT NULL AUTO_INCREMENT,
	user_id								int NOT NULL,
	questionnaire_id					int NOT NULL,
	attempted_ans						int NOT NULL,
	-- score								int NOT NULL,
	PRIMARY KEY							(quiz_id),
	CONSTRAINT							`fk_quiz_user`
		FOREIGN KEY (user_id) REFERENCES user (user_id)
		ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT							`fk_quiz_questionnaires`
		FOREIGN KEY (questionnaire_id) REFERENCES questionnaires (questionnaire_id)
		ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS answers;
CREATE TABLE answers (
	answer_id						int NOT NULL AUTO_INCREMENT,
	question_id						int NOT NULL,
	choices							text NOT NULL,
	is_right						enum("Yes", "No") NOT NULL,
	PRIMARY KEY						(answer_id),
	CONSTRAINT						`fk_answers_questions`
		FOREIGN KEY (question_id) REFERENCES questions (question_id)
		ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS score;
CREATE TABLE score (
	score_id						int NOT NULL AUTO_INCREMENT,
	user_id							int NOT NULL,
	questionnaire_id				int NOT NULL,
	correct_num						int NOT NULL,
	PRIMARY KEY						(score_id),
	CONSTRAINT						`fk_score_user`
		FOREIGN KEY (user_id) REFERENCES user (user_id)
		ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT						`fk_score_questionnaires`
		FOREIGN KEY (questionnaire_id) REFERENCES questionnaires (questionnaire_id)
		ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS activity_log;
CREATE TABLE activity_log (
	activity_id						int NOT NULL AUTO_INCREMENT,
	activity_type					varchar(256) NOT NULL,
	activity_info					varchar(256) NOT NULL,
	PRIMARY KEY						(activity_id)
);

DROP TABLE IF EXISTS announcement;
CREATE TABLE announcement (
	announcement_id					int NOT NULL AUTO_INCREMENT,
	course_id						int NOT NULL,
	user_id							int NOT NULL,
	questionnaire_id				int DEFAULT NULL,
	attachment_id					int DEFAULT NULL,
	post							text NOT NULL,
	time_posted						datetime NOT NULL,
	PRIMARY KEY						(announcement_id),
	CONSTRAINT						`fk_announcement_course`
		FOREIGN KEY (course_id) REFERENCES course (course_id)
		ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT						`fk_announcement_user`
		FOREIGN KEY (user_id) REFERENCES user (user_id)
		ON UPDATE CASCADE ON DELETE CASCADE
);

delimiter |

CREATE TRIGGER tr_course_course_code AFTER INSERT ON `course` 
	FOR EACH ROW
	BEGIN
		INSERT INTO course_code VALUES (SUBSTRING(MD5(RAND()) FROM 1 FOR 6), NOW(), DATE_ADD(NOW(), INTERVAL 31 DAY), NEW.course_id);
	END;|  
delimiter ;

delimiter |

CREATE TRIGGER in_occupy_trig AFTER INSERT ON `questions_quiz` 
	FOR EACH ROW
	BEGIN
		UPDATE questionnaires SET published = '1' WHERE questionnaire_id = NEW.questionnaire_id;
	END;|
delimiter ;

-- delimiter |

-- CREATE TRIGGER del_occupy_trig AFTER DELETE ON `answers` 
-- 	FOR EACH ROW
-- 	BEGIN
-- 		UPDATE questions SET has_answer = NULL WHERE question_id = OLD.question_id;
-- 	END;|
-- delimiter ;