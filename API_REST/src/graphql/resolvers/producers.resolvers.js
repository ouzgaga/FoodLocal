const producersServices = require('../services/producers.services');
const productsServices = require('../services/products.services');
const usersServices = require('../services/users.services');
const salesPointsServices = require('../services/salespoints.services');
const ProducersModel = require('../models/producers.modelgql');
const UsersModel = require('../models/user.modelgql');
const SalesPoint = require('../models/salespoints.modelgql');

const isEmailUnused = async(emailUser) => {
  const existingUser = await UsersModel.findOne({ email: emailUser });
  const existingProducer = await ProducersModel.findOne({ email: emailUser });

  return existingUser === null && existingProducer === null;
};

const producerResolvers = {
  Query: {
    producers: () => producersServices.getProducers(),

    producer: (parent, args, context) => producersServices.getProducerById(args.producer)
  },

  Mutation: {
    addProducer: async(parent, args, context) => {
      // FIXME: comment faire une transaction aec Mongoose pour rollback en cas d'erreur ?
      if (await isEmailUnused(args.producer.email)) {
        const salespoint = await salesPointsServices.addSalesPoint(args.producer.salesPoint);

        const productsId = await productsServices.addAllProductsInArray(args.producer.products);

        const producer = {
          ...args.producer,
          salesPoint: salespoint.id,
          subscriptions: [],
          emailValidated: false,
          subscribedUsers: [],
          isValidated: false,
          products: productsId
        };

        return new ProducersModel(producer)
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
        subscriptions: await producersServices.getAllProducersInReceivedIdList(args.producer.subscriptions),
        emailValidated: args.producer.isValidated,
        // subscribedUsers: args.producer.subscribedUsers,
        phoneNumber: args.producer.phoneNumber,
        description: args.producer.description,
        website: args.producer.website,
        salesPoint: args.producer.salesPoint,
        isValidated: args.producer.isValidated
        // Products: args.producer.Products
      };

      return ProducersModel.findByIdAndUpdate(producer);
    }
  },

  Producer: {
    subscriptions: (parent, args, context) => producersServices.getAllProducersInReceivedIdList(parent.subscriptions),

    subscribedUsers: (parent, args, context) => usersServices.getAllUsersInReceivedIdList(parent.subscribedUsers),

    salesPoint: (parent, args, context) => salesPointsServices.getSalesPointById({ id: parent.salesPoint }),

    products: (parent, args, context) => productsServices.getAllProductsInReceivedIdList(parent.products)
  }
};
module.exports = producerResolvers;
