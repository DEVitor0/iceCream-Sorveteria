const express = require('express');
const router = express.Router();
const FinancialAnalyticsController = require('../controllers/others/statistics/financialAnalyticsController');
const authenticateJWT = require('../middlewares/security/authMiddleware');
const csrfProtection = require('../configs/security/csrfProtectionConfigs');
const sanitizeMiddleware = require('../middlewares/security/sanitizeMiddleware');
const { limiter } = require('../configs/security/rateLimiterConfig'); // Importação corrigida

// Middlewares globais
router.use(authenticateJWT);
router.use(sanitizeMiddleware);
router.use(csrfProtection);

// Rotas
router.get('/revenue-by-period', (req, res, next) =>
  FinancialAnalyticsController.getRevenueByPeriod(req, res, next));

router.get('/revenue-trend', limiter, (req, res, next) =>
  FinancialAnalyticsController.getRevenueTrend(req, res, next));

router.get('/payment-methods', limiter, (req, res, next) =>
  FinancialAnalyticsController.getPaymentMethodAnalysis(req, res, next));

router.get('/conversion-rate', (req, res, next) =>
  FinancialAnalyticsController.getOrderConversionRate(req, res, next));

router.get('/average-order-value', (req, res, next) =>
  FinancialAnalyticsController.getAverageOrderValue(req, res, next));

router.get('/discount-roi', (req, res, next) =>
  FinancialAnalyticsController.getDiscountROI(req, res, next));

module.exports = router;
