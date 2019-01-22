const { GraphQLDateTime } = require('graphql-iso-date');

/**
 * Resolver pour les dates utilisées dans le schéma GraphQL
 */
const dateResolvers = {
  Date: GraphQLDateTime
};

module.exports = dateResolvers;
