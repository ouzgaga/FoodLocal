module.exports = {
  getNotificationById,
  addNotification
};

const mongoose = require('mongoose');
const producersServices = require('./producers.services');
const NotificationsModel = require('../models/notifications.modelgql');
const personNotificationsServices = require('./personNotifications.services');

function getNotificationById(notificationId) {
  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    throw new Error('Received notificationId is invalid!');
  }
  return NotificationsModel.findById(notificationId);
}

async function addNotification(type, producerId) {
  if (!mongoose.Types.ObjectId.isValid(producerId)) {
    throw new Error('Received producerId is invalid!');
  }

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
  const res = await personNotificationsServices.addNotificationOfPersonForAllPersonIdInArray(producer.followersIds, notification.id);

  return notification;
}
