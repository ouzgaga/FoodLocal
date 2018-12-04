const tokenValidationEmailServices = require('../services/tokenValidationEmail.services');

const producerResolvers = {
  Mutation: {
    validateToken: (parent, args, context) => tokenValidationEmailServices.validateTokenValidationEmail(args.token),
    askNewToken: (parent, args, context) => {
      const token = tokenValidationEmailServices.addTokenValidationEmail(args.idUser);

      if (token === null){
        return false;
      } else {
        return true;
      }
    },
  }
};
module.exports = producerResolvers;
