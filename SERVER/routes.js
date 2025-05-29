const express = require("express");
const router = express.Router();
const sanitizeMiddleware = require('./middlewares/sanitizeMiddleware');
const csrfProtection = require('./configs/csrfProtectionConfigs');
const authenticateJWT = require('./middlewares/authMiddleware');
const validateLoginMiddleware = require('./middlewares/joiValidatorMiddleware');
const geoRestrictionMiddleware = require('./middlewares/geoRestrictionMiddleware.js');
const { twoFALogin, validateTwoFACode } = require('./controllers/twoFAController');
const { getAllTags } = require('./controllers/tagController');
const geoRoutes = require('./routes/geoRoutes');
const couponRoutes = require('./routes/couponRoutes');
const ApiError = require('./utils/ApiError.js');

const authenticationRoutes = require('./routes/authenticationRoutes');
const productRoutes = require('./routes/productRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const loadProducts = require('./routes/loadProducts');
const googleAuthRoutes = require('./routes/googleAuthRoutes');
const addressRoutes = require('./routes/addressRoutes');

router.get("/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

router.use('/coupons', authenticateJWT, couponRoutes);

router.use('/api', loadProducts);
router.use('/api/Dashboard', authenticateJWT, productRoutes);
router.use('/api', require('./routes/productRoutes.js'));
router.use('/api', geoRoutes);

router.use('/auth', googleAuthRoutes);
router.get('/auth/verify', geoRestrictionMiddleware, authenticateJWT, (req, res) => {
  res.status(200).json({ valid: true });
});

router.post('/login', sanitizeMiddleware, csrfProtection, validateLoginMiddleware, twoFALogin);

router.use('/address', authenticateJWT, addressRoutes);

router.post('/validate-2fa', sanitizeMiddleware, csrfProtection, validateTwoFACode);

router.use('/authentication', sanitizeMiddleware, csrfProtection, authenticationRoutes);

router.use('/Dashboard', authenticateJWT, productRoutes);
router.use('/Dashboard', authenticateJWT, dashboardRoutes);

router.get('/tags', getAllTags);

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
