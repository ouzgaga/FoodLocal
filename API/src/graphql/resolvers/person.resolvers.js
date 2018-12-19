require('../models/producers.modelgql');
const personServices = require('../services/persons.services');
const producersServices = require('../services/producers.services');

const PersonType = {
  USER: 'users',
  PRODUCER: 'producers'
};


const personResolvers = {
  Query: {
    checkIfEmailIsAvailable: (parent, args, context) => personServices.isEmailUnused(args.email)
  },

  Mutation: {
    addFollowerToProducer: (parent, args, context) => producersServices.addFollowerToProducer(args.producerId, args.personId),

    removeFollowerToProducer: (parent, args, context) => producersServices.removeFollowerToProducer(args.producerId, args.personId)
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

module.exports = personResolvers;
