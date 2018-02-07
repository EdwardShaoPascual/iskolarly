'use strict';

const landing_controller = require(__dirname + '/../controller/landing.controller.js');

module.exports = (router) => {

  // landing page routes
	router.post('/api/login',	 			                  landing_controller.login);
	return router;

}