'use strict';

const db       = require(__dirname + '/../lib/mysql');
const moment   = require('moment');
const R        = require('js-call-r');
const fs       = require('fs');

exports.list_questionnaires = (req, res, next) => {
  let query_string = 'SELECT * FROM questionnaires WHERE questionnaires.datetime_end <= (SELECT NOW())';

  db.query(query_string, [], (err, result) => {
    if (err) {
     return res.status(500).send({message: "An error has been encountered"});   
    }
    res.send(result);
  })
}

exports.retrieve_record = (req, res, next) => {
  let query_string = 'select user.student_num, concat(user.lastname, \', \', user.firstname, \' \', user.middlename) as name, scores.* from user, (select user_id, questionnaire_id, max(correct_num) as highest_num from score group by user_id, questionnaire_id) as scores, questionnaires where user.user_id = scores.user_id and questionnaires.questionnaire_id = scores.questionnaire_id and questionnaires.course_id = ? and user.role = ? order by questionnaire_id, name';

  db.query(query_string, [req.query.course_selected, 'Student'], (err, result) => {
    if (err) {
     return res.status(500).send({message: "An error has been encountered"});   
    }
    res.send(result);
  })
}

exports.retrieve_activity_logs = (req, res, next) => {
  let query_string = 'SELECT * FROM activity_log';

  db.query(query_string, [], (err, result) => {
    if (err) {
     return res.status(500).send({message: "An error has been encountered"});   
    }
    res.send(result);
  })
}

exports.retrieve_user = (req, res, next) => {
  let query_string = 'SELECT * FROM course_user NATURAL JOIN (SELECT user_id, firstname, middlename, lastname FROM user) as couser WHERE course_id = ?';

  db.query(query_string, [req.query.course_selected], (err, result) => {
    if (err) {
     return res.status(500).send({message: "An error has been encountered"});   
    }
    res.send(result);
  })
}

exports.retrieve_quiz_items = (req, res, next) => {
  let query_string = 'SELECT * FROM questions_quiz WHERE questionnaire_id = ?';

  db.query(query_string, [req.query.questionnaire_selected], (err, result) => {
    if (err) {
     return res.status(500).send({message: "An error has been encountered"});   
    }
    res.send(result);
  })
}

exports.process_data = (req, res, next) => {
  let key = Object.keys(req.body)[0];
  key = "[" + key + "]"
  key = key.replace(/ /g, '+');
  fs.writeFile(__dirname + "/../../activity.json", key, function(err) {
    if(err) {
      return res.status(500).send(err);
    }
    const result = R.call(__dirname + '/../scripts/assoc.R', key)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    })
  }); 
}
