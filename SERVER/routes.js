const { createProduct } = require('./controllers/productController');

const express = require("express");

const router = express.Router();

const { validateUserCredentials } = require('./controllers/userController');
const csrfProtection = require('./configs/csrfProtectionConfigs');
const authenticateJWT = require('./middlewares/authMiddleware');

router.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

router.post('/api/validate-credentials', csrfProtection, validateUserCredentials, (req, res) => {
  res.sendStatus(200);
});

router.get("/Dashboard", authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

router.post('/Dashboard/cadastrar', authenticateJWT, csrfProtection, createProduct);

module.exports = router;
