const mongoose = require('mongoose');

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
  }
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
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'productTypeCategory',
      required: true
    }
  }
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
    productType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'productType',
      required: true
    }
  }
);

/**
 * @typedef Product
 */

module.exports.Products = mongoose.model('products', ProductSchema);
module.exports.ProductType = mongoose.model('productType', ProductTypeSchema);
module.exports.ProductTypeCategory = mongoose.model('productTypeCategory', ProductTypeCategorySchema);
