const mongoose = require('mongoose');

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
    longitude: {
      type: mongoose.Schema.Types.Number,
      required: true
    },
    latitude: {
      type: mongoose.Schema.Types.Number,
      required: true
    }
  }
);

/**
 * DaySchedule Schema
 */
const dayScheduleSchema = new mongoose.Schema(
  {
    openingHour: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    closingHour: {
      type: mongoose.Schema.Types.String,
      required: true
    }
  }
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
  }
);

/**
 * salesPoint Schema
 */
const salesPointSchema = new mongoose.Schema(
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
  }
);

/**
 * @typedef salespoints
 */

module.exports = mongoose.model('salespoints', salesPointSchema);
