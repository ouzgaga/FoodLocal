const mongoose = require('mongoose');

const options = {
  toObject: { virtuals: true }
};


/**
 * personsNotification Schema
 */
const personNotificationsSchema = new mongoose.Schema(
  {
    personId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'persons',
      required: true
    },
    notificationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'notifications',
      required: true
    },
    seen:{
      type: mongoose.Schema.Types.Boolean,
      default: false,
      required: true
    }
  }, options
);

/**
 * Vérifie l'existence des personId et producerId entrés.
 * Lève une erreur si l'un des deux n'existe pas dans la base de données.
 */
personNotificationsSchema.pre('save', async function(next) {
  try {
    const personExist = await personsServices.checkIfPersonIdExistInDB(this.personId);
    if (!personExist) {
      throw new Error(`The given personId (${this.personId}) doesn’t exist in the database!`);
    }
    pubSub.publish('NEW_NOTIFICATION', { notification: this });
    next();
  } catch (err) {
    next(err);
  }
});

const PersonsNotificationsModel = mongoose.model('personNotifications', personNotificationsSchema);

/**
 * @typedef personNotificationsSchema
 */
module.exports = PersonsNotificationsModel;
const personsServices = require('../services/persons.services');
const pubSub = require('../utils/pubSub');
