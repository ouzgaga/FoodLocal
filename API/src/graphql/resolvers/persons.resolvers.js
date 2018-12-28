require('../models/producers.modelgql');
const personsServices = require('../services/persons.services');
const producersServices = require('../services/producers.services');

const PersonType = {
  USER: 'users',
  PRODUCER: 'producers'
};


const personsResolvers = {
  Query: {
    checkIfEmailIsAvailable: (parent, args, context) => personsServices.isEmailUnused(args.email)
  },

  Mutation: {
    addFollowerToProducer: (parent, args, context) => producersServices.addFollowerToProducer(args.producerId, args.personId),

    removeFollowerToProducer: (parent, args, context) => producersServices.removeFollowerToProducer(args.producerId, args.personId),

    changePassword: (parent, args, context) => personsServices.changePassword(args.newPassword, args.oldPassword, args.personId)
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
    }
  }
};

module.exports = personsResolvers;
