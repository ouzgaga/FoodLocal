const mongoose = require('mongoose');

/**
 * Producer Schema
 */
const producerSchema = new mongoose.Schema(
  {
    id         : {
      type    : mongoose.Schema.Types.ObjectId
    },
    name       : {
      type    : mongoose.Schema.Types.String,
      required: true
    },
    description: {
      type    : mongoose.Schema.Types.String,
      required: true
    },
    // TODO: il faut ajouter la gestion de l'image!
    phoneNumber: {
      type    : mongoose.Schema.Types.String,
      required: true
    },
    email      : {
      type    : mongoose.Schema.Types.String,
      required: true
    },
    isValidated: {
      type    : mongoose.Schema.Types.Boolean,
      required: true
    },
    password   : {
      type    : mongoose.Schema.Types.String,
      required: true
    },
    salesPoints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SalesPoint' }]
  }
);

/**
 * @typedef Producer
 */
module.exports = mongoose.model('Producer', producerSchema);
