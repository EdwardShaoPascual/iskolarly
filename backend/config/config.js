'use strict'

const path  = require('path');

module.exports = {
    APP_NAME: 'Iskolarly App: An ICS Homegrown Online Classroom',
    APP_URL: 'http://localhost:8000',

    PORT: 8000,
    STATIC_PORT: 8080,
    IP: '127.0.0.1',

    DEVELOPMENT: {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'iskolarly'
    },

    ASSETS_DIR: path.normalize(__dirname + '/../front-end'),

    COOKIE_SECRET: '1sk0l4rlyf',
    COOKIE_NAME: '__t0p_S3cR3T',
    COOKIE_DOMAIN: '.1sk0l4rly.io',

};