const express = require("express");
const router = express.Router();
const sanitizeMiddleware = require('./middlewares/sanitizeMiddleware');
const csrfProtection = require('./configs/csrfProtectionConfigs');
const authenticateJWT = require('./middlewares/authMiddleware');
const validateLoginMiddleware = require('./middlewares/joiValidatorMiddleware');
const { twoFALogin, validateTwoFACode } = require('./controllers/twoFAController');

const authenticationRoutes = require('./routes/authenticationRoutes');
const productRoutes = require('./routes/productRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

router.get("/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

router.post('/login', sanitizeMiddleware, csrfProtection, validateLoginMiddleware, twoFALogin);

router.post('/validate-2fa', sanitizeMiddleware, csrfProtection, validateTwoFACode);

router.use('/authentication', sanitizeMiddleware, csrfProtection, authenticationRoutes);

router.use('/Dashboard', authenticateJWT, productRoutes);
router.use('/Dashboard', authenticateJWT, dashboardRoutes);

module.exports = router;
