require('../models/producers.modelgql'); // FIXME: checker si vraiment utile....
const { isAuthenticatedAndIsYourself } = require('./authorization.resolvers');
const personsServices = require('../services/persons.services');
const producersServices = require('../services/producers.services');

const PersonType = {
  USER: 'users',
  PRODUCER: 'producers'
};


const personsResolvers = {
  Query: {
    checkIfEmailIsAvailable: (parent, args, context) => personsServices.isEmailAvailable(args.email)
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

    // FIXME: PAUL: ya moyen de renommer ce resolveType en 'kind' ou qqch de plus parlant?
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
  }
};

module.exports = personsResolvers;
