'use strict';

const db      = require(__dirname + '/../lib/mysql');
const fs      = require('fs');
const bcrypt  = require('bcrypt');

exports.login = function(req, res, next) {
  
  let payload = req.body;

  let queryString = 'SELECT * FROM user WHERE username = ? AND password = ?';
  let saltRounds = 10;
    // Store hash in your password DB.
    
  db.query(queryString, [payload.username, payload.password], (err, result, args, last_query) => {

  });
}