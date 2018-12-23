const mongoose = require('mongoose');
const ProducersModel = require('./producers.modelgql');
const ProductTypeCategoryModel = require('./productTypeCategories.modelgql');
const personsServices = require('../services/persons.services');

const options = {
  toObject: { virtuals: true }
};

/**
 * ProductType Schema
 */
const ProductTypeSchema = new mongoose.Schema(
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
ProductTypeSchema.pre('save', async function(next) {
  const categoryId = await ProductTypeCategoryModel.findById(this.categoryId);

  if (!categoryId) {
    throw new Error(`The given categoryId (${this.categoryId}) doesn’t exist in the database!`);
  }

  if (this.producersIds != null && this.producersIds.length > 0) {
    this.producersIds = this.producersIds.map(async(producerId) => {
      const producer = await personsServices.checkIfPersonIdExistInDB(producerId, true);

      if (producer) {
        return producer.id;
      } else {
        throw new Error(`The given producerId (${producerId}) doesn’t exist in the database!`);
      }
    });
    await Promise.all(this.producersIds);
  }
  next();
});

/**
 * @typedef ProductType
 */
module.exports = mongoose.model('productType', ProductTypeSchema);
