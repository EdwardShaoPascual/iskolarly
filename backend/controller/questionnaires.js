'use strict';

const db = require(__dirname + '/../lib/mysql');
// const winston = require('winston');

exports.view_questionnaires = (req, res, next) => {
  let query_string = 'SELECT * FROM questionnaires';

  db.query(query_string, [], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
}

exports.add_questionnaires = (req, res, next) => {
  let query_string = 'INSERT INTO questionnaires (question_name, question_desc) VALUES (?, ?)'
  let request_data = [req.query.question_name, req.query.question_desc]

  if (!req.query.question_name || !req.query.question_desc) {
    console.log("Fill all the fields");
    return res.status(400).send("Fill all the fields");
  }

  db.query(query_string, request_data, (err, result) => {
      res.send(result);
  });
}

exports.get_info_questionnaires = (req, res, next) => {
  let query_string = 'SELECT * FROM questionnaires WHERE question_id = ?';
  let request_data = [req.params.question_id]

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
}

exports.edit_questionnaires = (req, res, next) => {
  let query_string = 'UPDATE questionnaires SET question_name = ?, question_desc = ? WHERE question_id = ?'
  let request_data = [req.query.question_name, req.query.question_desc, req.query.question_id]

  if (!req.query.question_name || !req.query.question_desc) {
    console.log("Fill all the fields");
    return res.status(400).send("Fill all the fields");
  }

  db.query(query_string, request_data, (err, result) => {
      res.send(result);
  });
}

exports.delete_questionnaires = (req, res, next) => {
  let query_string = 'DELETE FROM questionnaires WHERE question_id = ?';
  let request_data = [req.params.question_id]

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
}