'use strict';

const db = require(__dirname + '/../lib/mysql');

exports.view_courses = (req, res, next) => {
  let query_string = ""
  if (req.session.user.role === 'Instructor') {
    query_string = 'SELECT firstname, lastname, course_title, course_description, course_code FROM course NATURAL JOIN course_code NATURAL JOIN user where user_id = ?';
  } else {
    query_string = 'SELECT * FROM ((SELECT firstname, lastname, course_title, course_description, course_id from user NATURAL JOIN course) as course INNER JOIN course_user ON course.course_id = course_user.course_id) where user_id = ?';
  }
  db.query(query_string, [req.session.user.user_id], (err, result) => {
    if (err) {
      return res.status(500).send({message: "An error has encountered"});
    } else {
      res.send(result);
    }
  });
}

exports.enroll_course = (req, res, next) => {
  let payload = [req.query.code, req.session.user.user_id];

  let query_string = 'SELECT course_id FROM course_code where course_code = ? AND NOW() BETWEEN time_start AND time_end';

  db.query(query_string, [req.query.code], (err, result) => {
    if (err) {
      return res.status(500).send({message: "An error has encountered beforehand"});
    } else if (result.length === 1) {
        let call_query_string = 'INSERT INTO course_user (course_id, user_id) VALUES (?,?)';
        db.query(call_query_string, [result[0].course_id, req.session.user.user_id], (error, resu) => {
          if (error) {
            return res.status(500).send({message: "An error has encountered"});            
          } else {
            res.send(resu);
          }
        })
    } else {
      return res.status(500).send({message: "Invalid course code!"});                  
    }
  });
}

exports.create_course = (req, res, next) => {
  let payload = [req.query.course_title,req.query.course_description,req.session.user.user_id];

  let query_string = 'INSERT INTO course (course_title, course_description, user_id) VALUES (?,?,?)';

  db.query(query_string, payload, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({message: "An error has encountered"});
    } else {
      res.send(result);
    }
  });
}

exports.check_auth = (req, res, next) => {
  if (req.session.user === '' || req.session.user === undefined) {
    return res.status(500).send({message: "There is no active session"});
  } else {
    res.send(req.session.user);
  }
}