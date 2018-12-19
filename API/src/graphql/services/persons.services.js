const mongoose = require('mongoose');
const PersonsModel = require('../models/persons.modelgql');

async function isEmailUnused(emailUser) {
  const existingPerson = await PersonsModel.findOne({ email: emailUser });
  return existingPerson === null;
}

async function checkIfPersonIdExistInDB(personId, isProducer = false) {
  if (!mongoose.Types.ObjectId.isValid(personId)) {
    return new Error('Received personRatingProducer.id is invalid!');
  }

  const person = await PersonsModel.findById(personId);
  if (isProducer) {
    return person != null && person.kind === 'producers';
  } else {
    return person != null;
  }
}

// FIXME: à ajouter aux tests du service !!!
function getPersonById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received user.id is invalid!');
  } else {
    return PersonsModel.findById(id);
  }
}

function getAllPersonsInReceivedIdList(listOfIdToGet) {
  return PersonsModel.find({ _id: { $in: listOfIdToGet } }).sort({ _id: 1 });
}

// FIXME: à ajouter aux tests!!!
function addProducerToPersonsFollowingList(personId, producerId) {
  return PersonsModel.findByIdAndUpdate(personId, { $addToSet: { followingProducersIds: producerId } }, { new: true }); // retourne l'objet modifié
}

// FIXME: à ajouter aux tests!!!
function removeProducerToPersonsFollowingList(personId, producerId) {
  return PersonsModel.findByIdAndUpdate(personId, { $pull: { followingProducersIds: producerId } }, { new: true }); // retourne l'objet modifié
}

module.exports = {
  isEmailUnused,
  checkIfPersonIdExistInDB,
  getPersonById,
  getAllPersonsInReceivedIdList,
  addProducerToPersonsFollowingList,
  removeProducerToPersonsFollowingList
};
