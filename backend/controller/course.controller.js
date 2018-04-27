'use strict';

const db = require(__dirname + '/../lib/mysql');
const moment = require('moment');

exports.retrieve_course = (req,res, next) => {
  
  let query_string = 'SELECT * FROM course NATURAL JOIN user where course_id = ?';

  db.query(query_string, [req.query.course_id], (err, result) => {
    if (err) {
      return res.status(500).send({message: "An error has encountered"});
    } else {
      if (result.length === 0) {
        res.send(result);
      } else {
        for (let i = 0; i<result.length; i++)
          delete result[i].password;
        res.send(result);
      }

    }
  });
}

exports.retrieve_announcement = (req,res, next) => {
  let query_string = 'SELECT * FROM announcement LEFT JOIN questionnaires ON announcement.questionnaire_id = questionnaires.questionnaire_id NATURAL JOIN user NATURAL JOIN (SELECT course_id, course_title, course_section, course_description FROM course) as course where course_id = ? ORDER BY time_posted DESC';

  db.query(query_string, [req.query.course_id], (err, result) => {
    if (err) {
      return res.status(500).send({message: "An error has encountered"});
    } else {
      if (result.length === 0) {
        res.send(result);
      } else {
        for (let i = 0; i<result.length; i++) {
          delete result[i].password;
          delete result[i].username;
          delete result[i].birthday;
          delete result[i].role;
          delete result[i].college;
          result[i].time_posted = moment(result[i].time_posted).format('ll').split(',')[0];
        }
        res.send(result);
      }

    }
  });
}

exports.post_note = (req,res, next) => {
  
  let payload = [req.query.course_id,req.query.user_id,req.query.post];

  let query_string = 'INSERT INTO announcement (course_id, user_id, post, time_posted) VALUES (?,?,?,NOW())';

  db.query(query_string, payload, (err, result) => {
    if (err) {
      return res.status(500).send({message: "An error has encountered"});
    } else {
      res.send(result);
    }
  });
}

exports.stud_view_announcements  = (req, res, next) => {
  let query_string = 'SELECT * FROM announcement LEFT JOIN questionnaires ON announcement.questionnaire_id = questionnaires.questionnaire_id LEFT JOIN course_user ON announcement.course_id = course_user.course_id LEFT JOIN course ON course_user.course_id = course.course_id WHERE course_user.user_id = ? ORDER BY announcement.time_posted DESC';
  let request_data = [req.session.user.user_id]

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
}

exports.inst_view_announcements  = (req, res, next) => {
  let query_string = 'SELECT * FROM announcement LEFT JOIN questionnaires ON announcement.questionnaire_id = questionnaires.questionnaire_id LEFT JOIN course ON announcement.course_id = course.course_id WHERE announcement.user_id = ? ORDER BY announcement.time_posted DESC';
  let request_data = [req.session.user.user_id]

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
}

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
  let query_string = 'INSERT INTO questionnaires (questionnaire_name, questionnaire_desc, questionnaire_no, items, datetime_start, datetime_end) VALUES (?,?,?,?,?,?)'
  let request_data = [req.query.questionnaire_name, req.query.questionnaire_desc, req.query.questionnaire_no, req.query.items, req.query.datetime_start, req.query.datetime_end]

  if (!req.query.questionnaire_name || !req.query.questionnaire_desc || !req.query.questionnaire_no) {
    return res.status(400).send("Please fill all the missing fields!");
  }

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({message: "An error has encountered"});
    } else {
      let new_query_string = 'INSERT INTO announcement (course_id, user_id, questionnaire_id, post, time_posted) VALUES (?,?,?,?,NOW())';
      db.query(new_query_string, [req.query.course_id, req.session.user.user_id, result.insertId, req.query.post], (error, rest) => {
        if (error) {
          console.log(error);
          return res.status(500).send({message: "An error has encountered"});
        } else {
          return res.send(rest);
        }
      })
    }
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
      let query_string = 'UPDATE questionnaires SET questionnaire_name = ?, questionnaire_desc = ?, questionnaire_no = ?, items = ? WHERE questionnaire_id = ?'
      let request_data = [req.query.questionnaire_name, req.query.questionnaire_desc, req.query.questionnaire_no, req.query.questionnaire_item, req.query.questionnaire_id]
      if (!req.query.questionnaire_name || !req.query.questionnaire_desc || !req.query.questionnaire_no) {
        return res.status(400).send("Fill all the fields");
      } else if (req.query.questionnaire_no < req.query.questionnaire_item) {
        return res.status(400).send("Questionnaire no should be less than or equal to items");
      }

      db.query(query_string, request_data, (errs, result) => {
        if (errs) {
          return res.status(400).send("An error has been encountered");
        } else {
          return res.send(result);
        }
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

exports.upload_attachment = (req, res, next) => {
  let query_string = 'INSERT INTO attachment (attachment_name, url, type) VALUES (?,?,?)';
  let request_data = [req.query.filename, req.query.url, 'Handout'];

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      let new_query_string = 'INSERT INTO announcement (course_id, user_id, attachment_id, post, time_posted) VALUES (?,?,?,?,NOW())';
      let new_request_data = [req.query.course_id, req.query.user_id, result.insertId, req.query.post];
      
      db.query(new_query_string, new_request_data, (error, rest) => {
        if (error) {
          console.log(error);
          return res.status(500).send(err);
        } else {
          console.log(rest);
          return res.send(rest);
        }
      })
    }
  });
}