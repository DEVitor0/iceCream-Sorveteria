const FinancialAnalyticsService = require('../../../utils/others/statistics/financialAnalyticsService');

class FinancialAnalyticsController {
  static async getRevenueByPeriod(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const data = await FinancialAnalyticsService.getRevenueByPeriod(startDate, endDate);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getRevenueTrend(req, res, next) {
    try {
      const { timeframe, startDate, endDate } = req.query;
      const data = await FinancialAnalyticsService.getRevenueTrend(timeframe, startDate, endDate);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getPaymentMethodAnalysis(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const data = await FinancialAnalyticsService.getPaymentMethodAnalysis(startDate, endDate);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getOrderConversionRate(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const data = await FinancialAnalyticsService.getOrderConversionRate(startDate, endDate);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getAverageOrderValue(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const data = await FinancialAnalyticsService.getAverageOrderValue(startDate, endDate);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getDiscountROI(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const data = await FinancialAnalyticsService.getDiscountROI(startDate, endDate);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FinancialAnalyticsController;
