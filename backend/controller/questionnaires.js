'use strict';

const db = require(__dirname + '/../lib/mysql');
// const winston = require('winston');

exports.view_questionnaires = (req, res, next) => {
  const query_string = 'SELECT * FROM questionnaires';

  db.query(query_string, [], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.send(result);
      // console.log(result);
    }
  });
}