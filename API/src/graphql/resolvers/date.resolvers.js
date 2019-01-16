const { GraphQLDateTime } = require('graphql-iso-date');

const dateResolvers = {
  Date: GraphQLDateTime
};

module.exports = dateResolvers;
