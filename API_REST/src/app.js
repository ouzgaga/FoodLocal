const express = require('express');
const merge = require('lodash/merge');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const path = require('path');
const { fileLoader, mergeTypes } = require('merge-graphql-schemas');

const Producer = require('./graphql/resolvers/producers.resolvers');
const Person = require('./graphql/resolvers/person.resolvers');
const DailySchedule = require('./graphql/resolvers/dailySchedule.resolvers');
const config = require('./config/config');

mongoose.Promise = require('bluebird');

mongoose.connect(config.db, { useNewUrlParser: true })
  .then(() => console.log(`connecté à la base de donnée de ${process.env.NODE_ENV} --> ${config.db}`))
  .catch(error => console.log(`la connexion à la database ${config.db} a échoué\n${error.message}`));

const app = express();

// Active CORS pour le client
app.use(cors());

const resolvers = merge(
  Producer,
  // Person,
  // DailySchedule
);

const typesArray = fileLoader(path.join(__dirname, './graphql/schemas'));
const typeDefs = mergeTypes(typesArray, { all: true });

// Integrate apollo as a middleware
const server = new ApolloServer(
  {
    typeDefs,
    resolvers
  }
);
server.applyMiddleware({ app });

// close connection
// mongoose.connection.close(); // FIXME: faut-il fermer la connexion...?

module.exports = require('./config/express')(app, config);
