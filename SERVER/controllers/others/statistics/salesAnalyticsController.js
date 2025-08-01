const SalesAnalyticsService = require('../../../utils/others/statistics/salesAnalyticsService');

class SalesAnalyticsController {
  static async getTopSellingProducts(req, res, next) {
    try {
      const { startDate, endDate, limit } = req.query;
      const data = await SalesAnalyticsService.getTopSellingProducts(
        startDate,
        endDate,
        parseInt(limit) || 10
      );
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getSalesByCategory(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const data = await SalesAnalyticsService.getSalesByCategory(startDate, endDate);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getSalesByHour(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const data = await SalesAnalyticsService.getSalesByHour(startDate, endDate);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getTopCustomers(req, res, next) {
    try {
      const { startDate, endDate, limit } = req.query;
      const data = await SalesAnalyticsService.getTopCustomers(
        startDate,
        endDate,
        parseInt(limit) || 10
      );
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getCustomerRetention(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const data = await SalesAnalyticsService.getCustomerRetention(startDate, endDate);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getSeasonalSales(req, res, next) {
    try {
      const { startYear, endYear } = req.query;
      const data = await SalesAnalyticsService.getSeasonalSales(
        parseInt(startYear),
        parseInt(endYear)
      );
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SalesAnalyticsController;
