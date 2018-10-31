const mongoose = require('mongoose');

/**
 * Product Schema
 */
const productSchema = new mongoose.Schema(
  {
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
    producers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Producers' }],
      required: false // FIXME: faire en sorte d'ajouter automatiquement un tableau vide par défaut!
    },
  }
);

/**
 * @typedef Product
 */
mongoose.model('products', productSchema);
