const mongoose = require('mongoose');
const ProductTypesModel = require('./productTypes.modelgql');

const options = {
  toObject: { virtuals: true }
};

/**
 * Product Schema
 */
const ProductSchema = new mongoose.Schema(
  {
    description: {
      type: mongoose.Schema.Types.String,
      required: false
    },
    productTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'productType',
      required: true
    }
  }, options
);

/**
 * Vérifie l'existence du productTypeId entrés.
 * Lève une erreur s'il n'existe pas dans la collection des productType.
 */
ProductSchema.pre('save', async function(next) {
  try {
    const productTypeId = await ProductTypesModel.findById(this.productTypeId);

    if (!productTypeId) {
      throw new Error(`The given productTypeId (${this.productTypeId}) doesn’t exist in the database!`);
    }
    next();
  } catch (err) {
    return next(err);
  }
});

/**
 * @typedef Product
 */
module.exports = mongoose.model('products', ProductSchema);
