const express = require('express');
const { csrfProtection } = require('./middlewares/csurfMiddleware');
const { validateUserCredentials } = require('./controllers/userController');

const router = express.Router();

router.get('/csrf-token', csrfProtection, (req, res) => {
  const csrfToken = req.csrfToken();
  console.log('Token servidor:', csrfToken);
  res.json({ csrfToken });
});

router.post('/api/validate-credentials', csrfProtection, (req, res) => {
  const csrfTokenHeader = req.headers['csrf-token'];
  console.log('Token CSRF recebido no servidor:', csrfTokenHeader);

  try {
    if (!req.csrfToken()) {
      console.error('Token CSRF inválido ou ausente');
      return res.status(403).json({ message: 'Invalid CSRF token' });
    }

    validateUserCredentials(req, res);
  } catch (error) {
    console.error('Erro na validação CSRF:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

module.exports = router;
