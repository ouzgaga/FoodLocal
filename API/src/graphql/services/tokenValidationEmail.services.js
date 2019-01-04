const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const mail = require('../utils/sendEmailFoodlocal');

async function askNewEmailToken(email, password) {
  const person = await personsServices.getPersonByLogin(email, password);

  return addTokenValidationEmail(person);
}

async function addTokenValidationEmail({ id, email, firstname, lastname }) {
  const token = await jwt.sign({ id, email }, config.jwtSecret, { expiresIn: '7d' });

  // FIXME: À décommenter pour réellement envoyer les emails!!!!!
  // mail.sendMailConfirmation(email, firstname, lastname, token);
  return true;
}

/**
 * Check if the token is valide
 * @param token - token to check
 * @returns {boolean} - result
 */
async function validateToken(token) {
  try {
    const person = await jwt.verify(token, config.jwtSecret, { maxAge: '7d' });

    await personsServices.checkIfPersonIdExistInDB(person.id);
    return person;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error('Your token is expired. Please ask for a new one.');
    }

    throw err;
  }
}

module.exports = {
  askNewEmailToken,
  addTokenValidationEmail,
  validateToken
};

const personsServices = require('./persons.services');
