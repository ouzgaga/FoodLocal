const { connectionFromArray } = require('graphql-relay');
const { isAuthenticatedAsProducerAndIsYourself, isAuthenticatedAsAdmin } = require('./authorization.resolvers');
const productsServices = require('../services/products.services');
const producersServices = require('../services/producers.services');
const salespointsServices = require('../services/salespoints.services');
const personsServices = require('../services/persons.services');

const producerResolvers = {
  Query: {
    producers: (parent, args, context) => producersServices.getProducers(),

    producer: (parent, args, context) => producersServices.getProducerById(args.producerId),

    producersWaitingForValidation: async(parent, args, context) => {
      await isAuthenticatedAsAdmin(context.id, context.isAdmin);
      return producersServices.getAllProducerWaitingForValidation();
    },

    filterProducers: (parent, args, context) => producersServices.filterProducers(args.byProductTypeIds),

    geoFilterProducers: (parent, args, context) => producersServices.geoFilterProducers(args.locationClient, args.byProductTypeIds)
  },

  Mutation: {
    validateAProducer: async(parent, args, context) => {
      await isAuthenticatedAsAdmin(context.id, context.isAdmin);
      return producersServices.validateAProducer(args.producerId, args.validationState);
    },

    // addProducer: (parent, args, context) => producersServices.addProducer(args.producer),

    updateProducer: async(parent, args, context) => {
      await isAuthenticatedAsProducerAndIsYourself(context.id, args.producer.id, context.kind);
      return producersServices.updateProducer(args.producer);
    },

    deleteProducer: async(parent, args, context) => {
      await isAuthenticatedAsProducerAndIsYourself(context.id, args.producerId, context.kind);
      return producersServices.deleteProducer(args.producerId);
    }
  },

  Producer: {
    followingProducers: (parent, args, context) => producersServices.getAllProducersInReceivedIdList(parent.followingProducersIds),

    followers: (parent, args, context) => personsServices.getAllPersonsInReceivedIdList(parent.followersIds),

    salespoint: (parent, args, context) => (parent.salespointId != null ? salespointsServices.getSalespointById(parent.salespointId) : null),

    products: (parent, args, context) => productsServices.getAllProductsInReceivedIdList(parent.productsIds),
  },

  ProducerConnection: {
    totalCount: (parent, args, context) => producersServices.countProducersIndBD()
  }
};

module.exports = producerResolvers;
