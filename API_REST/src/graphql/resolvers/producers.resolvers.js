require('../../app/models/producers.model');

const producerServices = require('../../app/services/producersServices');
const Producers = require('../../app/models/producers.model');
const SalesPoint = require('../../app/models/salespoints.model');

const isEmailUnused = async(emailProducer) => {
  const producer = await Producers.findOne({ email: emailProducer });
  return producer === null;
};

const producerResolvers = {
  Query: {
    producers: (parent, args, context) => Producers.find({})
      .sort({ _id: 1 }),

    producer: (parent, args, context) => Producers.findById(args.id)
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

    updateProducerInfos: async (parent, args, context) => {
      // fixme: checker le contexte pour vérifier que le user ait bien les droits pour faire cet udpate!


      const producer = {
        firstname: args.producer.firstname,
        lastname: args.producer.lastname,
        email: args.producer.email,
        password: args.producer.password,
        image: args.producer.image,
        subscriptions: await producerServices.getFiltredProducersById(args.producer.subscriptions),
        emailValidated: args.producer.isValidated,
        // subscribedUsers: args.producer.subscribedUsers,
        phoneNumber: args.producer.phoneNumber,
        description: args.producer.description,
        website: args.producer.website,
        salesPoint: args.producer.salesPoint,
        isValidated: args.producer.isValidated,
        // Products: args.producer.Products
      };


      return Producers.findByIdAndUpdate(producer);
    }
  },
  Producer: {
    salesPoint: (parent, args, context) => SalesPoint.findById(parent.salesPoint),
    subscriptions: () => Producers.find({})
    // userType: UserType!
    // subscribedUsers : [User!]!
    // salesPoint: SalesPoint!
    // isValidated: Boolean!
    // Products: [Product!]!
  }
};

module.exports = producerResolvers;
