const mongoose = require('mongoose');
const UsersModel = require('../models/user.modelgql');
const UtilsServices = require('../services/utils.services');
const ProducersModel = require('../models/producers.modelgql');
const tokenValidationEmail = require('./tokenValidationEmail.services');

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
function getUsers({ tags = undefined, limit = 50, page = 0 } = {}) {
  let skip;
  if (page !== 0) {
    skip = page * limit;
  }

  return UsersModel.find(tags)
    .sort({ _id: 1 })
    .skip(+skip)
    .limit(+limit);
}

function getAllUsersInReceivedIdList(listOfIdToGet) {
  return UsersModel.find({ _id: { $in: listOfIdToGet } });
}

/**
 * Ajoute un nouveau producteur dans la base de données.
 * Doublons autorisés!
 *
 * @param {Integer} user, Les informations du producteur à ajouter.
 */
async function addUser(user) {
  // FIXME: comment faire une transaction aec Mongoose pour rollback en cas d'erreur ?
  if (await UtilsServices.isEmailUnused(user.email)) {
    const userToAdd = {
      ...user,
      subscriptions: [],
      emailValidated: false
    };

    const userAdded = await new UsersModel(userToAdd).save();
    tokenValidationEmail.addTokenValidationEmail(userAdded);
    return userAdded;
  } else {
    throw new Error('This email is already used.');
  }
}

/**
 * Retourne le producteur correspondant à l'id reçu.
 *
 * @param {Integer} id, L'id du producteur à récupérer.
 */
function getUserById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received user.id is invalid!');
  } else {
    return UsersModel.findById(id);
  }
}

/**
 * Met à jour le producteur possédant l'id reçu avec les
 * données reçues. Remplace toutes les données du producteur
 * dans la base de données par celles reçues!
 *
 * @param {Integer} user, Les informations du producteur à mettre à jour.
 */
async function updateUser({
  id, firstname, lastname, email, password, image, subscriptions, emailValidated 
}) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received user.id is invalid!');
  }

  const userToUpdate = {
    firstname,
    lastname,
    email,
    password,
    image,
    subscriptions: await getAllUsersInReceivedIdList(subscriptions),
    emailValidated
  };
  return UsersModel.findByIdAndUpdate(id, userToUpdate, { new: true }); // retourne l'objet modifié
  // return UsersModel.updateOne(userInfos); // retourne un OK mais pas l'objet modifié
}

/**
 * Supprime le producteur correspondant à l'id reçu.
 *
 * @param {Integer} id, L'id du producteur à supprimer.
 */
function deleteUser(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received user.id is invalid!');
  }

  return UsersModel.findByIdAndRemove(id);
}

async function validateEmailUserByToken(value) {
  if (tokenValidationEmail.validateToken(value)) {
    const token = await tokenValidationEmail.getTokenValidationEmailByValue(value);
    if (token === null) {
      throw Error('token not found');
    }
    const user = await getUserById(token.idUser);
    user.emailValidated = true;
    return updateUser(user) !== null;
  } else {
    return new Error('Token not valid');
  }
}

module.exports = {
  getUsers,
  addUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsersInReceivedIdList,
  validateEmailUserByToken
};
