module.exports = {
  getNotificationById,
  addNotification
};

const producersServices = require('./producers.services');
const NotificationsModel = require('../models/notifications.modelgql');
const personNotificationsServices = require('./personNotifications.services');

function getNotificationById(notificationId) {
  return NotificationsModel.findById(notificationId);
}

async function addNotification(type, producerId) {
  const producer = await producersServices.getProducerById(producerId);
  if (producer == null) {
    throw new Error(`The given producerId (with id: ${producerId}) doesn’t exist in the database!\``);
  }

  const notificationToAdd = {
    type,
    producerId: producer.id,
    // date: Date.now()
  };
  // on enregistre le nouveau post dans la base de données
  const notification = await new NotificationsModel(notificationToAdd).save();

  // on ajoute une personNotification pour chaque follower du producteur ayant produit la nouvelle notification
  await personNotificationsServices.addNotificationOfPersonForAllPersonIdInArray(producer.followersIds, notification.id);

  return notification;
}
