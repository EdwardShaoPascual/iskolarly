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
  let query_string = 'INSERT INTO questions (questionnaire_id, question_desc, type) VALUES (?, ?, ?)'
  let request_data = [req.query.questionnaire_id, req.query.question_desc, req.query.type]

  if (!req.query.question_desc && !req.query.type) {
    console.log("Fill all the fields");
    return res.status(400).send("Fill all the fields");
  }

  db.query(query_string, request_data, (err, result) => {
    res.send(result);
  });
}

exports.delete_questions = (req, res, next) => {
  let query_string = 'DELETE FROM questions WHERE question_id = ?';
  let request_data = [req.params.question_id]

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
}

exports.get_info_questions = (req, res, next) => {
  let query_string = 'SELECT * FROM questions WHERE question_id = ?';
  let request_data = [req.params.question_id]

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
}

exports.view_answers = (req, res, next) => {
  let query_string = 'SELECT * FROM answers WHERE question_id = ?';
  let request_data = [req.params.question_id]

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
}

exports.add_answers = (req, res, next) => {
  let query_string = 'INSERT INTO answers (question_id, choices, is_right) VALUES ((SELECT question_id FROM questions ORDER BY question_id DESC LIMIT 1), ?, ?)'
  let request_data = [req.query.choices, req.query.is_right]

  db.query(query_string, request_data, (err, result) => {
    res.send(result);
  });
}

exports.delete_answers = (req, res, next) => {
  let query_string = 'DELETE FROM answers WHERE answer_id = ?';
  let request_data = [req.params.answer_id]

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
}