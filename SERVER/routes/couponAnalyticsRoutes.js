const express = require('express');
const router = express.Router();
const CouponAnalyticsController = require('../controllers/others/statistics/couponAnalyticsController');
const authenticateJWT = require('../middlewares/security/authMiddleware');
const csrfProtection = require('../configs/security/csrfProtectionConfigs');
const sanitizeMiddleware = require('../middlewares/security/sanitizeMiddleware');

// Middlewares globais
router.use(authenticateJWT);
router.use(sanitizeMiddleware);
router.use(csrfProtection);

// Rotas
router.get('/effectiveness', (req, res, next) =>
  CouponAnalyticsController.getCouponEffectiveness(req, res, next));

router.get('/top-coupons', (req, res, next) =>
  CouponAnalyticsController.getTopCoupons(req, res, next));

router.get('/statistics', (req, res, next) =>
  CouponAnalyticsController.getCouponStatistics(req, res, next));

router.get('/impact-aov', (req, res, next) =>
  CouponAnalyticsController.getCouponImpactOnAOV(req, res, next));

module.exports = router;
