const {
  getWeeklyRevenueAndOrders,
  getAbandonedOrdersCount,
  getPeakOrderHour
} = require('../../../utils/others/statistics/dailyStatsService');
const ApiError = require('../../../utils/ApiError');

async function weeklyStatsMiddleware(req, res, next) {
  try {
    const [weeklyStats, abandonedCount, peakHour] = await Promise.all([
      getWeeklyRevenueAndOrders(),
      getAbandonedOrdersCount(),
      getPeakOrderHour()
    ]);

    res.locals.weeklyStats = {
      weeklyRevenue: weeklyStats.weeklyRevenue,
      weeklyOrderCount: weeklyStats.weeklyOrderCount,
      abandonedOrdersCount: abandonedCount,
      peakOrderHour: peakHour.hour,
      peakOrderCount: peakHour.count
    };

    next();
  } catch (error) {
    console.error('Error in weeklyStatsMiddleware:', error);
    next(new ApiError(500, 'Failed to gather weekly statistics'));
  }
}

module.exports = weeklyStatsMiddleware;
