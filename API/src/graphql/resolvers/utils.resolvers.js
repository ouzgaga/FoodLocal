const utilsServices = require('../services/utils.services');

const producerResolvers = {
  Query: {
    checkIfEmailIsAvailable: (parent, args, context) => utilsServices.isEmailUnused(args.email)
  }
};
module.exports = producerResolvers;
