'use strict';

const db = require(__dirname + '/../lib/mysql');

exports.view_courses = (req, res, next) => {
  let query_string = 'SELECT firstname, lastname, course_title, course_description FROM course natural join user';

  db.query(query_string, [], (err, result) => {
    if (err) {
      return res.status(500).send({message: "An error has encountered"});
    } else {
      res.send(result);
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