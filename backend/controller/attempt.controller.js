'use strict';

const db = require(__dirname + '/../lib/mysql');
const moment = require('moment');

exports.view_attempt = (req,res, next) => {
  let query_string = 'SELECT * FROM questionnaires NATURAL JOIN questions_quiz NATURAL JOIN quiz WHERE questionnaire_id = ?';
  let request_data = [req.params.questionnaire_id]

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send({message: "An error has encountered"});
    } else {
      res.send(result);
    }
  });
}