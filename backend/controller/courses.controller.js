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