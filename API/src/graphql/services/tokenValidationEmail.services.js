const mongoose = require('mongoose');
const TokenGenerator = require('uuid-token-generator');
const TokenValidationEmailModel = require('../models/tokenValidationEmail.modelgql');
const mail = require('../utils/sendEmailFoodlocal');

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

  return TokenValidationEmailModel.find(tags)
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
  return TokenValidationEmailModel.findOne({ value });
}

/**
 * Generation d'un token de confirmation d'email. Envoie le token à l'utilisateur
 * @param id
 * @returns {Promise<*>}
 */
async function addTokenValidationEmail (user) {
  // check user exist
  // TODO: euh... faut faire un check là du coup...?!^^
  if (user == null) {
    return false;
  }

  // Generate token
  const tokenGen = new TokenGenerator(256, TokenGenerator.BASE62);
  const token = {
    value: tokenGen.generate(),
    idPerson: user.id
  };
  // insert in the database
  const tokenValidationEmail = await new TokenValidationEmailModel(token).save();
  const name = `${user.firstname} ${user.lastname}`;

  // FIXME: À décommenter pour réellement envoyer les emails!!!!!
  // mail.sendMailConfirmation(user.email, name, tokenValidationEmail.value);
  return tokenValidationEmail != null;
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

  return TokenValidationEmailModel.findByIdAndRemove(id);
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
async function validateToken(value) {
  const token = await getTokenValidationEmailByValue(value); // try to get Token with the token string pass in parameter
  // if token not found return that the token is not valide
  if (token == null) {
    return null;
  } else if (tokenToOld(token.dateCreation)) {
    return null;
  } else { // is a valide token
    await deleteTokenValidationEmail(token.id); // delete token
    return token;
  }
}


module.exports = {
  getTokenValidationEmailByValue,
  getTokenValidationEmails,
  addTokenValidationEmail,
  validateToken
};
