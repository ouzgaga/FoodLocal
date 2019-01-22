const mongoose = require('mongoose');

const options = {
  toObject: { virtuals: true }
};

/**
 * ProductType Schema
 */
const productTypeSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    image: {
      type: mongoose.Schema.Types.String,
      required: false
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'productTypeCategory',
      required: true
    },
    producersIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'producers',
      required: true
    }
  }, options
);

/**
 * Vérifie l'existence de la categoryId entrée avant chaque enregistrement dans la collection.
 * Lève une erreur s'il n'existe pas dans la base de données et annule l'enregistrement.
 */
productTypeSchema.pre('save', async function(next) {
  try {
    if (!(await ProductTypeCategoriesModel.findById(this.categoryId))) {
      throw new Error(`The given categoryId (${this.categoryId}) doesn’t exist in the database!`);
    }
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Vérifie l'existence du producerId entrés avant chaque update.
 * Lève une erreur s'il n'existe pas dans la base de données et annule l'update.
 */
productTypeSchema.pre('findOneAndUpdate', async function(next) {
  try {
    if (this._update != null && this._update.$addToSet != null) {
      const addToSetOperation = this._update.$addToSet;
      try {
        await personsServices.checkIfPersonIdExistInDB(addToSetOperation.producersIds, true);
      } catch (err) {
        throw new Error(`The given producerId (with id: ${addToSetOperation.producersIds}) doesn’t exist in the database or is not a producer!`);
      }
    }
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * @typedef ProductType
 */
module.exports = mongoose.model('productType', productTypeSchema);
const personsServices = require('../services/persons.services');
const ProductTypeCategoriesModel = require('./productTypeCategories.modelgql');
