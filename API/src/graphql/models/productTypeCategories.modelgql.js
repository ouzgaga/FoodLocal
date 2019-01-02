const mongoose = require('mongoose');

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
 * @typedef ProductTypeCategory
 */
module.exports = mongoose.model('productTypeCategory', ProductTypeCategorySchema);
