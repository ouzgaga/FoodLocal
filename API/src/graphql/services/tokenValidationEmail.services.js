module.exports = {
  askNewEmailToken,
  addTokenValidationEmail,
  validateToken
};

const jwt = require('jsonwebtoken');
const personsServices = require('./persons.services');
const config = require('../../config/config');
const mail = require('../utils/sendEmailFoodlocal');

async function askNewEmailToken(email, password) {
  const person = await personsServices.getPersonByLogin(email, password);

  return addTokenValidationEmail(person);
}

async function addTokenValidationEmail({ id, email, firstname, lastname }) {
  const token = await jwt.sign({ id, email }, config.jwtSecret, { expiresIn: '7d', subject: 'emailValidationToken' });

  // FIXME: À décommenter pour réellement envoyer les emails!!!!!
  // console.log(`token evoyé : ${token}`);
  // mail.sendMailConfirmation(email, firstname, lastname, token);
  return token;
}

/**
 * Check if the token is valide
 * @param token - token to check
 * @returns {boolean} - result
 */
async function validateToken(token) {
  try {
    const tokenContent = await jwt.verify(token, config.jwtSecret, { maxAge: '7d', subject: 'emailValidationToken' });

    const person = await personsServices.getPersonById(tokenContent.id);
    if (person == null) {
      throw new Error('The id found in the token doesn\'t exist in the database!');
    }
    if (person.emailValidated) {
      // l'email de la personne est déjà validé
      throw new Error('Email already validated!');
    }
    return tokenContent;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error('Your token is expired. Please ask for a new one.');
    }

    throw err;
  }
}
