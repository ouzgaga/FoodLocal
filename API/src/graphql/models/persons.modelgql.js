const mongoose = require('mongoose');
// const { ProductsModel } = require('../requires/models');

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

personSchema.pre('save', async function(next) {
  try {
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
  } catch (err) {
    return next(err);
  }
});

personSchema.pre('findOneAndUpdate', async function(next) {
  try {
    if (this._update != null && this._update.$addToSet != null) {
      const addToSetOperation = this._update.$addToSet;
      if (addToSetOperation.productsIds != null) {
        /*
        // fixme: problème de require circulaire....!!! `_´
        if (await ProductsModel.findById(addToSetOperation.productsIds)) {
          return addToSetOperation.productsIds;
        } else {
          throw new Error(`The given product (with id: ${addToSetOperation.productsIds}) doesn’t exist in the database!`);
        }
        */
      } else if (addToSetOperation.followingProducersIds != null) {
        const person = await PersonsModel.findById(this._update.$addToSet.followingProducersIds);
        if (person != null) {
          if (person.kind !== 'producers') {
            throw new Error(
              `The given person (with id: ${this._update.$addToSet.followingProducersIds}) is not a producer! You can only follow the producers.`);
          }
          return this._update.$addToSet.followingProducersIds;
        } else {
          throw new Error(`The given person (with id: ${this._update.$addToSet.followingProducersIds}) doesn’t exist in the database!`);
        }
      }
    }
    next();
  } catch (err) {
    return next(err);
  }
});

const PersonsModel = mongoose.model('persons', personSchema);

/**
 * @typedef Person
 */
module.exports = PersonsModel;
