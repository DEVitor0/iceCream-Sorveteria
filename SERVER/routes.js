const express = require("express");

const router = express.Router();

const { validateUserCredentials } = require('./controllers/userController');
const csrfProtection = require('./configs/csrfProtectionConfigs');
const { login, register } = require('./controllers/authController');
const authenticateJWT = require('./middlewares/authMiddleware');

router.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

router.post('/api/validate-credentials', csrfProtection, validateUserCredentials, (req, res) => {
  res.sendStatus(200);
});

router.post('/entrar', csrfProtection, login);
router.post('/registrar', csrfProtection, register);

// Rota protegida com JWT
router.get("/dashboard", authenticateJWT, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;
