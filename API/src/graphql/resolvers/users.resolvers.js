const usersServices = require('../services/users.services');

const producerResolvers = {
  Query: {
    users: (parent, args, context) => usersServices.getUsers(),

    user: (parent, args, context) => usersServices.getUserById(args.userId)
  },

  Mutation: {
    addUser: async(parent, args, context) => usersServices.addUser(args.user),

    updateUser: async(parent, args, context) => usersServices.updateUser(args.user),

    deleteUser: (parent, args, context) => usersServices.deleteUser(args.userId)
  },

  User: {
    password: (parent, args, context) => null,

    followingProducers: (parent, args, context) => usersServices.getAllUsersInReceivedIdList(parent.followingProducersIds)
  }
};
module.exports = producerResolvers;
