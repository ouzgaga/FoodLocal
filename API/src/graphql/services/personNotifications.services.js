const mongoose = require('mongoose');
const PersonsNotificationsModel = require('../models/personNotifications.modelgql');

function getAllNotificationsOfPerson(personId) {
  // FIXME: Il faut ajouter la pagination entre la DB et le serveur !!!
  return PersonsNotificationsModel.find({ personId })
    .sort({ _id: 1 });
}

function countNbNotificationsOfPerson(personId) {
  return PersonsNotificationsModel.countDocuments({ personId });
}

function addNotificationOfPerson(personId, notificationId) {
  if (!mongoose.Types.ObjectId.isValid(personId)) {
    throw new Error('Received personId is invalid!');
  }

  const personNotificationToAdd = {
    personId,
    notificationId,
    seen: false
  };

  // on enregistre le nouveau post dans la base de données
  return new PersonsNotificationsModel(personNotificationToAdd).save();
}

function addNotificationOfPersonForAllPersonIdInArray(personIdArray, notificationId) {
  const promises = personIdArray.map(personId => addNotificationOfPerson(personId, notificationId));
  return Promise.all(promises);
}

function setPersonNotificationAsSeen(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Received personNotification.id is invalid!');
  }

  return PersonsNotificationsModel.findByIdAndUpdate(id, { seen: true }, { new: true });
}


module.exports = {
  getAllNotificationsOfPerson,
  countNbNotificationsOfPerson,
  addNotificationOfPersonForAllPersonIdInArray,
  setPersonNotificationAsSeen
};
