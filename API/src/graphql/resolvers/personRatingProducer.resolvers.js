const personRatingProducerServices = require('../services/personRatingProducer.services');
const personsServices = require('../services/persons.services');
const producersServices = require('../services/producers.services');

const personRatingProducerResolvers = {
  Query: {
    ratingsAboutProducer: (parent, args, context) => personRatingProducerServices.getAllRatingsAboutProducerWithId(args.producerId),

    ratingAboutProducerMadeByPerson: (parent, args, context) => personRatingProducerServices.getRatingAboutProducerIdMadeByPersonId(args.personId,
      args.producerId),

    ratingsMadeByPerson: (parent, args, context) => personRatingProducerServices.getAllRatingsMadeByPersonWithId(args.personId)
  },

  Mutation: {
    addProducerRating: (parent, args, context) => personRatingProducerServices.addPersonRatingProducer(args.rating),

    updateProducerRating: (parent, args, context) => personRatingProducerServices.updatePersonRatingProducer(args.rating),

    deleteProducerRating: (parent, args, context) => personRatingProducerServices.deletePersonRatingProducer(args.ratingId)
  },

  PersonRatingProducer: {
    person: (parent, args, context) => personsServices.getPersonById(parent.personId),

    producer: (parent, args, context) => producersServices.getProducerById(parent.producerId)
  }
};
module.exports = personRatingProducerResolvers;
