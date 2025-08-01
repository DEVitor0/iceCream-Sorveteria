const Order = require('../../../model/orderModel');
const mongoose = require('mongoose');

class SalesAnalyticsService {
  // Produtos mais vendidos
  static async getTopSellingProducts(startDate, endDate, limit = 10) {
    return Order.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          name: { $first: '$items.name' },
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.unitPrice'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: limit }
    ]);
  }

  // Vendas por categoria (assumindo que productModel tem categoria)
  static async getSalesByCategory(startDate, endDate) {
    return Order.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.unitPrice'] } }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);
  }

  // Padrão de vendas por hora do dia
  static async getSalesByHour(startDate, endDate) {
    return Order.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
  }

  // Clientes que mais compram (RFM analysis)
  static async getTopCustomers(startDate, endDate, limit = 10) {
    return Order.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: '$userId',
          totalSpent: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
          lastPurchaseDate: { $max: '$createdAt' }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: limit }
    ]);
  }

  // Taxa de retenção de clientes
  static async getCustomerRetention(startDate, endDate) {
    const periodStart = new Date(startDate);
    const periodEnd = new Date(endDate);

    // Encontrar todos os clientes únicos no período
    const uniqueCustomers = await Order.distinct('userId', {
      status: 'completed',
      createdAt: { $gte: periodStart, $lte: periodEnd }
    });

    // Para cada cliente, verificar se fez compra no período anterior
    const retentionAnalysis = await Promise.all(
      uniqueCustomers.map(async userId => {
        const previousPeriodStart = new Date(periodStart);
        previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);
        const previousPeriodEnd = new Date(periodStart);

        const hadPreviousOrder = await Order.exists({
          userId,
          status: 'completed',
          createdAt: { $gte: previousPeriodStart, $lt: previousPeriodEnd }
        });

        return {
          userId,
          isReturning: hadPreviousOrder
        };
      })
    );

    const returningCustomers = retentionAnalysis.filter(c => c.isReturning).length;
    const retentionRate = uniqueCustomers.length > 0
      ? (returningCustomers / uniqueCustomers.length) * 100
      : 0;

    return {
      totalCustomers: uniqueCustomers.length,
      returningCustomers,
      retentionRate,
      newCustomers: uniqueCustomers.length - returningCustomers
    };
  }

  // Vendas sazonais (por mês/estação)
  static async getSeasonalSales(startYear, endYear) {
    return Order.aggregate([
      {
        $match: {
          status: 'completed',
          $expr: {
            $and: [
              { $gte: [{ $year: '$createdAt' }, startYear] },
              { $lte: [{ $year: '$createdAt' }, endYear] }
            ]
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalRevenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
  }
}

module.exports = SalesAnalyticsService;
