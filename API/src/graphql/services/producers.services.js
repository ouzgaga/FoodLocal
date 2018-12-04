const mongoose = require('mongoose');
const ProducersModel = require('../models/producers.modelgql');
const UsersModel = require('../models/user.modelgql');
const SalesPointModel = require('../models/salespoints.modelgql');
const productsServices = require('../services/products.services');
const usersServices = require('../services/users.services');
const salesPointsServices = require('../services/salespoints.services');


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
 * @param {Integer} id, L'id du producteur à récupérer.
 * @returns {*}
 */
function getProducerById({ id }) {
  let objectId = id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received producer.id is invalid!');
  } else {
    // FIXME: je comprend pas pourquoi je dois faire ça....?! Sans ça, il ne trouve pas de résultat alors que yen a.....
    objectId = new mongoose.Types.ObjectId(id);
  }

  return ProducersModel.findById(objectId);
}

/**
 * Retourne tous les producteurs dont l'id se trouve dans la liste passée en paramètre.
 * @param listOfIdToGet, liste contenant les ids des producteurs que l'on cherche.
 * @returns {*}
 */
function getAllProducersInReceivedIdList(listOfIdToGet) {
  return ProducersModel.find({ _id: { $in: listOfIdToGet } });
}

const isEmailUnused = async(emailUser) => {
  const existingUser = await UsersModel.findOne({ email: emailUser });
  const existingProducer = await ProducersModel.findOne({ email: emailUser });

  return existingUser === null && existingProducer === null;
};

/**
 * Ajoute un nouveau producteur dans la base de données.
 * Doublons autorisés!
 *
 * @param {Integer} producer, Les informations du producteur à ajouter.
 */
async function addProducer(producer) {
  // FIXME: comment faire une transaction aec Mongoose pour rollback en cas d'erreur ?
  if (await isEmailUnused(producer.email)) {
    const salespoint = await salesPointsServices.addSalesPoint(producer.salesPoint);

    const productsId = await productsServices.addAllProductsInArray(producer.products);

    const producerToAdd = {
      ...producer,
      salesPoint: salespoint.id,
      subscriptions: [],
      emailValidated: false,
      subscribedUsers: [],
      isValidated: false,
      products: productsId
    };

    return new ProducersModel(producerToAdd).save();
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
    subscriptions: producer.subscriptions !== undefined ? producer.subscriptions.map(s => s.id) : [],
    emailValidated: producerValidations.emailValidated,
    subscribedUsers: producer.subscribedUsers !== undefined ? producer.subscribedUsers.map(u => u.id) : [],
    phoneNumber: producer.phoneNumber,
    description: producer.description,
    website: producer.website,
    salesPoint: producer.salesPoint.id,
    isValidated: producerValidations.isValidated,
    products: producer.products !== undefined ? producer.products.map(p => p.id) : []
  };

  return ProducersModel.findByIdAndUpdate(producerToUpdate.id, producerToUpdate, { new: true }); // retourne l'objet modifié
}

/**
 * Supprime le producteur correspondant à l'id reçu.
 *
 * @param {Integer} id, L'id du producteur à supprimer.
 */
function deleteProducer({ id }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received producer.id is invalid!');
  }

  return ProducersModel.findByIdAndRemove(id);
}

module.exports = {
  getProducers,
  addProducer,
  getProducerById,
  updateProducer,
  deleteProducer,
  getAllProducersInReceivedIdList
};
