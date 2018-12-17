const mongoose = require('mongoose');
// fixme: PAUL: pourquoi ajouter cette référence fait tout planter??!
// const ProducerModel = require('./producers.modelgql');

/**
 * Person Schema
 */
const options = {
  discriminatorKey: 'kind',
  toObject: { virtuals: true }
};

const personSchema = new mongoose.Schema(
  {
    firstname: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    lastname: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    email: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    password: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    // l'image doit être encodée en base64
    image: {
      type: mongoose.Schema.Types.String,
      required: false
    },
    followingProducersIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'producers'
        }
      ],
      required: true
    },
    emailValidated: {
      type: mongoose.Schema.Types.Boolean,
      required: true
    },
    isAdmin: {
      type: mongoose.Schema.Types.Boolean,
      required: true
    }
  }, options
);

/*
personSchema.pre('save', (next, err) => {
  if (err) {
    throw err;
  }
  // this.followingProducersIds = this.followingProducersIds.map((producer) => producer._id);
  next();
});

personSchema.pre('findOneAndUpdate', async(next) => {
  const promises = this.followingProducersIds.map(async(ref) => {
    const exist = true; // await ProducerModel.findById(ref);
    if (!exist) {
      throw new Error(`The given ref id (${ref}) doesn’t exist in the database!`);
    }
  });

  await Promise.all(promises);

  next();
});
*/

/**
 * @typedef Person
 */

module.exports = mongoose.model('persons', personSchema);
