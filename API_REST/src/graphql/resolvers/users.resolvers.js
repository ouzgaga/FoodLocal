const usersServices = require('../services/users.services');

const producerResolvers = {
  Query: {
    users: () => usersServices.getUsers(),

    user: (parent, args, context) => usersServices.getUserById(args.user)
  },

  Mutation: {
    addUser: async(parent, args, context) => usersServices.addUser(args.user),

    updateUser: async(parent, args, context) => usersServices.updateUser(args.user),

    deleteUser: (parent, args, context) => usersServices.deleteUser(args.user)
  },

  User: {
    subscriptions: (parent, args, context) => usersServices.getAllProducersInReceivedIdList(parent.subscriptions)
  }
};
module.exports = producerResolvers;
