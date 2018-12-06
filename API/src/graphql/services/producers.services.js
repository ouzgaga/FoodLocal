const mongoose = require('mongoose');
const ProducersModel = require('../models/producers.modelgql');
const productsServices = require('../services/products.services');
const salesPointsServices = require('../services/salespoints.services');
const UtilsServices = require('../services/utils.services');
const TokenValidationEmail = require('./tokenValidationEmail.services');
const productTypeServices = require('./productType.services');

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

function getAllProducerWaitingForValidation() {
  return ProducersModel.find({ isValidated: false });
}

/**
 * Retourne tous les producteurs dont l'id se trouve dans la liste passée en paramètre.
 * @param listOfIdToGet, liste contenant les ids des producteurs que l'on cherche.
 * @returns {*}
 */
function getAllProducersInReceivedIdList(listOfIdToGet) {
  return ProducersModel.find({ _id: { $in: listOfIdToGet } });
}

async function filterProducers(byProductTypeIds) {
  let filtredProducersIds;
  if (byProductTypeIds != null && byProductTypeIds.length !== 0) {
    // on filtre les producteurs que l'on retourne avec les productTypeId contenus dans le tableau reçu
    filtredProducersIds = await productTypeServices.getAllProducersIdsProposingProductsOfReceivedProductsTypeIds(byProductTypeIds);
  }

  if (filtredProducersIds != null && filtredProducersIds.length !== 0) {
    return getAllProducersInReceivedIdList(filtredProducersIds);
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
async function addProducer(producer) {
  // FIXME: comment faire une transaction aec Mongoose pour rollback en cas d'erreur ?
  if (await UtilsServices.isEmailUnused(producer.email)) {
    let salespoint;
    if (producer.salesPoint != null) {
      salespoint = await salesPointsServices.addSalesPoint(producer.salesPoint);
    }

    let productsId;
    if (producer.products != null && producer.products.length !== 0) {
      productsId = await productsServices.addAllProductsInArray(producer.products);
    }
    const producerToAdd = {
      ...producer,
      salesPointId: salespoint != null ? salespoint.id : null,
      subscriptions: [],
      emailValidated: false,
      subscribedUsers: [],
      isValidated: false,
      productsIds: productsId != null ? productsId : []
    };

    const producerAdded = await new ProducersModel(producerToAdd).save();

    if (producer.products != null && producer.products.length !== 0) {
      producer.products.map(async p => productTypeServices.addProducerProducingThisProductType(p.productTypeId, producerAdded.id));
    }

    TokenValidationEmail.addTokenValidationEmail(producerAdded);
    return producerAdded;
  } else {
    throw new Error('This email is already used.');
  }
}

/**
 * Met à jour le producteur possédant l'id reçu avec les
 * données reçues. Remplace toutes les données du producteur
 * dans la base de données par celles reçues!
 *
 * @param {Integer} producer, Les informations du producteur à mettre à jour.
 */
async function updateProducer(producer) {
  // fixme: checker le contexte pour vérifier que le user ait bien les droits pour faire cet udpate!

  if (!mongoose.Types.ObjectId.isValid(producer.id)) {
    return new Error('Received producer.id is invalid!');
  }

  const producerValidations = await ProducersModel.findById(producer.id, 'emailValidated isValidated');

  const producerToUpdate = {
    id: producer.id,
    firstname: producer.firstname,
    lastname: producer.lastname,
    email: producer.email,
    password: producer.password,
    image: producer.image,
    subscriptions: producer.subscriptions != null ? producer.subscriptions.map(s => s.id) : [],
    emailValidated: producerValidations.emailValidated,
    subscribedUsersIds: producer.subscribedUsers != null ? producer.subscribedUsers.map(u => u.id) : [],
    phoneNumber: producer.phoneNumber,
    description: producer.description,
    website: producer.website,
    salesPointId: producer.salesPoint,
    isValidated: producerValidations.isValidated,
    productsIds: producer.products != null ? producer.products.map(p => p.id) : []
  };

  return ProducersModel.findByIdAndUpdate(producerToUpdate.id, producerToUpdate, { new: true }); // retourne l'objet modifié
}

async function validateAProducer(producerId, validationState) {
  if (!mongoose.Types.ObjectId.isValid(producerId)) {
    return new Error('Received producer.id is invalid!');
  }

  const producerToUpdate = await getProducerById(producerId);
  if (producerToUpdate != null) {
    producerToUpdate.isValidated = validationState;
    return ProducersModel.findByIdAndUpdate(producerToUpdate.id, producerToUpdate, { new: true }); // retourne l'objet modifié
  } else {
    return null;
  }
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

  return ProducersModel.findByIdAndRemove(id);
}

module.exports = {
  getProducers,
  getProducerById,
  getAllProducerWaitingForValidation,
  getAllProducersInReceivedIdList,
  filterProducers,
  addProducer,
  updateProducer,
  validateAProducer,
  deleteProducer
};
