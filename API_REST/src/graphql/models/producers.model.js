const mongoose = require('mongoose');
const UserSchema = require('./user.model');

/**
 * Producer Schema (hérite du contenu du schéma 'users')
 */
const options = { discriminatorKey: 'kind' };

const producerSchema = new mongoose.Schema(
  {
    subscribedUsers: [
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
    salesPoint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'salespoints',
      required: true
    },
    isValidated: {
      type: mongoose.Schema.Types.Boolean,
      required: true
    },
    Products: [
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

module.exports = UserSchema.discriminator('producers', producerSchema);
