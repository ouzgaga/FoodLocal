const express = require('express');
const glob = require('glob');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const httpStatus = require('http-status');
const APIError = require('../app/helpers/APIError');


const productsRoutes = require('../app/routes/products');
const producersRoutes = require('../app/routes/producers');
const salespointsRoutes = require('../app/routes/salespoints');

module.exports = (app, config) => {
  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env === 'development';

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(methodOverride());

  /*
   * Routes
   */
  app.use('/products', productsRoutes);
  app.use('/producers', producersRoutes);
  app.use('/salespoints', salespointsRoutes);

  app.use((req, res, next) => {
    const err = new APIError('Not Found', httpStatus.NOT_FOUND);
    err.status = httpStatus.NOT_FOUND;
    next(err);
  });

  if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
      res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);
      res.send({
        message: err.message,
        error: err,
        title: 'error',
      });
    });
  }

  app.use((err, req, res, next) => {
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);
    res.send({
      message: err.message,
      error: {},
      title: 'error',
    });
  });

  return app;
};
