const personRatingProducerServices = require('../services/personRatingProducer.services');

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
    personId: (parent, args, context) => parent.personId.toString(),

    producerId: (parent, args, context) => parent.producerId.toString()
  }
};
module.exports = personRatingProducerResolvers;
