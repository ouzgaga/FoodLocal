const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

/**
 * DailySchedule Schema
 */
const dailySchedule = new mongoose.Schema(
  {
    id     : {
      type    : Number,
      required: true
    },
    weekday: {
      type    : String,
      required: true
    },
    openingHourAM: {
      type    : Date,
      required: true
    },
    openingHourPM: {
      type    : String,
      required: true
    },
    closingHourAM: {
      type    : Date,
      required: true
    },
    closingHourPM: {
      type    : String,
      required: true
    }
  }
);

/**
 * SalesPoint Schema
 */
const salesPointSchema = new mongoose.Schema(
  {
    id         : {
      type    : Number,
      required: true
    },
    name       : {
      type    : String,
      required: true
    },
    description: {
      type    : String,
      required: true
    },
    type       : {
      type    : String,
      required: true
    },
    address    : {
      number    : {
        type    : String,
        required: true
      },
      street    : {
        type    : String,
        required: false
      },
      city      : {
        type    : String,
        required: false
      },
      postalCode: {
        type    : String,
        required: false
      },
      country   : {
        type    : String,
        required: false
      },
      longitude : {
        type    : String,
        required: false
      },
      latitude  : {
        type    : String,
        required: false
      }
    },
    schedule   : {
      type    : [dailySchedule],
      minItems: 1,
      maxItems: 7,
      required: false
    }
  });

/**
 * Methods
 */
salesPointSchema.method({});

/**
 * Statics
 */
salesPointSchema.statics = {
  /**
   * Get salesPoint
   * @param {ObjectId} id - The objectId of salesPoint.
   * @returns {Promise<SalesPoint, APIError>}
   */
  get (id) {
    return this.findById(id).exec().then((salesPoint) => {
      if (salesPoint) {
        return salesPoint;
      }
      const err = new APIError('No such salesPoint exists!',
                               httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },

  /**
   * List all salesPoints in descending order of id.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<SalesPoint[]>}
   */
  list ({skip = 0, limit = 50} = {}) {
    return this.find().sort({createdAt: -1}).skip(+skip).limit(+limit).exec();
  }
};

/**
 * @typedef SalesPoint
 */
module.exports = mongoose.model('SalesPoint', salesPointSchema);
