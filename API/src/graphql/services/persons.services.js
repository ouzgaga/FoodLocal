const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const config = require('../../config/config');

async function isEmailAvailable(emailUser) {
  const existingPerson = await PersonsModel.findOne({ email: emailUser });
  return existingPerson === null;
}

async function checkIfPersonIdExistInDB(personId, isProducer = false) {
  if (!mongoose.Types.ObjectId.isValid(personId)) {
    throw new Error('Received personId is invalid!');
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
    throw new Error('Received person.id is invalid!');
  }

  return PersonsModel.findById(id);
}

async function getPersonByLogin(email, password) {
  const person = await PersonsModel.findOne({ email });

  if (person == null || person.id == null) {
    throw new Error(`There is no user corresponding to the email "${email}"`);
  }

  // une personne avec cet email a été trouvée dans la DB -> on compare le password reçu en paramètre avec le mdp enregistré dans la DB
  const match = await bcrypt.compare(password, person.password);
  if (!match) {
    throw new Error('Received password is not correct!');
  }
  // si le mdp est correct, on retourne la personne
  return person;
}

async function getPersonByToken(token) {
  const tokenContent = await jwt.verify(token, config.jwtSecret);

  if (tokenContent == null || tokenContent.id == null) {
    return null;
  }
  return getPersonById(tokenContent.id);
}

function getAllPersonsInReceivedIdList(listOfIdToGet) {
  // FIXME: Il faut ajouter la pagination entre la DB et le serveur !!!
  return PersonsModel.find({ _id: { $in: listOfIdToGet } }).sort({ _id: 1 });
}

function countNbPersonsInDB() {
  return PersonsModel.countDocuments();
}

function addProducerToPersonsFollowingList(personId, producerId) {
  if (personId === producerId) {
    throw new Error('You can\'t follow yourself!');
  }

  return PersonsModel.findByIdAndUpdate(personId, { $addToSet: { followingProducersIds: producerId } }, { new: true }); // retourne l'objet modifié
}

function removeProducerToPersonsFollowingList(personId, producerId) {
  if (personId === producerId) {
    throw new Error('You can\'t follow yourself!');
  }

  return PersonsModel.findByIdAndUpdate(personId, { $pull: { followingProducersIds: producerId } }, { new: true }); // retourne l'objet modifié
}

async function changePassword(newPassword, oldPassword, personId) {
  let person;
  try {
    person = await getPersonById(personId);
  } catch (err) {
    // le personId reçu ne correspond à aucune entrée de la base de données!
    throw new Error('Received personId can\'t be found in the database!');
  }

  if (person == null) {
    // le personId reçu ne correspond à aucune entrée de la base de données!
    throw new Error('Received personId can\'t be found in the database!');
  }

  // la personne correspondante à 'personId' a été trouvé dans la DB
  // on compare le oldPassword avec le mdp enregistré dans la DB
  const match = await bcrypt.compare(oldPassword, person.password);
  if (!match) {
    // oldPassword n'est pas identique au mdp enregistré dans la DB!
    throw new Error('The received oldPassword is not correct!');
  }

  // oldPassword est identique au mdp enregistré dans la DB
  checkIfPasswordIsValid(newPassword);

  // si on arrive ici, alors le nouveau mot de passe est un mot de passe valide.
  person.password = await bcrypt.hash(newPassword, 10);
  const updatedPerson = await PersonsModel.findByIdAndUpdate(person.id, { password: person.password }, { new: true });
  return updatedPerson != null;
}

async function resetPassword(email) {
  const person = await PersonsModel.findOne({ email });

  if (person == null || person.id == null) {
    throw new Error(`There is no user corresponding to the email "${email}"`);
  }
  const password = crypto.randomBytes(20).toString('hex');
  person.password = await bcrypt.hash(password, 10);
  const updatedPerson = await PersonsModel.findByIdAndUpdate(person.id, { password: person.password }, { new: true });
  return updatedPerson != null;
}

function checkIfPasswordIsValid(password) {
  if (password.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }
  if (password.length > 30) {
    throw new Error('New password must be less than 30 characters long.');
  }
  if (password.search(/\d/) === -1) {
    throw new Error('New password must contain at least 1 number.');
  }
  if (password.search(/[a-zA-Z]/) === -1) {
    throw new Error('New password must contain at least 1 letter.');
  }
  // si on arrive jusqu'ici -> le mdp est valide
  return true;
}

async function validateEmailUserByToken(emailValidationToken) {
  const person = await tokenValidationEmailServices.validateToken(emailValidationToken);

  const updatedPerson = await PersonsModel.findByIdAndUpdate(person.id, { emailValidated: true }, { new: true }); // retourne l'objet modifié
  return connectionTokenServices.createConnectionToken(updatedPerson.id, updatedPerson.email, updatedPerson.isAdmin, updatedPerson.kind, updatedPerson.emailValidated);
}

function deletePersonAccount(personId, kind) {
  if (kind === 'producers') {
    return producersServices.deleteProducer(personId);
  } else {
    return usersServices.deleteUser(personId);
  }
}

module.exports = {
  isEmailAvailable,
  checkIfPersonIdExistInDB,
  getPersonById,
  getPersonByLogin,
  getPersonByToken,
  getAllPersonsInReceivedIdList,
  countNbPersonsInDB,
  addProducerToPersonsFollowingList,
  removeProducerToPersonsFollowingList,
  changePassword,
  resetPassword,
  checkIfPasswordIsValid,
  validateEmailUserByToken,
  deletePersonAccount
};

const PersonsModel = require('../models/persons.modelgql');
const tokenValidationEmailServices = require('./tokenValidationEmail.services');
const producersServices = require('./producers.services');
const usersServices = require('./users.services');
const connectionTokenServices = require('./connectionToken.services');
