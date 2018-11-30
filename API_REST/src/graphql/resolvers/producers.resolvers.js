const producersServices = require('../services/producers.services');
const productsServices = require('../services/products.services');
const usersServices = require('../services/users.services');
const salesPointsServices = require('../services/salespoints.services');
const Producers = require('../models/producers.model');
const SalesPoint = require('../models/salespoints.model');

const isEmailUnused = async(emailProducer) => {
  const producer = await Producers.findOne({ email: emailProducer });
  return producer === null;
};

const producerResolvers = {
  Query: {
    producers: () => producersServices.getProducers(),

    producer: (parent, args, context) => producersServices.getProducerById({ id: args.id })
  },

  Mutation: {
    addProducer: async(parent, args, context) => {
      if (await isEmailUnused(args.producer.email)) {
        const salespoint = await new SalesPoint(args.producer.salesPoint).save();

        const producer = {
          ...args.producer,
          salesPoint: salespoint.id,
          subscriptions: [],
          emailValidated: false,
          subscribedUsers: [],
          isValidated: false
        };

        return new Producers(producer)
          .save();
      } else {
        throw new Error('This email is already used.');
      }
    },

    updateProducerInfos: async(parent, args, context) => {
      // fixme: checker le contexte pour vérifier que le user ait bien les droits pour faire cet udpate!


      const producer = {
        firstname: args.producer.firstname,
        lastname: args.producer.lastname,
        email: args.producer.email,
        password: args.producer.password,
        image: args.producer.image,
        subscriptions: await producersServices.getFiltredProducersById(args.producer.subscriptions),
        emailValidated: args.producer.isValidated,
        // subscribedUsers: args.producer.subscribedUsers,
        phoneNumber: args.producer.phoneNumber,
        description: args.producer.description,
        website: args.producer.website,
        salesPoint: args.producer.salesPoint,
        isValidated: args.producer.isValidated
        // Products: args.producer.Products
      };


      return Producers.findByIdAndUpdate(producer);
    }
  },

  Producer: {
    subscriptions: (parent, args, context) => producersServices.getAllProducersInReceivedIdList(parent.subscriptions),

    subscribedUsers: (parent, args, context) => usersServices.getAllUsersInReceivedIdList(parent.subscribedUsers),

    salesPoint: (parent, args, context) => salesPointsServices.getSalesPointById({ id: parent.salesPoint }),

    Products: (parent, args, context) => productsServices.getAllProductsInReceivedIdList(parent.subscribedUsers)
  }
};
module.exports = producerResolvers;
