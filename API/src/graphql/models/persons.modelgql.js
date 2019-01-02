const mongoose = require('mongoose');
const SalespointsModel = require('./salespoints.modelgql');

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
      required: true,
      match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      lowercase: true
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

// il n'y a aucun check à faire lors de l'ajout d'un producer ou d'un user (ils sont tous fait au niveau de GraphQL)


personSchema.pre('findOneAndUpdate', async function(next) {
  try {
    if (this._update != null && this._update.$addToSet != null) {
      // on check les opérations addToSet
      const addToSetOperation = this._update.$addToSet;

      // on check la validité des insertions dans le tableau productsIds
      if (addToSetOperation.productsIds != null && !(await ProductsModel.findById(addToSetOperation.productsIds))) {
        throw new Error(`The given product (with id: ${addToSetOperation.productsIds}) doesn’t exist in the database!`);
      }

      // on check la validité des insertions dans le tableau followingProducersIds
      if (addToSetOperation.followingProducersIds != null) {
        const person = await PersonsModel.findById(addToSetOperation.followingProducersIds);
        if (person == null) {
          throw new Error(`The given person (with id: ${addToSetOperation.followingProducersIds}) doesn’t exist in the database!`);
        } else if (person.kind !== 'producers') {
          throw new Error(
            `The given person (with id: ${addToSetOperation.followingProducersIds}) is not a producer! You can only follow the producers.`
          );
        }
      }

      // on check la validité des insertions dans le tableau followersIds
      if (addToSetOperation.followersIds != null && !(await PersonsModel.findById(addToSetOperation.followersIds))) {
        throw new Error(`The given person (with id: ${addToSetOperation.followersIds}) doesn’t exist in the database!`);
      }
    }
    next();
  } catch (err) {
    next(err);
  }
});

const PersonsModel = mongoose.model('persons', personSchema);

/**
 * @typedef Person
 */
module.exports = PersonsModel;

// Très moche, mais permet de résoudre le problème de dépendances circulaires...
const ProductsModel = require('../models/products.modelgql');
