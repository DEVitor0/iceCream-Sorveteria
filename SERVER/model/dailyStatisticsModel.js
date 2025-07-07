const mongoose = require('mongoose');

const dailyStatisticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
    default: Date.now
  },
  revenue: {
    type: Number,
    default: 0
  },
  profit: {
    type: Number,
    default: 0
  },
  newUsers: {
    type: Number,
    default: 0
  },
  accessCount: {
    type: Number,
    default: 0
  },
  orderCount: {
    type: Number,
    default: 0
  },
  profitMargin: {
    type: Number,
    default: 0
  },
  itemsSold: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

dailyStatisticsSchema.index({ date: 1 });

module.exports = mongoose.model('DailyStatistics', dailyStatisticsSchema);
