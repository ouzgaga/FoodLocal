module.exports = {
  getProducers,
  getProducerById,
  getAllProducerWaitingForValidation,
  getAllProducersInReceivedIdList,
  countProducersIndBD,
  filterProducers,
  geoFilterProducers,
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

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const salespointsServices = require('./salespoints.services');
const notificationsServices = require('./notifications.services');
const ProducersModel = require('../models/producers.modelgql');
const personsServices = require('../services/persons.services');
const tokenValidationEmailServices = require('./tokenValidationEmail.services');
const productTypesServices = require('./productTypes.services');

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
function getProducers({ tags = undefined } = {}) {
  // FIXME: Il faut ajouter la pagination entre la DB et le serveur !!!
  return ProducersModel.find(tags)
    .sort({ _id: 1 });
}

/**
 * Retourne le producteur correspondant à l'id reçu.
 *
 * @param {String} id, L'id du producteur à récupérer.
 * @returns {*}
 */
function getProducerById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Received producer.id is invalid!');
  }

  return ProducersModel.findById(id);
}

/**
 * Retourne tous les producteurs dont l'id se trouve dans la liste passée en paramètre.
 * @param listOfIdToGet, liste contenant les ids des producteurs que l'on cherche.
 * @returns {*}
 */
function getAllProducersInReceivedIdList(listOfIdToGet) {
  return getProducers({ tags: { _id: { $in: listOfIdToGet } } });
}

function getAllProducersWithSalespointInReceivedIdList(listOfSalespointsIdToGet) {
  return getProducers({ tags: { salespointId: { $in: listOfSalespointsIdToGet } } });
}

/**
 * Retourne tous les producteurs qui n'ont pas encore été validés (isValidated = false)
 * @returns {*}
 */
function getAllProducerWaitingForValidation() {
  return getProducers({ tags: { isValidated: false } });
}

function countProducersIndBD() {
  return ProducersModel.countDocuments();
}

/**
 * Filtre tous les producteurs en fonction des productTypeId reçus.
 * Seul les producteurs produisant un ou plusieurs produits du type correspondant à un des productTypeId du tableau reçu sont retournés.
 * Si aucun producteur ne produit ce type de produit, alors tous les producteurs sont retournés.
 *
 * @param byProductTypeIds, tableau d'ids des productType dont on souhaite récupérer les producteurs qui produisent un produit de ce type.
 * @returns {Promise<*>}
 */
function filterProducers(byProductTypeIds) {
  if (byProductTypeIds == null) {
    throw new Error('Received parameter "byProductTypeIds" cannot be null!');
  }

  if (byProductTypeIds.length !== 0) {
    // on filtre les producteurs que l'on retourne avec les productTypeId contenus dans le tableau reçu
    return productTypesServices.getProducersIdsProposingProductsOfAllReceivedProductsTypeIds(byProductTypeIds);
  } else {
    // pas de filtre --> on retourne tous les producteurs
    return getProducers();
  }
}

async function geoFilterProducers({ longitude, latitude, maxDistance }, productTypeIdsTab) {
  if (productTypeIdsTab == null || productTypeIdsTab.length === 0) {
    const salespointsIds = await salespointsServices.geoFilterProducersSalespoints({ longitude, latitude, maxDistance });
    return getAllProducersWithSalespointInReceivedIdList(salespointsIds);
  }

  return salespointsServices.geoFilterProducersSalespointsByProductTypeIds({ longitude, latitude, maxDistance }, productTypeIdsTab);
}

/**
 * Ajoute un nouveau producteur dans la base de données.
 * Doublons autorisés!
 *
 * @param {Integer} producer, Les informations du producteur à ajouter.
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
async function updateProducer({ id, firstname, lastname, image, phoneNumber, description, website }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Received producer.id is invalid!');
  }

  const producerValidation = await ProducersModel.findById(id, 'emailValidated isValidated isAdmin');

  // si producerValidation est nul -> l'utilisateur n'existe pas dans la DB
  if (producerValidation == null) {
    throw new Error('The received id is not in the database!');
  }

  const { emailValidated, isValidated, isAdmin } = producerValidation;

  const producerToUpdate = {
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

  return ProducersModel.findByIdAndUpdate(producerToUpdate.id, producerToUpdate, { new: true }); // retourne l'objet modifié
}

/**
 * Ajoute le salespointId reçu au producteur possédant l'id reçu.
 *
 * @param producerId, L'id du producteur auquel on souhaite ajouter le salespoint reçu.
 * @param salespoint, Les informations du salespoint que l'on souhaite ajouter au producteur.
 */
async function addSalespointToProducer(producerId, salespoint) {
  if (!mongoose.Types.ObjectId.isValid(producerId)) {
    throw new Error('Received producerId is invalid!');
  }

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
  return ProducersModel.findByIdAndUpdate(producerId, { salespointId: addedSalespoint.id }, { new: true }); // retourne l'objet modifié
}

/**
 * Supprime le salespointId reçu au producteur possédant l'id reçu.
 *
 * @param {Integer} producerId, L'id du producteur dont on souhaite supprimer le salespoint.
 */
async function removeSalespointToProducer(producerId) {
  if (!mongoose.Types.ObjectId.isValid(producerId)) {
    throw new Error('Received producerId is invalid!');
  }

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

// TOD: à ajouter dans les tests des services!!!
function updateProducerRating(producerId, rating) {
  if (!mongoose.Types.ObjectId.isValid(producerId)) {
    throw new Error('Received producer.id is invalid!');
  }

  // retourne l'objet modifié
  return ProducersModel.findByIdAndUpdate(producerId, { rating }, { new: true });
}

async function validateAProducer(producerId, validationState) {
  if (!mongoose.Types.ObjectId.isValid(producerId)) {
    throw new Error('Received producer.id is invalid!');
  }
  return ProducersModel.findByIdAndUpdate(producerId, { $set: { isValidated: validationState } }, { new: true }); // retourne l'objet modifié
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
    rating: null
  });

  const salespoint = salespointsServices.deleteSalespoint(producer.salespointId);

  return producer;
}

async function addFollowerToProducer(producerId, followerId) {
  if (!mongoose.Types.ObjectId.isValid(followerId)) {
    throw new Error('Received followerId is invalid!');
  }
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
  const updatedProducer = await ProducersModel.findByIdAndUpdate(producerId, { $addToSet: { followersIds: followerId } }, { new: true });

  // on ajoute le producerId au tableaux d'ids des producteurs suivi par la personne et on met à jour la personne dans la base de données
  return personsServices.addProducerToPersonsFollowingList(followerId, updatedProducer.id);
}

async function removeFollowerToProducer(producerId, followerId) {
  if (!mongoose.Types.ObjectId.isValid(followerId)) {
    throw new Error('Received followerId is invalid!');
  }
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
  const updatedProducer = await ProducersModel.findByIdAndUpdate(producerId, { $pull: { followersIds: followerId } }, { new: true });

  // on ajoute le producerId au tableaux d'ids des producteurs suivi par la personne et on met à jour la personne dans la base de données
  return personsServices.removeProducerToPersonsFollowingList(followerId, updatedProducer.id);
}
