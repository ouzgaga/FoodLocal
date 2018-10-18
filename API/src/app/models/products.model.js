const mongoose = require('mongoose');

/**
 * Product Schema
 */
const productSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    name: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    description: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    // TODO: il faut ajouter la gestion de l'image!
    // Category = fruits, légumes, viande, fromage, ....
    category: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    // Type = pomme, tomate, boeuf, Gruyère, ...
    type: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    availableFrom: {
      type: mongoose.Schema.Types.Date,
      required: false
    },
    availableUntil: {
      type: mongoose.Schema.Types.Date,
      required: false
    },
    producers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Producers' }],
  }
);

/**
 * @typedef Product
 */
mongoose.model('products', productSchema);
