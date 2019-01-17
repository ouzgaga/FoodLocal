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

async function login(email, password) {
  const person = await personsServices.getPersonByLogin(email, password);

  return createConnectionToken(person.id, person.email, person.isAdmin, person.kind, person.emailValidated);
}

async function signUpAsUser(newUser) {
  // le check de la disponibilité de l'email et de la force du mdp sont fait dans addUser()
  const person = await usersServices.addUser(newUser);

  // on crée et retourne un token de connection
  return createConnectionToken(person.id, person.email, person.isAdmin, person.kind, person.emailValidated);
}

async function signUpAsProducer(newProducer) {
  // le check de la disponibilité de l'email et de la force du mdp sont fait dans addUser()
  const person = await producersServices.addProducer(newProducer);

  // on crée et retourne un token de connection
  return createConnectionToken(person.id, person.email, person.isAdmin, person.kind, person.emailValidated);
}

function createConnectionToken(id, email, isAdmin, kind, emailValidated) {
  return jwt.sign({ id, email, isAdmin, kind, emailValidated }, config.jwtSecret, { subject: 'connectionToken' });
}

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
