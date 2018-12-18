const mongoose = require('mongoose');
const PersonSchema = require('./persons.modelgql');

const options = {
  discriminatorKey: 'kind',
  toObject: { virtuals: true }
};

const RatingSchema = new mongoose.Schema(
  {
    rating: {
      type: mongoose.Schema.Types.Number,
      required: true
    },
    nbRatings: {
      type: mongoose.Schema.Types.Number,
      required: true
    }
  }
);

/**
 * Producer Schema (hérite du contenu du schéma 'persons')
 */
const producerSchema = new mongoose.Schema(
  {
    followersIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'persons',
        required: true
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
        ref: 'products',
        required: true
      }
    ],
    rating: {
      type: RatingSchema,
      required: false
    }
  }, options
);

producerSchema.pre('save', function(next, err) {
  this.followersIds = this.followersIds.map(person => person._id);
  this.salespointId = this.salespointId != null ? this.salespointId._id : null;
  this.productsIds = this.productsIds.map(product => product._id);
  next();
});

/**
 * @typedef Producer
 */

module.exports = PersonSchema.discriminator('producers', producerSchema);
