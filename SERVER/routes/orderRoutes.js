const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/authMiddleware');
const csrfProtection = require('../configs/csrfProtectionConfigs');
const { getCompletedOrders, updateDeliveryStatus } = require('../controllers/orderController');

router.get('/completed', authenticateJWT, getCompletedOrders);

router.put('/:orderId/status', authenticateJWT, csrfProtection, updateDeliveryStatus);

module.exports = router;
