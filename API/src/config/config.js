const path = require('path');

const rootPath = path.normalize(`${__dirname}/..`);
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'express'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/express-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'express'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/express-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'express'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/express-production'
  }
};

module.exports = config[env];
