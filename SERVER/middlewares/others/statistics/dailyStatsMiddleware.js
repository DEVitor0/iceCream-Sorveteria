const DailyStatistics = require('../../../model/dailyStatisticsModel');
const { updateDailyStats } = require('../../../utils/others/statistics/dailyStatsService')

async function dailyStatsMiddleware(req, res, next) {
  try {
    if (shouldLogRequest(req)) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const updatedStats = await DailyStatistics.findOneAndUpdate(
        { date: today },
        { $inc: { accessCount: 1 } },
        { upsert: true, new: true }
      );

      // Atualiza sempre, não apenas quando é novo
      await updateDailyStats();
    }
  } catch (error) {
    console.error('Error logging daily stats:', error);
  } finally {
    next();
  }
}

function shouldLogRequest(req) {
  return req.method === 'GET' &&
         !req.path.startsWith('/static') &&
         !req.path.startsWith('/uploads');
}

module.exports = dailyStatsMiddleware;
