'use strict';

const db = require(__dirname + '/../lib/mysql');
const fs = require('fs');
const config = require('../config/config');

exports.logout = function(req, res, next) {
	if (req.session.user) {
        req.session.destroy();
        res.send({message: 'Logged out successfully!'});
	} else {
		res.status(401).send({message: "You must be logged in."});
	}
}