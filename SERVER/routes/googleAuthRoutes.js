const express = require("express");
const router = express.Router();
const { handleGoogleAuth } = require("../controllers/authGoogleController");
const sanitizeMiddleware = require('../middlewares/sanitizeMiddleware');
const csrfProtection = require('../configs/csrfProtectionConfigs');
const authenticateJWT = require('../middlewares/authMiddleware');
const verifyUser = require('../middlewares/userGoogleVerificationMiddleware');

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