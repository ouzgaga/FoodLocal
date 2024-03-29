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
  checkIfPersonFollowProducer,
  changePassword,
  resetPassword,
  checkIfPasswordIsValid,
  upgradeUserToProducer,
  validateEmailUserByToken,
  deletePersonAccount
};

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const PersonsModel = require('../models/persons.modelgql');
const tokenValidationEmailServices = require('./tokenValidationEmail.services');
const producersServices = require('./producers.services');
const usersServices = require('./users.services');
const connectionTokenServices = require('./connectionToken.services');
const config = require('../../config/config');
const mail = require('../utils/sendEmailFoodlocal');

/**
 * Retourne true si l'email reçu en paramètre n'est pas encore présent dans la base de données (et donc disponible pour inscrire une nouvelle personne).
 * Retourne false si l'email est déjà pris (déjà dans la base de données).
 * @param emailUser, l'email dont on souhaite vérifier la disponibilité.
 * @true si l'email est disponible pour un nouvel inscrit, false sinon.
 */
async function isEmailAvailable(emailUser) {
  const existingPerson = await PersonsModel.findOne({ email: emailUser });
  return existingPerson === null;
}

/**
 * Retourne true si l'id 'personId' existe bien dans la collection persons, false sinon. Si isProducer vaut true, vérifie également que la personne
 * correspondant à l'id 'personId' est bien un producer (kind === 'producers'). Retourne false si ce n'est pas le cas.
 * @param personId, l'id de la personne dont on souhaite vérifier l'existence.
 * @param isProducer, true si on souhaite vérifier que cette personne est également un producer, false sinon.
 * @returns {Promise<boolean>}
 */
async function checkIfPersonIdExistInDB(personId, isProducer = false) {
  const person = await PersonsModel.findById(personId);
  if (isProducer) {
    return person != null && person.kind === 'producers';
  } else {
    return person != null;
  }
}

/**
 * Retourne la personne correspondante à l'id reçu.
 * @param id, l'ide de la personne que l'on souhaite récupérer.
 * @returns la personne correspondante à l'id reçu.
 */
function getPersonById(id) {
  return PersonsModel.findById(id);
}

/**
 * Retourne la personne correspondante au couple email, password reçu. Vérifie l'existence de l'email dans la base de données ainsi que la correspondance
 * entre le password reçu en paramètre et celui enregistré dans la base de données. Lève une erreur si l'email n'existe pas ou si le password ne correspond
 * pas à celui dans la base de données.
 * @param email, l'email de la personne que l'on souhaite récupérer.
 * @param password, le mot de passe de la personne que l'on souhaite récupérer.
 * @returns la personne correspondant au couple email, password reçu.
 */
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

/**
 * Retourne la personne correspondante au token de connexion reçu, pour autant que celui-ci soit valide.
 * @param token, un token de connexion valide.
 * @returns la personne correspondante au token reçu
 */
async function getPersonByToken(token) {
  const tokenContent = await jwt.verify(token, config.jwtSecret, { subject: 'connectionToken' });

  if (tokenContent == null || tokenContent.id == null) {
    return null;
  }
  return getPersonById(tokenContent.id);
}

/**
 * Retourne toutes les personnes correspondantes à un id du tableau listOfIdToGet reçu.
 * @param listOfIdToGet, un tableau d'id contenant l'id de toutes les personnes dont on souhaite récupérer les informations.
 * @returns un tableau contenant toutes les personnes correspondantes à un id du tableau listOfIdToGet reçu.
 */
function getAllPersonsInReceivedIdList(listOfIdToGet) {
  // FIXME: Il faut ajouter la pagination entre la DB et le serveur !!!
  return PersonsModel.find({ _id: { $in: listOfIdToGet } }).sort({ _id: 1 });
}

/**
 * Retourne le nombre total de personnes (users et producers) présentes dans la base de données.
 * @returns le nombre total de personnes (users et producers) présentes dans la base de données.
 */
function countNbPersonsInDB() {
  return PersonsModel.countDocuments();
}

/**
 * Ajoute le producteur correspondant à 'producerId' à la liste des personnes suivies par la personne 'personId'.
 * @param personId, l'id de la personne à qui on souhaite ajouter un producteur dans la liste des personnes suivies.
 * @param producerId, l'id du producteur que la personne veut désormais suivre.
 * @returns {Query}
 */
function addProducerToPersonsFollowingList(personId, producerId) {
  if (personId === producerId) {
    throw new Error('You can\'t follow yourself!');
  }

  return PersonsModel.findByIdAndUpdate(personId, { $addToSet: { followingProducersIds: producerId } }, { new: true, runValidators: true }); // retourne l'objet modifié
}

/**
 * Supprime le producteur correspondant à 'producerId' de la liste des personnes suivies par la personne 'personId'.
 * @param personId, l'id de la personne à qui on souhaite supprimer un producteur dans la liste des personnes suivies.
 * @param producerId, l'id du producteur que la personne ne veut désormais plus suivre.
 * @returns {Query}
 */
function removeProducerToPersonsFollowingList(personId, producerId) {
  if (personId === producerId) {
    throw new Error('You can\'t follow yourself!');
  }

  return PersonsModel.findByIdAndUpdate(personId, { $pull: { followingProducersIds: producerId } }, { new: true, runValidators: true }); // retourne l'objet modifié
}

/**
 * Retourne true si la personne corresopndante à 'personId' suit le producteur 'producerId', false sinon.
 * @param personId, l'id de la personne dont on souhaite savoir si elle suite le producteur.
 * @param producerId, l'id du producteur que l'on souhaite rechercher parmi les producteurs suivis par la personne.
 * @returns true si 'personId' suit 'producerId', false sinon
 */
async function checkIfPersonFollowProducer(personId, producerId) {
  if (personId === producerId) {
    return false;
  }

  const res = await PersonsModel.findOne({ _id: personId, followingProducersIds: producerId });
  return res != null;
}

/**
 * Permet de changer le mot de passe de la personne correspondant à 'personId' si le oldPassword correspond au mot de passe enregistré dans la base de
 * données et si le newPassword est un mot de passe valide.
 * @param newPassword, le nouveau mot de passe à attribuer à la personne.
 * @param oldPassword, l'ancien mot de passe de la personne.
 * @param personId, l'id de la personne dont on souhaite modifier le mot de passe.
 * @returns true si le mot de passe a été changé avec succès. Lève une erreur dans le cas contraire (dépendante du problème rencontré)
 */
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
  const updatedPerson = await PersonsModel.findByIdAndUpdate(person.id, { password: person.password }, { new: true, runValidators: true });
  return updatedPerson != null;
}

/**
 * Permet de réinitialiser le mot de passe de la personne correspondant à l'email reçu en paramètre. Le nouveau mot de passe est généré automatiquement et
 * envoyé par email à l'adresse email reçue.
 * @param email, l'email de la personne dont on souhaite réinitialiser le mot de passe.
 * @returns true si le mot de passe a bien été réinitialisé. Lève une erreur dans le cas contraire.
 */
async function resetPassword(email) {
  const person = await PersonsModel.findOne({ email });

  if (person == null || person.id == null) {
    throw new Error(`There is no user corresponding to the email "${email}"`);
  }
  const password = crypto.randomBytes(20).toString('hex');
  person.password = await bcrypt.hash(password, 10);
  const updatedPerson = await PersonsModel.findByIdAndUpdate(person.id, { password: person.password }, { new: true, runValidators: true });
  if (updatedPerson != null && process.env.NODE_ENV === 'production') {
    // les mails ne sont réellement envoyés que si l'API tourne en production
    mail.sendMailResetPassword(email, updatedPerson.firstname, updatedPerson.lastname, password);
  }
  return true;
}

/**
 * Vérifie la validité du mot de passe reçu en paramètre. Pour être valide, un mot de passe doit:
 *          - avoir une longueur d'au moins 6 caractères et au plus 30
 *          - contenir au moins une lettre
 *          - contenir au moins un chiffre
 * @param password, le password dont on souhaite vérifier la validité
 * @returns true si le mot de passe est valide. Lève une erreur dans le cas contraire.
 */
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

/**
 * Transforme un utilisateur ('users') en un producteur ('producers').
 * @param idUserToUpgrade, l'id de l'utilisateur que l'on souhaite transformer en producteur.
 * @param password, le mot de passe de l'utilisateur que l'on souhaite transformer en producteur.
 * @returns {producer, newLoginToken}, un objet contenant le nouveau producteur ainsi que le nouveau login de connexion de ce producteur.
 */
async function upgradeUserToProducer(idUserToUpgrade, password) {
  const user = await usersServices.getUserById(idUserToUpgrade);

  if (user == null) {
    throw new Error('The received idUserToUpgrade is not in the database!');
  }

  // on compare le password reçu en paramètre avec le mdp enregistré dans la DB
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error('Received password is not correct!');
  }

  const producer = await PersonsModel.findByIdAndUpdate(user.id, { kind: 'producers', followersIds: [], productsIds: [], isValidated: false },
    { new: true, runValidators: true, strict: false });

  const token = await connectionTokenServices.createConnectionToken(producer.id, producer.email, producer.isAdmin, producer.kind, producer.emailValidated);
  return { producer, newLoginToken: token };
}

/**
 * Valide l'email contenu dans le token de validation d'email reçu. Lève une erreur si le token est invalide ou périmé.
 * @param emailValidationToken, un token de validation d'email.
 * @returns un token de connexion valide.
 */
async function validateEmailUserByToken(emailValidationToken) {
  const person = await tokenValidationEmailServices.validateToken(emailValidationToken);

  const updatedPerson = await PersonsModel.findByIdAndUpdate(person.id, { emailValidated: true }, { new: true, runValidators: true }); // retourne l'objet modifié
  return connectionTokenServices.createConnectionToken(updatedPerson.id, updatedPerson.email, updatedPerson.isAdmin, updatedPerson.kind, updatedPerson.emailValidated);
}

/**
 * Supprime le compte de la personne correspondante à l'id 'personId'.
 * @param personId, l'id de la personne dont on souhaite supprimer le compte.
 * @param kind, le type de la personne ('producers' ou 'users').
 * @returns {*}
 */
function deletePersonAccount(personId, kind) {
  if (kind === 'producers') {
    return producersServices.deleteProducer(personId);
  } else {
    return usersServices.deleteUser(personId);
  }
}
