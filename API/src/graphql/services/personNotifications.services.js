const mongoose = require('mongoose');
const PersonsNotificationsModel = require('../models/personNotifications.modelgql');

function getAllNotificationsOfPerson(personId, { limit = 30, page = 0 } = {}) {
  if (!mongoose.Types.ObjectId.isValid(personId)) {
    return new Error('Received personId is invalid!');
  }

  let skip;
  if (page !== 0) {
    skip = page * limit;
  }

  return PersonsNotificationsModel.find({ personId })
    .sort({ _id: 1 })
    .skip(+skip)
    .limit(+limit);
}

function addNotificationOfPerson(personId, notificationId) {
  if (!mongoose.Types.ObjectId.isValid(personId)) {
    return new Error('Received personId is invalid!');
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
    return new Error('Received personNotification.id is invalid!');
  }

  return PersonsNotificationsModel.findByIdAndUpdate(id, { seen: true }, { new: true });
}


module.exports = {
  getAllNotificationsOfPerson,
  addNotificationOfPersonForAllPersonIdInArray,
  setPersonNotificationAsSeen
};
