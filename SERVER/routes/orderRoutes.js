const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/authMiddleware');
const csrfProtection = require('../configs/csrfProtectionConfigs');
const sanitizeMiddleware = require('../middlewares/sanitizeMiddleware');
const {
  getCompletedOrders,
  updateDeliveryStatus,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus
} = require('../controllers/orderController');

router.get('/completed', authenticateJWT, getCompletedOrders);
router.put('/:orderId/delivery-status', authenticateJWT, csrfProtection, updateDeliveryStatus);

router.get('/', authenticateJWT, getAllOrders);
router.get('/:id', authenticateJWT, getOrderDetails);
router.put('/:id/status', authenticateJWT, csrfProtection, sanitizeMiddleware, updateOrderStatus);

module.exports = router;
