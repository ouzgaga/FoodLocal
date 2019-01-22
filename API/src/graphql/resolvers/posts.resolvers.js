const { isAuthenticatedAsProducerAndIsYourself } = require('./authorization.resolvers');
const postsServices = require('../services/posts.services');
const producersServices = require('../services/producers.services');

/**
 * Resolvers correspondant au schéma GraphQL post.graphqls
 * La documentation correspondant à chaque resolver se trouve dans le schéma GraphQL.
 */
const postsResolvers = {
  Query: {
    postsOfProducer: (parent, args, context) => postsServices.getAllPostsOfProducer(args.producerId, args)
  },

  Mutation: {
    addPostOfProducer: async(parent, args, context) => {
      await isAuthenticatedAsProducerAndIsYourself(context.id, args.post.producerId, context.kind);
      return postsServices.addPostOfProducer(args.post);
    },

    deletePostOfProducer: async(parent, args, context) => {
      await isAuthenticatedAsProducerAndIsYourself(context.id, args.producerId, context.kind);
      return postsServices.deletePostOfProducer(args.postId);
    }
  },

  Post: {
    producer: (parent, args, context) => producersServices.getProducerById(parent.producerId),
  },

  PostConnection: {
    totalCount: (parent, args, context) => {
      const producerId = parent.edges[0] != null ? parent.edges[0].node.producerId : null;
      return postsServices.countNbPostsOfProducerInDB(producerId);
    }
  }
};

module.exports = postsResolvers;
