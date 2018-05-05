'use strict';

const bcrypt      = require('bcrypt');
const dateFormat  = require('dateformat');
const moment      = require('moment');

const db = require(__dirname + '/../lib/mysql');
// const winston = require('winston');

exports.get_quiz = (req, res, next) => {
  let query_string = 'SELECT qn.*, qe.questionnaire_name FROM questions qn, questionnaires qe WHERE qn.questionnaire_id = ? AND qe.questionnaire_id = ?';
  let request_data = [req.params.questionnaire_id, req.params.questionnaire_id]
  if (req.session.user === undefined) {
    res.status(500).send({message: "There is no active session!"});
  } else {
    db.query(query_string, request_data, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        let query = 'INSERT INTO activity_log (activity_type, activity_info) VALUES (?,?)';
        let request = '[' + moment().format() + '] user=' + req.session.user.username + ' user_id=' + req.session.user.user_id + ' time=' + moment().format() + ' questionnaire_id=' + req.params.questionnaire_id + ' ipv4=' + req.query.ip;
        let activity = "Quiz Start";
        db.query(query, [activity, request], (error, rest, args, last_query) => {
          if (error) {
            return res.status(500).send({message: "An error has encountered"})
          } else {
            let return_data = [];
            return_data[0] = result;
            return_data[1] = rest.insertId;
            res.send(return_data);
          }
        });
      }
    });
  }
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
  let query_str = 'SELECT attempted_ans FROM quiz WHERE questionnaire_id = ?';
  let req_data = [req.query.questionnaire_id]

  db.query(query_str, req_data, (errt, rest) => {
    if (errt) {
      return res.status(500).send({message: "An error has encountered"})
    } else {
      let query_string = 'INSERT INTO activity_log (activity_type, activity_info) VALUES (?,?)';
      let request_data = '[' + moment().format() + '] user=' + req.session.user.username + ' user_id=' + req.session.user.user_id + ' time=' + moment().format() + ' questionnaire_id=' + req.query.questionnaire_id + ' score=' + req.query.score + ' attempt=' + (rest[0].attempted_ans+1) + ' ipv4=' + req.query.ip + ' reference_id=' + req.query.activity_quiz;
      let activity = "Quiz End";
      console.log("X");
      db.query(query_string, [activity, request_data], (err, result, args, last_query) => {
        if (err) {
          return res.status(500).send({message: "An error has encountered"})
        } else {
          let quer_str = 'UPDATE quiz SET attempted_ans = ? WHERE questionnaire_id = ?';
          let reqt_data = [rest[0].attempted_ans+1, req.query.questionnaire_id]
    
          db.query(quer_str, reqt_data, (error, reslt) => {
            if (error) {
              return res.status(500).send({message: "An error has encountered"})
            } else {
              console.log("Y");
              res.send(result);
            }
          });
        }
      });
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

exports.insert_score = (req, res, next) => {
  let query_string = 'INSERT INTO score (user_id, questionnaire_id, correct_num) VALUES (?, ?, ?)';
  let request_data = [req.session.user.username, req.query.questionnaire_id, req.query.score];

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send({message: "An error has encountered"})
    } else {
      res.send(result);
    }
  });
}