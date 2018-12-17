require('../models/producers.modelgql');
const personServices = require('../services/persons.services');

const PersonType = {
  USER: 'users',
  PRODUCER: 'producers'
};


const personResolvers = {
  Query: {
    checkIfEmailIsAvailable: (parent, args, context) => personServices.isEmailUnused(args.email)
  },

  Mutation: {
    subscribeToProducer: (parent, args, context) => personServices.subscribePersonToProducer(args.producerId, args.personId),

    unsubscribeToProducer: (parent, args, context) => personServices.unsubscribePersonToProducer(args.producerId, args.personId)
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
