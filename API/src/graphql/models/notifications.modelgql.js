const mongoose = require('mongoose');
const personsServices = require('../services/persons.services');

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
      // FIXME: PAUL: pourquoi le default n'est jamais appelé?!
      // FIXME: Paul: comment changer la timezone de l'heure enregistrée?
      default: mongoose.Schema.Types.Date.now
    },
    producerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'producers',
      required: true
    }
  }, options
);

/**
 * Vérifie l'existence des personId et producerId entrés.
 * Lève une erreur si l'un des deux n'existe pas dans la base de données.
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
