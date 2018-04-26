'use strict';

const bcrypt      = require('bcrypt');
const dateFormat  = require('dateformat');
const moment      = require('moment');

const db = require(__dirname + '/../lib/mysql');
// const winston = require('winston');

exports.get_quiz = (req, res, next) => {
  let query_string = 'SELECT qn.*, qe.questionnaire_name FROM questions qn, questionnaires qe WHERE qn.questionnaire_id = ? AND qe.questionnaire_id = ?';
  let request_data = [req.params.questionnaire_id, req.params.questionnaire_id]

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      let query = 'INSERT INTO activity_log (activity_type, activity_info) VALUES (?,?)';
      let request = '[' + moment().format() + '] user=' + req.session.user.username + ' user_id=' + req.session.user.user_id + ' time=' + moment().format() + ' ipv4=' + req.query.ip;
      let activity = "Quiz " + req.query.questionnaire_id + " Start";
      db.query(query, [activity, request], (error, rest, args, last_query) => {
        if (error) {
          return res.status(500).send({message: "An error has encountered"})
        } else {
          res.send(result);          
        }
      });
    }
  });
}

exports.get_answers = (req, res, next) => {
  let query_string = 'SELECT an.* FROM questions qn, answers an WHERE qn.question_id = ? AND an.question_id = ? ORDER BY RAND() LIMIT 0,4';
  let request_data = [req.params.question_id, req.params.question_id]

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
}

exports.insert_quizlog = (req, res, next) => {
  let query_string = 'INSERT INTO activity_log (activity_type, activity_info) VALUES (?,?)';
  let request_data = '[' + moment().format() + '] user=' + req.session.user.username + ' user_id=' + req.session.user.user_id + ' time=' + moment().format() + ' ipv4=' + req.query.ip;
  let activity = "Quiz " + req.query.questionnaire_id + " End";

  db.query(query_string, [activity, request_data], (err, result, args, last_query) => {
    if (err) {
      return res.status(500).send({message: "An error has encountered"})
    } else {
      res.send(result);
    }
  });
}

exports.insert_questionlog = (req, res, next) => {
  let query_string = 'INSERT INTO activity_log (activity_type, activity_info) VALUES (?,?)';
  let request_data = '[' + moment().format() + '] user=' + req.session.user.username + ' user_id=' + req.session.user.user_id + ' time=' + moment().format() + ' questionnaire_id=' + req.query.questionnaire_id + ' question_id=' + req.query.question_id + ' ipv4=' + req.query.ip;
  let activity = req.query.activity;

  db.query(query_string, [activity, request_data], (err, result, args, last_query) => {
    if (err) {
      return res.status(500).send({message: "An error has encountered"})
    } else {
      res.send(result);
    }
  });
}