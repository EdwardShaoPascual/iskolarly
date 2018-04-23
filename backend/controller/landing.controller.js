'use strict';

const db          = require(__dirname + '/../lib/mysql');
const bcrypt      = require('bcrypt');
const dateFormat  = require('dateformat');
const moment      = require('moment');

exports.login = function(req, res, next) {
  let payload = req.query;

  let queryString = 'SELECT * FROM user WHERE username = ?';
  let saltRounds = 10;

  db.query(queryString, [payload.username], (err, result, args, last_query) => {
    if (err) {
      return res.status(500).send({message: "An error has encountered"})
    } else if (result.length === 0) {
      return res.status(500).send({message: "Invalid username or password!"})
    } else {
      bcrypt.compare(payload.password, result[0].password, function(error, response) {
        if (response === true) {
          req.session.user = result[0];
          delete req.session.user.password;
          let queryStringCB = 'INSERT INTO activity_log (activity_type, activity_info) VALUES (?,?)';
          let activityDescription = '[' + moment().format() + '] user='+result[0].username+' user_id='+result[0].user_id + ' ipv4='+ req.query.ip;
          let activity = "Login Account";
          db.query(queryStringCB, [activity,activityDescription], (err, rest, args, last_query) => {
            if (err) {
              console.log(err);
              return res.status(500).send({message: "An error has encountered"})
            }
            return res.status(200).send(rest);
          })
        } else if (response === false) {
          return res.status(404).send({message: "Invalid username or password!"})
        }
      });
    }
  });
}

exports.register = function(req, res, next) {
  
  let payload = req.query;
  
  let queryStringStudent = 'INSERT INTO user (firstname, middlename, lastname, email, username, password, course, birthday, college, role) VALUES (?,?,?,?,?,?,?,STR_TO_DATE(?,"%d-%m-%Y"),?,?)';
  let queryStringInstr = 'INSERT INTO user (firstname, middlename, lastname, email, username, password, birthday, role) VALUES (?,?,?,?,?,?,STR_TO_DATE(?,"%d-%m-%Y"),?)';
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
    if (payload.role === 'Student') {
      bcrypt.hash(payload.password, saltRounds, (err, hash) => {
        db.query(
          queryStringStudent, 
          [payload.firstname, payload.middlename, payload.lastname,
          payload.email, payload.username, hash, payload.course,
          dateFormat(payload.birthday,"dd-mm-yyyy"), payload.college, payload.role], 
          (err,result,args,last_query) => {
            if (!err) {
              let queryStringCB = 'INSERT INTO activity_log (activity_type, activity_info) VALUES (?,?)';
              let activityDescription = '[' + moment().format() + '] user=' + payload.username +' user_id='+result.insertId + ' ipv4='+ req.query.ip;
              let activity = "Register Account";
              db.query(queryStringCB, [activity,activityDescription], (err, rest, args, last_query) => {
                if (err) {
                  console.log(err);
                  return res.status(500).send({message: "An error has encountered"})
                }
                  return res.send(result);
              });
              return res.send(result);
            } else if (err.code == "ER_DUP_ENTRY") {
              return res.status(500).send({message: "The username or email address is already taken"})
            }
            console.log(err);
            return res.status(500).send({message: "An error has encountered"})
          })
      })
    } 
    else {
      bcrypt.hash(payload.password, saltRounds, (err, hash) => {
        db.query(
          queryStringInstr, 
          [payload.firstname, payload.middlename, payload.lastname,
          payload.email, payload.username, hash,
          dateFormat(payload.birthday,"dd-mm-yyyy"), payload.role], 
          (err,result,args,last_query) => {
            if (!err) {
              let queryStringCB = 'INSERT INTO activity_log (activity_type, activity_info) VALUES (?,?)';
              let activityDescription = '[' + moment().format() + '] user=' + payload.username +' user_id='+result.insertId + ' ipv4='+ req.query.ip;
              let activity = "Register Account";
              db.query(queryStringCB, [activity,activityDescription], (err, rest, args, last_query) => {
                if (err) {
                  console.log(err);
                  return res.status(500).send({message: "An error has encountered"})
                }
                  return res.send(result);
              });
              return res.send(result);
            } else if (err.code == "ER_DUP_ENTRY") {
              return res.status(500).send({message: "The username or email address is already taken"})
            }
            return res.status(500).send({message: "An error has encountered"})
          })
      })
    }
  }
    
}