'use strict';

const controller = require(__dirname + '/../controller/controller.js');
const questionnaires = require(__dirname + '/../controller/questionnaires.js');

module.exports = (router) => {
	router.get('/quiz', questionnaires.view_questionnaires);

	router.all('*', (req, res, next) => {
	  res.status(404).send({message: 'Unmatched route :('});
	});

	return router;

}