require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('./app/helpers/APIError');
const config = require('./config/config');

mongoose.createConnection(config.db);
const db = mongoose.connection;
db.on('error', () => {
  throw new APIError(`unable to connect to database at ${config.db}`, httpStatus.INTERNAL_SERVER_ERROR);
});

const app = express();

module.exports = require('./config/express')(app, config);

app.listen(config.port, () => {
  console.log(`Express server listening on port ${config.port}`);
});
