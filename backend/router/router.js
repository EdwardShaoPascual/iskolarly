'use strict';

const question_controller = require(__dirname + '/../controller/questionnaires.js');
const landing_controller = require(__dirname + '/../controller/landing.controller.js');

module.exports = (router) => {

  // -- LANDING PAGE ROUTES --
  // POST
  router.post('/api/login',	 			                  landing_controller.login);
  router.post('/api/register',	 			              landing_controller.register);
  
  // quiz page routes  
  router.get('/api/view_quiz',                               question_controller.view_questionnaires);
  router.get('/api/get_info_quiz/:question_id',              question_controller.get_info_questionnaires);

  router.post('/api/add_quiz',                              question_controller.add_questionnaires);
  router.post('/api/edit_quiz',                             question_controller.edit_questionnaires);
  router.post('/api/delete_quiz/:question_id',              question_controller.delete_questionnaires);
  
	router.all('*', (req, res, next) => {
	  res.status(404).send({message: 'Unmatched route :('});
	});

	return router;

}