'use strict';

const db = require(__dirname + '/../lib/mysql');
const moment = require('moment');

// destroys the active session of the logged in user
exports.user_logout = (req, res, next) => {
  if (req.session.user === undefined) {
    res.status(500).send({message: "There is no active session!"});
  } else {
    req.session.destroy();
    res.status(200).send({message: "You've successfully logged out"});
  }
}