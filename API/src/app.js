const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');

mongoose.Promise = require('bluebird');

mongoose.connect(config.db, { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', () => {
  throw new Error(`unable to connect to database at ${config.db}`);
});

console.log(`connecté à la base de donnée de ${process.env.NODE_ENV} --> ${config.db}`);

const app = express();

// Active CORS pour le client
app.use(cors());

// close connection
// mongoose.connection.close(); // FIXME: faut-il fermer la connexion...?

module.exports = require('./config/express')(app, config);
