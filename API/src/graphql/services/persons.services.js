const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const PersonsModel = require('../models/persons.modelgql');
const tokenValidationEmailServices = require('./tokenValidationEmail.services');

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

function getPersonById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received person.id is invalid!');
  } else {
    return PersonsModel.findById(id);
  }
}

function getAllPersonsInReceivedIdList(listOfIdToGet) {
  return PersonsModel.find({ _id: { $in: listOfIdToGet } }).sort({ _id: 1 });
}

function addProducerToPersonsFollowingList(personId, producerId) {
  if (personId !== producerId) {
    return PersonsModel.findByIdAndUpdate(personId, { $addToSet: { followingProducersIds: producerId } }, { new: true }); // retourne l'objet modifié
  } else {
    return new Error('You can\'t follow yourself!');
  }
}

function removeProducerToPersonsFollowingList(personId, producerId) {
  if (personId !== producerId) {
    return PersonsModel.findByIdAndUpdate(personId, { $pull: { followingProducersIds: producerId } }, { new: true }); // retourne l'objet modifié
  } else {
    return new Error('You can\'t follow yourself!');
  }
}

async function changePassword(newPassword, oldPassword, personId) {
  const person = await getPersonById(personId);

  if (person != null && person.id != null) { // la personne correspondante à 'personId' a été trouvé dans la DB
    // on compare le oldPassword avec le mdp enregistré dans la DB
    const match = await bcrypt.compare(oldPassword, person.password);
    if (match) { // oldPassword est identique au mdp enregistré dans la DB
      person.password = await bcrypt.hash(newPassword, 10); // fixme: Paul: 10 saltRound, c'est suffisant ?
      return true;
    } else { // oldPassword n'est pas identique au mdp enregistré dans la DB!
      return new Error('The received oldPassword is not correct!');
    }
  } else { // le personId reçu ne correspond à aucune entrée de la base de données!
    return new Error('Received personId can\'t be found in the database!');
  }
}

// TODO: à ajouter aux tests!
async function validateEmailUserByToken(value) {
  const token = await tokenValidationEmailServices.validateToken(value);
  if (token !== null) {
    const updatedPerson = await PersonsModel.findByIdAndUpdate(token.idPerson, { emailValidated: true }, { new: true }); // retourne l'objet modifié
    return updatedPerson !== null;
  } else {
    return new Error('The token is not valid');
  }
}

module.exports = {
  isEmailUnused,
  checkIfPersonIdExistInDB,
  getPersonById,
  getAllPersonsInReceivedIdList,
  addProducerToPersonsFollowingList,
  removeProducerToPersonsFollowingList,
  changePassword,
  validateEmailUserByToken
};
