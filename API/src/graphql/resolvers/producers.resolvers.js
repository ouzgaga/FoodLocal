const personsServices = require('../services/persons.services');
const producersServices = require('../services/producers.services');
const productsServices = require('../services/products.services');
const salespointsServices = require('../services/salespoints.services');

const producerResolvers = {
  Query: {
    producers: (parent, args, context) => producersServices.getProducers(),

    producer: (parent, args, context) => producersServices.getProducerById(args.producerId),

    producersWaitingForValidation: (parent, args, context) => producersServices.getAllProducerWaitingForValidation(),

    filterProducers: (parent, args, context) => producersServices.filterProducers(args.byProductTypeIds),
  },

  Mutation: {
    validateAProducer: (parent, args, context) => producersServices.validateAProducer(args.producerId, args.validationState),

    addProducer: (parent, args, context) => producersServices.addProducer(args.producer),

    updateProducer: (parent, args, context) => producersServices.updateProducer(args.producer),

    deleteProducer: (parent, args, context) => producersServices.deleteProducer(args.producerId),
  },

  Producer: {
    followingProducers: (parent, args, context) => producersServices.getAllProducersInReceivedIdList(parent.followingProducersIds),

    followers: (parent, args, context) => personsServices.getAllPersonsInReceivedIdList(parent.followersIds),

    salespoint: (parent, args, context) => (parent.salespointId != null ? salespointsServices.getSalesPointById(parent.salespointId) : null),

    products: (parent, args, context) => productsServices.getAllProductsInReceivedIdList(parent.productsIds),
  }
};

module.exports = producerResolvers;
