const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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
  return jwt.sign({ id, email, isAdmin, kind, emailValidated }, config.jwtSecret);
}

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
    { new: true, strict: false });

  const token = await createConnectionToken(producer.id, producer.email, producer.isAdmin, producer.kind, producer.emailValidated);
  return { producer, newLoginToken: token };
}


module.exports = {
  login,
  signUpAsUser,
  signUpAsProducer,
  createConnectionToken,
  upgradeUserToProducer
};
const PersonsModel = require('../models/persons.modelgql');
