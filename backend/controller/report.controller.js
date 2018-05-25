'use strict';

const db          = require(__dirname + '/../lib/mysql');
const moment      = require('moment');
const fs          = require('fs');
const async       = require('async');
const shell       = require('shelljs');

// getting the list of questionnaires that are already finished
exports.list_questionnaires = (req, res, next) => {
  let query_string = 'SELECT * FROM questionnaires WHERE questionnaires.datetime_end <= (SELECT NOW())';

  db.query(query_string, [], (err, result) => {
    if (err) {
     return res.status(500).send({message: "An error has been encountered"});   
    }
    res.send(result);
  })
}

// getting the record of the students
exports.retrieve_record = (req, res, next) => {
  let query_string = 'select user.student_num, concat(user.lastname, \', \', user.firstname, \' \', user.middlename) as name, scores.* from user, (select user_id, questionnaire_id, max(correct_num) as highest_num from score group by user_id, questionnaire_id) as scores, questionnaires where user.user_id = scores.user_id and questionnaires.questionnaire_id = scores.questionnaire_id and questionnaires.course_id = ? and user.role = ? order by questionnaire_id, name';

  db.query(query_string, [req.query.course_selected, 'Student'], (err, result) => {
    if (err) {
     return res.status(500).send({message: "An error has been encountered"});   
    }
    res.send(result);
  })
}

// retrieving the activity log for the pattern mining process and for displaying
exports.retrieve_activity_logs = (req, res, next) => {
  let query_string = 'SELECT * FROM activity_log';

  db.query(query_string, [], (err, result) => {
    if (err) {
     return res.status(500).send({message: "An error has been encountered"});   
    }
    res.send(result);
  })
}

// retrieving the user list for individual evaluation
exports.retrieve_user = (req, res, next) => {
  let query_string = 'SELECT * FROM course_user NATURAL JOIN (SELECT user_id, firstname, middlename, lastname FROM user) as couser WHERE course_id = ?';

  db.query(query_string, [req.query.course_selected], (err, result) => {
    if (err) {
     return res.status(500).send({message: "An error has been encountered"});   
    }
    res.send(result);
  })
}

// retrieving the questions of a quiz
exports.retrieve_quiz_items = (req, res, next) => {
  let query_string = 'SELECT * FROM questions_quiz WHERE questionnaire_id = ?';

  db.query(query_string, [req.query.questionnaire_selected], (err, result) => {
    if (err) {
     return res.status(500).send({message: "An error has been encountered"});   
    }
    res.send(result);
  })
}

// the actual preprocessing of data and the actual pattern mining using a spawned shell R script
exports.process_data = (req, res, next) => {
  
  let query_string = 'SELECT * from questionnaires WHERE course_id = ? and datetime_end <= NOW()'
  let payload = [req.query.course_id]
  let stringified = "["
  db.query(query_string, payload, (err,result) => {
    if (result.length !== 0) {
      let new_query_string = 'SELECT * from activity_log WHERE'
      let new_payload = [];
      for (let i=0; i<result.length; i++) {
        new_query_string += ' activity_info LIKE ?'
        new_payload.push('%questionnaire_id=' + result[i].questionnaire_id + '%')
        if (i+1 !== result.length) {
          new_query_string += ' OR'
        }
      }
      db.query(new_query_string, new_payload, (new_err, new_result) => {
        let data_array = [];
        for (let i=0; i<new_result.length; i++) {
          let object = {
            id: null,
            date: null,
            activity_type: null,
            username: null,
            viewed_time: null,
            answered_time: null,
            started_time: null,
            ended_time: null,
            ipv4: null,
            id_question: null,
            score: null
          };

          if (new_result[i].activity_type.includes('Quiz') || new_result[i].activity_type.includes('Question')) {
            if (new_result[i].activity_type === 'Quiz Start') {
              new_result[i].activity_type = 'Quiz-Started';
            } else if (new_result[i].activity_type === 'Quiz End') {
              new_result[i].activity_type = 'Quiz-Ended';
              object.score = new_result[i].activity_info.split(' ')[5].split('=')[1];
            } else if (new_result[i].activity_type === 'Question Viewed') {
              new_result[i].activity_type = 'Question-Viewed';
            } else if (new_result[i].activity_type === 'Question Answered') {
              new_result[i].activity_type = 'Question-Answered';
            }
            let date = moment(new Date(new_result[i].activity_info.split(' ')[0].replace('[','').replace(']',''))).format('ll'); 
            date = date.replace(/,/g, '');
            date = date.replace(/ /g, '-');
            object.date = date;
            object.id = new_result[i].activity_id;
            object.id_questionnaire = new_result[i].activity_info.split(' ')[4].split('=')[1];
            object.activity_type = new_result[i].activity_type;
            object.username = new_result[i].activity_info.split(' ')[1].split('=')[1];
            let data = new_result[i].activity_info.split(' ');
            for (let i=0; i < data.length; i++) {
              if (data[i].includes('ipv4=')) {
                object.ipv4 = data[i].split('=')[1];
              }
            }
            if (new_result[i].activity_type.includes('Question')) {
              object.id_question = new_result[i].activity_info.split(' ')[5].split('=')[1];
              if (new_result[i].activity_type.includes('Viewed')) {
                object.viewed_time = new_result[i].activity_info.split(' ')[0].replace('[','').replace(']','');
              } else {
                object.answered_time = new_result[i].activity_info.split(' ')[0].replace('[','').replace(']','');
              }
            } else {
              if (new_result[i].activity_type.includes('Start')) {
                object.started_time = new_result[i].activity_info.split(' ')[0].replace('[','').replace(']','');
              } else {
                object.ended_time = new_result[i].activity_info.split(' ')[0].replace('[','').replace(']','');
              }
            }
            data_array.push(object);
            stringified = stringified + JSON.stringify(object);
            if (i+1 !== new_result.length) {
              stringified = stringified + ","
            }
          }
        }
        stringified = stringified + "]"
        let return_data = {
          support: [],
          lift: []
        }
        fs.writeFile(__dirname + "/../../activity.json", stringified, function(err) {
          if(err) {
            return res.status(500).send(err);
          }
          let out = shell.exec('Rscript backend/scripts/assoc.R',{silent:true}).stdout;
          // console.log(out);
          fs.readFile(__dirname + '/../../inspect_supp.txt', "UTF8", function(err, data) {
            return_data.support = data.split('\n');
            fs.readFile(__dirname + '/../../inspect_lift.txt', "UTF8", function(err_1, data_1) {
              return_data.lift = data_1.split('\n');
              res.send(return_data);              
            })
          }); 
        }); 
      })
    } else {
      return res.status(404).send({message: "There is no finished quiz for this course yet!"});
    }
  })
}
