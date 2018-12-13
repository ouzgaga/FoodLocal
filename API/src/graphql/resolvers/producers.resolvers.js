const producersServices = require('../services/producers.services');
const productsServices = require('../services/products.services');
const usersServices = require('../services/users.services');
const salesPointsServices = require('../services/salespoints.services');
const utilsServices = require('../services/utils.services');

const producerResolvers = {
  Query: {
    producers: () => producersServices.getProducers(),

    producer: (parent, args, context) => producersServices.getProducerById(utilsServices.castIdInObjectId(args.producerId)),

    producersWaitingForValidation: (parent, args, context) => producersServices.getAllProducerWaitingForValidation(),

    searchProducerByProducts: (parent, args, context) => producersServices.getAllProducersInReceivedIdList(
      utilsServices.castTabOfIdsInTabOfObjectIds(args.productsIds)
    ),

    filterProducers: async(parent, args, context) => producersServices.filterProducers(utilsServices.castTabOfIdsInTabOfObjectIds(args.byProductTypeIds))
  },

  Mutation: {
    validateAProducer: (poarent, args, context) => producersServices.validateAProducer(utilsServices.castIdInObjectId(args.producerId), args.validationState),

    addProducer: (parent, args, context) => producersServices.addProducer(args.producer),

    updateProducer: (parent, args, context) => producersServices.updateProducer(args.producer),

    deleteProducer: (parent, args, context) => producersServices.deleteProducer(utilsServices.castIdInObjectId(args.producerId))
  },

  Producer: {
    subscriptions: (parent, args, context) => producersServices.getAllProducersInReceivedIdList(parent.subscriptions),

    subscribedUsers: (parent, args, context) => usersServices.getAllUsersInReceivedIdList(parent.subscribedUsers),

    salesPoint: (parent, args, context) => (parent.salesPointId != null ? salesPointsServices.getSalesPointById(
      utilsServices.castIdInObjectId(parent.salesPointId)
    ) : null),

    products: (parent, args, context) => productsServices.getAllProductsInReceivedIdList(utilsServices.castTabOfIdsInTabOfObjectIds(parent.productsIds))
  }
};

module.exports = producerResolvers;
