const Joi = require('joi');

exports.validateAddress = (req, res, next) => {
  console.log('[BACK] Validando endereço - body recebido:', req.body);
  const schema = Joi.object({
    cep: Joi.string().pattern(/^\d{5}-?\d{3}$/).required(),
    logradouro: Joi.string().trim().required(),
    numero: Joi.string().required(),
    complemento: Joi.string().trim().allow(''),
    bairro: Joi.string().trim().required(),
    cidade: Joi.string().trim().required(),
    estado: Joi.string().length(2).uppercase().valid(
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
      'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
      'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ).required()
  });

  const { error } = schema.validate(req.body);
  console.log('[BACK] Resultado da validação:', error ? error.details : 'Válido');
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};
