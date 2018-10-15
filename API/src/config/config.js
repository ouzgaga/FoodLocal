const path = require('path');

const rootPath = path.normalize(`${__dirname}/..`);
const env = process.env.NODE_ENV || 'production';

const config = {
  development: {
    root: rootPath,
    app : {
      name: 'API FoodLocal'
    },
    port: process.env.PORT || 3000,
    db  : `mongodb://${process.env.mongoDB_host_dev}:${process.env.mongoDB_port_dev}/${process.env.mongoDB_dbName_dev}`
  },

  test: {
    root: rootPath,
    app : {
      name: 'API FoodLocal'
    },
    port: process.env.PORT || 3000,
    db  : `mongodb://${process.env.mongoDB_host_dev}:${process.env.mongoDB_port_dev}/${process.env.mongoDB_dbName_test}`
  },

  production: {
    root: rootPath,
    app : {
      name: 'API FoodLocal'
    },
    port: process.env.PORT || 3000,
    db  : `mongodb://${process.env.mongoDB_host_prod}.${process.env.mongoDB_port_prod}/${process.env.mongoDB_dbName_prod}`
  }
};

module.exports = config[env];
