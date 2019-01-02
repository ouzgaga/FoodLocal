const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const tokenValidationEmailServices = require('./tokenValidationEmail.services');

async function isEmailAvailable(emailUser) {
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

// TODO: à ajouter aux tests des services et d'intégration!
async function getPersonByLogin(email, password) {
  const person = await PersonsModel.findOne({ email });

  if (person != null && person.id != null) { // une personne avec cet email a été trouvée dans la DB
    // on compare le password reçu en paramètre avec le mdp enregistré dans la DB
    const match = await bcrypt.compare(password, person.password);
    if (match) {
      // si le mdp est correct, on retourne la personne
      return person;
    } else {
      return new Error('Received password is not correct!');
    }
  } else {
    return new Error(`There is no user corresponding to the email "${email}"`);
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
      try {
        checkIfPasswordIsValid(newPassword);

        // si on arrive ici, alors le nouveau mot de passe est un mot de passe valide.
        person.password = await bcrypt.hash(newPassword, 10); // fixme: Paul: 10 saltRound, c'est suffisant ?
        const updatedPerson = await PersonsModel.findByIdAndUpdate(person.id, { password: person.password }, { new: true });
        return updatedPerson != null;
      } catch (err) {
        return err;
      }
    } else { // oldPassword n'est pas identique au mdp enregistré dans la DB!
      return new Error('The received oldPassword is not correct!');
    }
  } else { // le personId reçu ne correspond à aucune entrée de la base de données!
    return new Error('Received personId can\'t be found in the database!');
  }
}

function checkIfPasswordIsValid(password) {
  if (password.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  } else if (password.length > 30) {
    throw new Error('New password must be less than 30 characters long.');
  } else if (password.search(/\d/) === -1) {
    throw new Error('New password must contain at least 1 number.');
  } else if (password.search(/[a-zA-Z]/) === -1) {
    throw new Error('New password must contain at least 1 letter.');
  } else {
    return true;
  }
}

// TODO: à ajouter aux tests!
async function validateEmailUserByToken(emailValidationToken) {
  const token = await tokenValidationEmailServices.validateToken(emailValidationToken);
  if (token !== null) {
    const updatedPerson = await PersonsModel.findByIdAndUpdate(token.idPerson, { emailValidated: true }, { new: true }); // retourne l'objet modifié
    return updatedPerson !== null;
  } else {
    return new Error('The token is not valid');
  }
}

// TODO: Ajouter une fonction pour upgrade un utilsiateur en producteur !

module.exports = {
  isEmailAvailable,
  checkIfPersonIdExistInDB,
  getPersonById,
  getPersonByLogin,
  getAllPersonsInReceivedIdList,
  addProducerToPersonsFollowingList,
  removeProducerToPersonsFollowingList,
  changePassword,
  checkIfPasswordIsValid,
  validateEmailUserByToken
};

const PersonsModel = require('../models/persons.modelgql');
