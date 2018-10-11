const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Products = require('../models/products');
const SalesPoints = require('./salespoints');

/**
 * Producer Schema
 */
const producerSchema = new mongoose.Schema(
  {
    id         : {
      type    : Number,
      required: true
    },
    name       : {
      type    : String,
      required: true
    },
    description: {
      type    : String,
      required: true
    },
    // TODO: il faut ajouter la gestion de l'image!
    phoneNumber: {
      type    : String,
      required: true
    },
    email      : {
      type    : String,
      required: true
    },
    isValidated: {
      type    : Boolean,
      required: true
    },
    password   : {
      type: String,
      required: true
    },
    products:{
      type: [Products],
      required: false
    },
    salesPoints:{
      type: [SalesPoints],
      required: true
    }
  });

/**
 * Methods
 */
producerSchema.method({});

/**
 * Statics
 */
producerSchema.statics = {
  /**
   * Get producer
   * @param {ObjectId} id - The objectId of producer.
   * @returns {Promise<Producer, APIError>}
   */
  get (id) {
    return this.findById(id).exec().then((producer) => {
      if (producer) {
        return producer;
      }
      const err = new APIError('No such producer exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },

  /**
   * List all producers in descending order of id.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<Producer[]>}
   */
  list ({skip = 0, limit = 50} = {}) {
    return this.find().sort({createdAt: -1}).skip(+skip).limit(+limit).exec();
  }
};

/**
 * @typedef Producer
 */
module.exports = mongoose.model('Producer', producerSchema);
