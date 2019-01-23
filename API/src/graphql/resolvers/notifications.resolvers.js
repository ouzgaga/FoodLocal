const { withFilter } = require('graphql-subscriptions');
const { isAuthenticated, isAuthenticatedAndIsYourself } = require('./authorization.resolvers');
const notificationsServices = require('../services/notifications.services');
const personNotificationsServices = require('../services/personNotifications.services');
const personsServices = require('../services/persons.services');
const producersServices = require('../services/producers.services');
const pubSub = require('../utils/pubSub');

/**
 * Resolvers correspondant au schéma GraphQL notification.graphqls
 * La documentation correspondant à chaque resolver se trouve dans le schéma GraphQL.
 */
const notificationsResolvers = {
  Query: {
    numberOfUnSeenNotificationsOfPerson: async(parent, args, context) => {
      await isAuthenticated(context.id);
      return personNotificationsServices.countUnSeenNotificationsOfPerson(context.id);
    },

    notificationsOfPerson: async(parent, args, context) => {
      await isAuthenticatedAndIsYourself(context.id, args.personId);
      return personNotificationsServices.getAllNotificationsOfPerson(args.personId);
    }
  },

  Mutation: {
    setAllNotificationsAsSeen: async(parent, args, context) => {
      await isAuthenticated(context.id);
      return (await personNotificationsServices.setAllPersonNotificationAsSeen(context.id)).nModified;
    },

    setNotificationAsSeen: async(parent, args, context) => {
      await isAuthenticatedAndIsYourself(context.id, args.personId);
      return personNotificationsServices.setPersonNotificationAsSeen(args.personNotificationId);
    }
  },

  Subscription: {
    newNotificationReceived: {
      subscribe: withFilter(
        () => pubSub.asyncIterator('NEW_NOTIFICATION'),
        (payload, variables, context) => payload.notification.personId === context.id
      )
    }
  },

  PersonNotification: {
    person: (parent, args, context) => personsServices.getPersonById(parent.person),

    notification: async(parent, args, context) => notificationsServices.getNotificationById(parent.notificationId)
  },

  Notification: {
    producer: (parent, args, context) => producersServices.getProducerById(parent.producerId)
  },

  PersonNotificationConnection: {
    totalCount: (parent, args, context) => personNotificationsServices.countNbNotificationsOfPerson()
  }
};

module.exports = notificationsResolvers;
