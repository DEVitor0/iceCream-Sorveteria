const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { validateUserCredentials } = require('./controllers/userController');
const csrfProtection = require('./configs/csrfProtectionConfigs');
const captchaController = require('./controllers/captchaController');
const generateCaptcha = require('./utils/captchaGenerator')

const generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const validateCredentials = async (req, res, next) => {
  try {
    const { email, senha: password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Campos obrigatórios' });
    }

    const user = await validateUserCredentials(email, password);
    req.session.failedAttempts = 0;
    next();
  } catch (error) {
    req.session.failedAttempts = (req.session.failedAttempts || 0) + 1;

    // Lógica do CAPTCHA após 3 tentativas
    if (req.session.failedAttempts >= 3) {
      try {
        const captchaToken = generateRandomToken();
        const { text } = captchaController.generateCaptchaSecret();

        req.session.captchaToken = captchaToken;
        req.session.captchaSecret = {
          text,
          expires: Date.now() + 600000 // 10 minutos
        };

        // Resposta estruturada para o frontend
        return res.status(403).json({
          error: true,
          requiresCaptcha: true,
          captchaToken: captchaToken,
          redirectTo: '/validate-captcha',
          message: 'Verificação CAPTCHA necessária'
        });

      } catch (err) {
        console.error('Erro no CAPTCHA:', err);
        return res.status(500).json({
          error: true,
          message: 'Erro interno no servidor'
        });
      }
    }

    // Resposta padrão para credenciais inválidas
    res.status(401).json({
      error: true,
      message: error.message || 'Credenciais inválidas'
    });
  }
};

router.get('/captcha', (req, res) => {
  const { text, dataUrl } = generateCaptcha();
  req.session.captchaSecret = { text, expires: Date.now() + 600000 };
  res.json({ image: dataUrl });
});

router.post('/validate-captcha', csrfProtection, (req, res, next) => {
  const { captchaToken, captchaText } = req.body;

  if (!req.session.captchaSecret ||
      req.session.captchaToken !== captchaToken ||
      req.session.captchaSecret.text.toLowerCase() !== captchaText.toLowerCase()) {
    return res.status(400).json({ error: 'CAPTCHA inválido' });
  }

  delete req.session.captchaSecret;
  delete req.session.captchaToken;
  req.session.failedAttempts = 0;
  next();
}, validateCredentials);

router.post('/api/validate-credentials', csrfProtection, (req, res) => {
  res.sendStatus(200);
});

router.post('/login', csrfProtection, validateCredentials, (req, res) => {
  console.log('[ROUTE] Login successful - Session:', req.session);
  res.json({ redirectUrl: '/' });
});

router.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

module.exports = router;
