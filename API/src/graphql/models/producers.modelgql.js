const mongoose = require('mongoose');
const PersonsModel = require('./persons.modelgql');
const ProductsModel = require('./products.modelgql');
const SalespointsModel = require('./salespoints.modelgql');

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

producerSchema.pre('save', async function(next) {
  try {
    // FIXME: PAUL: comment appeler le pre hook save du schéma parent (person) ?
    if (this.salespointId != null && !(await SalespointsModel.findById(this.salespointId))) {
      throw new Error(`The given salespoint (with id: ${this.salespointId}) doesn’t exist in the database!`);
    }

    this.followersIds = this.followersIds.map(async(follower) => {
      if (await PersonsModel.findById(follower.id)) {
        return follower.id;
      } else {
        throw new Error(`The given person (with id: ${follower.id}) doesn’t exist in the database!`);
      }
    });

    this.productsIds = this.productsIds.map(async(product) => {
      if (await ProductsModel.findById(product.id)) {
        return product.id;
      } else {
        throw new Error(`The given product (with id: ${product.id}) doesn’t exist in the database!`);
      }
    });
    await Promise.all([this.followersIds, this.productsIds]);
    next();
  } catch (err) {
    return next(err);
  }
});

/**
 * @typedef Producer
 */

module.exports = PersonsModel.discriminator('producers', producerSchema);
