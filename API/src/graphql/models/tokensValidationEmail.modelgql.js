const mongoose = require('mongoose');


/**
 * TokenValidationEmail Schema
 */

const TokenValidationEmail = new mongoose.Schema(
  {
    value: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user', // FIXME: voir comment référencer aussi le schéma producers
      required: true
    },
    dateCreation: {
      type: mongoose.Schema.Types.Date,
      default: mongoose.Schema.Types.Date.now
    }
  }
);

/**
 * @typedef TokenValidationEmail
 */
module.exports = mongoose.model('tokensValidationEmail', TokenValidationEmail);
