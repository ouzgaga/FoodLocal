const salespointsServices = require('../services/salespoints.services');
const producersServices = require('../services/producers.services');

const salespointsResolvers = {
  Query: {
    salespoints: (parent, args, context) => salespointsServices.getSalesPoints(),

    salespoint: (parent, args, context) => salespointsServices.getSalesPointById(args.salespointId)
  },

  Mutation: {
    addSalespointToProducer: (parent, args, context) => producersServices.addSalespointToProducer(args.producerId, args.salespoint),

    updateSalespoint: (parent, args, context) => salespointsServices.updateSalesPoint(args.salespoint),

    deleteSalesPointToProducer: (parent, args, context) => producersServices.removeSalespointToProducer(args.producerId)
  }
};
module.exports = salespointsResolvers;
