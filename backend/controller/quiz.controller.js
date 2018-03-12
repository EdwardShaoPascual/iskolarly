'use strict';

const db = require(__dirname + '/../lib/mysql');
// const winston = require('winston');

exports.get_quiz = (req, res, next) => {
  let query_string = 'SELECT qn.question_id, qn.question_desc FROM questions qn, questionnaires qe WHERE qn.questionnaire_id = ? AND qe.questionnaire_id = ?';
  let request_data = [req.params.questionnaire_id, req.params.questionnaire_id]

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
}