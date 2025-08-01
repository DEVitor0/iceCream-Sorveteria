const Coupon = require('../../../model/couponModel');
const Order = require('../../../model/orderModel');

class CouponAnalyticsService {
  static async getCouponEffectiveness(startDate, endDate) {
    const couponOrders = await Order.aggregate([
      {
        $match: {
          status: 'completed',
          couponCode: { $exists: true, $ne: null },
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: '$couponCode',
          totalRevenue: { $sum: '$totalAmount' },
          totalDiscount: { $sum: '$discountApplied' },
          orderCount: { $sum: 1 },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    // Pedidos sem cupom
    const nonCouponOrders = await Order.aggregate([
      {
        $match: {
          status: 'completed',
          couponCode: { $exists: false },
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    return {
      couponOrders,
      nonCouponOrders: nonCouponOrders[0] || {
        totalRevenue: 0,
        orderCount: 0,
        averageOrderValue: 0
      }
    };
  }

  static async getTopCoupons(startDate, endDate, limit = 5) {
    return Order.aggregate([
      {
        $match: {
          status: 'completed',
          couponCode: { $exists: true, $ne: null },
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: '$couponCode',
          totalDiscount: { $sum: '$discountApplied' },
          orderCount: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { orderCount: -1 } },
      { $limit: limit }
    ]);
  }

  static async getCouponStatistics() {
    return Coupon.aggregate([
      {
        $group: {
          _id: null,
          totalCoupons: { $sum: 1 },
          activeCoupons: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ['$isActive', true] },
                  { $gt: ['$expirationDate', new Date()] },
                  { $lt: ['$currentUses', '$maxUses'] }
                ]},
                1,
                0
              ]
            }
          },
          expiredCoupons: {
            $sum: {
              $cond: [
                { $lt: ['$expirationDate', new Date()] },
                1,
                0
              ]
            }
          },
          usedCoupons: {
            $sum: {
              $cond: [
                { $gte: ['$currentUses', '$maxUses'] },
                1,
                0
              ]
            }
          },
          totalUses: { $sum: '$currentUses' },
          totalDiscountGiven: { $sum: '$discountValue' }
        }
      }
    ]);
  }

  static async getCouponImpactOnAOV(startDate, endDate) {
    const [withCoupon, withoutCoupon] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            status: 'completed',
            couponCode: { $exists: true, $ne: null },
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
          }
        },
        {
          $group: {
            _id: null,
            averageOrderValue: { $avg: '$totalAmount' },
            orderCount: { $sum: 1 }
          }
        }
      ]),
      Order.aggregate([
        {
          $match: {
            status: 'completed',
            couponCode: { $exists: false },
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
          }
        },
        {
          $group: {
            _id: null,
            averageOrderValue: { $avg: '$totalAmount' },
            orderCount: { $sum: 1 }
          }
        }
      ])
    ]);

    return {
      withCoupon: withCoupon[0] || { averageOrderValue: 0, orderCount: 0 },
      withoutCoupon: withoutCoupon[0] || { averageOrderValue: 0, orderCount: 0 },
      difference: withCoupon[0] && withoutCoupon[0]
        ? withCoupon[0].averageOrderValue - withoutCoupon[0].averageOrderValue
        : 0
    };
  }
}

module.exports = CouponAnalyticsService;
