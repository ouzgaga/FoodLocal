const path = require('path');

const rootPath = path.normalize(`${__dirname}/..`);
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'API FoodLocal'
    },
    port: process.env.PORT || 3000,
    db: `mongodb://${process.env.mongoDB_host_dev}:${process.env.mongoDB_port_dev}/${process.env.mongoDB_dbName_dev}`
  },

  test: {
    root: rootPath,
    app: {
      name: 'API FoodLocal'
    },
    port: process.env.PORT || 3000,
    db: `mongodb://${process.env.mongoDB_host_dev}:${process.env.mongoDB_port_dev}/${process.env.mongoDB_dbName_test}`
  },

  production: {
    root: rootPath,
    app: {
      name: 'API FoodLocal'
    },
    port: process.env.PORT || 3000,
    // db  : `mongodb://${process.env.mongoDB_host_prod}:${process.env.mongoDB_port_prod}/${process.env.mongoDB_dbName_prod}`
    db: 'mongodb://mongo-0.mongo-service:27017/API_FoodLocal_production'
  }
};

module.exports = config[env];
