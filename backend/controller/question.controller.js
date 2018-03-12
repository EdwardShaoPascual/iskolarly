'use strict';

const db = require(__dirname + '/../lib/mysql');

exports.view_questions = (req, res, next) => {
  let query_string = 'SELECT * FROM questions WHERE questionnaire_id = ?';
  let request_data = [req.params.questionnaire_id]

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
}

exports.get_questions = (req, res, next) => {
  let query_string = 'SELECT * FROM questionnaires WHERE questionnaire_id = ?';
  let request_data = [req.params.questionnaire_id]

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
}

exports.check_questions = (req, res, next) => {
  let query_string = 'SELECT COUNT(*) AS size, qe.questionnaire_no FROM questions qn, questionnaires qe WHERE qe.questionnaire_id = ? AND qn.questionnaire_id = ?'
  let request_data = [req.query.questionnaire_id, req.query.questionnaire_id]

  db.query(query_string, request_data, (err, result) => {
    if (result[0].size >= result[0].questionnaire_no) {
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
