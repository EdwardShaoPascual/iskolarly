'use strict';

const config        = require(__dirname + '/config/config');
const router        = require(__dirname + '/router/router');
const express       = require('express');
const body_parser   = require('body-parser');
const helmet        = require('helmet');
const winston       = require('winston');

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
  app.use(express.static(__dirname + '/../frontend/'));
  app.use(require('method-override')());
  app.use(body_parser.urlencoded({extended: true}));
  app.use(body_parser.json());
  app.use(require('compression')());
  app.use(router(express.Router()));
  app.use(helmet());

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
