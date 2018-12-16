const mongoose = require('mongoose');

const options = {
  toObject: { virtuals: true }
};

/**
 * person's ratings of producers Schema
 */

const personRatingProducer = new mongoose.Schema(
  {
    producerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'producers',
      required: true
    },
    personId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'persons',
      required: true
    },
    rating: {
      type: mongoose.Schema.Types.Number,
      required: true,
      min: 1,
      max: 5,
      validate : {
        validator : Number.isInteger,
        message   : '{VALUE} is not an integer value'
      }
    }
  }, options
);

/**
 * @typedef personRatingProducer
 */
module.exports = mongoose.model('personRatingProducer', personRatingProducer);
