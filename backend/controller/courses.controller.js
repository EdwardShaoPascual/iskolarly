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

exports.check_auth = (req, res, next) => {
  if (req.session.user === '' || req.session.user === undefined) {
    return res.status(500).send({message: "There is no active session"});
  } else {
    res.send(req.session.user);
  }
}