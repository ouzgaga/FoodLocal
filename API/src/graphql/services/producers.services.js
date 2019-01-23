module.exports = {
  getProducers,
  getProducerById,
  getAllProducerWaitingForValidation,
  getAllProducersInReceivedIdList,
  countProducersInDB,
  filterProducers,
  geoFilterProducers,
  addProducer,
  addProductToProducer,
  addSalespointToProducer,
  removeSalespointToProducer,
  removeProductFromProducer,
  updateProducer,
  validateAProducer,
  deleteProducer,
  addFollowerToProducer,
  removeFollowerToProducer
};

const bcrypt = require('bcrypt');
const salespointsServices = require('./salespoints.services');
const notificationsServices = require('./notifications.services');
const ProducersModel = require('../models/producers.modelgql');
const personsServices = require('../services/persons.services');
const tokenValidationEmailServices = require('./tokenValidationEmail.services');
const productTypesServices = require('./productTypes.services');

/**
 * Retourne tous les producteurs de la base de données triés par id si sortById vaut true (non triés sinon) et filtrés en fonction des tags reçus.
 *
 * @param sortById, si true, trie les résultats retournés par id. Sinon, ne les trie pas.
 * @param tags, objet contenant les tags à utiliser pour filtrer les résultats. Séparer plusieurs tags à l'aide de ','.
 * @returns tous les producteurs de la base de données triés par id si sortById vaut true (non triés sinon) et filtrés en fonction des tags reçus.
 */
function getProducers(sortById, { tags = undefined } = {}) {
  // FIXME: Il faut ajouter la pagination entre la DB et le serveur !!!
  if (sortById) {
    return ProducersModel.find({ isValidated: true, deleted: false, ...tags })
      .sort({ _id: 1 });
  } else {
    return ProducersModel.find({ isValidated: true, deleted: false, ...tags });
  }
}

/**
 * Retourne le producteur correspondant à l'id reçu.
 *
 * @param id, l'id du producteur à récupérer.
 * @returns le producteur correspondant à l'id reçu.
 */
function getProducerById(id) {
  return ProducersModel.findById(id);
}

/**
 * Retourne tous les producteurs dont l'id se trouve dans la liste passée en paramètre.
 * @param listOfIdToGet, la liste contenant les ids des producteurs que l'on souhaite récupérer.
 * @returns un tableau contenant tous les producteurs dont l'id se trouve dans la liste reçue en paramètre.
 */
function getAllProducersInReceivedIdList(listOfIdToGet) {
  return getProducers(true, { tags: { _id: { $in: listOfIdToGet } } });
}

/**
 * Retourne tous les producteurs qui n'ont pas encore été validés par un administrateur (isValidated = false).
 * @returns un tableau contenant tous les producteurs qui n'ont pas encore été validés par un administrateur.
 */
function getAllProducerWaitingForValidation() {
  return getProducers(true, { tags: { isValidated: false } });
}

/**
 * Retourne le nombre total de producteurs validés (isValidated === true) et non supprimés (deleted === false) enregistrés dans la base de données.
 * @returns le nombre total de producteurs validés (isValidated === true) et non supprimés (deleted === false) enregistrés dans la base de données.
 */
function countProducersInDB() {
  return ProducersModel.countDocuments({ isValidated: true, deleted: false });
}

/**
 * Filtre tous les producteurs en fonction des productTypeId reçus.
 * Seul les producteurs produisant un ou plusieurs produits du type correspondant à un des productTypeId du tableau reçu sont retournés.
 *
 * @param byProductTypeIds, un tableau d'ids des productType dont on souhaite récupérer les producteurs qui produisent un produit de ce type.
 * @returns un tableau contenant tous les producteurs produisant un ou plusieurs produits du type correspondant à un des productTypeId du tableau reçu.
 */
function filterProducers(byProductTypeIds) {
  if (byProductTypeIds == null) {
    throw new Error('Received parameter "byProductTypeIds" cannot be null!');
  }

  // on filtre les producteurs que l'on retourne avec les productTypeId contenus dans le tableau reçu
  return productTypesServices.getProducersIdsProposingProductsOfAllReceivedProductsTypeIds(byProductTypeIds);
}

/**
 * Filtre tous les producteurs en fonction :
 *      - 1) de la localisation de de l'utilisateur
 *      - 2) du tableau de productTypeId reçu
 *      - 3) du rating de producteurs
 *
 * 1) retourne les producteurs les plus proche de l'utilsiateur d'abord.
 * 2) retourne que les producteurs produisant un ou plusieurs produits du type correspondant à un des productTypeId du tableau productTypeIdsTab.
 * 3) retourne que les producteurs ayant un rating d'au moins 'ratingMin' ou plus.
 *
 * Ces 3 filtres peuvent être combinés à volonté.
 *
 * @param locationClient, la localisation de l'utilsiateur.
 * @param productTypeIdsTab, un tableau d'ids des productType dont on souhaite récupérer les producteurs qui produisent un produit de ce type.
 * @param ratingMin, le rating minimal qu'un producteur doit avoir pour être retrouné au client.
 * @returns tous les producteurs correspondants aux critères de recherche mentionnés ci-dessus.
 */
function geoFilterProducers(locationClient, productTypeIdsTab, ratingMin = 1) {
  if (productTypeIdsTab == null || productTypeIdsTab.length === 0) {
    return salespointsServices.geoFilterProducersSalespoints(locationClient, ratingMin);
  }

  return salespointsServices.geoFilterProducersSalespointsByProductTypeIds(locationClient, productTypeIdsTab, ratingMin);
}

/**
 * Ajoute un nouveau producteur dans la base de données si l'email reçu n'est pas déjà utilisé et si le password reçu est suffisemment robuste.
 *
 * @param firstname, le prénom du producteur.
 * @param lastname, le nom de famille du producteur.
 * @param email, l'email du producteur.
 * @param password, le mot de passe du producteur.
 * @param image, l'image du producteur (encodée en base64).
 * @param phoneNumber, le numéro de téléphone du producteur.
 * @param description
 * @param website
 * @returns {Promise<*>}
 */
async function addProducer({ firstname, lastname, email, password, image, phoneNumber, description, website }) {
  if (await personsServices.isEmailAvailable(email) && personsServices.checkIfPasswordIsValid(password)) { // si l'email n'est pas encore utilisé, on peut ajouter le producteur
    const producerToAdd = {
      firstname,
      lastname,
      email,
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
      isValidated: false
      // productsIds: []
    };

    // on enregistre le producteur dans la DB
    const producerAdded = await new ProducersModel(producerToAdd).save();

    // on envoie un mail au producteur avec un token de validation de l'adresse email et on enregistre le token généré dans la DB
    await tokenValidationEmailServices.addTokenValidationEmail(producerAdded);
    return producerAdded;
  } else { // l'email est déjà utilisé -> on ne peut pas ajouter ce producteur!
    throw new Error('This email is already used.');
  }
}

function addProductToProducer(productId, producerId) {
  // retourne l'objet modifié
  return ProducersModel.findByIdAndUpdate(producerId, { $addToSet: { productsIds: productId } }, { new: true, runValidators: true });
}

function removeProductFromProducer(productId, producerId) {
  return ProducersModel.findByIdAndUpdate(producerId, { $pull: { productsIds: productId } }, { new: true, runValidators: true }); // retourne l'objet modifié
}

/**
 * Met à jour le producteur possédant l'id reçu avec les données reçues. Remplace toutes les données du producteur
 * dans la base de données par celles reçues!
 *
 * @param {Integer} producer, Les informations du producteur à mettre à jour.
 */
async function updateProducer({ id, firstname, lastname, image, phoneNumber, description, website }) {

  const producerValidation = await ProducersModel.findById(id, 'emailValidated isValidated isAdmin');

  // si producerValidation est nul -> l'utilisateur n'existe pas dans la DB
  if (producerValidation == null) {
    throw new Error('The received id is not in the database!');
  }

  const { emailValidated, isValidated, isAdmin } = producerValidation;

  const producerToUpdate = {
    id,
    emailValidated,
    isAdmin,
    isValidated
  };

  // si un élément est donnée, on l'update, sinon, on ne le déclare même pas (pour ne pas remplacer l'élément dans la DB par null sans le vouloir)
  if (firstname !== undefined) {
    producerToUpdate.firstname = firstname;
  }
  if (lastname !== undefined) {
    producerToUpdate.lastname = lastname;
  }
  if (image !== undefined) {
    producerToUpdate.image = image;
  }
  if (phoneNumber !== undefined) {
    producerToUpdate.phoneNumber = phoneNumber;
  }
  if (description !== undefined) {
    producerToUpdate.description = description;
  }
  if (website !== undefined) {
    producerToUpdate.website = website;
  }

  // on ajoute une nouvelle notification signalant la mise à jour des informations du producteur à tous ses followers
  await notificationsServices.addNotification('PRODUCER_UPDATE_INFO', id);

  return ProducersModel.findByIdAndUpdate(producerToUpdate.id, producerToUpdate, { new: true, runValidators: true }); // retourne l'objet modifié
}

/**
 * Ajoute le salespointId reçu au producteur possédant l'id reçu.
 *
 * @param producerId, L'id du producteur auquel on souhaite ajouter le salespoint reçu.
 * @param salespoint, Les informations du salespoint que l'on souhaite ajouter au producteur.
 */
async function addSalespointToProducer(producerId, salespoint) {
  const producer = await getProducerById(producerId);
  if (producer == null) {
    throw new Error('The received producerId is not in the database!');
  }
  if (producer.salespointId != null) {
    throw new Error('This producer has already a salespoint but a producer can\'t have more than one salespoint. Try to update the current salespoint.');
  }

  // on ajoute le salespoint dans la collection des salespoint
  const addedSalespoint = await salespointsServices.addSalespoint(salespoint);

  // on met à jour le salespointId du producteur avec l'id du nouveau salespoint
  return ProducersModel.findByIdAndUpdate(producerId, { salespointId: addedSalespoint.id }, { new: true, runValidators: true }); // retourne l'objet modifié
}

/**
 * Supprime le salespointId reçu au producteur possédant l'id reçu.
 *
 * @param {Integer} producerId, L'id du producteur dont on souhaite supprimer le salespoint.
 */
async function removeSalespointToProducer(producerId) {
  // on supprime le salespointId contenu dans les informations du producteur
  const producer = await ProducersModel.findByIdAndUpdate(producerId, { salespointId: null }, { new: false }); // retourne l'objet avant sa modification

  if (producer == null) {
    throw new Error('The received producerId is not in the database!');
  }
  // on supprime le salespoint correspondant au salespointId du producteur
  await salespointsServices.deleteSalespoint(producer.salespointId);

  // on applique la modification afin de retourner le producteur tel qu'il est réellement dans la DB sans avoir à le récupérer à nouveau dans la DB
  producer.salespointId = null;
  return producer;
}

async function validateAProducer(producerId, validationState) {
  // retourne l'objet modifié
  return ProducersModel.findByIdAndUpdate(producerId, { $set: { isValidated: validationState } }, { new: true, runValidators: true });
}

/**
 * Supprime le producteur correspondant à l'id reçu.
 *
 * @param {Integer} id, L'id du producteur à supprimer.
 */
async function deleteProducer(id) {
  const producer = await ProducersModel.findByIdAndUpdate(id, {
    firstname: null,
    lastname: null,
    email: null,
    password: null,
    image: null,
    // followingProducers: null,
    emailValidated: null,
    isAdmin: null,
    // followers: null,
    phoneNumber: null,
    description: null,
    website: null,
    // salespoint: null,
    isValidated: null,
    // products: null,
    rating: null,
    deleted: true
  });

  if (producer != null) {
    salespointsServices.deleteSalespoint(producer.salespointId);
  }
  return producer;
}

async function addFollowerToProducer(producerId, followerId) {
  if (producerId === followerId) {
    throw new Error('You can\'t follow yourself!');
  }

  const personIsInDB = await personsServices.checkIfPersonIdExistInDB(followerId);
  const producerIsInDB = await personsServices.checkIfPersonIdExistInDB(producerId, true);

  // on check que le followerId soit présent dans la DB
  if (!personIsInDB) {
    throw new Error('There is no person with this id in database!');
  }
  // on check que le producerId soit présent dans la DB
  if (!producerIsInDB) {
    throw new Error('There is no producer with this id in database!');
  }

  // on ajoute le nouveau follower au tableaux d'ids des followers du producteur et on met à jour le producteur dans la base de données
  const updatedProducer = await ProducersModel.findByIdAndUpdate(producerId, { $addToSet: { followersIds: followerId } }, { new: true, runValidators: true });

  // on ajoute le producerId au tableaux d'ids des producteurs suivi par la personne et on met à jour la personne dans la base de données
  return personsServices.addProducerToPersonsFollowingList(followerId, updatedProducer.id);
}

async function removeFollowerToProducer(producerId, followerId) {
  if (producerId === followerId) {
    throw new Error('You can\'t follow yourself!');
  }

  const personIsInDB = await personsServices.checkIfPersonIdExistInDB(followerId);
  const producerIsInDB = await personsServices.checkIfPersonIdExistInDB(producerId, true);

  // on check que le followerId soit présent dans la DB
  if (!personIsInDB) {
    throw new Error('There is no person with this id in database!');
  }
  // on check que le producerId soit présent dans la DB
  if (!producerIsInDB) {
    throw new Error('There is no producer with this id in database!');
  }

  // on supprime followerId du tableaux d'ids des followers du producteur et on met à jour le producteur dans la base de données
  const updatedProducer = await ProducersModel.findByIdAndUpdate(producerId, { $pull: { followersIds: followerId } }, { new: true, runValidators: true });

  // on ajoute le producerId au tableaux d'ids des producteurs suivi par la personne et on met à jour la personne dans la base de données
  return personsServices.removeProducerToPersonsFollowingList(followerId, updatedProducer.id);
}
