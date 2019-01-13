const { defaultFieldResolver } = require('graphql');
const { connectionFromArray, connectionArgs } = require('graphql-relay');
const { SchemaDirectiveVisitor } = require('apollo-server-express');

class ConnectionDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    // get original resolver
    const { resolve = defaultFieldResolver } = field;

    // add connections arguments
    field.args.push({ name: 'after', type: connectionArgs.after.type });
    field.args.push({ name: 'before', type: connectionArgs.before.type });
    field.args.push({ name: 'first', type: connectionArgs.first.type });
    field.args.push({ name: 'last', type: connectionArgs.last.type });

    // wrap resolver
    field.resolve = async function(...args) {
      const { first, last } = args[1];
      const results = await resolve.apply(this, args);
      if (first <= 0) {
        throw new Error('The \'first\' parameter must be greater than 0!');
      }
      if (last <= 0) {
        throw new Error('The \'last\' parameter must be greater than 0!');
      }
      return connectionFromArray(results, args);
    };
  }
}

module.exports = ConnectionDirective;
