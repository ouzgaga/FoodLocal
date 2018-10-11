const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

/**
 * Product Schema
 */
const productSchema = new mongoose.Schema(
  {
    id            : {
      type    : Number,
      required: true
    },
    name          : {
      type    : String,
      required: true
    },
    description   : {
      type    : String,
      required: true
    },
    // TODO: il faut ajouter la gestion de l'image!
    category      : {
      type    : String,
      required: true
    },
    type          : {
      type    : String,
      required: true
    },
    availableFrom : {
      type    : Date,
      required: false
    },
    availableUntil: {
      type    : Date,
      required: false
    }
  });

/**
 * Methods
 */
productSchema.method({});

/**
 * Statics
 */
productSchema.statics = {
  /**
   * Get product
   * @param {ObjectId} id - The objectId of product.
   * @returns {Promise<Product, APIError>}
   */
  get (id) {
    return this.findById(id).exec().then((product) => {
      if (product) {
        return product;
      }
      const err = new APIError('No such product exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },

  /**
   * List all products in descending order of id.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<Product[]>}
   */
  list ({skip = 0, limit = 50} = {}) {
    return this.find().sort({createdAt: -1}).skip(+skip).limit(+limit).exec();
  }
};

/**
 * @typedef Product
 */
module.exports = mongoose.model('Product', productSchema);
