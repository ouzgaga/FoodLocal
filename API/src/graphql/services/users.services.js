const mongoose = require('mongoose');
const UsersModel = require('../models/users.modelgql');
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

function getAllUsersInReceivedIdList(listOfIdToGet) {
  return UsersModel.find({ _id: { $in: listOfIdToGet } });
}

/**
 * Ajoute un nouveau producteur dans la base de données.
 * Doublons autorisés!
 *
 * @param {Integer} user, Les informations du producteur à ajouter.
 */
async function addUser({ firstname, lastname, email, password, image }) {
  if (await UtilsServices.isEmailUnused(email)) {
    const userToAdd = {
      firstname,
      lastname,
      email,
      password,
      image,
      subscriptions: [],
      emailValidated: false,
      isAdmin: false
    };

    const userAdded = await new UsersModel(userToAdd).save();
    tokenValidationEmail.addTokenValidationEmail(userAdded);
    return userAdded;
  } else {
    return new Error('This email is already used.');
  }
}

/**
 * Met à jour le producteur possédant l'id reçu avec les
 * données reçues. Remplace toutes les données du producteur
 * dans la base de données par celles reçues!
 *
 * @param {Integer} user, Les informations du producteur à mettre à jour.
 */
async function updateUser({ id, firstname, lastname, email, password, image, subscriptions }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received user.id is invalid!');
  }
  // FIXME: PAUL: on peut aussi récupérer que certains champs à l'aide de .select(...), qu'est-ce qui est le mieux...?
  const userValidation = await UsersModel.findById(id, 'emailValidated isAdmin');

  if (userValidation != null) {
    // si usrValidation n'est pas nul -> l'utilisateur existe dans la DB
    const { emailValidated, isAdmin } = userValidation;
    const userToUpdate = {
      firstname,
      lastname,
      email,
      password,
      image,
      subscriptions: await getAllUsersInReceivedIdList(subscriptions),
      emailValidated,
      isAdmin
    };
    return UsersModel.findByIdAndUpdate(id, userToUpdate, { new: true }); // retourne l'objet modifié
  } else {
    return new Error('The received id is not in the database!');
  }
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

// todo: à déplacer dans un fichier Person.services, faire la recherche sur toutes les personnes et faire les tests des tokens!
async function validateEmailUserByToken(value) {
  const token = await tokenValidationEmail.validateToken(value);
  if (token !== null) {
    const user = await getUserById(token.idPerson);
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
