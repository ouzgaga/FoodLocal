const mongoose = require('mongoose');

const options = {
  toObject: { virtuals: true }
};

/**
 * Address Schema
 */
const addressSchema = new mongoose.Schema(
  {
    number: {
      type: mongoose.Schema.Types.String,
      required: false
    },
    street: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    city: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    postalCode: {
      type: mongoose.Schema.Types.Number,
      required: true
    },
    state: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    country: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
    /*
    longitude: {
      type: mongoose.Schema.Types.Number,
      min: -180,
      max: 180,
      required: true
    },
    latitude: {
      type: mongoose.Schema.Types.Number,
      min: -90,
      max: 90,
      required: true
    }
    */
  }, options
);

addressSchema.index({ location: '2dsphere' });

/**
 * DaySchedule Schema
 */
const dayScheduleSchema = new mongoose.Schema(
  {
    // fixme: il faudrait checker que les heures sont valides...
    openingHour: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    closingHour: {
      type: mongoose.Schema.Types.String,
      required: true
    }
  }, options
);

/**
 * Schedule Schema
 */
const scheduleSchema = new mongoose.Schema(
  {
    monday: {
      type: [dayScheduleSchema],
      maxItems: 2,
      required: true
    },
    tuesday: {
      type: [dayScheduleSchema],
      maxItems: 2,
      required: true
    },
    wednesday: {
      type: [dayScheduleSchema],
      maxItems: 2,
      required: true
    },
    thursday: {
      type: [dayScheduleSchema],
      maxItems: 2,
      required: true
    },
    friday: {
      type: [dayScheduleSchema],
      maxItems: 2,
      required: true
    },
    saturday: {
      type: [dayScheduleSchema],
      maxItems: 2,
      required: true
    },
    sunday: {
      type: [dayScheduleSchema],
      maxItems: 2,
      required: true
    }
  }, options
);

/**
 * salespoint Schema
 */
const salespointSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    address: {
      type: addressSchema,
      required: false
    },
    schedule: {
      type: scheduleSchema,
      required: false
    }
  }, options
);

/**
 * @typedef salespoints
 */

module.exports = {
  SalespointsModel: mongoose.model('salespoints', salespointSchema),
  addressSchema
};
