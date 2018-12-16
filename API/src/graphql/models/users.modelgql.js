const mongoose = require('mongoose');
const PersonSchema = require('./persons.modelgql');

/**
 * User Schema (hérite du contenu du schéma 'persons')
 */
const options = {
  discriminatorKey: 'kind',
  toObject: { virtuals: true }
};
const userSchema = new mongoose.Schema(
  {}, options
);

/**
 * @typedef User
 */

module.exports = PersonSchema.discriminator('users', userSchema);
