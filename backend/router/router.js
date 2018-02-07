'use strict';

const landing_controller = require(__dirname + '/../controller/landing.controller.js');

module.exports = (router) => {

  // -- LANDING PAGE ROUTES --
  // POST
  router.post('/api/login',	 			                  landing_controller.login);
  router.post('/api/register',	 			              landing_controller.register);
  
	return router;

}