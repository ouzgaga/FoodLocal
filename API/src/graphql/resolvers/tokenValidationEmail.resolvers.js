const tokenValidationEmailServices = require('../services/tokenValidationEmail.services');
const usersService = require('../services/users.services');

const producerResolvers = {
  Query: {
    tokens: () => tokenValidationEmailServices.getTokenValidationEmails(),
  },
  Mutation: {
    validateToken: (parent, args, context) => usersService.validateEmailUserByToken(args.token),
    askNewToken: (parent, args, context) => {
      const token = tokenValidationEmailServices.addTokenValidationEmail(args.idUser);
      if (token === null) {
        return false;
      } else {
        return true;
      }
    },
  }
};
module.exports = producerResolvers;
