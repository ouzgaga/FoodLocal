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

/**
 * Vérifie l'existence du productTypeId entrés.
 * Lève une erreur s'il n'existe pas dans la collection des productType.
 */
ProductSchema.pre('save', async function(next) {
  const productTypeId = await productTypeModel.findById(this.productTypeId);

  if (!productTypeId) {
    throw new Error(`The given productTypeId (${this.productTypeId}) doesn’t exist in the database!`);
  }
  next();
});

/**
 * Vérifie l'existence de la categoryId entrée ainsi que l'existence de chaque producer du tableau producersIds.
 * Lève une erreur si l'un d'entre eux n'existe pas dans la base de données.
 */
ProductTypeSchema.pre('save', async function(next) {
  const categoryId = await productTypeCategoryModel.findById(this.categoryId);

  if (!categoryId) {
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
    await Promise.all(this.producersIds);
  }
  next();
});


const productModel = mongoose.model('products', ProductSchema);
const productTypeModel = mongoose.model('productType', ProductTypeSchema);
const productTypeCategoryModel = mongoose.model('productTypeCategory', ProductTypeCategorySchema);

/**
 * @typedef Product
 */
module.exports.Products = productModel;

/**
 * @typedef ProductType
 */
module.exports.ProductType = productTypeModel;

/**
 * @typedef ProductTypeCategory
 */
module.exports.ProductTypeCategory = productTypeCategoryModel;
