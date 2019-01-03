const jwt = require('jsonwebtoken');
const personsServices = require('./persons.services');
const usersServices = require('./users.services');
const producersServices = require('./producers.services');
const config = require('../../config/config');

async function login(email, password) {
  const person = await personsServices.getPersonByLogin(email, password);

  return createConnectionToken(person.id, person.email, person.isAdmin, person.kind);
}

async function signUpAsUser(newUser) {
  // le check de la disponibilité de l'email et de la force du mdp sont fait dans addUser()
  const person = await usersServices.addUser(newUser);

  // on crée et retourne un token de connection
  return createConnectionToken(person.id, person.email, person.isAdmin, person.kind);
}

async function signUpAsProducer(newProducer) {
  // le check de la disponibilité de l'email et de la force du mdp sont fait dans addUser()
  const person = await producersServices.addProducer(newProducer);

  // on crée et retourne un token de connection
  return createConnectionToken(person.id, person.email, person.isAdmin, person.kind);
}

function createConnectionToken(id, email, isAdmin, kind) {
  return jwt.sign({ id, email, isAdmin, kind }, config.jwtSecret);
}

module.exports = {
  login,
  signUpAsUser,
  signUpAsProducer
};
