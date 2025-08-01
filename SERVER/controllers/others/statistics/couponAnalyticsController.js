const CouponAnalyticsService = require('../../../utils/others/statistics/couponAnalyticsService');

class CouponAnalyticsController {
  static async getCouponEffectiveness(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const data = await CouponAnalyticsService.getCouponEffectiveness(startDate, endDate);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getTopCoupons(req, res, next) {
    try {
      const { startDate, endDate, limit } = req.query;
      const data = await CouponAnalyticsService.getTopCoupons(
        startDate,
        endDate,
        parseInt(limit) || 5
      );
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getCouponStatistics(req, res, next) {
    try {
      const data = await CouponAnalyticsService.getCouponStatistics();
      res.json({ success: true, data: data[0] || {} });
    } catch (error) {
      next(error);
    }
  }

  static async getCouponImpactOnAOV(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const data = await CouponAnalyticsService.getCouponImpactOnAOV(startDate, endDate);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CouponAnalyticsController;
