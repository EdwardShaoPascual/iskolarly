'use strict';

const db = require(__dirname + '/../lib/mysql');
// const winston = require('winston');

exports.get_quiz = (req, res, next) => {
  let query_string = 'SELECT qn.* FROM questions qn, questionnaires qe WHERE qn.questionnaire_id = ? AND qe.questionnaire_id = ?';
  let request_data = [req.params.questionnaire_id, req.params.questionnaire_id]

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
}

exports.get_answers = (req, res, next) => {
  let query_string = 'SELECT an.* FROM questions qn, answers an WHERE qn.question_id = ? AND an.question_id = ?';
  let request_data = [req.params.question_id, req.params.question_id]

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
}