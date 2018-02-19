'use strict';

const db = require(__dirname + '/../lib/mysql');
// const winston = require('winston');

exports.view_questions = (req, res, next) => {
  let query_string = 'SELECT DISTINCT qr.questionnaire_name, qt.* FROM questions qt, questionnaires qr WHERE qt.questionnaire_id = ? AND qr.questionnaire_id = ?';
  let request_data = [req.params.questionnaire_id, req.params.questionnaire_id]

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
}

exports.add_questions = (req, res, next) => {
  let query_string = 'INSERT INTO questions (questionnaire_id, question_desc) VALUES (?, ?)'
  let request_data = [req.query.questionnaire_id, req.query.question_desc]

  if (!req.query.question_desc) {
    console.log("Fill all the fields");
    return res.status(400).send("Fill all the fields");
  }

  db.query(query_string, request_data, (err, result) => {
      res.send(result);
  });
}
