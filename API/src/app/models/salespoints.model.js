const mongoose = require('mongoose');

/**
 * Address Schema
 */
const addressSchema = new mongoose.Schema(
  {
    number    : {
      type    : mongoose.Schema.Types.String,
      required: false
    },
    street    : {
      type    : mongoose.Schema.Types.String,
      required: true
    },
    city      : {
      type    : mongoose.Schema.Types.String,
      required: true
    },
    postalCode: {
      type    : mongoose.Schema.Types.Number,
      required: true
    },
    country   : {
      type    : mongoose.Schema.Types.String,
      required: true
    },
    longitude : {
      type    : mongoose.Schema.Types.Number,
      required: true
    },
    latitude  : {
      type    : mongoose.Schema.Types.Number,
      required: true
    }
  }
);

/**
 * DailySchedule Schema
 */
const dailyScheduleSchema = new mongoose.Schema(
  {
    id           : {
      type    : mongoose.Schema.Types.ObjectId,
      required: false
    },
    weekday      : {
      type    : mongoose.Schema.Types.String,
      required: true
    },
    openingHourAM: {
      type    : mongoose.Schema.Types.Date,
      required: true
    },
    openingHourPM: {
      type    : mongoose.Schema.Types.Date,
      required: false
    },
    closingHourAM: {
      type    : mongoose.Schema.Types.Date,
      required: false
    },
    closingHourPM: {
      type    : mongoose.Schema.Types.Date,
      required: true
    }
  }
);

/**
 * salesPoint Schema
 */
const salesPointSchema = new mongoose.Schema(
  {
    id         : {
      type: mongoose.Schema.Types.ObjectId
    },
    name       : {
      type    : mongoose.Schema.Types.String,
      required: true
    },
    description: {
      type    : mongoose.Schema.Types.String,
      required: true
    },
    type       : {
      type    : mongoose.Schema.Types.String,
      required: true
    },
    address    : {
      type    : addressSchema,
      required: false
    },
    schedule   : {
      type    : [dailyScheduleSchema],
      minItems: 1,
      maxItems: 7,
      required: false
    },
    producers  : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Producers' }]
  }
);

/**
 * @typedef salespoints
 */
mongoose.model('salespoints', salesPointSchema);
