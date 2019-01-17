const { isAuthenticatedAsUserAndIsYourself, isAuthenticated } = require('./authorization.resolvers');
const tokenValidationEmailServices = require('../services/tokenValidationEmail.services');
const connectionTokenServices = require('../services/connectionToken.services');
const personsServices = require('../services/persons.services');

const producerResolvers = {
  Mutation: {
    validateAnEmailToken: (parent, args, context) => personsServices.validateEmailUserByToken(args.emailValidationToken),

    askNewEmailToken: (parent, args, context) => tokenValidationEmailServices.askNewEmailToken(args.email, args.password),

    login: (parent, args, context) => connectionTokenServices.login(args.email, args.password),

    renewToken: async(parent, args, context) => {
      await isAuthenticated(context.id);
      return connectionTokenServices.createConnectionToken(context.id, context.email, context.isAdmin, context.kind);
    },

    signUpAsUser: (parent, args, context) => connectionTokenServices.signUpAsUser(args.newUser),

    signUpAsProducer: (parent, args, context) => connectionTokenServices.signUpAsProducer(args.newProducer),

    upgradeUserToProducer: async(parent, args, context) => {
      await isAuthenticatedAsUserAndIsYourself(context.id, args.idUserToUpgrade, context.kind);
      return personsServices.upgradeUserToProducer(args.idUserToUpgrade, args.password);
    }
  },

  Token: {
    token: (parent, args, context) => parent
  },

};
module.exports = producerResolvers;
