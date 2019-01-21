const express = require('express');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const { isAuthenticated } = require('./graphql/resolvers/authorization.resolvers');
const connectionTokenServices = require('./graphql/services/connectionToken.services');
const { resolvers, schema: typeDefs, connectionDirective } = require('./graphql/graphqlConfig');

const config = require('./config/config');

mongoose.Promise = require('bluebird');

mongoose.connect(config.db, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
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
    schemaDirectives: {
      connection: connectionDirective
    },
    introspection: true,
    playground: true,
    context: ({ req, connection }) => {
      const token = req != null ? req.headers.token : connection.context.token;
      const res = connectionTokenServices.verifyToken(token, false);
      // console.log(token);
      return res;
    },
    subscriptions: {
      path: '/subscriptions',
      onConnect: async(connectionParams) => {
        const user = await connectionTokenServices.verifyToken(connectionParams.token, false);
        await isAuthenticated(user.id);
        console.log('Subscription client connected using Apollo server\'s built-in SubscriptionServer.');
        return connectionParams;
      }
    }
  }
);
server.applyMiddleware({ app });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: config.port }, () => {
  console.log(`🚀 Server ready at http://localhost:${config.port}${server.graphqlPath}`);
  console.log(`🚀 WS ready at ws://localhost:${config.port}${server.subscriptionsPath}`);
});

module.exports = require('./config/express')(app, config);
