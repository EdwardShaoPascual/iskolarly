'use strict';

const question_controller = require(__dirname + '/../controller/questionnaires.js');
const landing_controller = require(__dirname + '/../controller/landing.controller.js');

module.exports = (router) => {

  // -- LANDING PAGE ROUTES --
  // POST
  router.post('/api/login',	 			                  landing_controller.login);
  router.post('/api/register',	 			              landing_controller.register);
  
  // quiz page routes  
  router.get('/quiz',                               question_controller.view_questionnaires);

	router.all('*', (req, res, next) => {
	  res.status(404).send({message: 'Unmatched route :('});
	});

	return router;

}