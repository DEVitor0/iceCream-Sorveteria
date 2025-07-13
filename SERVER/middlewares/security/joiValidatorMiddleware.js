const validateLogin = require('../../utils/security/joiValidantion');

const validateLoginMiddleware = (req, res, next) => {
  console.log('Dados recebidos:', req.body);
  const { error } = validateLogin.validate(req.body);

  if (error) {
    console.log('Erros de validação:', error.details);
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: error.details.map((err) => err.message),
    });
  }

  next();
};

module.exports = validateLoginMiddleware;
