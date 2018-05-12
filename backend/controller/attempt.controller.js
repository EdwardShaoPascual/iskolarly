'use strict';

const db = require(__dirname + '/../lib/mysql');
const moment = require('moment');

exports.view_attempt = (req,res, next) => {
  let query_string = 'SELECT * FROM questionnaires NATURAL JOIN questions_quiz NATURAL JOIN quiz WHERE questionnaire_id = ? AND user_id = ?';
  let request_data = [req.params.questionnaire_id, req.session.user.user_id]
  
  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send({message: "An error has encountered"});
    } else {
      res.send(result);
    }
  });
}

exports.get_time = (req, res, next) => {
  let query_string = 'SELECT * FROM questionnaires WHERE questionnaire_id = ? AND datetime_end >= ?';
  let request_data = [req.query.questionnaire_id, req.query.datetime]

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
}