const { isAuthenticatedAndIsYourself, isAuthenticated } = require('./authorization.resolvers');
const personsServices = require('../services/persons.services');
const producersServices = require('../services/producers.services');

const PersonType = {
  USER: 'users',
  PRODUCER: 'producers'
};

/**
 * Resolvers correspondant au schéma GraphQL person.graphqls
 * La documentation correspondant à chaque resolver se trouve dans le schéma GraphQL.
 */
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
    },

    resetPassword: (parent, args, context) => personsServices.resetPassword(args.email),

    deletePersonAccount: async(parent, args, context) => {
      await isAuthenticated(context.id);
      const deletedPerson = await personsServices.deletePersonAccount(context.id, context.kind);
      return deletedPerson.email == null;
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
    // ne fonctionne que parce qu'il n'y a pas de pagination entre la DB et le serveur...!
    totalCount: (parent, args, context) => parent.edges.length // FIXME: mieux mais pas toujours correct... -> personsServices.countNbPersonsInDB()
  }
};

module.exports = personsResolvers;
