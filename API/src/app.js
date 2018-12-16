const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const { resolvers, schema: typeDefs } = require('./graphql/graphqlConfig');

const config = require('./config/config');

mongoose.Promise = require('bluebird');

mongoose.connect(config.db, { useNewUrlParser: true })
  .then(() => console.log(`connecté à la base de donnée de ${process.env.NODE_ENV} --> ${config.db}`))
  .catch(error => console.log(`la connexion à la database ${config.db} a échoué\n${error.message}`));

const app = express();

// Active CORS pour le client
app.use(cors());

// Integrate apollo as a middleware
const server = new ApolloServer(
  {
    typeDefs,
    resolvers,
    introspection: true,
    playground: true
  }
);
server.applyMiddleware({ app });

// close connection
// mongoose.connection.close(); // FIXME: faut-il fermer la connexion...?

module.exports = require('./config/express')(app, config);
