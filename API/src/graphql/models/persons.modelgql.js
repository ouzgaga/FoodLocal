const mongoose = require('mongoose');

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

personSchema.pre('save', async function(next, err) {
  this.followingProducersIds = this.followingProducersIds.map(async(producer) => {
    const person = await PersonsModel.findById(producer._id);
    if (person != null) {
      if (person.kind !== 'producers') {
        throw new Error(`The given person (with id: ${producer.id}) is not a producer! You can only follow the producers.`);
      }
      return producer._id;
    } else {
      throw new Error(`The given person (with id: ${producer.id}) doesn’t exist in the database!`);
    }
  });

  next();
});


const PersonsModel = mongoose.model('persons', personSchema);

/**
 * @typedef Person
 */
module.exports = PersonsModel;
