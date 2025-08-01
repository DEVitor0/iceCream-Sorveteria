const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/security/authMiddleware');
const emailController = require('../controllers/others/mailers/emailController');
const sanitizeMiddleware = require('../middlewares/security/sanitizeMiddleware');

router.post('/send-mass-email',
  authenticateJWT,
  sanitizeMiddleware,
  emailController.sendMassEmail
);

module.exports = router;
