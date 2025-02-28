const { createProduct } = require('./controllers/productController');
const express = require("express");
const router = express.Router();

// Corrigir importações
const { validateUserCredentials } = require('./controllers/userController');
const {login} = require('./controllers/authController')

const csrfProtection = require('./configs/csrfProtectionConfigs');
const authenticateJWT = require('./middlewares/authMiddleware');

// Rotas CSRF
router.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Rota de validação de credenciais
router.post('/api/validate-credentials',
  csrfProtection,
  validateUserCredentials,
  (req, res) => {
    res.sendStatus(200);
  }
);

// Rotas de autenticação
router.post('/api/validate', csrfProtection, validateUserCredentials);
router.post('/api/login', csrfProtection, login);

router.get("/Dashboard", authenticateJWT, (req, res) => {
  res.json({
    user: req.user
  });
});

router.post('/Dashboard/cadastrar',
  authenticateJWT,
  csrfProtection,
  createProduct
);

module.exports = router;
