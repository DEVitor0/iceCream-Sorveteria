const express = require("express");
const router = express.Router();
const { handleGoogleAuth } = require("../controllers/validation/authGoogleController");
const sanitizeMiddleware = require('../middlewares/security/sanitizeMiddleware');
const csrfProtection = require('../configs/security/csrfProtectionConfigs');
const authenticateJWT = require('../middlewares/security/authMiddleware');
const verifyUser = require('../middlewares/validation/userGoogleVerificationMiddleware');

router.post('/google-auth', sanitizeMiddleware, csrfProtection, handleGoogleAuth);
router.get('/verify-auth',
  authenticateJWT,
  verifyUser,
  (req, res) => {
    res.status(200).json({
      success: true,
      user: req.authenticatedUser
    });
  }
);


module.exports = router;
