const path = require('path');

const rootPath = path.normalize(`${__dirname}/../..`);
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'API FoodLocal'
    },
    port: process.env.PORT || 3000,
    db  : `mongodb://${process.env.MONGODB_HOST_DEV}:${process.env.MONGODB_PORT_DEV}/${process.env.MONGODB_DBNAME_DEV}`
  },

  test: {
    root: rootPath,
    app: {
      name: 'API FoodLocal'
    },
    port: process.env.PORT || 3000,
    db  : `mongodb://${process.env.MONGODB_HOST_TEST}:${process.env.MONGODB_PORT_TEST}/${process.env.MONGODB_DBNAME_TEST}`
  },

  production: {
    root: rootPath,
    app: {
      name: 'API FoodLocal'
    },
    port: process.env.PORT || 3000,
    db  : `mongodb://${process.env.MONGODB_HOST_PROD}:${process.env.MONGODB_PORT_PROD}/${process.env.MONGODB_DBNAME_PROD}`
  }
};

module.exports = config[env];
