'use strict';

const questionnaire_controller = require(__dirname + '/../controller/questionnaire.controller.js');
const question_controller = require(__dirname + '/../controller/question.controller.js');
const landing_controller = require(__dirname + '/../controller/landing.controller.js');
const quiz_controller = require(__dirname + '/../controller/quiz.controller.js');
const courses_controller = require(__dirname + '/../controller/courses.controller.js');

module.exports = (router) => {

  // -- LANDING PAGE ROUTES --
  // POST
  router.post('/api/login',	 			                  landing_controller.login);
  router.post('/api/register',	 			              landing_controller.register);
  
  // -- QUESTIONNAIRE PAGE ROUTES --
  // GET
  router.get('/api/view_questionnaire',                               questionnaire_controller.view_questionnaires);
  router.get('/api/get_info_questionnaire/:questionnaire_id',         questionnaire_controller.get_info_questionnaires);

  // POST
  router.post('/api/add_questionnaire',                               questionnaire_controller.add_questionnaires);
  router.post('/api/edit_questionnaire',                              questionnaire_controller.edit_questionnaires);
  router.post('/api/delete_questionnaire/:questionnaire_id',          questionnaire_controller.delete_questionnaires);

  // -- QUESTION PAGE ROUTES --
  // GET
  router.get('/api/view_question/:questionnaire_id',                  question_controller.view_questions);
  router.get('/api/get_question/:questionnaire_id',                   question_controller.get_questions);
  
  // POST
  router.post('/api/check_question',                                  question_controller.check_questions);
  router.post('/api/add_question',                                    question_controller.add_questions);
  router.post('/api/delete_question/:question_id',                    question_controller.delete_questions);
  
  // -- QUIZ PAGE ROUTES --
  // GET
  router.get('/api/get_quiz/:questionnaire_id',                        quiz_controller.get_quiz);

  // -- COURSE PAGE ROUTES --
  // GET
  router.get('/api/check_auth',                                       courses_controller.check_auth);
  router.get('/api/view_courses',                                     courses_controller.view_courses);
  
	router.all('*', (req, res, next) => {
	  res.status(404).send({message: 'Unmatched route :('});
	});  

	return router;

}