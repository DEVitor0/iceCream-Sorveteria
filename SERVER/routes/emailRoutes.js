const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/authMiddleware');
const emailController = require('../controllers/emailController');
const sanitizeMiddleware = require('../middlewares/sanitizeMiddleware');

router.post('/send-mass-email',
  authenticateJWT,
  sanitizeMiddleware,
  emailController.sendMassEmail
);

module.exports = router;
