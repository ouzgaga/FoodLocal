const mongoose = require('mongoose');
const PersonSchema = require('./persons.modelgql');

/**
 * Producer Schema (hérite du contenu du schéma 'users')
 */
const options = {
  discriminatorKey: 'kind',
  toObject: { virtuals: true }
};

const producerSchema = new mongoose.Schema(
  {
    subscribedUsersIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
      }
    ],
    phoneNumber: {
      type: mongoose.Schema.Types.String,
      required: false
    },
    description: {
      type: mongoose.Schema.Types.String,
      required: false
    },
    website: {
      type: mongoose.Schema.Types.String,
      required: false
    },
    salespointId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'salespoints',
      required: false
    },
    isValidated: {
      type: mongoose.Schema.Types.Boolean,
      required: true
    },
    productsIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
      }
    ]
  }, options
);

/**
 * @typedef Producer
 */

module.exports = PersonSchema.discriminator('producers', producerSchema);
