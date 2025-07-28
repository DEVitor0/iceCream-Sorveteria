const express = require("express");
const router = express.Router();

const csrfProtection = require('./configs/security/csrfProtectionConfigs.js');
const ApiError = require('./utils/ApiError.js');

const { twoFALogin, validateTwoFACode } = require('./controllers/validation/twoFAController.js');
const { getAllTags } = require('./controllers/others/products/tagController.js');
const { forceUpdateDailyStats } = require('./controllers/others/statistics/dailyStatsController.js')

const sanitizeMiddleware = require('./middlewares/security/sanitizeMiddleware.js');
const validateLoginMiddleware = require('./middlewares/security/joiValidatorMiddleware');
const geoRestrictionMiddleware = require('./middlewares/security/geoRestrictionMiddleware.js');
const dailyStatsMiddleware = require('./middlewares/others/statistics/dailyStatsMiddleware.js');
const authenticateJWT = require('./middlewares/security/authMiddleware.js');
const weeklyStatsMiddleware = require('./middlewares/others/statistics/weeklyStatsMiddleware.js');

const authenticationRoutes = require('./routes/authenticationRoutes');
const productRoutes = require('./routes/productRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const loadProducts = require('./routes/loadProducts');
const googleAuthRoutes = require('./routes/googleAuthRoutes');
const addressRoutes = require('./routes/addressRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const geoRoutes = require('./routes/geoRoutes');
const couponRoutes = require('./routes/couponRoutes');
const dailyStatsRoutes = require('./routes/dailyStatsRoutes');
const stockAlertRoutes = require('./routes/stockAlertRoutes');
const emailRoutes = require('./routes/emailRoutes');
const clientAdminRoutes = require('./routes/clientAdminRoutes');
const financialAnalyticsRoutes = require('./routes/financialAnalyticsRoutes');
const salesAnalyticsRoutes = require('./routes/salesAnalyticsRoutes');
const couponAnalyticsRoutes = require('./routes/couponAnalyticsRoutes');

router.use('/api', stockAlertRoutes);

router.get("/csrf-token", (req, res) => {
  console.log('Cookies recebidos:', req.cookies);
  console.log('CSRF Token gerado:', req.csrfToken());
  res.json({ csrfToken: req.csrfToken() });
});

router.use(dailyStatsMiddleware);

router.use('/api', loadProducts);
router.use('/api', require('./routes/productRoutes.js'));
router.use('/api', geoRoutes);
router.use('/api/emails', emailRoutes);
router.use('/api/orders', authenticateJWT, require('./routes/orderRoutes'));
router.use('/api/Dashboard', authenticateJWT, productRoutes);
router.use('/api/analytics/financial', financialAnalyticsRoutes);
router.use('/api/analytics/sales', salesAnalyticsRoutes);
router.use('/api/analytics/coupons', couponAnalyticsRoutes);
router.use('/api/stats/daily', authenticateJWT, dailyStatsRoutes);
router.use('/api/admin', clientAdminRoutes);

router.use('/auth', googleAuthRoutes);
router.get('/auth/verify', geoRestrictionMiddleware, authenticateJWT, (req, res) => {
  res.status(200).json({ valid: true });
});

router.get('/force-update', authenticateJWT, forceUpdateDailyStats);
router.use('/address/', authenticateJWT, addressRoutes);

router.post('/login', sanitizeMiddleware, csrfProtection, validateLoginMiddleware, twoFALogin);
router.post('/validate-2fa', sanitizeMiddleware, csrfProtection, validateTwoFACode);
router.use('/authentication', sanitizeMiddleware, csrfProtection, authenticationRoutes);

router.use('/Dashboard', authenticateJWT, productRoutes);
router.use('/Dashboard', authenticateJWT, dashboardRoutes);

router.get('/tags', getAllTags);
router.use('/coupons', authenticateJWT, couponRoutes);

router.use('/payment', paymentRoutes);

router.get('/api/stats/weekly-summary',
  authenticateJWT,
  weeklyStatsMiddleware,
  (req, res) => {
    res.json({
      success: true,
      data: res.locals.weeklyStats
    });
  }
);

router.get('/api/stats/weekly-orders', authenticateJWT, async (req, res, next) => {
  try {
    const { getWeeklyOrderStats } = require('./utils/others/statistics/dailyStatsService.js');
    const stats = await getWeeklyOrderStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

router.get('/api/stats/top-categories-yearly',
  authenticateJWT,
  async (req, res, next) => {
    try {
      const { getTopCategoriesYearly } = require('./utils/others/statistics/dailyStatsService.js');
      const data = await getTopCategoriesYearly();
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }
);

router.use((err, req, res, next) => {
  console.error('Erro:', {
      message: err.message,
      stack: err.stack,
      status: err.statusCode
  });

  if (err instanceof ApiError) {
      return res.status(err.statusCode).json({
          success: false,
          message: err.message.split('\n')[0].trim()
      });
  }

  res.status(500).json({
      success: false,
      message: 'Ocorreu um erro inesperado'
  });
});

module.exports = router;
