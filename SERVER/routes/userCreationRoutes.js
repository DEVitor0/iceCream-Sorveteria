const express = require('express');
const router = express.Router();

const csrfProtection = require('../configs/security/csrfProtectionConfigs');
const sanitizeMiddleware = require('../middlewares/security/sanitizeMiddleware');
const verifyTwoFAMiddleware = require('../middlewares/security/authMiddleware');
const { initiateUserCreation, createUser } = require('../controllers/validation/createUserController');

router.post(
  '/initiate',
  sanitizeMiddleware,
  csrfProtection,
  initiateUserCreation
);

router.post(
  '/confirm',
  sanitizeMiddleware,
  csrfProtection,
  verifyTwoFAMiddleware,
  createUser
);

module.exports = router;
