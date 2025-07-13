const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/others/products/paymentController');
const authenticateJWT = require('../middlewares/security/authMiddleware');
const csrfProtection = require('../configs/security/csrfProtectionConfigs');

// Adicione um endpoint para verificar a configuração
router.get('/config', (req, res) => {
  res.json({
    mercadoPago: process.env.MERCADOPAGO_ACCESS_TOKEN ? 'Configurado' : 'Não configurado',
    environment: process.env.NODE_ENV
  });
});

router.post(
  '/create-preference',
  csrfProtection,
  authenticateJWT,
  paymentController.createPaymentPreference
);

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }), // Importante para webhooks
  paymentController.handleWebhook
);

module.exports = router;
