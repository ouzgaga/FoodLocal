const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const httpStatus = require('http-status');
const APIError = require('../app/helpers/APIError');

const productsController = require('../app/controllers/products.controller');
const producersController = require('../app/controllers/producers.controller');
const salesPointsController = require('../app/controllers/salespoints.controller');

module.exports = (app, config) => {
  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env === 'development';

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(methodOverride());

  /*
   * Routes
   */
  app.use('/products', productsController);
  app.use('/producers', producersController);
  app.use('/salesPoints', salesPointsController);

  app.use('/', (req, res, next) => {
    res.status(httpStatus.OK).send('Hey mon ami! T\'aimes ça manger des patates?!');
  });

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
        error  : err,
        title  : 'error'
      });
    });
  }

  app.use((err, req, res, next) => {
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);
    res.send({
      message: err.message,
      error  : {},
      title  : 'error'
    });
  });

  return app;
};
