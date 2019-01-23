const mongoose = require('mongoose');

const options = {
  toObject: { virtuals: true }
};


/**
 * notifications of producers Schema
 */
const notificationsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        'NEW_POST',
        'PRODUCER_UPDATE_INFO',
        'PRODUCER_UPDATE_PRODUCTS_LIST',
        'PRODUCER_UPDATE_SALESPOINT_INFO'
      ],
      required: true
    },
    date: {
      type: mongoose.Schema.Types.Date,
      default: Date.now,
    },
    producerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'producers',
      required: true
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'posts',
      required: false
    }
  }, options
);

/**
 * Vérifie l'existence du producerId entrés avant chaque save.
 * Lève une erreur s'il n'existe pas dans la base de données et annule l'enregistrement.
 */
notificationsSchema.pre('save', async function(next) {
  try {
    const producerExist = await personsServices.checkIfPersonIdExistInDB(this.producerId, true);
    if (!producerExist) {
      throw new Error(`The given producerId (${this.producerId}) doesn’t exist in the database!`);
    }
    next();
  } catch (err) {
    next(err);
  }
});

const NotificationsModel = mongoose.model('notifications', notificationsSchema);

/**
 * @typedef notificationsSchema
 */
module.exports = NotificationsModel;
const personsServices = require('../services/persons.services');
