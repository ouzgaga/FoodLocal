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
    idPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'persons',
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
