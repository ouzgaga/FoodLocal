const mongoose = require('mongoose');
const producersModel = require('./producers.modelgql');

const options = {
  toObject: { virtuals: true }
};

/**
 * ProductTypeCategory Schema
 */
const ProductTypeCategorySchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    image: {
      type: mongoose.Schema.Types.String,
      required: false
    }
  }, options
);

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

const productModel = mongoose.model('products', ProductSchema);
const productTypeModel = mongoose.model('productType', ProductTypeSchema);
const productTypeCategoryModel = mongoose.model('productTypeCategory', ProductTypeCategorySchema);

/**
 * Vérifie l'existence du productTypeId entrés.
 * Lève une erreur s'il n'existe pas dans la collection des productType.
 */
// FIXME: Paul: pourquoi intelliJ me met le aysnc en jaune?
ProductSchema.pre('save', async function(next, err) {
  const productTypeId = await productTypeModel.findById(this.productTypeId);

  if (!productTypeId) {
    throw new Error(`The given productTypeId (${this.productTypeId}) doesn’t exist in the database!`);
  }

  // FIXME: PAUL: c'est quoi ce err qui vaut toujours qqch...?!
  /*
  if (err) {
    throw err;
  }
  */
  next();
});

ProductTypeSchema.pre('save', async function(next, err) {
  const categoryId = await productTypeCategoryModel.findById(this.categoryId.id);

  if (categoryId) {
    this.categoryId = this.categoryId.id;
  } else {
    throw new Error(`The given categoryId (${this.categoryId}) doesn’t exist in the database!`);
  }

  if (this.producersIds != null && this.producersIds.length > 0) {
    this.producersIds = this.producersIds.map(async(producerId) => {
      const producer = await producersModel.findById(producerId);

      if (producer) {
        return producer.id;
      } else {
        throw new Error(`The given producerId (${producerId}) doesn’t exist in the database!`);
      }
    });
  }

  // FIXME: PAUL: c'est quoi ce err qui vaut toujours qqch...?!
  /*
  if (err) {
    throw err;
  }
  */
  next();
});

/**
 * @typedef Product
 */

module.exports.Products = productModel;
module.exports.ProductType = productTypeModel;
module.exports.ProductTypeCategory = productTypeCategoryModel;
