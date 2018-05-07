'use strict';

const question_controller = require(__dirname + '/../controller/question.controller.js');
const landing_controller = require(__dirname + '/../controller/landing.controller.js');
const quiz_controller = require(__dirname + '/../controller/quiz.controller.js');
const course_controller = require(__dirname + '/../controller/course.controller.js');
const courses_controller = require(__dirname + '/../controller/courses.controller.js');
const nav_controller = require(__dirname + '/../controller/nav.controller.js');
const report_controller = require(__dirname + '/../controller/report.controller.js');
const attempt_controller = require(__dirname + '/../controller/attempt.controller.js');

module.exports = (router) => {

  // -- LANDING PAGE ROUTES --
  // POST
  router.post('/api/login',	 			                                    landing_controller.login);
  router.post('/api/register',	 			                                landing_controller.register);
  
  // -- COURSE PAGE ROUTES --
  // GET
  router.get('/api/stud_view_announcement',                           course_controller.stud_view_announcements);
  router.get('/api/inst_view_announcement',                           course_controller.inst_view_announcements);
  router.get('/api/retrieve_course',                                  course_controller.retrieve_course);  
  router.get('/api/retrieve_announcement',                            course_controller.retrieve_announcement);  
  router.get('/api/view_questionnaire',                               course_controller.view_questionnaires);
  router.get('/api/get_info_questionnaire/:questionnaire_id',         course_controller.get_info_questionnaires);

  // POST
  router.post('/api/post_note',                                       course_controller.post_note);
  router.post('/api/add_questionnaire',                               course_controller.add_questionnaires);
  router.post('/api/edit_questionnaire',                              course_controller.edit_questionnaires);
  router.post('/api/delete_questionnaire/:questionnaire_id',          course_controller.delete_questionnaires);
  router.post('/api/upload_attachment',                               course_controller.upload_attachment);
  router.post('/api/delete_post/:announcement_id',                    course_controller.delete_post);
  
  // -- QUESTION PAGE ROUTES --
  // GET
  router.get('/api/view_question/:questionnaire_id',                  question_controller.view_questions);
  router.get('/api/get_question/:questionnaire_id',                   question_controller.get_questions);
  router.get('/api/view_answer/:question_id',                         question_controller.view_answers);  
  router.get('/api/get_info_question/:question_id',                   question_controller.get_info_questions);
  
  // POST
  router.post('/api/check_question',                                  question_controller.check_questions);
  router.post('/api/add_question',                                    question_controller.add_questions);
  router.post('/api/delete_question/:question_id',                    question_controller.delete_questions);
  router.post('/api/add_answer',                                      question_controller.add_answers);
  router.post('/api/delete_answer/:answer_id',                        question_controller.delete_answers);
  router.post('/api/publish_quiz/',                                   question_controller.publish_quiz);
  
  // -- QUIZ PAGE ROUTES --
  // GET
  router.get('/api/get_quiz/:questionnaire_id',                       quiz_controller.get_quiz);
  router.get('/api/get_answer/:question_id',                          quiz_controller.get_answers);

  // POST
  router.post('/api/insert_quizlog',                                  quiz_controller.insert_quizlog);
  router.post('/api/insert_questionlog',                              quiz_controller.insert_questionlog);
  router.post('/api/insert_score',                                    quiz_controller.insert_score);
  
  // -- COURSES PAGE ROUTES --
  // GET
  router.get('/api/check_attempt/:questionnaire_id',                  courses_controller.check_attempt);
  router.get('/api/check_quiz/:questionnaire_id',                     courses_controller.check_quiz);
  router.get('/api/check_course/:course_id',                          courses_controller.check_course);
  router.get('/api/check_inst',                                       courses_controller.check_inst);
  router.get('/api/check_auth',                                       courses_controller.check_auth);
  router.get('/api/view_courses',                                     courses_controller.view_courses);
  
  // POST
  router.post('/api/create_course',                                   courses_controller.create_course);
  router.post('/api/enroll_course',                                   courses_controller.enroll_course);

  // -- NAV ROUTES --
  // POST
  router.post('/api/logout',                                          nav_controller.user_logout);

  // -- REPORT PAGE ROUTES --
  // GET
  router.get('/api/list_questionnaires',                              report_controller.list_questionnaires);
  router.get('/api/retrieve_user',                                    report_controller.retrieve_user);
  router.get('/api/retrieve_activity_logs',                           report_controller.retrieve_activity_logs);
  router.get('/api/retrieve_quiz_items',                              report_controller.retrieve_quiz_items);
  
  // -- ATTEMPT PAGE ROUTES --
  // GET
  router.get('/api/view_attempt/:questionnaire_id',                   attempt_controller.view_attempt);

	router.all('*', (req, res, next) => {
	  res.status(404).send({message: 'Unmatched route :('});
	});  

	return router;

}