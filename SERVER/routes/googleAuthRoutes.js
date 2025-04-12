const express = require("express");
const router = express.Router();
const { handleGoogleAuth } = require("../controllers/authGoogleController");
const sanitizeMiddleware = require('../middlewares/sanitizeMiddleware');
const csrfProtection = require('../configs/csrfProtectionConfigs');

router.post('/google-auth', sanitizeMiddleware, csrfProtection, handleGoogleAuth);

module.exports = router;