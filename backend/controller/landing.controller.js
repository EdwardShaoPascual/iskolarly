'use strict';

const db          = require(__dirname + '/../lib/mysql');
const bcrypt      = require('bcrypt');
const dateFormat  = require('dateformat');

exports.login = function(req, res, next) {
  
  let payload = req.query;

  let queryString = 'SELECT * FROM user WHERE username = ?';
  let saltRounds = 10;

  db.query(queryString, [payload.username], (err, result, args, last_query) => {
    if (err) {
      return res.status(500).send({message: "An error has encountered!"})
    } else {
      bcrypt.compare(payload.password, result[0].password, function(err, response) {
        if (response === true) {
          return res.status(200).send(result)
        } else if (response === false) {
          return res.status(404).send({message: "Invalid username or password!"})
        }
      });
    }
  });
}

exports.register = function(req, res, next) {
  
  let payload = req.query;
  
  let queryString = 'INSERT INTO user (firstname, middlename, lastname, email, username, password, course, birthday, college, role) VALUES (?,?,?,?,?,?,?,STR_TO_DATE(?,"%d-%m-%Y"),?,?)';
  let saltRounds = 10;
  let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (payload.firstname === "" || 
      payload.middlename === "" ||
      payload.lastname === "" ||
      payload.email === "" || 
      payload.username === "" ||
      payload.password === "" ||
      payload.course === "" ||
      payload.birthday === "" ||
      payload.college === "" ||
      payload.role === "") {
    res.status(400).send({message: "Please fill all the missing fields!"})
  } 
  else if (pattern.test(payload.email) === false) {
    res.status(400).send({message: "Invalid input of email address!"});
  }
  else if (payload.username.length < 6) {
    res.status(400).send({message: "Username must be in length of at least 6 characters!"});
  } 
  else if (payload.password.length < 8) {
    res.status(400).send({message: "Password must be in length of at least 8 characters!"});
  }
  else {
    bcrypt.hash(payload.password, saltRounds, (err, hash) => {
      db.query(
        queryString, 
        [payload.firstname, payload.middlename, payload.lastname,
        payload.email, payload.username, hash, payload.course,
        dateFormat(payload.birthday,"dd-mm-yyyy"), payload.college, payload.role], 
        (err,result,args,last_query) => {
          if (!err) {
            return res.send(result);
          } else if (err.code == "ER_DUP_ENTRY") {
            return res.status(500).send({message: "The username or email address is already taken"})
          }
          return res.status(500).send({message: "An error has encountered"})
        })
    })
  }
    
}