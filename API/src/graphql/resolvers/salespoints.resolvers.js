const { isAuthenticatedAsProducerAndIsYourself } = require('./authorization.resolvers');
const salespointsServices = require('../services/salespoints.services');
const producersServices = require('../services/producers.services');

/**
 * Resolvers correspondant au schéma GraphQL salespoint.graphqls
 * La documentation correspondant à chaque resolver se trouve dans le schéma GraphQL.
 */
const salespointsResolvers = {
  Query: {
    salespoints: (parent, args, context) => salespointsServices.getSalespoints(),

    salespoint: (parent, args, context) => salespointsServices.getSalespointById(args.salespointId)
  },

  Mutation: {
    addSalespointToProducer: async(parent, args, context) => {
      await isAuthenticatedAsProducerAndIsYourself(context.id, args.producerId, context.kind);
      return producersServices.addSalespointToProducer(args.producerId, args.salespoint);
    },

    updateSalespoint: async(parent, args, context) => {
      await isAuthenticatedAsProducerAndIsYourself(context.id, args.producerId, context.kind);
      return salespointsServices.updateSalespoint(args.producerId, args.salespoint);
    },

    deleteSalespointToProducer: async(parent, args, context) => {
      await isAuthenticatedAsProducerAndIsYourself(context.id, args.producerId, context.kind);
      return producersServices.removeSalespointToProducer(args.producerId);
    }
  },

  Address: {
    distance: (parent, args, context) => parent.distance,

    longitude: (parent, args, context) => parent.location.coordinates[0],

    latitude: (parent, args, context) => parent.location.coordinates[1]
  },

  SalespointConnection: {
    totalCount: (parent, args, context) => salespointsServices.countNbSalespointInDB()
  }
};
module.exports = salespointsResolvers;
