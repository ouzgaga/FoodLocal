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
      required: true,
      default: mongoose.Schema.Types.Date.now
    },
    dateExpiration: {
      type: mongoose.Schema.Types.Date, // TODO: custum validation date bigger then dateCreation
      required: true,
      default: mongoose.Schema.Types.Date.now().getDate() + 7
    }
  }
);

/**
 * @typedef TokenValidationEmail
 */
module.exports = mongoose.model('tokensValidationEmail', TokenValidationEmail);
