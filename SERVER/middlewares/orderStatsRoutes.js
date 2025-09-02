const express = require('express');
const router = express.Router();
const { getDailyRevenue } = require('../controllers/orderStatsController');
const authenticateJWT = require('../middlewares/authMiddleware');
const ApiError = require('../utils/ApiError');

/**
 * @swagger
 * /api/stats/revenue/daily:
 *   get:
 *     summary: pega faturamento diario
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Dados de faturamento diario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   format: date
 *                 totalRevenue:
 *                   type: number
 *                 orderCount:
 *                   type: integer
 *       400:
 *         description: data invalida ou nem fornecida
 *       500:
 *         description: erro ao calcular faturamento
 */
router.get('/revenue/daily', authenticateJWT, async (req, res, next) => {
  try {
    const { date } = req.query;

    if (!date) {
      throw new ApiError(400, 'Date parameter is required');
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new ApiError(400, 'Invalid date format. Use YYYY-MM-DD');
    }

    const revenueData = await getDailyRevenue(date);
    res.json(revenueData);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
