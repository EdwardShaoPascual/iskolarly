'use strict'

const mysql  = require('mysql');
const config = require(__dirname + '/../config/config');

// the mysql configuration for queries and accessing data in the database
const ENV = 'DEVELOPMENT';

module.exports = mysql.createConnection({
    host     : config[ENV].host,
    user     : config[ENV].user,
    password : config[ENV].password,
    database : config[ENV].database
});