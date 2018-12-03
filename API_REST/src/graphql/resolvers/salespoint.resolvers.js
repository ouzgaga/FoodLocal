const salespointsServices = require('../services/salespoints.services');

const salespointsResolvers = {
  Query: {
    salespoints: () => salespointsServices.getSalesPoints(),

    salespoint: (parent, args, context) => salespointsServices.getSalesPointById({ id: args.id })
  },

  Mutation: {
    addSalespoint: (parent, args, context) => salespointsServices.addSalesPoint(args.salespoint),

    updateSalespoint: (parent, args, context) => salespointsServices.updateSalesPoint(args.salespoint),

    deleteSalesPoint: (parent, args, context) => salespointsServices.deleteSalesPoint(args.salespoint)
  }

};
module.exports = salespointsResolvers;
