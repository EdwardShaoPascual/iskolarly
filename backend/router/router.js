'use strict';

const controller = require(__dirname + '/../controller/controller.js');
const questionnaires = require(__dirname + '/../controller/questionnaires.js');
const landing_controller = require(__dirname + '/../controller/landing.controller.js');

module.exports = (router) => {
  // landing page routes
	router.post('/api/login',	 			                  landing_controller.login);
  
  // quiz page routes  
  router.get('/quiz',                               questionnaires.view_questionnaires);

	router.all('*', (req, res, next) => {
	  res.status(404).send({message: 'Unmatched route :('});
	});

	return router;

}