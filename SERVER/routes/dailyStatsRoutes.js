const express = require('express');
const router = express.Router();
const { getDailyStatistics } = require('../controllers/others/statistics/dailyStatsController');
const authenticateJWT = require('../middlewares/security/authMiddleware');

/**
 * @swagger
 * /api/stats/daily:
 *   get:
 *     summary: Obtém todas as estatísticas diárias com comparação percentual
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
 *         description: Data no formato YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Estatísticas diárias com comparação percentual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   format: date
 *                 revenue:
 *                   type: number
 *                 profit:
 *                   type: number
 *                 newUsers:
 *                   type: number
 *                 accessCount:
 *                   type: number
 *                 orderCount:
 *                   type: number
 *                 profitMargin:
 *                   type: number
 *                 itemsSold:
 *                   type: number
 *                 percentages:
 *                   type: object
 *                   properties:
 *                     revenue:
 *                       type: number
 *                       description: Variação percentual do faturamento em relação ao dia anterior
 *                     profit:
 *                       type: number
 *                       description: Variação percentual do lucro em relação ao dia anterior
 *                     newUsers:
 *                       type: number
 *                       description: Variação percentual de novos usuários em relação ao dia anterior
 *                     accessCount:
 *                       type: number
 *                       description: Variação percentual de acessos em relação ao dia anterior
 *       400:
 *         description: Data inválida ou não fornecida
 *       500:
 *         description: Erro ao obter estatísticas
 */

/**
 * @swagger
 * /api/stats/top-categories-yearly:
 *   get:
 *     summary: Obtém as 3 categorias mais persistentes ao longo do ano
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados das categorias mais vendidas no último ano
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     labels:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Nomes dos meses (últimos 12)
 *                     datasets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           label:
 *                             type: string
 *                             description: Nome da categoria
 *                           data:
 *                             type: array
 *                             items:
 *                               type: number
 *                             description: Quantidade vendida por mês
 *       500:
 *         description: Erro ao calcular estatísticas
 */

router.get('/', authenticateJWT, getDailyStatistics);

module.exports = router;
