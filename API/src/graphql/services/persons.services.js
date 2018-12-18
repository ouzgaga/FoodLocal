const mongoose = require('mongoose');
const PersonsModel = require('../models/persons.modelgql');
const ProducersModel = require('../models/producers.modelgql');

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

async function subscribePersonToProducer(producerId, personId) {
  if (!mongoose.Types.ObjectId.isValid(personId)) {
    return new Error('Received personId is invalid!');
  }
  if (producerId === personId) {
    return new Error('You can\'t follow yourself!');
  }

  const personIsInDB = await checkIfPersonIdExistInDB(personId);
  const producerIsInDB = await checkIfPersonIdExistInDB(producerId, true);

  // on check que le personId soit présent dans la DB
  if (!personIsInDB) {
    return new Error('There is no person with this id in database!');
  }
  // on check que le producerId soit présent dans la DB
  if (!producerIsInDB) {
    return new Error('There is no producer with this id in database!');
  }

  // on ajoute le nouveau follower au tableaux d'ids des followers du producteur et on met à jour le producteur dans la base de données
  const updateProducer = await ProducersModel.findByIdAndUpdate(producerId, { $addToSet: { followersIds: personId } }, { new: true }); // retourne l'objet
                                                                                                                                       // modifié
  // Si on arrive jusqu'ici alors personId et producerId sont des ids valides et existent bien dans la DB

  // on ajoute le producerId au tableaux d'ids des producteurs suivi par la personne et on met à jour la personne dans la base de données
  return PersonsModel.findByIdAndUpdate(personId, { $addToSet: { followingProducersIds: updateProducer.id } }, { new: true }); // retourne l'objet modifié
}

async function unsubscribePersonToProducer(producerId, personId) {
  // FIXME: PAUL: Y-a moyen de vérifier la validité d'un id directement lors de l'insertion/update dans mongoose?
  if (!mongoose.Types.ObjectId.isValid(personId)) {
    return new Error('Received personId is invalid!');
  }
  if (producerId === personId) {
    return new Error('You can\'t follow yourself!');
  }

  // FIXME: PAUL: Y-a moyen de vérifier l'existence d'un id référencé directement lors de l'insertion/update dans mongoose?
  const personIsInDB = await checkIfPersonIdExistInDB(personId);
  const producerIsInDB = await checkIfPersonIdExistInDB(producerId, true);

  // on check que le personId soit présent dans la DB
  if (!personIsInDB) {
    return new Error('There is no person with this id in database!');
  }
  // on check que le producerId soit présent dans la DB
  if (!producerIsInDB) {
    return new Error('There is no producer with this id in database!');
  }

  // on supprime personId du tableaux d'ids des followers du producteur et on met à jour le producteur dans la base de données
  const updateProducer = await ProducersModel.findByIdAndUpdate(producerId, { $pull: { followersIds: personId } }, { new: true }); // retourne l'objet modifié
  // Si on arrive jusqu'ici alors personId et producerId sont des ids valides et existent bien dans la DB

  // on ajoute le producerId au tableaux d'ids des producteurs suivi par la personne et on met à jour la personne dans la base de données
  return PersonsModel.findByIdAndUpdate(personId, { $pull: { followingProducersIds: updateProducer.id } }, { new: true }); // retourne l'objet modifié
}

module.exports = {
  isEmailUnused,
  checkIfPersonIdExistInDB,
  getPersonById,
  getAllPersonsInReceivedIdList,
  subscribePersonToProducer,
  unsubscribePersonToProducer
};
