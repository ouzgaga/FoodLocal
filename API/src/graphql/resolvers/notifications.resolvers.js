const { isAuthenticatedAndIsYourself } = require('./authorization.resolvers');
const notificationsServices = require('../services/notifications.services');
const personNotificationsServices = require('../services/personNotifications.services');
const personsServices = require('../services/persons.services');
const producersServices = require('../services/producers.services');

const notificationsResolvers = {
  Query: {
    notificationsOfPerson: async(parent, args, context) => {
      await isAuthenticatedAndIsYourself(context.id, args.personId);
      return personNotificationsServices.getAllNotificationsOfPerson(args.personId);
    }
  },

  Mutation: {
    setNotificationAsSeen: async(parent, args, context) => {
      await isAuthenticatedAndIsYourself(context.id, args.personId);
      return personNotificationsServices.setPersonNotificationAsSeen(args.personNotificationId);
    }
  },

  PersonNotification: {
    person: (parent, args, context) => personsServices.getPersonById(parent.person),

    notification: (parent, args, context) => notificationsServices.getNotificationById(parent.notification)
  },

  Notification: {
    producer: (parent, args, context) => producersServices.getProducerById(parent.producer)
  },

  PersonNotificationConnection: {
    totalCount: (parent, args, context) => personNotificationsServices.countNbNotificationsOfPerson()
  }
};

module.exports = notificationsResolvers;
