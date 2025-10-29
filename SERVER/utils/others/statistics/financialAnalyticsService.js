const Order = require('../../../model/orderModel');

class FinancialAnalyticsService {
  // Receita total por período
  static async getRevenueByPeriod(startDate, endDate) {
    const orders = await Order.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    return orders.length > 0 ? orders[0] : { totalRevenue: 0, count: 0 };
  }

  // Receita diária/mensal/anual
  static async getRevenueTrend(timeframe, startDate, endDate) {
    let groupBy;
    switch (timeframe) {
      case 'daily':
        groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
        break;
      case 'monthly':
        groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
        break;
      case 'yearly':
        groupBy = { $dateToString: { format: '%Y', date: '$createdAt' } };
        break;
      default:
        throw new Error('Timeframe inválido. Use daily, monthly ou yearly.');
    }

    return Order.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }

  // Métodos de pagamento mais utilizados
  static async getPaymentMethodAnalysis(startDate, endDate) {
    return Order.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: '$payment.paymentMethod',
          totalAmount: { $sum: '$totalAmount' },
          count: { $sum: 1 },
          averageValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);
  }

  // Taxa de conversão de pedidos (completos vs. cancelados)
  static async getOrderConversionRate(startDate, endDate) {
    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalOrders = result.reduce((sum, item) => sum + item.count, 0);
    const completedOrders = result.find(item => item._id === 'completed')?.count || 0;

    return {
      totalOrders,
      completedOrders,
      conversionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
    };
  }

  // Valor médio do pedido (AOV)
  static async getAverageOrderValue(startDate, endDate) {
    const result = await Order.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: null,
          averageValue: { $avg: '$totalAmount' },
          minValue: { $min: '$totalAmount' },
          maxValue: { $max: '$totalAmount' },
          medianValue: { $push: '$totalAmount' }
        }
      }
    ]);

    if (result.length === 0) {
      return {
        averageValue: 0,
        minValue: 0,
        maxValue: 0,
        medianValue: 0
      };
    }

    // Calcular mediana
    const values = result[0].medianValue.sort((a, b) => a - b);
    const mid = Math.floor(values.length / 2);
    const median = values.length % 2 !== 0
      ? values[mid]
      : (values[mid - 1] + values[mid]) / 2;

    return {
      averageValue: result[0].averageValue,
      minValue: result[0].minValue,
      maxValue: result[0].maxValue,
      medianValue: median
    };
  }

  // Retorno sobre descontos (ROI)
  static async getDiscountROI(startDate, endDate) {
    const result = await Order.aggregate([
      {
        $match: {
          status: 'completed',
          discountApplied: { $gt: 0 },
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: null,
          totalDiscount: { $sum: '$discountApplied' },
          totalRevenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
          potentialRevenue: { $sum: { $add: ['$totalAmount', '$discountApplied'] } }
        }
      }
    ]);

    if (result.length === 0) {
      return {
        totalDiscount: 0,
        totalRevenue: 0,
        potentialRevenue: 0,
        roi: 0,
        orderCount: 0
      };
    }

    const { totalDiscount, totalRevenue, potentialRevenue, orderCount } = result[0];
    const roi = totalDiscount > 0
      ? ((totalRevenue - (potentialRevenue - totalRevenue)) / totalDiscount) * 100
      : 0;

    return {
      totalDiscount,
      totalRevenue,
      potentialRevenue,
      roi,
      orderCount,
      averageDiscount: totalDiscount / orderCount
    };
  }
}

module.exports = FinancialAnalyticsService;
