'use strict';

// libraries and middleware initialization
const config        = require(__dirname + '/config/config');
const router        = require(__dirname + '/router/router');
const express       = require('express');
const body_parser   = require('body-parser');
const helmet        = require('helmet');
const winston       = require('winston');
const session       = require('express-session');
const redis         = require('redis');
const redis_store   = require('connect-redis')(session);
const client        = redis.createClient();

let start;
let handler;
let app;

start = () => {
  if (handler) {
      handler.close();
  }

  // create an express app
  app = express();

  // winston instantiation
  winston.cli();
  winston.level = config.LOG_LEVEL || 'silly';
  winston.log('info', 'Starting', config.APP_NAME);

  // setting the environment for express
  winston.log('verbose', 'Binding 3rd-party middlewares');
  app.set('case sensitive routing', true);
  app.set('x-powered-by', false);

  // session handling in server-side
  app.use(session({
    secret: config.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60 * 1000 * 60 * 2 },
    store: new redis_store({
      host: 'localhost',
      port: config.PORT,
      client: client
    })
  }))

  // loading of 3rd-party middlewares
  app.use(express.static(__dirname + '/../frontend/'));
  app.use(require('method-override')());
  app.use(body_parser.urlencoded({extended: true}));
  app.use(body_parser.json());
  app.use(require('compression')());
  app.use(router(express.Router()));

  // catching the wrong api call
  app.get('*', (req,res,next) => {
    res.redirect('/#/error_404')
  })

  // this will start app
  winston.log('info', 'Server listening on port', config.PORT);
  return app.listen(config.PORT, config.IP);
}

handler = start();


module.exports = {
  app,
  start,
  handler
}
