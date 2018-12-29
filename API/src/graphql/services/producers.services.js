const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ProducersModel = require('../models/producers.modelgql');
const personsServices = require('../services/persons.services');
const tokenValidationEmailServices = require('./tokenValidationEmail.services');
const productTypesServices = require('./productTypes.services');
const salespointsServices = require('./salespoints.services');

/**
 * Retourne "limit" producteurs de la base de données, fitlrés
 * selon les tags "tags" reçus à partir de la page "page". Sans
 * paramètres, retourne tous les producteurs de la base de
 * données.
 *
 * @param {Array} tags, Tags à utiliser pour filtrer les résultats. Séparer plusieurs tags à l'aide de ','.
 * @param {Integer} limit, Nombre maximum de producteurs à retourner.
 * @param {Integer} page, Numéro de la page à retourner. Permet par exemple de récupérer la 'page'ème page de 'limit'
 * producteurs. Par exemple, si 'limit' vaut 20 et 'page' vaut 3, on récupère la 3ème page de 20 producteurs, soit les producteurs 41 à 60.
 */
function getProducers({ tags = undefined, limit = 30, page = 0 } = {}) {
  let skip;
  if (page !== 0) {
    skip = page * limit;
  }

  return ProducersModel.find(tags)
    .sort({ _id: 1 })
    .skip(+skip)
    .limit(+limit);
}

/**
 * Retourne le producteur correspondant à l'id reçu.
 *
 * @param {String} id, L'id du producteur à récupérer.
 * @returns {*}
 */
function getProducerById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received producer.id is invalid!');
  } else {
    return ProducersModel.findById(id);
  }
}

/**
 * Retourne tous les producteurs dont l'id se trouve dans la liste passée en paramètre.
 * @param listOfIdToGet, liste contenant les ids des producteurs que l'on cherche.
 * @returns {*}
 */
function getAllProducersInReceivedIdList(listOfIdToGet) {
  return ProducersModel.find({ _id: { $in: listOfIdToGet } });
}

/**
 * Retourne tous les producteurs qui n'ont pas encore été validés (isValidated = false)
 * @returns {*}
 */
function getAllProducerWaitingForValidation() {
  return ProducersModel.find({ isValidated: false });
}

/**
 * Filtre tous les producteurs en fonction des productTypeId reçus.
 * Seul les producteurs produisant un ou plusieurs produits du type correspondant à un des productTypeId du tableau reçu sont retournés.
 * Si aucun producteur ne produit ce type de produit, alors tous les producteurs sont retournés.
 *
 * @param byProductTypeIds, tableau d'ids des productType dont on souhaite récupérer les producteurs qui produisent un produit de ce type.
 * @returns {Promise<*>}
 */
async function filterProducers(byProductTypeIds) {
  let filtredProducersObjectIds;
  if (byProductTypeIds != null && byProductTypeIds.length !== 0) {
    // on filtre les producteurs que l'on retourne avec les productTypeId contenus dans le tableau reçu
    filtredProducersObjectIds = await productTypesServices.getProducersIdsProposingProductsOfAllReceivedProductsTypeIds(byProductTypeIds);
  }

  if (filtredProducersObjectIds != null && filtredProducersObjectIds.length !== 0) {
    return getAllProducersInReceivedIdList(filtredProducersObjectIds);
  } else {
    // pas de filtre --> on retourne tous les producteurs
    return getProducers();
  }
}

/**
 * Ajoute un nouveau producteur dans la base de données.
 * Doublons autorisés!
 *
 * @param {Integer} producer, Les informations du producteur à ajouter.
 */
async function addProducer({ firstname, lastname, email, password, image, phoneNumber, description, website }) {
  if (await personsServices.isEmailUnused(email)) { // si l'email n'est pas encore utilisé, on peut ajouter le producteur
    const producerToAdd = {
      firstname,
      lastname,
      email,
      // fixme: Paul: 10 saltRound, c'est suffisant ?
      password: await bcrypt.hash(password, 10),
      image,
      // followingProducersIds: [],
      emailValidated: false,
      isAdmin: false,
      // followersIds: [],
      phoneNumber,
      description,
      website,
      // salespointId: salespoint, // salespoint contient l'id du point de vente
      isValidated: false,
      // productsIds: []
    };

    // on enregistre le producteur dans la DB
    const producerAdded = await new ProducersModel(producerToAdd).save();

    // on envoie un mail au producteur avec un token de validation de l'adresse email et on enregistre le token généré dans la DB
    await tokenValidationEmailServices.addTokenValidationEmail(producerAdded);
    return producerAdded;
  } else { // l'email est déjà utilisé -> on ne peut pas ajouter ce producteur!
    return new Error('This email is already used.');
  }
}

function addProductToProducer(productId, producerId) {
  return ProducersModel.findByIdAndUpdate(producerId, { $addToSet: { productsIds: productId } }, { new: true }); // retourne l'objet modifié
}

function removeProductFromProducer(productId, producerId) {
  return ProducersModel.findByIdAndUpdate(producerId, { $pull: { productsIds: productId } }, { new: true }); // retourne l'objet modifié
}

/**
 * Met à jour le producteur possédant l'id reçu avec les données reçues. Remplace toutes les données du producteur
 * dans la base de données par celles reçues!
 *
 * @param {Integer} producer, Les informations du producteur à mettre à jour.
 */
async function updateProducer({ id, firstname, lastname, email, image, phoneNumber, description, website}) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received producer.id is invalid!');
  }

  const producerValidation = await ProducersModel.findById(id, 'emailValidated isValidated isAdmin');

  if (producerValidation != null) {
    // si producerValidation n'est pas nul -> l'utilisateur existe dans la DB
    const { emailValidated, isValidated, isAdmin } = producerValidation;

    const producerToUpdate = {
      id,
      firstname,
      lastname,
      email,
      image,
      // followingProducersIds: followingProducers,
      emailValidated,
      isAdmin,
      // followersIds: followers,
      phoneNumber,
      description,
      website,
      isValidated,
      // productsIds
    };

    return ProducersModel.findByIdAndUpdate(producerToUpdate.id, producerToUpdate, { new: true }); // retourne l'objet modifié
  } else {
    return new Error('The received id is not in the database!');
  }
}

/**
 * Ajoute le salespointId reçu au producteur possédant l'id reçu.
 *
 * @param producerId, L'id du producteur auquel on souhaite ajouter le salespoint reçu.
 * @param salespoint, Les informations du salespoint que l'on souhaite ajouter au producteur.
 */
async function addSalespointToProducer(producerId, salespoint) {
  if (!mongoose.Types.ObjectId.isValid(producerId)) {
    return new Error('Received producerId is invalid!');
  }

  // on ajoute le salespoint dans la collection des salespoint
  const addedSalespoint = await salespointsServices.addSalesPoint(salespoint);

  // on met à jour le salespointId du producteur avec l'id du nouveau salespoint
  return ProducersModel.findByIdAndUpdate(producerId, { salespointId: addedSalespoint.id }, { new: true }); // retourne l'objet modifié
}

/**
 * Supprime le salespointId reçu au producteur possédant l'id reçu.
 *
 * @param {Integer} producerId, L'id du producteur dont on souhaite supprimer le salespoint.
 */
async function removeSalespointToProducer(producerId) {
  if (!mongoose.Types.ObjectId.isValid(producerId)) {
    return new Error('Received producerId is invalid!');
  }

  // on supprime le salespointId contenu dans les informations du producteur
  const producer = ProducersModel.findByIdAndUpdate(producerId, { salespointId: null }, { new: false }); // retourne l'objet avant sa modification

  // on supprime le salespoint correspondant au salespointId du producteur
  await salespointsServices.deleteSalesPoint(producer.salespointId);

  // on applique la modification afin de retourner le producteur tel qu'il est réellement dans la DB
  producer.salespointId = null;
  return producer;
}

// TOD: à ajouter dans les tests des services!!!
function updateProducerRating(producerId, rating) {
  if (!mongoose.Types.ObjectId.isValid(producerId)) {
    return new Error('Received producer.id is invalid!');
  }

  // retourne l'objet modifié
  return ProducersModel.findByIdAndUpdate(producerId, { rating }, { new: true });
}

async function validateAProducer(producerId, validationState) {
  if (!mongoose.Types.ObjectId.isValid(producerId)) {
    return new Error('Received producer.id is invalid!');
  }
  return ProducersModel.findByIdAndUpdate(producerId, { $set: { isValidated: validationState } }, { new: true }); // retourne l'objet modifié
}

/**
 * Supprime le producteur correspondant à l'id reçu.
 *
 * @param {Integer} id, L'id du producteur à supprimer.
 */
function deleteProducer(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received producer.id is invalid!');
  }

  // FIXME: il faut supprimer toutes les informations du producteur -> les produits, le point de vente, son id dans les productType qu'il produisait, ......

  return ProducersModel.findByIdAndRemove(id);
}

async function addFollowerToProducer(producerId, followerId) {
  if (!mongoose.Types.ObjectId.isValid(followerId)) {
    return new Error('Received followerId is invalid!');
  }
  if (producerId === followerId) {
    return new Error('You can\'t follow yourself!');
  }

  const personIsInDB = await personsServices.checkIfPersonIdExistInDB(followerId);
  const producerIsInDB = await personsServices.checkIfPersonIdExistInDB(producerId, true);

  // on check que le followerId soit présent dans la DB
  if (!personIsInDB) {
    return new Error('There is no person with this id in database!');
  }
  // on check que le producerId soit présent dans la DB
  if (!producerIsInDB) {
    return new Error('There is no producer with this id in database!');
  }

  // on ajoute le nouveau follower au tableaux d'ids des followers du producteur et on met à jour le producteur dans la base de données
  const updatedProducer = await ProducersModel.findByIdAndUpdate(producerId, { $addToSet: { followersIds: followerId } }, { new: true });

  // on ajoute le producerId au tableaux d'ids des producteurs suivi par la personne et on met à jour la personne dans la base de données
  return personsServices.addProducerToPersonsFollowingList(followerId, updatedProducer.id);
}

async function removeFollowerToProducer(producerId, followerId) {
  if (!mongoose.Types.ObjectId.isValid(followerId)) {
    return new Error('Received followerId is invalid!');
  }
  if (producerId === followerId) {
    return new Error('You can\'t follow yourself!');
  }

  const personIsInDB = await personsServices.checkIfPersonIdExistInDB(followerId);
  const producerIsInDB = await personsServices.checkIfPersonIdExistInDB(producerId, true);

  // on check que le followerId soit présent dans la DB
  if (!personIsInDB) {
    return new Error('There is no person with this id in database!');
  }
  // on check que le producerId soit présent dans la DB
  if (!producerIsInDB) {
    return new Error('There is no producer with this id in database!');
  }

  // on supprime followerId du tableaux d'ids des followers du producteur et on met à jour le producteur dans la base de données
  const updatedProducer = await ProducersModel.findByIdAndUpdate(producerId, { $pull: { followersIds: followerId } }, { new: true });

  // on ajoute le producerId au tableaux d'ids des producteurs suivi par la personne et on met à jour la personne dans la base de données
  return personsServices.removeProducerToPersonsFollowingList(followerId, updatedProducer.id);
}


module.exports = {
  getProducers,
  getProducerById,
  getAllProducerWaitingForValidation,
  getAllProducersInReceivedIdList,
  filterProducers,
  addProducer,
  addProductToProducer,
  addSalespointToProducer,
  removeSalespointToProducer,
  removeProductFromProducer,
  updateProducer,
  updateProducerRating,
  validateAProducer,
  deleteProducer,
  addFollowerToProducer,
  removeFollowerToProducer
};
