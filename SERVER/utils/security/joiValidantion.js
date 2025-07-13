const Joi = require('joi');

const validateLogin = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'O email deve ser um endereço de email válido.',
    'string.empty': 'O campo email não pode estar vazio.',
    'any.required': 'O campo email é obrigatório.',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'A senha deve ter no mínimo 6 caracteres.',
    'string.empty': 'O campo senha não pode estar vazio.',
    'any.required': 'O campo senha é obrigatório.',
  }),
});

module.exports = validateLogin;
