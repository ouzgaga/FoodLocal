const salespointsServices = require('../services/salespoints.services');

const salespointsResolvers = {
  Query: {
    salespoints: (parent, args, context) => salespointsServices.getSalesPoints(),

    salespoint: (parent, args, context) => salespointsServices.getSalesPointById(args.salespointId)
  },

  Mutation: {
    addSalespoint: (parent, args, context) => salespointsServices.addSalesPoint(args.salespoint),

    updateSalespoint: (parent, args, context) => salespointsServices.updateSalesPoint(args.salespoint),

    deleteSalesPoint: (parent, args, context) => salespointsServices.deleteSalesPoint(args.salespointId)
  }
};
module.exports = salespointsResolvers;
