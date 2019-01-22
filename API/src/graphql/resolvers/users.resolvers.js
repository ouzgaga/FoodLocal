const { isAuthenticatedAsUserAndIsYourself, isAuthenticatedAsAdmin } = require('./authorization.resolvers');
const usersServices = require('../services/users.services');
const producersServices = require('../services/producers.services');

/**
 * Resolvers correspondant au schéma GraphQL user.graphqls
 * La documentation correspondant à chaque resolver se trouve dans le schéma GraphQL.
 */
const userResolvers = {
  Query: {
    users: async(parent, args, context) => {
      await isAuthenticatedAsAdmin(context.id, context.isAdmin);
      return usersServices.getUsers();
    },

    user: async(parent, args, context) => {
      await isAuthenticatedAsAdmin(context.id, context.isAdmin);
      return usersServices.getUserById(args.userId);
    }
  },

  Mutation: {
    updateUser: async(parent, args, context) => {
      await isAuthenticatedAsUserAndIsYourself(context.id, args.user.id, context.kind);
      return usersServices.updateUser(args.user);
    }
  },

  User: {
    followingProducers: (parent, args, context) => producersServices.getAllProducersInReceivedIdList(parent.followingProducersIds),
  },

  UserConnection: {
    totalCount: (parent, args, context) => usersServices.countNbUsersInDB()
  }
};
module.exports = userResolvers;
