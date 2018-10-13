const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

/**
 * Product Schema
 */
const productSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    description: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    // TODO: il faut ajouter la gestion de l'image!
    category: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    type: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    availableFrom: {
      type: mongoose.Schema.Types.Date,
      required: false
    },
    availableUntil: {
      type: mongoose.Schema.Types.Date,
      required: false
    },
    producers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Producer' }],
  }
);

/**
 * @typedef Product
 */
module.exports = mongoose.model('Product', productSchema);
