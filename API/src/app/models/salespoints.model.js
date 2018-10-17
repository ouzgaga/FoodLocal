const mongoose = require('mongoose');

/**
 * DailySchedule Schema
 */
const dailySchedule = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    weekday: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    openingHourAM: {
      type: mongoose.Schema.Types.Date,
      required: true
    },
    openingHourPM: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    closingHourAM: {
      type: mongoose.Schema.Types.Date,
      required: true
    },
    closingHourPM: {
      type: mongoose.Schema.Types.String,
      required: true
    }
  }
);

/**
 * salesPoint Schema
 */
const salesPointSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    name: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    description: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    type: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    address: {
      number: {
        type: mongoose.Schema.Types.String,
        required: true
      },
      street: {
        type: mongoose.Schema.Types.String,
        required: false
      },
      city: {
        type: mongoose.Schema.Types.String,
        required: false
      },
      postalCode: {
        type: mongoose.Schema.Types.String,
        required: false
      },
      country: {
        type: mongoose.Schema.Types.String,
        required: false
      },
      longitude: {
        type: mongoose.Schema.Types.String,
        required: false
      },
      latitude: {
        type: mongoose.Schema.Types.String,
        required: false
      }
    },
    schedule: {
      type: [dailySchedule],
      minItems: 1,
      maxItems: 7,
      required: false
    },
    producers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Producers' }]
  }
);

/**
 * @typedef Producer
 */
mongoose.model('salespoints', salesPointSchema);
