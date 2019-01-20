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
 * Vérifie l'existence des personId et producerId entrés.
 * Lève une erreur si l'un des deux n'existe pas dans la base de données.
 */
async function checkGivenPersonAndProducerExists(query, next) {
  const personExist = await personsServices.checkIfPersonIdExistInDB(query.personId);
  if (!personExist) {
    throw new Error(`The given personId (${query.personId}) doesn’t exist in the database!`);
  }

  const producerExist = await personsServices.checkIfPersonIdExistInDB(query.producerId, true);
  if (!producerExist) {
    throw new Error(`The given producerId (${query.producerId}) doesn’t exist in the database!`);
  }
  next();
}

personRatingProducer.pre('findOneAndUpdate', function(next) {
  try {
    return checkGivenPersonAndProducerExists(this._conditions, next);
  } catch (err) {
    next(err);
  }
});


/**
 * Met à jour le rating enregistré dans le producer après qu'un nouveau vote le concernant ait été enregistré ou qu'un vote déjà enregistré ait été mis à jour.
 * @param doc
 * @returns {Promise<*>}
 */
async function updateProducerRating(doc) {
  if (!doc) {
    return null;
  }

  let rating = await PersonRatingProducersModel.aggregate([
    { $match: { producerId: mongoose.Types.ObjectId(doc.producerId) } },
    { $group: { _id: null, nbRatings: { $sum: 1 }, grade: { $avg: '$rating' } } },
    { $project: { _id: false } }
  ]);

  if (rating.length === 0) {
    rating = null;
  } else {
    rating = rating[0];
  }

  return ProducersModel.findByIdAndUpdate(doc.producerId, { rating }, { new: true, runValidators: true });
}

personRatingProducer.post('save', doc => updateProducerRating(doc));
personRatingProducer.post('findOneAndUpdate', doc => updateProducerRating(doc));
personRatingProducer.post('findOneAndRemove', doc => updateProducerRating(doc));

const PersonRatingProducersModel = mongoose.model('personRatingProducer', personRatingProducer);

/**
 * @typedef personRatingProducer
 */
module.exports = PersonRatingProducersModel;
const personsServices = require('../services/persons.services');
const ProducersModel = require('../models/producers.modelgql');
