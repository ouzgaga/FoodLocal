const { defaultFieldResolver, GraphQLString, GraphQLInt } = require('graphql');
const { connectionFromArray } = require('graphql-relay');
const { SchemaDirectiveVisitor } = require('apollo-server-express');

class ConnectionDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    // get original resolver
    const { resolve = defaultFieldResolver } = field;

    // add connections arguments
    field.args.push({ name: 'first', type: GraphQLInt });
    field.args.push({ name: 'last', type: GraphQLInt });
    field.args.push({ name: 'before', type: GraphQLString });
    field.args.push({ name: 'after', type: GraphQLString });

    // wrap resolver
    field.resolve = async function(...args) {
      const results = await resolve.apply(this, args);
      return connectionFromArray(results, args);
    };
  }
}

module.exports = ConnectionDirective;
