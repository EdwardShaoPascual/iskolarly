'use strict';

const db          = require(__dirname + '/../lib/mysql');
const bcrypt      = require('bcrypt');
const dateFormat  = require('dateformat');

exports.login = function(req, res, next) {
  
  let payload = req.query;

  let queryString = 'SELECT * FROM user WHERE username = ?';
  let saltRounds = 15;

  db.query(queryString, [payload.username], (err, result, args, last_query) => {
    if (err) {
      return res.status(500).send({message: "An error has encountered!"})
    } else if (result.length === 1) {
      bcrypt.compare(payload.password, result[0].password, function(err, response) {
        if (response === true) {
          return res.status(200).send(result)
        } else if (response === false) {
          return res.status(404).send({message: "Invalid username or password!"})
        }
      });
    } else if (result.length === 0) {
      return res.status(404).send({message: "Invalid username or password!"})
    }
  });
}

exports.register = function(req, res, next) {
  
  let payload = req.query;

  let queryString = 'INSERT INTO user (firstname, middlename, lastname, email, username, password, course, birthday, college) VALUES (?,?,?,?,?,?,?,STR_TO_DATE(?,"%d-%m-%Y"),?)';
  let saltOrRounds = 15;
  bcrypt.hash(payload.password, saltOrRounds, (err, hash) => {
    db.query(
      queryString, 
      [payload.firstname, payload.middlename, payload.lastname,
      payload.email, payload.username, hash, payload.course,
      dateFormat(payload.birthday,"dd-mm-yyyy"), payload.college], 
      (err,result,args,last_query) => {
        if (!err) {
          return res.send(result);
        }
        return res.status(500).send({message: "An error has encountered"})
      })
  })
    
}