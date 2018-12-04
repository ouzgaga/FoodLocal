const mongoose = require('mongoose');

/**
 * User Schema
 */
const options = { discriminatorKey: 'kind' };

const userSchema = new mongoose.Schema(
  {
    firstname     : {
      type    : mongoose.Schema.Types.String,
      required: true
    },
    lastname      : {
      type    : mongoose.Schema.Types.String,
      required: true
    },
    email         : {
      type    : mongoose.Schema.Types.String,
      required: true
    },
    password      : {
      type    : mongoose.Schema.Types.String,
      required: true
    },
    // l'image doit être encodée en base64
    image         : {
      type    : mongoose.Schema.Types.String,
      required: false
    },
    subscriptions : {
      type    : [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'producers'
        }
      ],
      required: true
    },
    emailValidated: {
      type    : mongoose.Schema.Types.Boolean,
      required: true
    }
  }, options
);
// FIXME: C'est normal que le 'kind' n'apparaisse dans la DB que pour les producers mais pas pour les users ?

/**
 * @typedef Producer
 */

module.exports = mongoose.model('users', userSchema);
