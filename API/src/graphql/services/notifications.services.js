module.exports = {
  getNotificationById,
  addNotification
};

const producersServices = require('./producers.services');
const NotificationsModel = require('../models/notifications.modelgql');
const personNotificationsServices = require('./personNotifications.services');

/**
 * Permet de récupérer la notification correspondante à l'id reçu dans la base de données.
 * @param notificationId, l'id de la notification à récupérer dans la base de données
 * @returns la notification correspondante à l'id reçu.
 */
function getNotificationById(notificationId) {
  return NotificationsModel.findById(notificationId);
}

/**
 * Ajoute une nouvelle notification dans la bse de donnée et ajoute une notification personnelle à tous les followers du producteur correspondant à producerId.
 * @param type, le type de la notification
 *    NEW_POST -> notification créée lorsqu'un producteur poste un nouveau message sur son mur.
 *    PRODUCER_UPDATE_INFO -> notification crée lorsqu'un producteur met à jour ses informations personnelles.
 *    PRODUCER_UPDATE_PRODUCTS_LIST -> notification crée lorsqu'un producteur met à jour sa liste de produits.
 *    PRODUCER_UPDATE_SALESPOINT_INFO) -> notification crée lorsqu'un producteur met à jour les informations de son point de vente.
 * @param producerId, l'id du producteur ayant produit la notification.
 * @returns la nouvelle notification.
 */
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
