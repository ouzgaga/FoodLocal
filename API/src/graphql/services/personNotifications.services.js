module.exports = {
  countUnSeenNotificationsOfPerson,
  getAllNotificationsOfPerson,
  countNbNotificationsOfPerson,
  addNotificationOfPersonForAllPersonIdInArray,
  setAllPersonNotificationAsSeen,
  setPersonNotificationAsSeen
};

const PersonsNotificationsModel = require('../models/personNotifications.modelgql');

function countUnSeenNotificationsOfPerson(personId) {
  return PersonsNotificationsModel.countDocuments({ personId, seen: false });
}

function getAllNotificationsOfPerson(personId) {
  // FIXME: Il faut ajouter la pagination entre la DB et le serveur !!!
  return PersonsNotificationsModel.find({ personId })
    .sort({ _id: 1 });
}

function countNbNotificationsOfPerson(personId) {
  return PersonsNotificationsModel.countDocuments({ personId });
}

function addNotificationOfPerson(personId, notificationId) {
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

function setAllPersonNotificationAsSeen(personId) {
  return PersonsNotificationsModel.updateMany({ personId, seen: false }, { seen: true });
}

function setPersonNotificationAsSeen(id) {
  return PersonsNotificationsModel.findByIdAndUpdate(id, { seen: true }, { new: true, runValidators: true });
}
