'use strict';

const db = require(__dirname + '/../lib/mysql');

exports.view_courses = (req, res, next) => {
  let query_string = ""
  if (req.session.user === undefined || req.session.user === '') {
    return res.status(500).send({message: "There is no active session yet"});
  }
  else if (req.session.user.role === 'Instructor') {
    query_string = 'SELECT firstname, lastname, course_id, course_title, course_section, course_description, course_code FROM course NATURAL JOIN course_code NATURAL JOIN user where user_id = ?';
  } else {
    query_string = 'SELECT * FROM ((SELECT firstname, lastname, course_title, course_description, course_id, course_section from user NATURAL JOIN course) as course INNER JOIN course_user ON course.course_id = course_user.course_id) where user_id = ?';
  }
  db.query(query_string, [req.session.user.user_id], (err, result) => {
    if (err) {
      return res.status(500).send({message: "An error has encountered"});
    } else {
      res.send(result.reverse());
    }
  });
}

exports.enroll_course = (req, res, next) => {
  let payload = [req.query.code, req.session.user.user_id];

  let query_string = 'SELECT * FROM course_code NATURAL JOIN (SELECT * FROM course NATURAL JOIN user) as ucourse where course_code = ? AND NOW() BETWEEN time_start AND time_end';

  db.query(query_string, [req.query.code], (err, result) => {
    if (err) {
      return res.status(500).send({message: "An error has encountered beforehand"});
    } else if (result.length === 1) {
        let call_query_string = 'SELECT * FROM course_user WHERE course_id = ? AND user_id = ?';
        db.query(call_query_string, [result[0].course_id, req.session.user.user_id], (error, rest) => {
          if (error) {
            return res.status(500).send({message: "An error has encountered beforehand"});            
          } else if (rest.length !== 0) {            
            return res.status(500).send({message: "You've already enrolled in this class"});            
          } else {
            let call_query_string = 'INSERT INTO course_user (course_id, user_id) VALUES (?,?)';
            db.query(call_query_string, [result[0].course_id, req.session.user.user_id], (errors, resu) => {
              if (errors) {
                return res.status(500).send({message: "An error has encountered"});            
              } else {
                delete result[0].password;
                res.send(result);
              }
            })
          }
        })
    } else {
      return res.status(500).send({message: "Invalid course code!"});                  
    }
  });
}

exports.create_course = (req, res, next) => {
  let payload = [req.query.course_title,req.query.course_section,req.query.course_description,req.session.user.user_id];

  let query_string = 'INSERT INTO course (course_title, course_section, course_description, user_id) VALUES (?,?,?,?)';

  db.query(query_string, payload, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({message: "An error has encountered"});
    } else {
      let new_query_string = "SELECT * FROM course_code WHERE course_id = ?"
      db.query(new_query_string, [result.insertId], (error, rest) => {
        if (err) {
          console.log(err);
          return res.status(500).send({message: "An error has encountered"});
        } else {
          res.send(rest);
        }
      });
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

exports.check_inst = (req, res, next) => {
  let query_string = 'SELECT * FROM course LEFT JOIN questionnaires ON course.course_id = questionnaires.course_id WHERE questionnaires.questionnaire_id = ? AND course.user_id = ?';
  let request_data = [req.query.questionnaire_id, req.query.user_id];

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
}

exports.check_quiz = (req, res, next) => {
  let query_string = 'SELECT * FROM questionnaires NATURAL JOIN questions_quiz NATURAL JOIN quiz WHERE user_id = ? AND questionnaire_id = ?';
  let request_data = [req.session.user.user_id, req.params.questionnaire_id]

  db.query(query_string, request_data, (err, result) => {
    if (err) {
      return res.status(500).send({message: "An error has encountered"});
    } else {
      res.send(result);
    }
  });
}

exports.check_course = (req, res, next) => {
  if (req.session.user.role === 'Instructor') {
    let query_string = 'SELECT * FROM course WHERE user_id = ? AND course_id = ?';
    let request_data = [req.session.user.user_id, req.params.course_id]

    db.query(query_string, request_data, (err, result) => {
      if (err) {
        return res.status(500).send({message: "An error has encountered"});
      } else {
        res.send(result);
      }
    });
  } else {
    let query_string = 'SELECT * FROM course_user WHERE user_id = ? AND course_id = ?';
    let request_data = [req.session.user.user_id, req.params.course_id]

    db.query(query_string, request_data, (err, result) => {
      if (err) {
        return res.status(500).send({message: "An error has encountered"});
      } else {
        res.send(result);
      }
    });
  }
}

exports.check_attempt = (req, res, next) => {
  let query = 'SELECT * FROM questionnaires NATURAL JOIN course_user WHERE user_id = ? and questionnaire_id = ?';
  let request = [req.session.user.user_id, req.params.questionnaire_id]

  db.query(query, request, (error, reslt) => {
    if (error) {
      return res.status(500).send({message: "An error has encountered"});
    } else {
      if (reslt.length !== 0) {
        
        let query_string = 'SELECT * FROM quiz WHERE user_id = ? AND questionnaire_id = ?';
        let request_data = [req.session.user.user_id, req.params.questionnaire_id]

        db.query(query_string, request_data, (err, result) => {
          if (err) {
            return res.status(500).send({message: "An error has encountered"});
          } else {
            if (result.length == 0) {
        
              let query_str = 'INSERT INTO quiz (user_id, questionnaire_id, attempted_ans) VALUES (?, ?, ?)';
              let req_data = [req.session.user.user_id, req.params.questionnaire_id, 0]

              db.query(query_str, req_data, (errt, rest) => {
                if (errt) {
                  return res.status(500).send({message: "An error has encountered"});
                } else {
                  res.send(result);
                }
              })
            } else {
              res.send(result);
            }
        
          }
        });

      } else {
        return res.status(500).send({message: "An error has encountered"});
      }
    }
  });
}