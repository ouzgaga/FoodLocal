const mongoose = require('mongoose');
const { addressSchema } = require('./salespoints.modelgql');

const options = {
  toObject: { virtuals: true }
};

/**
 * posts of producers Schema
 */
const postsSchema = new mongoose.Schema(
  {
    producerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'producers',
      required: true
    },
    text: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    publicationDate: {
      type: mongoose.Schema.Types.Date,
      default: mongoose.Schema.Types.Date.now
    },
    address: {
      type: addressSchema,
      required: false
    },
    deleted: {
      type: mongoose.Schema.Types.Boolean,
      required: true,
      default: false
    }
  }, options
);

/**
 * Vérifie l'existence du producerId entrés avant chaque save.
 * Lève une erreur s'il n'existe pas dans la base de données et annule l'enregistrement.
 */
postsSchema.pre('save', async function(next) {
  try {
    const producerExist = await personsServices.checkIfPersonIdExistInDB(this.producerId, true);
    if (!producerExist) {
      throw new Error(`The given producerId (${this.producerId}) doesn’t exist in the database!`);
    }
    next();
  } catch (err) {
    next(err);
  }
});

const PostsModel = mongoose.model('posts', postsSchema);

/**
 * @typedef postsSchema
 */
module.exports = PostsModel;
const personsServices = require('../services/persons.services');
