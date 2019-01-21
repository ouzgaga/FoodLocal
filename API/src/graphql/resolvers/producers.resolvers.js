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

    geoFilterProducers: (parent, args, context) => producersServices.geoFilterProducers(args.locationClient, args.byProductTypeIds, args.ratingMin)
  },

  Mutation: {
    validateAProducer: async(parent, args, context) => {
      await isAuthenticatedAsAdmin(context.id, context.isAdmin);
      return producersServices.validateAProducer(args.producerId, args.validationState);
    },

    updateProducer: async(parent, args, context) => {
      await isAuthenticatedAsProducerAndIsYourself(context.id, args.producer.id, context.kind);
      return producersServices.updateProducer(args.producer);
    }
  },

  Producer: {
    id: (parent, args, context) => parent._id.toString(),

    followingProducers: (parent, args, context) => producersServices.getAllProducersInReceivedIdList(parent.followingProducersIds),

    followers: (parent, args, context) => personsServices.getAllPersonsInReceivedIdList(parent.followersIds),

    salespoint: (parent, args, context) => {
      if (parent.salespoint != null) {
        return parent.salespoint;
      }
      return (parent.salespointId != null ? salespointsServices.getSalespointById(parent.salespointId) : null);
    },

    products: (parent, args, context) => {
      if (parent.products != null) {
        return parent.products;
      }
      return productsServices.getAllProductsInReceivedIdList(parent.productsIds);
    }
  },

  ProducerConnection: {
    // ne fonctionne que parce qu'il n'y a pas de pagination entre la DB et le serveur...!
    totalCount: (parent, args, context) => parent.edges.length // FIXME: mieux mais pas toujours correct... -> producersServices.countProducersInDB()
  }
};

module.exports = producerResolvers;
