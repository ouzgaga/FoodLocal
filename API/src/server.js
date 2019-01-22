require('dotenv').config();
const { createServer } = require('http');
const { app, server } = require('./app');
const config = require('./config/config');

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: config.port }, () => {
  console.log(`🚀 Server ready at http://localhost:${config.port}${server.graphqlPath}`);
  console.log(`🚀 WS ready at ws://localhost:${config.port}${server.subscriptionsPath}`);
});
