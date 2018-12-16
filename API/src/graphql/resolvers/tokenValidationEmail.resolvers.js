const tokenValidationEmailServices = require('../services/tokenValidationEmail.services');
const usersService = require('../services/users.services');

const producerResolvers = {
  Query: {
    tokens: (parent, args, context) => tokenValidationEmailServices.getTokenValidationEmails()
  },

  Mutation: {
    validateToken: (parent, args, context) => usersService.validateEmailUserByToken(args.token),

    askNewToken: (parent, args, context) => tokenValidationEmailServices.addTokenValidationEmail(args.idPerson)
  }
};
module.exports = producerResolvers;
