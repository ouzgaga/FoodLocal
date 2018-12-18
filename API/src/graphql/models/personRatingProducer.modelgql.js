const mongoose = require('mongoose');
const personsServices = require('../services/persons.services');


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
// FIXME: Paul: pourquoi intelliJ me met le aysnc en jaune?
personRatingProducer.pre('save', async function(next, err) {
  const personExist = await personsServices.checkIfPersonIdExistInDB(this.personId);
  if (!personExist) {
    throw new Error(`The given personId (${this.personId}) doesn’t exist in the database!`);
  }

  const producerExist = await personsServices.checkIfPersonIdExistInDB(this.producerId, true);
  if (!producerExist) {
    throw new Error(`The given producerId (${this.producerId}) doesn’t exist in the database!`);
  }
  // FIXME: PAUL: c'est que ce err qui vaut toujours qqch...?!
  /*
  if (err) {
    throw err;
  }
  */
  next();
});

/**
 * @typedef personRatingProducer
 */
module.exports = mongoose.model('personRatingProducer', personRatingProducer);
