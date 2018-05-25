'use strict';

const db = require(__dirname + '/../lib/mysql');

// getting the questions based on the quiz id
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

// getting the quiz for display
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

// checking the validity and the number of questions needed for a quiz
exports.check_questions = (req, res, next) => {
  let query_string = 'SELECT COUNT(*) AS size, qe.items FROM questions qn, questionnaires qe WHERE qe.questionnaire_id = ? AND qn.questionnaire_id = ?'
  let request_data = [req.query.questionnaire_id, req.query.questionnaire_id]

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
}

// posting new questions for a specific quiz
exports.add_questions = (req, res, next) => {
  let query_string = 'INSERT INTO questions (questionnaire_id, question_desc, type) VALUES (?, ?, ?)'
  let request_data = [req.query.questionnaire_id, req.query.question_desc, req.query.type]

  if (!req.query.question_desc && !req.query.type) {
    return res.status(400).send("Fill all the fields");
  }

  db.query(query_string, request_data, (err, result) => {
    res.send(result);
  });
}

// deleting questions for a specific quiz
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

// getting the information of the questions for displaying
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

// getting the answers for a specific question
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

// adding new answers for a specific question
exports.add_answers = (req, res, next) => {
  let query_string = 'INSERT INTO answers (question_id, choices, is_right) VALUES ((SELECT question_id FROM questions ORDER BY question_id DESC LIMIT 1), ?, ?)'
  let request_data = [req.query.choices, req.query.is_right]

  db.query(query_string, request_data, (err, result) => {
    res.send(result);
  });
}

// deleting answers for a specific question
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

// publishing quiz to make it accessible for the students
exports.publish_quiz = (req, res, next) => {
  let query_string = 'INSERT INTO questions_quiz (questionnaire_id, question_no, attempts) VALUES (?,?,?)';
  let request_data = [req.query.questionnaire_id, req.query.question_no, req.query.attempts]

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
}