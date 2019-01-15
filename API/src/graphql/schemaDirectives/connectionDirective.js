const { defaultFieldResolver } = require('graphql');
// const { mongooseConnection } = require('graphql-relay-connection');
const { connectionArgs, connectionFromArray } = require('graphql-relay');
const { SchemaDirectiveVisitor } = require('apollo-server-express');

class ConnectionDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    // get original resolver
    const { resolve = defaultFieldResolver } = field;

    /*
    const {
      connectionFromArray
    } = mongooseConnection;

*/
    // add connections arguments
    field.args.push({ name: 'after', type: connectionArgs.after.type });
    field.args.push({ name: 'before', type: connectionArgs.before.type });
    field.args.push({ name: 'first', type: connectionArgs.first.type });
    field.args.push({ name: 'last', type: connectionArgs.last.type });

    // wrap resolver
    field.resolve = async function(...args) {
      const results = await resolve.apply(this, args);
      const res = connectionFromArray(results, args[1]);
      return res;
    };
  }
}

module.exports = ConnectionDirective;
