module.exports = {
  countUnSeenNotificationsOfPerson,
  getAllNotificationsOfPerson,
  countNbNotificationsOfPerson,
  addNotificationOfPersonForAllPersonIdInArray,
  setAllPersonNotificationAsSeen,
  setPersonNotificationAsSeen
};

const PersonsNotificationsModel = require('../models/personNotifications.modelgql');

/**
 * Retourne le nombre de notifications personnelles non lues par la personne correspondante à personId.
 * @param personId, l'id de la personne dont on souhaite connaître le nombre de notifications non lues.
 * @returns le nombre de notifications personnelles non lues par la personne correspondante à personId.
 */
function countUnSeenNotificationsOfPerson(personId) {
  return PersonsNotificationsModel.countDocuments({ personId, seen: false });
}

/**
 * Retourne toutes les notifications personnelles de la personne correspondante à personId.
 * @param personId, l'id de la personne dont on souhaite récupérer toutes les notifications.
 * @returns le nombre de notifications personnelles non lues par la personne correspondante à personId.
 */
function getAllNotificationsOfPerson(personId) {
  // FIXME: Il faut ajouter la pagination entre la DB et le serveur !!!
  return PersonsNotificationsModel.find({ personId })
    .sort({ _id: 1 });
}

/**
 * Retourne le nombre total de notifications personnelles reçues par la personne correspondante à l'id personId.
 * @param personId, l'id de la personne dont on souhaite obtenir le nombre total de notifications reçues.
 * @returns le nombre total de notifications personnelles reçues par la personne correspondante à l'id personId.
 */
function countNbNotificationsOfPerson(personId) {
  return PersonsNotificationsModel.countDocuments({ personId });
}

/**
 * Ajoute une nouvelle notification personnelle pour la personne correspondant à l'id personId. La notification liée est celle correspondant à l'id
 * notificationId.
 * @param personId, la personne à qui on souhaite ajouter une nouvelle notification personnelle.
 * @param notificationId, la notification liée à la notification personnelle.
 * @returns une nouvelle notification personnelle liant la notification correspondante à notificationId avec la personne personId.
 */
function addNotificationOfPerson(personId, notificationId) {
  const personNotificationToAdd = {
    personId,
    notificationId,
    seen: false
  };

  // on enregistre le nouveau post dans la base de données
  return new PersonsNotificationsModel(personNotificationToAdd).save();
}

/**
 * Ajoute une nouvelle notification personnelle pour toutes les personnes correspondant à un id du tableau peronIdArray reçu. La notification liée est celle
 * correspondant à l'id notificationId.
 * @param personIdArray, un tableau d'id de toutes les personnes à qui on souhaite ajouter une nouvelle notification personnelle.
 * @param notificationId, la notification liée à la notification personnelle.
 * @returns un tableau de nouvelles notifications personnelles liant la notification correspondante à notificationId avec une personne du tableau d'id
 * personIdArray.
 */
function addNotificationOfPersonForAllPersonIdInArray(personIdArray, notificationId) {
  const promises = personIdArray.map(personId => addNotificationOfPerson(personId, notificationId));
  return Promise.all(promises);
}

/**
 * Permet de marquer comme 'vues' toutes les notifications personnelles de la personne correspondante à personId.
 * @param personId, l'id de la personne dont on souhaite marquer comme 'vues' toutes les notifications personnelles.
 * @returns {Promise}
 */
function setAllPersonNotificationAsSeen(personId) {
  return PersonsNotificationsModel.updateMany({ personId, seen: false }, { seen: true });
}

/**
 * Permet de marquer comme 'vue' la notification personnelle correspondant à l'id reçu.
 * @param id, l'id de la notification personnelle que l'on souhaite marquer comme 'vue'.
 * @returns {Promise}
 */
function setPersonNotificationAsSeen(id) {
  return PersonsNotificationsModel.findByIdAndUpdate(id, { seen: true }, { new: true, runValidators: true });
}
