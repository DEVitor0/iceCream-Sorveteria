const { getDailyStats, updateDailyStats } = require('../../../utils/others/statistics/dailyStatsService');
const ApiError = require('../../../utils/ApiError');

async function getDailyStatistics(req, res, next) {
  try {
    const { date } = req.query;

    if (!date) {
      throw new ApiError(400, 'Date parameter is required');
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new ApiError(400, 'Invalid date format. Use YYYY-MM-DD');
    }

    const stats = await getDailyStats(date);

    const response = {
      date: stats.date,
      revenue: stats.revenue,
      profit: stats.profit,
      newUsers: stats.newUsers,
      accessCount: stats.accessCount,
      orderCount: stats.orderCount,
      profitMargin: stats.profitMargin,
      itemsSold: stats.itemsSold,
      percentages: {
        revenue: Math.round(stats.revenuePercentage),
        profit: Math.round(stats.profitPercentage),
        newUsers: Math.round(stats.newUsersPercentage),
        accessCount: Math.round(stats.accessCountPercentage)
      }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

const forceUpdateDailyStats = async (req, res, next) => {
  try {
    await updateDailyStats();
    const today = new Date().toISOString().split('T')[0];
    const stats = await getDailyStats(today);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDailyStatistics,
  forceUpdateDailyStats
};
