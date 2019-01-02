const { combineResolvers } = require('graphql-resolvers');
const { isAuthenticatedAsUserAndIsYourself, isAuthenticatedAndIsYourself } = require('./authorization.resolvers');
const personRatingProducersServices = require('../services/personRatingProducers.services');
const personsServices = require('../services/persons.services');
const producersServices = require('../services/producers.services');

const personRatingProducersResolvers = {
  Query: {
    ratingsAboutProducer: (parent, args, context) => personRatingProducersServices.getAllRatingsAboutProducerWithId(args.producerId),

    ratingAboutProducerMadeByPerson: combineResolvers(
      isAuthenticatedAsUserAndIsYourself,
      (parent, args, context) => personRatingProducersServices.getRatingAboutProducerIdMadeByPersonId(args.personId, args.producerId)
    ),

    ratingsMadeByPerson: combineResolvers(
      isAuthenticatedAsUserAndIsYourself,
      (parent, args, context) => personRatingProducersServices.getAllRatingsMadeByPersonWithId(args.personId)
    )
  },

  Mutation: {
    addProducerRating: combineResolvers(
      isAuthenticatedAndIsYourself,
      (parent, args, context) => personRatingProducersServices.addPersonRatingProducer(args.rating)
    ),

    updateProducerRating: combineResolvers(
      isAuthenticatedAndIsYourself,
      (parent, args, context) => personRatingProducersServices.updatePersonRatingProducer(args.rating)
    ),

    deleteProducerRating: combineResolvers(
      isAuthenticatedAndIsYourself,
      (parent, args, context) => personRatingProducersServices.deletePersonRatingProducer(args.ratingId)
    )
  },

  PersonRatingProducer: {
    person: (parent, args, context) => personsServices.getPersonById(parent.personId),

    producer: (parent, args, context) => producersServices.getProducerById(parent.producerId)
  }
};
module.exports = personRatingProducersResolvers;
