'use strict';

const db = require(__dirname + '/../lib/mysql');

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
  let query_string = 'INSERT INTO questionnaires (questionnaire_name, questionnaire_desc, questionnaire_no) VALUES (?, ?, ?)'
  let request_data = [req.query.questionnaire_name, req.query.questionnaire_desc, req.query.questionnaire_no]

  if (!req.query.questionnaire_name || !req.query.questionnaire_desc || !req.query.questionnaire_no) {
    return res.status(400).send("Please fill all the missing fields!");
  }

  db.query(query_string, request_data, (err, result) => {
      res.send(result);
  });
}

exports.get_info_questionnaires = (req, res, next) => {
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

exports.edit_questionnaires = (req, res, next) => {
  let query_string2 = 'SELECT COUNT(*) AS size, qe.questionnaire_no FROM questions qn, questionnaires qe WHERE qe.questionnaire_id = ? AND qn.questionnaire_id = ?'
  let request_data2 = [req.query.questionnaire_id, req.query.questionnaire_id]

  db.query(query_string2, request_data2, (errs, results) => {
      let query_string = 'UPDATE questionnaires SET questionnaire_name = ?, questionnaire_desc = ?, questionnaire_no = ? WHERE questionnaire_id = ?'
      let request_data = [req.query.questionnaire_name, req.query.questionnaire_desc, req.query.questionnaire_no, req.query.questionnaire_id]
  
      if (!req.query.questionnaire_name || !req.query.questionnaire_desc || !req.query.questionnaire_no) {
        console.log("Fill all the fields");
        return res.status(400).send("Fill all the fields");
      } else if (req.query.questionnaire_no < results[0].size) {
        console.log("Wrong input items");
        return res.status(400).send("Wrong input items");
      }

      db.query(query_string, request_data, (errs, result) => {
        res.send(result);
      });
  });
}

exports.delete_questionnaires = (req, res, next) => {
  let query_string = 'DELETE FROM questionnaires WHERE questionnaire_id = ?';
  let request_data = [req.params.questionnaire_id]

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
}