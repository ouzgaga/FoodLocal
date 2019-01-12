const { isAuthenticatedAndIsYourself } = require('./authorization.resolvers');
const personsServices = require('../services/persons.services');
const producersServices = require('../services/producers.services');

const PersonType = {
  USER: 'users',
  PRODUCER: 'producers'
};


const personsResolvers = {
  Query: {
    checkIfEmailIsAvailable: (parent, args, context) => personsServices.isEmailAvailable(args.email),

    me: (parent, args, context) => personsServices.getPersonByToken(args.token)
  },

  Mutation: {
    addFollowerToProducer: (parent, args, context) => producersServices.addFollowerToProducer(args.producerId, args.followerId),

    removeFollowerToProducer: (parent, args, context) => producersServices.removeFollowerToProducer(args.producerId, args.followerId),

    changePassword: async(parent, args, context) => {
      await isAuthenticatedAndIsYourself(context.id, args.personId);
      return personsServices.changePassword(args.newPassword, args.oldPassword, args.personId);
    }
  },

  Person: {
    __resolveType(obj) {
      switch (obj.kind) {
        case PersonType.USER:
          return 'User';
        case PersonType.PRODUCER:
          return 'Producer';
        default:
          return null;
      }
    },

    followingProducers: (parent, args, context) => personsServices.getAllPersonsInReceivedIdList(parent.followingProducersIds)
  },

  PersonConnection: {
    totalCount: (parent, args, context) => personsServices.countNbPersonsInDB()
  }
};

module.exports = personsResolvers;
