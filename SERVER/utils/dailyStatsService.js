const DailyStatistics = require('../model/dailyStatisticsModel');
const Order = require('../model/orderModel');
const User = require('../model/userModel');
const ApiError = require('./ApiError');

async function updateDailyStats() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // SEMPRE buscar os dados mais recentes, ignorando cache
    const [revenueResult, profitResult, newUsersCount, yesterdayStats] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            status: 'completed',
            createdAt: {
              $gte: today,
              $lt: tomorrow
            }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            orderCount: { $sum: 1 }
          }
        }
      ]),
      Order.aggregate([
        {
          $match: {
            status: 'completed',
            createdAt: {
              $gte: today,
              $lt: tomorrow
            }
          }
        },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'productDetails'
          }
        },
        { $unwind: '$productDetails' },
        {
          $group: {
            _id: null,
            totalProfit: {
              $sum: {
                $multiply: [
                  { $subtract: ['$items.unitPrice', '$productDetails.costPrice'] },
                  '$items.quantity'
                ]
              }
            },
            totalRevenue: { $sum: { $multiply: ['$items.unitPrice', '$items.quantity'] } },
            itemsSold: { $sum: '$items.quantity' }
          }
        }
      ]),
      User.countDocuments({
        createdAt: {
          $gte: today,
          $lt: tomorrow
        }
      }),
      DailyStatistics.findOne({ date: yesterday })
    ]);

    const revenueData = revenueResult[0] || { totalRevenue: 0, orderCount: 0 };
    const profitData = profitResult[0] || { totalProfit: 0, totalRevenue: 0, itemsSold: 0 };
    const profitMargin = profitData.totalRevenue > 0
      ? (profitData.totalProfit / profitData.totalRevenue) * 100
      : 0;

    const calculatePercentageChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const yesterdayRevenue = yesterdayStats?.revenue || 0;
    const yesterdayProfit = yesterdayStats?.profit || 0;
    const yesterdayNewUsers = yesterdayStats?.newUsers || 0;
    const yesterdayAccessCount = yesterdayStats?.accessCount || 0;

    const updatedStats = {
      revenue: revenueData.totalRevenue,
      profit: profitData.totalProfit,
      newUsers: newUsersCount,
      orderCount: revenueData.orderCount,
      profitMargin: parseFloat(profitMargin.toFixed(2)),
      itemsSold: profitData.itemsSold,
      revenuePercentage: calculatePercentageChange(revenueData.totalRevenue, yesterdayRevenue),
      profitPercentage: calculatePercentageChange(profitData.totalProfit, yesterdayProfit),
      newUsersPercentage: calculatePercentageChange(newUsersCount, yesterdayNewUsers),
      accessCountPercentage: calculatePercentageChange(
        (await DailyStatistics.findOne({ date: today }))?.accessCount || 0,
        yesterdayAccessCount
      )
    };

    await DailyStatistics.findOneAndUpdate(
      { date: today },
      updatedStats,
      { upsert: true, new: true }
    );

    return true;
  } catch (error) {
    console.error('Error updating daily stats:', error);
    throw new ApiError(500, 'Failed to update daily stats');
  }
}

async function getDailyStats(date) {
  try {
    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const previousDate = new Date(queryDate);
    previousDate.setDate(previousDate.getDate() - 1);

    const [currentStats, previousStats] = await Promise.all([
      DailyStatistics.findOne({ date: queryDate }),
      DailyStatistics.findOne({ date: previousDate })
    ]);

    const defaultStats = {
      revenue: 0,
      profit: 0,
      newUsers: 0,
      accessCount: 0,
      orderCount: 0,
      profitMargin: 0,
      itemsSold: 0
    };

    const current = currentStats || { ...defaultStats, date: queryDate };
    const previous = previousStats || defaultStats;

    const calculatePercentageChange = (currentVal, previousVal) => {
      if (previousVal === 0) return currentVal > 0 ? 100 : 0;
      return ((currentVal - previousVal) / previousVal) * 100;
    };

    return {
      ...current.toObject ? current.toObject() : current,
      revenuePercentage: calculatePercentageChange(current.revenue, previous.revenue),
      profitPercentage: calculatePercentageChange(current.profit, previous.profit),
      newUsersPercentage: calculatePercentageChange(current.newUsers, previous.newUsers),
      accessCountPercentage: calculatePercentageChange(current.accessCount, previous.accessCount),
    };
  } catch (error) {
    console.error('Error getting daily stats:', error);
    throw new ApiError(500, 'Failed to get daily stats');
  }
}

async function getWeeklyOrderStats() {
  try {
    // Calcula a data de 7 dias atrás
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const result = await Order.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          count: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" }
        }
      },
      {
        $project: {
          dayOfWeek: "$_id",
          count: 1,
          totalRevenue: 1,
          _id: 0
        }
      }
    ]);

    // Mapeia os dias da semana (1=Domingo, 2=Segunda,..., 7=Sábado)
    const daysMap = {
      1: { name: 'Domingo', count: 0, totalRevenue: 0 },
      2: { name: 'Segunda', count: 0, totalRevenue: 0 },
      3: { name: 'Terça', count: 0, totalRevenue: 0 },
      4: { name: 'Quarta', count: 0, totalRevenue: 0 },
      5: { name: 'Quinta', count: 0, totalRevenue: 0 },
      6: { name: 'Sexta', count: 0, totalRevenue: 0 },
      7: { name: 'Sábado', count: 0, totalRevenue: 0 }
    };

    // Preenche os dados encontrados
    result.forEach(day => {
      if (daysMap[day.dayOfWeek]) {
        daysMap[day.dayOfWeek].count = day.count;
        daysMap[day.dayOfWeek].totalRevenue = day.totalRevenue;
      }
    });

    // Converte para array na ordem Segunda->Domingo
    const weekDaysOrder = [2, 3, 4, 5, 6, 7, 1];
    const formattedResult = weekDaysOrder.map(dayNum => daysMap[dayNum]);

    return formattedResult;
  } catch (error) {
    console.error('Error getting weekly order stats:', error);
    throw new ApiError(500, 'Failed to get weekly order stats');
  }
}

/**
 * Calcula o faturamento semanal e total de pedidos
 * @returns {Object} { weeklyRevenue: Number, weeklyOrderCount: Number }
 */
async function getWeeklyRevenueAndOrders() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const result = await Order.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      }
    ]);

    return {
      weeklyRevenue: result[0]?.totalRevenue || 0,
      weeklyOrderCount: result[0]?.orderCount || 0
    };
  } catch (error) {
    console.error('Error calculating weekly revenue and orders:', error);
    throw new ApiError(500, 'Failed to calculate weekly stats');
  }
}

/**
 * Calcula a quantidade de desistências (pedidos pending há mais de 5 horas)
 * @returns {Number} Número de pedidos abandonados
 */
async function getAbandonedOrdersCount() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000);

    const count = await Order.countDocuments({
      status: 'pending',
      createdAt: {
        $gte: sevenDaysAgo,
        $lte: fiveHoursAgo
      }
    });

    return count;
  } catch (error) {
    console.error('Error calculating abandoned orders:', error);
    throw new ApiError(500, 'Failed to calculate abandoned orders');
  }
}

/**
 * Identifica o horário com mais pedidos nos últimos 7 dias
 * @returns {Object} { hour: Number, count: Number }
 */
async function getPeakOrderHour() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const result = await Order.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 1
      }
    ]);

    return {
      hour: result[0]?._id || 0,
      count: result[0]?.count || 0
    };
  } catch (error) {
    console.error('Error calculating peak order hour:', error);
    throw new ApiError(500, 'Failed to calculate peak order hour');
  }
}

// Adicione ao dailyStatsService.js

/**
 * Obtém as 3 categorias mais persistentes ao longo do ano
 * @returns {Object} { labels: Array, monthlyData: Array }
 */
async function getTopCategoriesYearly() {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    oneYearAgo.setHours(0, 0, 0, 0);

    // Primeiro, obtemos todas as categorias vendidas no último ano
    const allCategories = await Order.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: oneYearAgo }
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$productDetails.tag',
          totalSold: { $sum: '$items.quantity' },
          monthsPresent: {
            $addToSet: {
              $dateToString: { format: "%Y-%m", date: "$createdAt" }
            }
          }
        }
      },
      {
        $project: {
          category: '$_id',
          totalSold: 1,
          monthsPresentCount: { $size: '$monthsPresent' },
          monthsPresent: 1
        }
      },
      { $sort: { totalSold: -1 } }
    ]);

    if (allCategories.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Calcula o número total de meses no período
    const totalMonths = 12;

    // Filtra categorias que estiveram presentes em pelo menos 70% dos meses
    const persistentCategories = allCategories.filter(
      cat => (cat.monthsPresentCount / totalMonths) >= 0.7
    );

    // Se não houver categorias persistentes, pega as top 3 por vendas totais
    const topCategories = persistentCategories.length >= 3
      ? persistentCategories.slice(0, 3)
      : [
          ...persistentCategories,
          ...allCategories
            .filter(cat => !persistentCategories.some(pc => pc._id === cat._id))
            .slice(0, 3 - persistentCategories.length)
        ].slice(0, 3);

    // Ordena as categorias selecionadas por vendas totais
    topCategories.sort((a, b) => b.totalSold - a.totalSold);

    // Prepara os labels dos meses (últimos 12 meses)
    const monthLabels = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      return date.toISOString().split('T')[0].substring(0, 7); // Formato YYYY-MM
    });

    // Agora obtemos os dados mensais para cada categoria selecionada
    const monthlyData = await Promise.all(
      topCategories.map(async ({ _id: category }) => {
        const monthlySales = await Order.aggregate([
          {
            $match: {
              status: 'completed',
              createdAt: { $gte: oneYearAgo }
            }
          },
          { $unwind: '$items' },
          {
            $lookup: {
              from: 'products',
              localField: 'items.productId',
              foreignField: '_id',
              as: 'productDetails'
            }
          },
          { $unwind: '$productDetails' },
          {
            $match: {
              'productDetails.tag': category
            }
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m", date: "$createdAt" }
              },
              totalSold: { $sum: '$items.quantity' }
            }
          }
        ]);

        // Cria um mapa de vendas por mês para facilitar o acesso
        const salesMap = new Map();
        monthlySales.forEach(sale => {
          salesMap.set(sale._id, sale.totalSold);
        });

        // Preenche os dados para todos os meses, mesmo os sem vendas
        const data = monthLabels.map(month => {
          return salesMap.get(month) || 0;
        });

        return {
          category,
          data
        };
      })
    );

    // Prepara os datasets no formato esperado pelo gráfico
    const datasets = monthlyData.map(({ category, data }, index) => ({
      label: category,
      data: data,
      color: ['info', 'dark', 'success'][index]
    }));

    // Formata os labels dos meses para exibição (ex: "Jan", "Fev", etc.)
    const formattedLabels = monthLabels.map(month => {
      const [year, monthNum] = month.split('-');
      const date = new Date(year, monthNum - 1);
      return date.toLocaleDateString('pt-BR', { month: 'short' });
    });

    return {
      labels: formattedLabels,
      datasets
    };

  } catch (error) {
    console.error('Error getting yearly top categories:', error);
    throw new ApiError(500, 'Failed to get yearly top categories');
  }
}

module.exports = {
  updateDailyStats,
  getDailyStats,
  getWeeklyOrderStats,
  getWeeklyRevenueAndOrders,
  getAbandonedOrdersCount,
  getPeakOrderHour,
  getTopCategoriesYearly
};
