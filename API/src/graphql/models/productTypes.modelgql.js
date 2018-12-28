const mongoose = require('mongoose');
const ProductTypeCategoriesModel = require('./productTypeCategories.modelgql');
const personsServices = require('../services/persons.services');

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
 * Vérifie l'existence de la categoryId entrée ainsi que l'existence de chaque producer du tableau producersIds.
 * Lève une erreur si l'un d'entre eux n'existe pas dans la base de données.
 */
productTypeSchema.pre('save', async function(next) {
  const categoryId = await ProductTypeCategoriesModel.findById(this.categoryId);

  if (!categoryId) {
    next(new Error(`The given categoryId (${this.categoryId}) doesn’t exist in the database!`));
  }

  if (this.producersIds != null && this.producersIds.length > 0) {
    this.producersIds = this.producersIds.map(async(producerId) => {
      const producer = await personsServices.checkIfPersonIdExistInDB(producerId, true);

      if (producer) {
        return producer.id;
      } else {
        next(new Error(`The given producerId (${producerId}) doesn’t exist in the database or is not a producer!`));
      }
    });
    await Promise.all(this.producersIds);
  }
  next();
});


productTypeSchema.pre('findOneAndUpdate', async function(next) {
  try {
    if (this._update != null && this._update.$addToSet != null) {
      const addToSetOperation = this._update.$addToSet;
      if (addToSetOperation.producersIds != null) {
        const producerExistInDB = await personsServices.checkIfPersonIdExistInDB(this._update.$addToSet.producersIds, true);
        if (producerExistInDB) {
          return this._update.$addToSet.producersIds;
        } else {
          throw new Error(`The given producerId (with id: ${this._update.$addToSet.producersIds}) doesn’t exist in the database or is not a producer!`);
        }
      }
    }
    next();
  } catch (err) {
    return next(err);
  }
});

/**
 * @typedef ProductType
 */
module.exports = mongoose.model('productType', productTypeSchema);
