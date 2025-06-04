const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticateJWT = require('../middlewares/authMiddleware');
const csrfProtection = require('../configs/csrfProtectionConfigs');

router.post(
  '/create-preference',
  csrfProtection,
  authenticateJWT,
  paymentController.createPaymentPreference
);

router.post(
  '/webhook',
  paymentController.handleWebhook
);

module.exports = router;
