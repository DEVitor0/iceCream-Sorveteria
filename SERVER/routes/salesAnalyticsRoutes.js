const express = require('express');
const router = express.Router();
const SalesAnalyticsController = require('../controllers/others/statistics/salesAnalyticsController');
const authenticateJWT = require('../middlewares/security/authMiddleware');
const csrfProtection = require('../configs/security/csrfProtectionConfigs');
const sanitizeMiddleware = require('../middlewares/security/sanitizeMiddleware');

// Middlewares globais
router.use(authenticateJWT);
router.use(sanitizeMiddleware);
router.use(csrfProtection);

// Rotas
router.get('/top-products', (req, res, next) =>
  SalesAnalyticsController.getTopSellingProducts(req, res, next));

router.get('/by-category', (req, res, next) =>
  SalesAnalyticsController.getSalesByCategory(req, res, next));

router.get('/by-hour', (req, res, next) =>
  SalesAnalyticsController.getSalesByHour(req, res, next));

router.get('/top-customers', (req, res, next) =>
  SalesAnalyticsController.getTopCustomers(req, res, next));

router.get('/customer-retention', (req, res, next) =>
  SalesAnalyticsController.getCustomerRetention(req, res, next));

router.get('/seasonal', (req, res, next) =>
  SalesAnalyticsController.getSeasonalSales(req, res, next));

module.exports = router;
