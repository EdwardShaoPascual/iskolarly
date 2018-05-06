'use strict';

const db = require(__dirname + '/../lib/mysql');
const moment = require('moment');

exports.list_questionnaires = (req, res, next) => {
  let query_string = 'SELECT * FROM questionnaires WHERE questionnaires.datetime_end <= (SELECT CURRENT_TIMESTAMP())';

  db.query(query_string, [], (err, result) => {
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