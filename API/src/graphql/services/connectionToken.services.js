module.exports = {
  login,
  signUpAsUser,
  signUpAsProducer,
  createConnectionToken,
  verifyToken
};

const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');
const personsServices = require('./persons.services');
const usersServices = require('./users.services');
const producersServices = require('./producers.services');
const config = require('../../config/config');

/**
 * Vérifie l'existence et la validité du couple (email, password) reçu et s'il est valide, retourne un token de connexion.
 * @param email, l'email de l'utilisateur tentant de se connecter.
 * @param password, le mot de passe de l'utilisateur tentant de se connecter.
 * @returns {Promise<*>}
 */
async function login(email, password) {
  // le check de la validité de l'email et du mdp sont fait dans getPersonByLogin()
  const person = await personsServices.getPersonByLogin(email, password);

  // on crée et retourne un token de connection
  return createConnectionToken(person.id, person.email, person.isAdmin, person.kind, person.emailValidated);
}

/**
 * Inscrit un nouvel utilisateur dans la base de données et retourne un token de connexion.
 * @param newUser, les informations du nouvel utilisteur.
 * @returns {Promise<*>}
 */
async function signUpAsUser(newUser) {
  // le check de la disponibilité de l'email et de la force du mdp sont fait dans addUser()
  const person = await usersServices.addUser(newUser);

  // on crée et retourne un token de connection
  return createConnectionToken(person.id, person.email, person.isAdmin, person.kind, person.emailValidated);
}

/**
 * Inscrit un nouveau producteur dans la base de données et retourne un token de connexion.
 * @param newProducer, les informations du nouveau producteur.
 * @returns {Promise<*>}
 */
async function signUpAsProducer(newProducer) {
  // le check de la disponibilité de l'email et de la force du mdp sont fait dans addUser()
  const person = await producersServices.addProducer(newProducer);

  // on crée et retourne un token de connection
  return createConnectionToken(person.id, person.email, person.isAdmin, person.kind, person.emailValidated);
}

/**
 * Crée un token de connexion contenant les paramètres reçus. Ce token sera utilisé par toutes les fonctionnalités requièrant que la personne soit connecté afin
 * de vérifier son identité.
 * @param id, l'id de la personne
 * @param email, l'email de la personne
 * @param isAdmin, le status de la personne (administrateur ou non)
 * @param kind, le type de la personne (users ou producers)
 * @param emailValidated, le status de l'email de la personne (vérifié ou non)
 * @returns un token de connexion
 */
function createConnectionToken(id, email, isAdmin, kind, emailValidated) {
  return jwt.sign({ id, email, isAdmin, kind, emailValidated }, config.jwtSecret, { subject: 'connectionToken' });
}

/**
 * Vérifie la validité du token reçu en paramètre et, s'il est valide, retourne un objet avec le contenu du token.
 * @param token, un token de connexion (une string)
 * @param mendatoryToken, un booléen indiquant si le token est obligatoire auquel cas, un token null lève une erreur.
 * @returns un objet contenant les éléments du token de connexion reçu.
 */
function verifyToken(token, mendatoryToken) {
  if (token == null && mendatoryToken) {
    throw new AuthenticationError('You need to be authenticated to be able to subscribe to real-time notifications.');
  } else if (token == null) {
    return null;
  }

  try {
    return jwt.verify(token, config.jwtSecret, { subject: 'connectionToken' });
  } catch (e) {
    throw new AuthenticationError(e.message);
  }
}
