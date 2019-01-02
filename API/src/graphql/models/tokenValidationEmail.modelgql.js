const mongoose = require('mongoose');

const options = {
  toObject: { virtuals: true }
};

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
  }, options
);

/**
 * @typedef TokenValidationEmail
 */
module.exports = mongoose.model('tokensValidationEmail', TokenValidationEmail);
