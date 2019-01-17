const { isAuthenticatedAsUserAndIsYourself, isAuthenticatedAndIsYourself } = require('./authorization.resolvers');
const personRatingProducersServices = require('../services/personRatingProducers.services');
const personsServices = require('../services/persons.services');
const producersServices = require('../services/producers.services');

const personRatingProducersResolvers = {
  Query: {
    ratingsAboutProducer: (parent, args, context) => personRatingProducersServices.getAllRatingsAboutProducerWithId(args.producerId),

    ratingAboutProducerMadeByPerson: async(parent, args, context) => {
      await isAuthenticatedAsUserAndIsYourself(context.id, args.personId, context.kind);
      return personRatingProducersServices.getRatingAboutProducerIdMadeByPersonId(args.personId, args.producerId);
    },

    ratingsMadeByPerson: async(parent, args, context) => {
      await isAuthenticatedAsUserAndIsYourself(context.id, args.personId, context.kind);
      return personRatingProducersServices.getAllRatingsMadeByPersonWithId(args.personId);
    }
  },

  Mutation: {
    addOrUpdateProducerRating: async(parent, args, context) => {
      await isAuthenticatedAndIsYourself(context.id, args.rating.personId);
      return personRatingProducersServices.addOrUpdatePersonRatingProducer(args.rating);
    },

    deleteProducerRating: async(parent, args, context) => {
      await isAuthenticatedAndIsYourself(context.id, args.personId);
      return personRatingProducersServices.deletePersonRatingProducer(args.ratingId);
    }
  },

  PersonRatingProducer: {
    person: (parent, args, context) => personsServices.getPersonById(parent.personId),

    producer: (parent, args, context) => producersServices.getProducerById(parent.producerId)
  },

  PersonRatingProducerConnectionProducer: {
    totalCount: (parent, args, context) => {
      const producerId = parent.edges[0] != null ? parent.edges[0].node.producerId : null;
      return personRatingProducersServices.countNbRatingsAboutProducerWithId(producerId);
    }
  },

  PersonRatingProducerConnectionPerson: {
    totalCount: (parent, args, context) => {
      const personId = parent.edges[0] != null ? parent.edges[0].node.personId : null;
      return personRatingProducersServices.countNbRatingsMadeByPersonWithId(personId);
    }
  }
};
module.exports = personRatingProducersResolvers;
