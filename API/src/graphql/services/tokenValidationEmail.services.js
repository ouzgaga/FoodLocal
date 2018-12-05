const mongoose = require('mongoose');
const TokenGenerator = require('uuid-token-generator');
const usersServices = require('./users.services');
const TokenValidationEmailsModel = require('../models/tokensValidationEmail.modelgql');
const mail = require('../../utils/sendEmailFoodlocal');

/**
 * get all tokens
 * @param tags
 * @param limit
 * @param page
 * @returns {*}
 */
function getTokenValidationEmails({ tags = undefined, limit = 50, page = 0 } = {}) {
  let skip;
  if (page !== 0) {
    skip = page * limit;
  }

  return TokenValidationEmailsModel.find(tags)
    .sort({ _id: 1 })
    .skip(+skip)
    .limit(+limit);
}

/**
 * Get token by his value (token)
 * @param token - value of the token
 * @returns {*} - return the token found
 */
function getTokenValidationEmailByValue(value) {
  return TokenValidationEmailsModel.findOne({ value });
}

/**
 * Generation d'un token de confirmation d'email. Envoie le token à l'utilisateur
 * @param id
 * @returns {Promise<*>}
 */
async function addTokenValidationEmail(id) {
  console.log(usersServices);
  // Get user by id
  const user = usersServices.getUserById(id);
  // check user exist
  if (user === null) {
    return null;
  }

  // Generate token
  const tokenGen = new TokenGenerator(256, TokenGenerator.BASE62);
  const token = {
    value: tokenGen.generate(),
    idUser: id
  };
  // insert in the database
  const tokenValidationEmail = await new TokenValidationEmailsModel(token).save();
  const name = `${user.firstname} ${user.lastname}`;
  mail.sendMailConfirmation(user.email, name, tokenValidationEmail.value);
  return tokenValidationEmail;
}

/**
 * Supprime le producteur correspondant à l'id reçu.
 *
 * @param {Integer} id, L'id du producteur à supprimer.
 */
function deleteTokenValidationEmail(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received TokenValidationEmail.id is invalid!');
  }

  return TokenValidationEmailsModel.findByIdAndRemove(id);
}

function tokenToOld(dateCreation) {
  /* const daysAgo = 7;
  const date = new Date() - (daysAgo * 24 * 60 * 60 * 1000);
  return date.getDate() >= dateCreation.getDate(); */
  return false;
}

/**
 * Check if the token is valide
 * @param token - token to check
 * @returns {boolean} - result
 */
function validateToken(value) {
  const token = getTokenValidationEmailByValue(value); // try to get Token with the token string pass in parameter
  // if token not found return that the token is not valide
  if (token === null) {
    return false;
  } else if (tokenToOld(token.dateCreation)) {
    return false;
  } else { // is a valide token
    usersServices.validateEmailUserById(token.idUser);
    deleteTokenValidationEmail(token); // delete token
    return true;
  }
}


module.exports = {
  getTokenValidationEmails,
  addTokenValidationEmail,
  validateToken
};