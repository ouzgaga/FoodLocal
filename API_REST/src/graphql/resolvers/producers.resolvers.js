const producersServices = require('../services/producers.services');
const productsServices = require('../services/products.services');
const usersServices = require('../services/users.services');
const salesPointsServices = require('../services/salespoints.services');

const producerResolvers = {
  Query: {
    producers: () => producersServices.getProducers(),

    producer: (parent, args, context) => producersServices.getProducerById(args.producer)
  },

  Mutation: {
    addProducer: (parent, args, context) => producersServices.addProducer(args.producer),

    updateProducer: (parent, args, context) => producersServices.updateProducer(args.producer),

    deleteProducer: (parent, args, context) => producersServices.deleteProducer(args.producer)
  },

  Producer: {
    subscriptions: (parent, args, context) => producersServices.getAllProducersInReceivedIdList(parent.subscriptions),

    subscribedUsers: (parent, args, context) => usersServices.getAllUsersInReceivedIdList(parent.subscribedUsers),

    salesPoint: (parent, args, context) => salesPointsServices.getSalesPointById({ id: parent.salesPoint }),

    products: (parent, args, context) => productsServices.getAllProductsInReceivedIdList(parent.products)
  }
};

module.exports = producerResolvers;
