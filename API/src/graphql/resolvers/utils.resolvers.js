const utilsServices = require('../services/utils.services');

const producerResolvers = {
  Query: {
    checkIfEmailIsAvailable: (parent, args, context) => utilsServices.isEmailUnused(args.email),
    login: (parent, args, context) => utilsServices.login(args.email, args.password)
}
};
module.exports = producerResolvers;
