'use strict';

const db       = require(__dirname + '/../lib/mysql');
const moment   = require('moment');
const R        = require('js-call-r');
const RScript  = require('r-script');

exports.list_questionnaires = (req, res, next) => {
  let query_string = 'SELECT * FROM questionnaires WHERE questionnaires.datetime_end <= (SELECT CURRENT_TIMESTAMP())';

  db.query(query_string, [], (err, result) => {
    if (err) {
     return res.status(500).send({message: "An error has been encountered"});   
    }
    res.send(result);
  })
}

exports.retrieve_record = (req, res, next) => {
  let query_string = 'select concat(user.lastname, \', \', user.firstname, \' \', user.middlename) as name, scores.* from user, (select user_id, questionnaire_id, max(correct_num) as highest_num from score group by user_id, questionnaire_id) as scores, course_user where user.user_id = scores.user_id = course_user.user_id and course_user.course_id = ? order by questionnaire_id, name';
  // console.log(query_string, req.query.course_selected)
  db.query(query_string, [req.query.course_selected], (err, result) => {
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
  let stringified = "["
  for (let i=0; i<req.query.count; i++) {
    stringified += req.query.datum[i]
    if (i !== req.query.count - 1) {
      stringified += ','
    }
  }
  stringified += "]"
  const result = R.call(__dirname + '/../scripts/assoc.R', stringified)
  .then((result) => {
    res.send(result);
  })
  .catch((err) => {
    res.status('500').send(err);
  })
}