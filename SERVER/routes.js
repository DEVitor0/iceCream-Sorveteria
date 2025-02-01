const express = require("express");

const router = express.Router();

const { validateUserCredentials } = require('./controllers/userController');
const csrfProtection = require('./configs/csrfProtectionConfigs');

router.post('/api/validate-credentials', csrfProtection, validateUserCredentials, (req, res) => {
  console.log('Token CSRF do cabeçalho:', req.headers['x-csrf-token']);
  console.log('Token CSRF do cookie:', req.cookies._csrf);
  console.log('Token CSRF esperado:', req.csrfToken());
  res.sendStatus(200);
});

router.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

module.exports = router;
